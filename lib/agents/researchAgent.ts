// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { getModel } from "../services/modelRouter";
import { searchTool } from "../services/search";
import { buildResearchPrompt } from "../prompts/researchPrompt";
import { ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runResearchAgent(company: string): Promise<ResearchOutput> {
  const systemPrompt = buildResearchPrompt(company);

  const llm = getModel("research");
  const agent = createReactAgent({
    llm,
    tools: [searchTool],
    messageModifier: systemPrompt,
  });

  try {
    const startTime = Date.now();
    const rawResult = await withRetry(async () => {
      return await agent.invoke({
        messages: [{ role: "user", content: `Please research ${company}.` }],
      });
    }, 1, 2000);
    const latency = Date.now() - startTime;

    const lastMessage = rawResult.messages[rawResult.messages.length - 1];
    const outputStr = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);
    
    // Estimate tokens roughly (chars / 4)
    const tokens = Math.floor(outputStr.length / 4);

    logLlmInteraction("ResearchAgent", { company }, outputStr, {
      provider: "gemini-1.5-flash",
      tokens,
      latency,
      costEstimate: 0,
    });

    try {
      const parsed = parseAgentJson<ResearchOutput>(outputStr, "ResearchAgent");
      return parsed;
    } catch (parseErr: any) {
      // Retry once on parse failure
      console.warn("[ResearchAgent] JSON parse failed, asking LLM to strictly fix JSON.");
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
      logLlmInteraction("ResearchAgent_Retry", { company }, retryOutputStr, {
        provider: "gemini-1.5-flash",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });
      return parseAgentJson<ResearchOutput>(retryOutputStr, "ResearchAgent");
    }

  } catch (err: any) {
    console.error("[ResearchAgent] Execution failed:", err);
    return {
      sector: "Unknown",
      hq: "Unknown",
      founded: "Unknown",
      businessModel: "Data unavailable",
      revenueModel: [],
      metrics: [],
      summary: "Agent execution failed.",
      keyPoints: [],
      sources: [],
      error: "Research agent failed: " + err.message
    } as any;
  }
}
