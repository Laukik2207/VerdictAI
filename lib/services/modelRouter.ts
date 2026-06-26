import { getLlmFlash, getLlmJudge, getLlmChallenge } from "./providers/gemini";

export type TaskType = "research" | "financial" | "sentiment" | "risk" | "judge" | "challenge";

export function getModel(task: TaskType) {
  switch (task) {
    case "research":
    case "financial":
    case "sentiment":
    case "risk":
      return getLlmFlash();
    case "judge":
      return getLlmJudge();
    case "challenge":
      return getLlmChallenge();
    default:
      return getLlmFlash(); // Fallback
  }
}
