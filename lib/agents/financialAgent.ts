// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { getModel } from "../services/modelRouter";
import { buildFinancialPrompt } from "../prompts/financialPrompt";
import { resolveTickerWithRanking } from "../utils/tickerResolver";
import { fetchFinancialOverview } from "../services/providers/finance";
import { FinancialOutput, ResearchOutput } from "../graph/types";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runFinancialAgent(company: string, research: ResearchOutput): Promise<{ output: FinancialOutput, alphaVantage: any }> {
  let ticker: string | null = null;
  try {
    ticker = await resolveTickerWithRanking(company);
  } catch (err) {
    console.warn("[FinancialAgent] Could not resolve ticker", err);
  }

  const overview = ticker ? await fetchFinancialOverview(ticker) : null;
  const prompt = buildFinancialPrompt(research, overview);
  const llm = getModel("financial");

  try {
    const startTime = Date.now();
    const rawResult = await withRetry(async () => {
      return await llm.invoke(prompt);
    }, 1, 2000);
    const latency = Date.now() - startTime;

    const outputStr = typeof rawResult.content === "string" ? rawResult.content : JSON.stringify(rawResult.content);
    const tokens = Math.floor(outputStr.length / 4);

    logLlmInteraction("FinancialAgent", { research, ticker, overview }, outputStr, {
      provider: "gemini-1.5-flash",
      tokens,
      latency,
      costEstimate: 0,
    });

    let parsed: any;
    try {
      parsed = parseAgentJson(outputStr, "FinancialAgent");
    } catch (parseErr) {
      console.warn("[FinancialAgent] JSON parse failed, asking LLM to strictly fix JSON.");
      const retryStartTime = Date.now();
      const retryResult = await llm.invoke(prompt + "\n\nCRITICAL: Your previous response was not valid JSON. You MUST return ONLY valid JSON matching the schema.");
      const retryLatency = Date.now() - retryStartTime;
      const retryOutputStr = typeof retryResult.content === "string" ? retryResult.content : JSON.stringify(retryResult.content);
      const retryTokens = Math.floor(retryOutputStr.length / 4);
      logLlmInteraction("FinancialAgent_Retry", { research, ticker, overview }, retryOutputStr, {
        provider: "gemini-1.5-flash",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });
      parsed = parseAgentJson(retryOutputStr, "FinancialAgent");
    }

    // Validate and clamp score if present, else fallback
    const score = parsed.score ?? 50;
    const clampedScore = Math.max(0, Math.min(100, Number(score) || 50));

    return {
      output: {
        metrics: parsed.metrics || {},
        trend: parsed.trend || "neutral",
        analysis: parsed.analysis || "Analysis not provided.",
        score: clampedScore,
      } as any,
      alphaVantage: overview
    };

  } catch (err: any) {
    console.error("[FinancialAgent] Execution failed:", err);
    return {
      output: {
        metrics: {},
        trend: "neutral",
        analysis: "Financial data unavailable",
        score: 50,
        error: "Financial agent failed: " + err.message
      } as any,
      alphaVantage: null
    };
  }
}
