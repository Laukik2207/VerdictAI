import { NextRequest } from "next/server";
import { GraphState } from "@/lib/graph/types";
import { runResearchAgent } from "@/lib/agents/researchAgent";
import { runFinancialAgent } from "@/lib/agents/financialAgent";
import { runSentimentAgent } from "@/lib/agents/sentimentAgent";
import { runRiskAgent } from "@/lib/agents/riskAgent";
import { runJudgeAgent } from "@/lib/agents/judgeAgent";
import { runChallengeAgent } from "@/lib/agents/challengeAgent";

export const maxDuration = 60; // Vercel max duration
export const dynamic = "force-dynamic";

// Simple in-memory rate limiting (IP -> { count, timestamp })
// Production rate limiting should use Redis or Vercel KV
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  
  // Rate limiting check
  const now = Date.now();
  const limitData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
  if (now - limitData.timestamp > RATE_LIMIT_WINDOW_MS) {
    limitData.count = 1;
    limitData.timestamp = now;
  } else {
    limitData.count++;
  }
  rateLimitMap.set(ip, limitData);

  if (limitData.count > RATE_LIMIT_MAX_REQUESTS) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate body
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  // Input Sanitization
  let company = body.company;
  if (typeof company !== "string") {
    return new Response(JSON.stringify({ error: "Company must be a string" }), { status: 400 });
  }

  company = company.trim();
  company = company.replace(/<[^>]*>?/gm, ""); // Basic HTML stripping
  
  if (!company || company.length > 100) {
    return new Response(JSON.stringify({ error: "Company must be between 1 and 100 characters" }), { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const emit = (event: string, data: any) => {
        const payload = JSON.stringify({ event, ...data });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      };

      try {
        // --- CACHE CHECK ---
        const normalizedCompany = company.toLowerCase();
        let cachedReport: GraphState | null = null;
        
        try {
          const { prisma } = await import("@/lib/services/db");
          const cacheRecord = await prisma.analysisCache.findUnique({
            where: { company: normalizedCompany }
          });
          
          if (cacheRecord) {
            // Check if fresh (e.g., < 24 hours old)
            const ageMs = Date.now() - new Date(cacheRecord.updatedAt).getTime();
            if (ageMs < 24 * 60 * 60 * 1000) {
              cachedReport = JSON.parse(cacheRecord.data) as GraphState;
            }
          }
        } catch (dbErr) {
          console.warn("Database cache read failed:", dbErr);
        }

        if (cachedReport) {
          // Replay cached data sequentially for UI effect
          const agents = [
            { name: "ResearchAgent", key: "research" },
            { name: "FinancialAgent", key: "financial" },
            { name: "SentimentAgent", key: "sentiment" },
            { name: "RiskAgent", key: "risk" },
            { name: "JudgeAgent", key: "verdict" },
            { name: "ChallengeAgent", key: "challenge" },
          ];

          for (const agent of agents) {
            emit("agent_start", { agent: agent.name, timestamp: Date.now() });
            await new Promise(r => setTimeout(r, 200)); // Small UI delay
            emit("agent_done", { 
              agent: agent.name, 
              output: (cachedReport as any)[agent.key] || {}, 
              elapsedMs: 200 
            });
          }
          
          emit("complete", { report: cachedReport });
          controller.close();
          return;
        }
        // --- END CACHE CHECK ---

        const state: GraphState = { 
          query: company,
          status: "running",
          errors: []
        };

        // 1. Research
        emit("agent_start", { agent: "ResearchAgent", timestamp: Date.now() });
        const t0 = Date.now();
        state.research = await runResearchAgent(company);
        if ((state.research as any).error) {
           state.errors?.push((state.research as any).error);
           emit("agent_error", { agent: "ResearchAgent", message: (state.research as any).error });
        }
        emit("agent_done", { agent: "ResearchAgent", output: state.research, elapsedMs: Date.now() - t0 });

        // 2, 3, 4. Financial, Sentiment, Risk (Parallel)
        emit("agent_start", { agent: "FinancialAgent", timestamp: Date.now() });
        emit("agent_start", { agent: "SentimentAgent", timestamp: Date.now() });
        emit("agent_start", { agent: "RiskAgent", timestamp: Date.now() });

        const [financialRes, sentimentRes, riskRes] = await Promise.all([
          (async () => {
            const t1 = Date.now();
            const res = await runFinancialAgent(company, state.research!);
            if ((res.output as any).error) {
               state.errors?.push((res.output as any).error);
               emit("agent_error", { agent: "FinancialAgent", message: (res.output as any).error });
            }
            emit("agent_done", { agent: "FinancialAgent", output: res.output, elapsedMs: Date.now() - t1 });
            return res;
          })(),
          (async () => {
            const t2 = Date.now();
            const res = await runSentimentAgent(company, state.research!);
            if ((res.output as any).error) {
               state.errors?.push((res.output as any).error);
               emit("agent_error", { agent: "SentimentAgent", message: (res.output as any).error });
            }
            emit("agent_done", { agent: "SentimentAgent", output: res.output, elapsedMs: Date.now() - t2 });
            return res;
          })(),
          (async () => {
            const t3 = Date.now();
            const res = await runRiskAgent(company, state.research!);
            if ((res as any).error) {
               state.errors?.push((res as any).error);
               emit("agent_error", { agent: "RiskAgent", message: (res as any).error });
            }
            emit("agent_done", { agent: "RiskAgent", output: res, elapsedMs: Date.now() - t3 });
            return res;
          })()
        ]);

        state.financial = financialRes.output;
        state.alphaVantage = financialRes.alphaVantage;
        
        state.sentiment = sentimentRes.output;
        state.newsArticles = sentimentRes.newsArticles;
        
        state.risk = riskRes;

        // 5. Judge
        emit("agent_start", { agent: "JudgeAgent", timestamp: Date.now() });
        const t4 = Date.now();
        state.verdict = await runJudgeAgent(state);
        if ((state.verdict as any).error) {
           state.errors?.push((state.verdict as any).error);
           emit("agent_error", { agent: "JudgeAgent", message: (state.verdict as any).error });
        }
        emit("agent_done", { agent: "JudgeAgent", output: state.verdict, elapsedMs: Date.now() - t4 });

        // 6. Challenge
        emit("agent_start", { agent: "ChallengeAgent", timestamp: Date.now() });
        const t5 = Date.now();
        state.challenge = await runChallengeAgent(state.verdict!, state);
        if ((state.challenge as any).error) {
           state.errors?.push((state.challenge as any).error);
           emit("agent_error", { agent: "ChallengeAgent", message: (state.challenge as any).error });
        }
        emit("agent_done", { agent: "ChallengeAgent", output: state.challenge, elapsedMs: Date.now() - t5 });

        state.status = "done";
        
        // --- SAVE TO CACHE ---
        try {
          const { prisma } = await import("@/lib/services/db");
          await prisma.analysisCache.upsert({
            where: { company: normalizedCompany },
            update: { data: JSON.stringify(state) },
            create: { company: normalizedCompany, data: JSON.stringify(state) }
          });
        } catch (dbErr) {
          console.warn("Database cache write failed:", dbErr);
        }
        
        emit("complete", { report: state });
        controller.close();
      } catch (err: any) {
        emit("error", { message: err.message || "An unexpected error occurred" });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
