import { ResearchOutput, RiskOutput, RiskSchema } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildRiskPrompt } from "../prompts/riskPrompt";
import { logLlmInteraction } from "../utils/logger";

export async function runRiskAgent(company: string, research: ResearchOutput): Promise<RiskOutput> {
  const prompt = buildRiskPrompt(company, research);
  const structuredLlm = getModel("risk").withStructuredOutput(RiskSchema, { name: "extract_risk" });

  try {
    const startTime = Date.now();
    const parsed = await structuredLlm.invoke(prompt);
    const latency = Date.now() - startTime;
    
    logLlmInteraction("RiskAgent", { company }, JSON.stringify(parsed), {
      provider: "gemini-2.5-flash",
      tokens: 0,
      latency,
      costEstimate: 0,
    });

    return parsed;
  } catch (error: any) {
    console.error("[RiskAgent] Execution failed:", error);
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
