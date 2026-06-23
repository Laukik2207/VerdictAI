import { GraphState, ChallengeOutput } from "../graph/types";
import { ChatOpenAI } from "@langchain/openai";
import { buildChallengePrompt } from "../prompts/challengePrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { logLlmInteraction } from "../utils/logger";

export async function runChallengeAgent(state: Partial<GraphState>): Promise<ChallengeOutput> {
  const verdict = state.verdict;
  if (!verdict) {
    return {
      counterVerdict: "Unknown",
      weakestAssumption: "Unknown",
      alternativeThesis: "Unknown",
      counterArguments: ["Analysis incomplete: missing verdict"],
      weaknesses: ["Unknown"],
      finalAdjustments: "Unknown",
      ...({ error: "Missing verdict" } as any),
    };
  }

  let prompt = buildChallengePrompt(verdict, state);
  
  // Temperature override: 0.7
  const creativeLlm = new ChatOpenAI({
    modelName: "openai/gpt-4o-mini",
    temperature: 0.7,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: { "HTTP-Referer": "http://localhost:3000", "X-Title": "VerdictAI" },
    },
  });

  const executor = async () => {
    const res = await creativeLlm.invoke(prompt);
    let data = parseAgentJson<ChallengeOutput>(res.content as string, "ChallengeAgent");

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
      const result = await executor();
      logLlmInteraction("challenge_agent", prompt, result);
      return result;
    } catch (err: any) {
      prompt = prompt + "\n\nCRITICAL REMINDER: You MUST return valid JSON. 'counterArguments' MUST have at least 3 items. 'weakestAssumption' and 'alternativeThesis' MUST be non-empty strings.";
      const retryResult = await executor();
      logLlmInteraction("challenge_agent", prompt, retryResult);
      return retryResult;
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
    logLlmInteraction("challenge_agent", prompt, fallback);
    return fallback;
  }
}
