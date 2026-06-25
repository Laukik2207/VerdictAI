import { GraphState, VerdictOutput } from "../graph/types";
import { getModel } from "../services/modelRouter";
import { buildJudgePrompt } from "../prompts/judgePrompt";
import { parseAgentJson } from "../utils/parseAgentJson";
import { logLlmInteraction } from "../utils/logger";

export async function runJudgeAgent(state: Partial<GraphState>): Promise<VerdictOutput> {
  let prompt = buildJudgePrompt(state);
  
  const decisiveLlm = getModel("judge");

  const executor = async () => {
    const startTime = Date.now();
    const res = await decisiveLlm.invoke(prompt);
    const latency = Date.now() - startTime;
    
    const outputStr = res.content as string;
    const tokens = Math.floor(outputStr.length / 4);

    let data = parseAgentJson<VerdictOutput>(outputStr, "JudgeAgent");

    logLlmInteraction("judge_agent", prompt, outputStr, {
      provider: "gemini-1.5-pro",
      tokens,
      latency,
      costEstimate: 0,
    });

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
      return await executor();
    } catch (err: any) {
      // Retry once with explicit instruction
      prompt = prompt + "\n\nCRITICAL REMINDER: You MUST return valid JSON. 'decision' MUST be exactly 'invest' or 'pass'. 'reasoning' MUST have at least 2 items. 'assumptions' MUST have at least 1 item.";
      
      const retryStartTime = Date.now();
      const res = await decisiveLlm.invoke(prompt);
      const retryLatency = Date.now() - retryStartTime;
      const retryOutputStr = res.content as string;
      const retryTokens = Math.floor(retryOutputStr.length / 4);
      
      logLlmInteraction("judge_agent_retry", prompt, retryOutputStr, {
        provider: "gemini-1.5-pro",
        tokens: retryTokens,
        latency: retryLatency,
        costEstimate: 0,
      });

      return parseAgentJson<VerdictOutput>(retryOutputStr, "JudgeAgent");
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
    logLlmInteraction("judge_agent_error", prompt, fallback);
    return fallback;
  }
}
