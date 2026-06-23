// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { llm } from "../services/gemini";
import { searchTool } from "../services/search";
import { buildSentimentPrompt } from "../prompts/sentimentPrompt";
import { SentimentOutput, ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runSentimentAgent(company: string, research: ResearchOutput): Promise<SentimentOutput> {
  const systemPrompt = buildSentimentPrompt(company, research);

  const agent = createReactAgent({
    llm,
    tools: [searchTool],
    messageModifier: systemPrompt,
  });

  try {
    const rawResult = await withRetry(async () => {
      return await agent.invoke({
        messages: [{ role: "user", content: `Please analyze market sentiment for ${company}.` }],
      });
    }, 1, 2000);

    const lastMessage = rawResult.messages[rawResult.messages.length - 1];
    const outputStr = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);
    
    logLlmInteraction("SentimentAgent", { company }, outputStr);

    let parsed: any;
    try {
      parsed = parseAgentJson(outputStr, "SentimentAgent");
    } catch (parseErr: any) {
      console.warn("[SentimentAgent] JSON parse failed, asking LLM to strictly fix JSON.");
      const retryResult = await agent.invoke({
        messages: [
          ...rawResult.messages,
          { role: "user", content: "CRITICAL: Your previous response was not valid JSON. You MUST return ONLY valid JSON matching the schema without markdown formatting." }
        ],
      });
      const retryLastMessage = retryResult.messages[retryResult.messages.length - 1];
      const retryOutputStr = typeof retryLastMessage.content === "string" ? retryLastMessage.content : JSON.stringify(retryLastMessage.content);
      
      logLlmInteraction("SentimentAgent_Retry", { company }, retryOutputStr);
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
      score: clampedScore,
      label: parsed.label || "neutral",
      details: parsed.details || "Sentiment data unavailable",
      bullSignals,
      bearSignals,
      headlines: parsed.headlines || []
    } as any;

  } catch (err: any) {
    console.error("[SentimentAgent] Execution failed:", err);
    return {
      score: 50,
      label: "neutral",
      details: "Sentiment data unavailable",
      bullSignals: ["Error retrieving data"],
      bearSignals: ["Error retrieving data"],
      headlines: [],
      error: "Sentiment agent failed: " + err.message
    } as any;
  }
}
