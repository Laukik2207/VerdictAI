import { GraphState, VerdictOutput, ChallengeOutput, ChallengeSchema } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildChallengePrompt } from "../prompts/challengePrompt";
import { logLlmInteraction } from "../utils/logger";

export async function runChallengeAgent(verdict: VerdictOutput, state: Partial<GraphState>): Promise<ChallengeOutput> {
  const prompt = buildChallengePrompt(verdict, state);
  const structuredLlm = getModel("challenge").withStructuredOutput(ChallengeSchema, { name: "extract_challenge" });

  try {
    const startTime = Date.now();
    const parsed = await structuredLlm.invoke(prompt);
    const latency = Date.now() - startTime;

    logLlmInteraction("ChallengeAgent", { verdictDecision: verdict.decision }, JSON.stringify(parsed), {
      provider: "gemini-2.5-flash",
      tokens: 0,
      latency,
      costEstimate: 0,
    });

    return parsed;
  } catch (err: any) {
    console.error("[ChallengeAgent] Execution failed:", err);
    return {
      counterVerdict: "Unavailable",
      weakestAssumption: "Error identifying assumption",
      alternativeThesis: "Analysis incomplete due to agent failure",
      counterArguments: [],
      weaknesses: [],
      finalAdjustments: "Review logs for errors",
      error: "Challenge agent failed: " + err.message
    } as any;
  }
}
