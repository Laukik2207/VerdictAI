import { llmFlash, llmJudge, llmChallenge } from "./providers/gemini";

export type TaskType = "research" | "financial" | "sentiment" | "risk" | "judge" | "challenge";

export function getModel(task: TaskType) {
  switch (task) {
    case "research":
    case "financial":
    case "sentiment":
    case "risk":
      return llmFlash;
    case "judge":
      return llmJudge;
    case "challenge":
      return llmChallenge;
    default:
      return llmFlash; // Fallback
  }
}
