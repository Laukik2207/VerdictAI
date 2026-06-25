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

        // 2. Financial
        emit("agent_start", { agent: "FinancialAgent", timestamp: Date.now() });
        const t1 = Date.now();
        const financialRes = await runFinancialAgent(company, state.research!);
        state.financial = financialRes.output;
        state.alphaVantage = financialRes.alphaVantage;
        if ((state.financial as any).error) {
           state.errors?.push((state.financial as any).error);
           emit("agent_error", { agent: "FinancialAgent", message: (state.financial as any).error });
        }
        emit("agent_done", { agent: "FinancialAgent", output: state.financial, elapsedMs: Date.now() - t1 });

        // 3. Sentiment
        emit("agent_start", { agent: "SentimentAgent", timestamp: Date.now() });
        const t2 = Date.now();
        const sentimentRes = await runSentimentAgent(company, state.research!);
        state.sentiment = sentimentRes.output;
        state.newsArticles = sentimentRes.newsArticles;
        if ((state.sentiment as any).error) {
           state.errors?.push((state.sentiment as any).error);
           emit("agent_error", { agent: "SentimentAgent", message: (state.sentiment as any).error });
        }
        emit("agent_done", { agent: "SentimentAgent", output: state.sentiment, elapsedMs: Date.now() - t2 });

        // 4. Risk
        emit("agent_start", { agent: "RiskAgent", timestamp: Date.now() });
        const t3 = Date.now();
        state.risk = await runRiskAgent(state);
        if ((state.risk as any).error) {
           state.errors?.push((state.risk as any).error);
           emit("agent_error", { agent: "RiskAgent", message: (state.risk as any).error });
        }
        emit("agent_done", { agent: "RiskAgent", output: state.risk, elapsedMs: Date.now() - t3 });

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
