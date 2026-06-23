import { GraphState } from "../graph/types";

export function buildRiskPrompt(state: Partial<GraphState>): string {
  return `You are the Risk Evaluation Agent on an AI Investment Committee.
You have access to all prior agent reports.

Research Summary: ${state.research?.summary}
Financial Trend: ${state.financial?.trend}
Sentiment Label: ${state.sentiment?.label}

Your mandate: identify the vulnerabilities in this investment thesis.
Focus on:
1. Competition Risk (moat durability, disruptors)
2. Operational Risk (supply chain, management execution, unit economics)
3. Market/Macro Risk (interest rate sensitivity, regulatory exposure)

Explicitly flag any critical information gaps (missing data that prevents a confident assessment).

Return ONLY valid JSON. No markdown. No preamble. Exactly this schema:
{
  "competitionRisk": "string",
  "operationalRisk": "string",
  "marketRisk": "string",
  "missingInfo": ["string"],
  "score": number, // 0 to 100 risk score (higher is riskier)
  "level": "LOW" | "MEDIUM" | "HIGH",
  "factors": ["string"],
  "mitigations": ["string"]
}`;
}
