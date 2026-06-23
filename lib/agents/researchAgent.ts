// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { llm } from "../services/gemini";
import { searchTool } from "../services/search";
import { buildResearchPrompt } from "../prompts/researchPrompt";
import { ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runResearchAgent(company: string): Promise<ResearchOutput> {
  const systemPrompt = buildResearchPrompt(company);

  const agent = createReactAgent({
    llm,
    tools: [searchTool],
    messageModifier: systemPrompt,
  });

  try {
    const rawResult = await withRetry(async () => {
      return await agent.invoke({
        messages: [{ role: "user", content: `Please research ${company}.` }],
      });
    }, 1, 2000);

    const lastMessage = rawResult.messages[rawResult.messages.length - 1];
    const outputStr = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);
    
    logLlmInteraction("ResearchAgent", { company }, outputStr);

    try {
      const parsed = parseAgentJson<ResearchOutput>(outputStr, "ResearchAgent");
      return parsed;
    } catch (parseErr: any) {
      // Retry once on parse failure
      console.warn("[ResearchAgent] JSON parse failed, asking LLM to strictly fix JSON.");
      const retryResult = await agent.invoke({
        messages: [
          ...rawResult.messages,
          { role: "user", content: "CRITICAL: Your previous response was not valid JSON. You MUST return ONLY valid JSON matching the schema without markdown formatting." }
        ],
      });
      const retryLastMessage = retryResult.messages[retryResult.messages.length - 1];
      const retryOutputStr = typeof retryLastMessage.content === "string" ? retryLastMessage.content : JSON.stringify(retryLastMessage.content);
      
      logLlmInteraction("ResearchAgent_Retry", { company }, retryOutputStr);
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
