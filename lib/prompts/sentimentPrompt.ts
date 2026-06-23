import { ResearchOutput } from "../graph/types";

export function buildSentimentPrompt(company: string, research: ResearchOutput): string {
  return `You are the Market Sentiment Agent on an AI Investment Committee.
Your mandate: analyze the qualitative momentum and public perception of ${company} (${research.sector}).

Search for news, earnings call transcripts, and analyst commentary from the last 90 days.
Focus on:
1. Institutional upgrades/downgrades
2. Executive leadership tone
3. Product launch reception
4. Macro tailwinds/headwinds affecting this specific company

Extract definitive bullish and bearish signals.

Return ONLY valid JSON. No markdown. No preamble. Exactly this schema:
{
  "score": number, // 0 to 100
  "label": "bullish" | "bearish" | "neutral",
  "details": "string",
  "bullSignals": ["string"],
  "bearSignals": ["string"],
  "headlines": ["string"]
}`;
}
