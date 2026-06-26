import { GraphState, VerdictOutput, VerdictSchema } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildJudgePrompt } from "../prompts/judgePrompt";
import { logLlmInteraction } from "../utils/logger";

export async function runJudgeAgent(state: Partial<GraphState>): Promise<VerdictOutput> {
  const prompt = buildJudgePrompt(state);
  const structuredLlm = getModel("judge").withStructuredOutput(VerdictSchema, { name: "extract_verdict" });

  try {
    const startTime = Date.now();
    const parsed = await structuredLlm.invoke(prompt);
    const latency = Date.now() - startTime;

    logLlmInteraction("JudgeAgent", { stateKeys: Object.keys(state) }, JSON.stringify(parsed), {
      provider: "gemini-2.5-flash",
      tokens: 0,
      latency,
      costEstimate: 0,
    });

    return parsed;
  } catch (err: any) {
    console.error("[JudgeAgent] Execution failed:", err);
    return {
      decision: "pass",
      rationale: "Judge agent failed to synthesize state graph.",
      confidence: 0,
      thesis: "Unavailable due to error.",
      reasoning: [],
      assumptions: [],
      error: "Judge agent failed: " + err.message
    } as any;
  }
}
