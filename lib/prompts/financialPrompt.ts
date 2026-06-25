import { ResearchOutput } from "../graph/types";
import { FinancialOverview } from "../services/providers/finance";

export function buildFinancialPrompt(research: ResearchOutput, overview: FinancialOverview | null): string {
  return `You are the Financial Analyst Agent on an AI Investment Committee.
Your mandate: rigorously analyze the financial health of the target company.

Context from the Research Agent:
Sector: ${research.sector}
Business Model: ${research.businessModel}

VERIFIED Financial Data (Alpha Vantage):
${overview ? JSON.stringify(overview, null, 2) : "Data unavailable (Private or Unlisted)"}

Analyze the provided financial data. LLM should reason, NOT invent numbers. Calculate a financial score (0-100) based on margins, growth, and leverage.

Return ONLY valid JSON. No markdown. No preamble. Exactly this schema:
{
  "metrics": { "string_key": "string or number value" },
  "trend": "positive" | "negative" | "neutral",
  "analysis": "string",
  "score": number
}`;
}
