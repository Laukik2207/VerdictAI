export type AgentStatus = "idle" | "running" | "done" | "error";

export interface ResearchOutput {
  sector: string;
  hq: string;
  founded: string;
  businessModel: string;
  revenueModel: string[];
  metrics: { label: string; value: string | number }[];
  summary: string;
  keyPoints: string[];
  sources: string[];
}

export interface FinancialOutput {
  metrics: Record<string, string | number>;
  trend: "positive" | "negative" | "neutral";
  analysis: string;
}

export interface SentimentOutput {
  score: number; // 0 to 1
  label: "bullish" | "bearish" | "neutral";
  details: string;
}

export interface RiskOutput {
  competitionRisk: string;
  operationalRisk: string;
  marketRisk: string;
  missingInfo: string[];
  score: number; // 0 to 100 or something similar
  level: "LOW" | "MEDIUM" | "HIGH";
  factors: string[];
  mitigations: string[];
}

export interface VerdictOutput {
  decision: "invest" | "pass";
  rationale: string;
  confidence: number; // 0 to 100
  thesis: string;
  reasoning: string[];
  assumptions: string[];
}

export interface ChallengeOutput {
  counterVerdict: string;
  weakestAssumption: string;
  alternativeThesis: string;
  counterArguments: string[];
  weaknesses: string[];
  finalAdjustments: string;
}

export interface GraphState {
  query: string;
  research?: ResearchOutput;
  financial?: FinancialOutput;
  sentiment?: SentimentOutput;
  risk?: RiskOutput;
  verdict?: VerdictOutput;
  challenge?: ChallengeOutput;
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
