// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { getModel } from "../services/modelRouter";
import { fetchCompanyNews } from "../services/providers/news";
import { searchTool } from "../services/search";
import { buildSentimentPrompt } from "../prompts/sentimentPrompt";
import { SentimentOutput, ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runSentimentAgent(company: string, research: ResearchOutput): Promise<{ output: SentimentOutput, newsArticles: any[] }> {
  const news = await fetchCompanyNews(company);
  const systemPrompt = buildSentimentPrompt(company, research, news);

  const llm = getModel("sentiment");
  const agent = createReactAgent({
    llm,
    tools: [searchTool],
    messageModifier: systemPrompt,
  });

  try {
    const startTime = Date.now();
    const rawResult = await withRetry(async () => {
      return await agent.invoke({
        messages: [{ role: "user", content: `Please analyze market sentiment for ${company}.` }],
      });
    }, 1, 2000);
    const latency = Date.now() - startTime;

    const lastMessage = rawResult.messages[rawResult.messages.length - 1];
    const outputStr = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);
    const tokens = Math.floor(outputStr.length / 4);

    logLlmInteraction("SentimentAgent", { company, news }, outputStr, {
      provider: "gemini-1.5-flash",
      tokens,
      latency,
      costEstimate: 0,
    });

    let parsed: any;
    try {
      parsed = parseAgentJson(outputStr, "SentimentAgent");
    } catch (parseErr: any) {
      console.warn("[SentimentAgent] JSON parse failed, asking LLM to strictly fix JSON.");
      const retryStartTime = Date.now();
      const retryResult = await agent.invoke({
        messages: [
          ...rawResult.messages,
          { role: "user", content: "CRITICAL: Your previous response was not valid JSON. You MUST return ONLY valid JSON matching the schema without markdown formatting." }
        ],
      });
      const retryLatency = Date.now() - retryStartTime;
      const retryLastMessage = retryResult.messages[retryResult.messages.length - 1];
      const retryOutputStr = typeof retryLastMessage.content === "string" ? retryLastMessage.content : JSON.stringify(retryLastMessage.content);
      
      const retryTokens = Math.floor(retryOutputStr.length / 4);
      logLlmInteraction("SentimentAgent_Retry", { company, news }, retryOutputStr, {
        provider: "gemini-1.5-flash",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });
      parsed = parseAgentJson(retryOutputStr, "SentimentAgent");
    }

    // Validation
    const score = parsed.score ?? 50;
    const clampedScore = Math.max(0, Math.min(100, Number(score) || 50));
    
    let bullSignals = parsed.bullSignals || [];
    if (!Array.isArray(bullSignals) || bullSignals.length === 0) bullSignals = ["No concrete bullish signals detected."];
    
    let bearSignals = parsed.bearSignals || [];
    if (!Array.isArray(bearSignals) || bearSignals.length === 0) bearSignals = ["No concrete bearish signals detected."];

    return {
      output: {
        score: clampedScore,
        label: parsed.label || "neutral",
        details: parsed.details || "Sentiment data unavailable",
        bullSignals,
        bearSignals,
        headlines: parsed.headlines || []
      } as any,
      newsArticles: news
    };

  } catch (err: any) {
    console.error("[SentimentAgent] Execution failed:", err);
    return {
      output: {
        score: 50,
        label: "neutral",
        details: "Sentiment data unavailable",
        bullSignals: ["Error retrieving data"],
        bearSignals: ["Error retrieving data"],
        headlines: [],
        error: "Sentiment agent failed: " + err.message
      } as any,
      newsArticles: []
    };
  }
}
