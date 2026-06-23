// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { llm } from "../services/gemini";
import { buildFinancialPrompt } from "../prompts/financialPrompt";
import { FinancialOutput, ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runFinancialAgent(research: ResearchOutput): Promise<FinancialOutput> {
  const prompt = buildFinancialPrompt(research);

  try {
    const rawResult = await withRetry(async () => {
      return await llm.invoke(prompt);
    }, 1, 2000);

    const outputStr = typeof rawResult.content === "string" ? rawResult.content : JSON.stringify(rawResult.content);
    logLlmInteraction("FinancialAgent", { research }, outputStr);

    let parsed: any;
    try {
      parsed = parseAgentJson(outputStr, "FinancialAgent");
    } catch (parseErr) {
      console.warn("[FinancialAgent] JSON parse failed, asking LLM to strictly fix JSON.");
      const retryResult = await llm.invoke(prompt + "\n\nCRITICAL: Your previous response was not valid JSON. You MUST return ONLY valid JSON matching the schema.");
      const retryOutputStr = typeof retryResult.content === "string" ? retryResult.content : JSON.stringify(retryResult.content);
      logLlmInteraction("FinancialAgent_Retry", { research }, retryOutputStr);
      parsed = parseAgentJson(retryOutputStr, "FinancialAgent");
    }

    // Validate and clamp score if present, else fallback
    const score = parsed.score ?? 50;
    const clampedScore = Math.max(0, Math.min(100, Number(score) || 50));

    return {
      metrics: parsed.metrics || {},
      trend: parsed.trend || "neutral",
      analysis: parsed.analysis || "Analysis not provided.",
      score: clampedScore,
    } as any; // any to accommodate the extra score field safely if not strictly in type yet

  } catch (err: any) {
    console.error("[FinancialAgent] Execution failed:", err);
    return {
      metrics: {},
      trend: "neutral",
      analysis: "Financial data unavailable",
      score: 50,
      error: "Financial agent failed: " + err.message
    } as any;
  }
}
