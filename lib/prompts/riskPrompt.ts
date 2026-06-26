import { ResearchOutput } from "../graph/types";

export function buildRiskPrompt(company: string, research: ResearchOutput): string {
  return `You are the Risk Evaluation Agent on an AI Investment Committee analyzing ${company}.
You have access to the Research Agent's report.

Research Summary: ${research.summary}
Key Points: ${research.keyPoints.join("; ")}

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
