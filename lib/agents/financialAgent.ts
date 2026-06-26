// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { getModel } from "../services/modelRouter";
import { buildFinancialPrompt } from "../prompts/financialPrompt";
import { resolveTickerWithRanking } from "../utils/tickerResolver";
import { fetchFinancialOverview } from "../services/providers/finance";
import { FinancialOutput, FinancialSchema, ResearchOutput } from "../graph/types";
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
  
  const structuredLlm = getModel("financial").withStructuredOutput(FinancialSchema, { name: "extract_financial" });

  try {
    const startTime = Date.now();
    const parsed = await structuredLlm.invoke(prompt);
    const latency = Date.now() - startTime;

    logLlmInteraction("FinancialAgent", { research, ticker, overview }, JSON.stringify(parsed), {
      provider: "gemini-2.5-flash",
      tokens: 0,
      latency,
      costEstimate: 0,
    });

    return {
      output: parsed,
      alphaVantage: overview
    };

  } catch (err: any) {
    console.error("[FinancialAgent] Execution failed:", err);
    return {
      output: {
        metrics: {},
        trend: "neutral",
        analysis: "Financial data unavailable",
        error: "Financial agent failed: " + err.message
      } as any,
      alphaVantage: null
    };
  }
}
