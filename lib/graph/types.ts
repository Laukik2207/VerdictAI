export type AgentStatus = "idle" | "running" | "done" | "error";

export interface ResearchOutput {
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
  level: "LOW" | "MEDIUM" | "HIGH";
  factors: string[];
  mitigations: string[];
}

export interface VerdictOutput {
  decision: "invest" | "pass";
  rationale: string;
  confidence: number; // 0 to 1
}

export interface ChallengeOutput {
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
}

export type SSEEventType = "agent_start" | "agent_done" | "agent_error" | "complete" | "error";

export interface SSEEvent {
  type: SSEEventType;
  data: any;
}
