import { GraphState, RiskOutput } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildRiskPrompt } from "../prompts/riskPrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { withRetry } from "../utils/retry";
import { logLlmInteraction } from "../utils/logger";

export async function runRiskAgent(state: Partial<GraphState>): Promise<RiskOutput> {
  const prompt = buildRiskPrompt(state);
  const llm = getModel("risk");

  const executor = async () => {
    const startTime = Date.now();
    const res = await llm.invoke(prompt);
    const latency = Date.now() - startTime;
    
    const outputStr = typeof res.content === "string" ? res.content : JSON.stringify(res.content);
    const tokens = Math.floor(outputStr.length / 4);

    logLlmInteraction("RiskAgent", { prompt }, outputStr, {
      provider: "gemini-1.5-flash",
      tokens,
      latency,
      costEstimate: 0,
    });

    let data = parseAgentJson<RiskOutput>(outputStr, "RiskAgent");

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

    if (!Array.isArray(data.missingInfo)) data.missingInfo = [];
    if (!Array.isArray(data.factors)) data.factors = [];
    if (!Array.isArray(data.mitigations)) data.mitigations = [];

    return data;
  };

  try {
    try {
      return await executor();
    } catch (err: any) {
      console.warn("[RiskAgent] Parse failed, asking LLM to strictly fix JSON.");
      const retryStartTime = Date.now();
      const retryResult = await llm.invoke(prompt + "\n\nCRITICAL REMINDER: You MUST return valid JSON exactly matching the schema.");
      const retryLatency = Date.now() - retryStartTime;
      const retryOutputStr = typeof retryResult.content === "string" ? retryResult.content : JSON.stringify(retryResult.content);
      const retryTokens = Math.floor(retryOutputStr.length / 4);
      
      logLlmInteraction("RiskAgent_Retry", { prompt }, retryOutputStr, {
        provider: "gemini-1.5-flash",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });
      
      const parsedData = parseAgentJson<RiskOutput>(retryOutputStr, "RiskAgent");
      
      if (!Array.isArray(parsedData.missingInfo)) parsedData.missingInfo = [];
      if (!Array.isArray(parsedData.factors)) parsedData.factors = [];
      if (!Array.isArray(parsedData.mitigations)) parsedData.mitigations = [];
      
      return parsedData;
    }
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
    return fallback;
  }
}
