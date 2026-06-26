import { z } from "zod";

export type AgentStatus = "idle" | "running" | "done" | "error";

export const ResearchSchema = z.object({
  sector: z.string().describe("The primary sector the company operates in."),
  hq: z.string().describe("Headquarters location."),
  founded: z.string().describe("When the company was founded."),
  businessModel: z.string().describe("Detailed description of the business model."),
  revenueModel: z.array(z.string()).describe("List of revenue streams."),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.union([z.string(), z.number()])
  })).describe("Key financial and operational metrics."),
  summary: z.string().describe("A concise executive summary."),
  keyPoints: z.array(z.string()).describe("List of key takeaways."),
  sources: z.array(z.string()).describe("URLs of sources used.")
});
export type ResearchOutput = z.infer<typeof ResearchSchema>;

export const FinancialSchema = z.object({
  metrics: z.record(z.string(), z.union([z.string(), z.number()])).describe("Key financial ratios and numbers."),
  trend: z.enum(["positive", "negative", "neutral"]).describe("The overall financial trend direction."),
  analysis: z.string().describe("Detailed qualitative financial analysis.")
});
export type FinancialOutput = z.infer<typeof FinancialSchema>;

export const SentimentSchema = z.object({
  score: z.number().describe("Sentiment score from 0.0 (bearish) to 1.0 (bullish)."),
  label: z.enum(["bullish", "bearish", "neutral"]).describe("The categorical sentiment label."),
  details: z.string().describe("Explanation of the sentiment factors.")
});
export type SentimentOutput = z.infer<typeof SentimentSchema>;

export const RiskSchema = z.object({
  competitionRisk: z.string().describe("Analysis of competitive threats and moat."),
  operationalRisk: z.string().describe("Analysis of supply chain, management, etc."),
  marketRisk: z.string().describe("Analysis of macro and market factors."),
  missingInfo: z.array(z.string()).describe("Any critical information gaps."),
  score: z.number().describe("Overall risk score from 0 (safest) to 100 (riskiest)."),
  level: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Categorical risk level."),
  factors: z.array(z.string()).describe("List of specific risk factors."),
  mitigations: z.array(z.string()).describe("Potential mitigations for the risks.")
});
export type RiskOutput = z.infer<typeof RiskSchema>;

export const VerdictSchema = z.object({
  decision: z.enum(["invest", "pass"]).describe("The final investment decision."),
  rationale: z.string().describe("The rationale behind the decision."),
  confidence: z.number().describe("Confidence score from 0 to 100."),
  thesis: z.string().describe("The core investment thesis."),
  reasoning: z.array(z.string()).describe("List of reasoning points."),
  assumptions: z.array(z.string()).describe("List of core assumptions made.")
});
export type VerdictOutput = z.infer<typeof VerdictSchema>;

export const ChallengeSchema = z.object({
  counterVerdict: z.string().describe("A verdict opposing the primary decision."),
  weakestAssumption: z.string().describe("The weakest assumption in the primary thesis."),
  alternativeThesis: z.string().describe("An alternative viewpoint or bear/bull case."),
  counterArguments: z.array(z.string()).describe("List of counter-arguments."),
  weaknesses: z.array(z.string()).describe("List of identified weaknesses in the original thesis."),
  finalAdjustments: z.string().describe("Suggested adjustments to the original thesis based on this challenge.")
});
export type ChallengeOutput = z.infer<typeof ChallengeSchema>;

export interface GraphState {
  query: string;
  research?: ResearchOutput;
  financial?: FinancialOutput;
  sentiment?: SentimentOutput;
  risk?: RiskOutput;
  verdict?: VerdictOutput;
  challenge?: ChallengeOutput;
  newsArticles?: any[];
  alphaVantage?: any;
  status: AgentStatus;
  error?: string;
  errors?: string[];
}

export type SSEEventType = "agent_start" | "agent_done" | "agent_error" | "complete" | "error";

export interface SSEEvent {
  type: SSEEventType;
  data: any;
}

export type AgentName = 
  | "ResearchAgent" 
  | "FinancialAgent" 
  | "SentimentAgent" 
  | "RiskAgent" 
  | "JudgeAgent" 
  | "ChallengeAgent";
