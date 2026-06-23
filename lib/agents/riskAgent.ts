import { GraphState, RiskOutput } from "../graph/types";
import { llm } from "../services/gemini";
import { buildRiskPrompt } from "../prompts/riskPrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

export async function runRiskAgent(state: Partial<GraphState>): Promise<RiskOutput> {
  const prompt = buildRiskPrompt(state);

  const executor = async () => {
    const res = await llm.invoke(prompt);
    let data = parseAgentJson<RiskOutput>(res.content as string, "RiskAgent");

    // Validate and clamp data
    const normalizeLevel = (val: string): "LOW" | "MEDIUM" | "HIGH" => {
      const upper = (val || "MEDIUM").toUpperCase();
      if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH") return upper as "LOW" | "MEDIUM" | "HIGH";
      return "MEDIUM";
    };

    data.level = normalizeLevel(data.level);
    data.competitionRisk = data.competitionRisk || "Unknown";
    data.operationalRisk = data.operationalRisk || "Unknown";
    data.marketRisk = data.marketRisk || "Unknown";

    if (typeof data.score === "number") {
      data.score = Math.max(0, Math.min(100, data.score));
    } else {
      data.score = 50;
    }

    if (!Array.isArray(data.missingInfo)) {
      data.missingInfo = [];
    }
    if (!Array.isArray(data.factors)) data.factors = [];
    if (!Array.isArray(data.mitigations)) data.mitigations = [];

    return data;
  };

  try {
    const result = await withRetry(executor, 1);
    logLlmInteraction("risk_agent", prompt, result);
    return result;
  } catch (error: any) {
    const fallback: RiskOutput = {
      competitionRisk: "MEDIUM",
      operationalRisk: "MEDIUM",
      marketRisk: "MEDIUM",
      missingInfo: [],
      score: 50,
      level: "MEDIUM",
      factors: [],
      mitigations: [],
      ...({ error: `Risk agent failed: ${error.message}` } as any),
    };
    logLlmInteraction("risk_agent", prompt, fallback);
    return fallback;
  }
}
