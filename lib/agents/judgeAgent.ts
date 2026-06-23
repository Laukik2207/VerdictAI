import { GraphState, VerdictOutput } from "../graph/types";
import { ChatOpenAI } from "@langchain/openai";
import { buildJudgePrompt } from "../prompts/judgePrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { logLlmInteraction } from "../utils/logger";

export async function runJudgeAgent(state: Partial<GraphState>): Promise<VerdictOutput> {
  let prompt = buildJudgePrompt(state);
  
  // Temperature override: 0.2
  const decisiveLlm = new ChatOpenAI({
    modelName: "openai/gpt-4o-mini",
    temperature: 0.2,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: { "HTTP-Referer": "http://localhost:3000", "X-Title": "VerdictAI" },
    },
  });

  const executor = async () => {
    const res = await decisiveLlm.invoke(prompt);
    let data = parseAgentJson<VerdictOutput>(res.content as string, "JudgeAgent");

    if (data.decision) {
      const upper = data.decision.toUpperCase();
      if (upper === "INVEST" || upper === "PASS") {
        data.decision = upper.toLowerCase() as "invest" | "pass";
      } else {
        throw new Error(`Invalid decision: ${data.decision}`);
      }
    } else {
      throw new Error("Missing verdict decision");
    }

    if (typeof data.confidence === "number") {
      data.confidence = Math.max(0, Math.min(100, data.confidence));
    } else {
      data.confidence = 50;
    }

    if (!Array.isArray(data.reasoning) || data.reasoning.length < 2) {
      throw new Error("Reasoning must be an array with at least 2 items");
    }

    if (!Array.isArray(data.assumptions) || data.assumptions.length < 1) {
      throw new Error("Assumptions must be an array with at least 1 item");
    }

    return data;
  };

  try {
    try {
      const result = await executor();
      logLlmInteraction("judge_agent", prompt, result);
      return result;
    } catch (err: any) {
      // Retry once with explicit instruction
      prompt = prompt + "\n\nCRITICAL REMINDER: You MUST return valid JSON. 'decision' MUST be exactly 'invest' or 'pass'. 'reasoning' MUST have at least 2 items. 'assumptions' MUST have at least 1 item.";
      const retryResult = await executor();
      logLlmInteraction("judge_agent", prompt, retryResult);
      return retryResult;
    }
  } catch (error: any) {
    const fallback: VerdictOutput = {
      decision: "pass",
      confidence: 0,
      thesis: "Analysis incomplete due to agent failure",
      rationale: "Error during processing",
      reasoning: ["Analysis failed", "Please review logs"],
      assumptions: ["System error occurred"],
      ...({ error: `Judge agent failed: ${error.message}` } as any),
    };
    logLlmInteraction("judge_agent", prompt, fallback);
    return fallback;
  }
}
