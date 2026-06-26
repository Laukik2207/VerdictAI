import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { getModel } from "../services/modelRouter";
import { searchTool } from "../services/search";
import { buildResearchPrompt } from "../prompts/researchPrompt";
import { ResearchOutput, ResearchSchema } from "../graph/types";
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
    const rawResult = await agent.invoke({
      messages: [{ role: "user", content: `Please research ${company}.` }],
    });
    const latency = Date.now() - startTime;

    const lastMessage = rawResult.messages[rawResult.messages.length - 1];
    const outputStr = typeof lastMessage.content === "string" ? lastMessage.content : JSON.stringify(lastMessage.content);
    
    const tokens = Math.floor(outputStr.length / 4);

    logLlmInteraction("ResearchAgent", { company }, outputStr, {
      provider: "gemini-2.5-flash",
      tokens,
      latency,
      costEstimate: 0,
    });

    const structuredLlm = getModel("research").withStructuredOutput(ResearchSchema, { name: "extract_research" });
    const parsed = await structuredLlm.invoke(`Extract the structured data from this report into JSON:\n\n${outputStr}`);
    return parsed;

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
