import { VerdictOutput, GraphState } from "../graph/types";

export function buildChallengePrompt(verdict: VerdictOutput, state: Partial<GraphState>): string {
  return `You are the Devil's Advocate Agent.
The committee voted to ${verdict.decision.toUpperCase()} with ${verdict.confidence}% confidence.

Thesis: ${verdict.thesis}

YOUR JOB: Prove them wrong.
Assume the verdict is INCORRECT. Build the strongest possible counter-case.
Find the assumption that would most damage this thesis if it proved false.
Construct a plausible alternative narrative that leads to the opposite conclusion.

Return ONLY valid JSON. No markdown. No preamble. Exactly this schema:
{
  "counterVerdict": "string",
  "weakestAssumption": "string",
  "alternativeThesis": "string",
  "counterArguments": ["string"],
  "weaknesses": ["string"],
  "finalAdjustments": "string"
}`;
}
