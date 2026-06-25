import { GraphState, ChallengeOutput, VerdictOutput } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildChallengePrompt } from "../prompts/challengePrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { logLlmInteraction } from "../utils/logger";

export async function runChallengeAgent(verdict: VerdictOutput, state: Partial<GraphState>): Promise<ChallengeOutput> {
  if (!verdict) {
    return {
      counterVerdict: "Pass",
      weakestAssumption: "Unknown",
      alternativeThesis: "N/A",
      counterArguments: ["No verdict provided to challenge"],
      weaknesses: [],
      finalAdjustments: "None",
    };
  }

  let prompt = buildChallengePrompt(verdict, state);

  const devilLlm = getModel("challenge");

  const executor = async () => {
    const startTime = Date.now();
    const res = await devilLlm.invoke(prompt);
    const latency = Date.now() - startTime;

    const outputStr = res.content as string;
    const tokens = Math.floor(outputStr.length / 4);

    let data = parseAgentJson<ChallengeOutput>(outputStr, "ChallengeAgent");

    logLlmInteraction("challenge_agent", prompt, outputStr, {
      provider: "gemini-1.5-pro",
      tokens,
      latency,
      costEstimate: 0,
    });

    if (!Array.isArray(data.counterArguments) || data.counterArguments.length < 3) {
      throw new Error("CounterArguments must be an array with at least 3 items");
    }
    if (!data.weakestAssumption || typeof data.weakestAssumption !== "string") {
      throw new Error("WeakestAssumption must be a non-empty string");
    }
    if (!data.alternativeThesis || typeof data.alternativeThesis !== "string") {
      throw new Error("AlternativeThesis must be a non-empty string");
    }

    if (!Array.isArray(data.weaknesses)) data.weaknesses = [];

    return data;
  };

  try {
    try {
      return await executor();
    } catch (err: any) {
      prompt = prompt + "\n\nCRITICAL REMINDER: You MUST return valid JSON exactly matching the schema. Do not include markdown formatting.";
      
      const retryStartTime = Date.now();
      const res = await devilLlm.invoke(prompt);
      const retryLatency = Date.now() - retryStartTime;
      const retryOutputStr = res.content as string;
      const retryTokens = Math.floor(retryOutputStr.length / 4);

      logLlmInteraction("challenge_agent_retry", prompt, retryOutputStr, {
        provider: "gemini-1.5-pro",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });

      return parseAgentJson<ChallengeOutput>(retryOutputStr, "ChallengeAgent");
    }
  } catch (error: any) {
    const fallback: ChallengeOutput = {
      counterVerdict: "Failed to generate counter verdict",
      weakestAssumption: "Unknown",
      alternativeThesis: "Analysis incomplete",
      counterArguments: ["Analysis incomplete", "Agent execution failed", "See error logs"],
      weaknesses: ["Unknown"],
      finalAdjustments: "None",
      ...({ error: `Challenge agent failed: ${error.message}` } as any),
    };
    logLlmInteraction("challenge_agent_error", prompt, fallback);
    return fallback;
  }
}
