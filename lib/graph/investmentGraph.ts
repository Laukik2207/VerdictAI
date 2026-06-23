import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { 
  GraphState, 
  AgentStatus, 
  ResearchOutput, 
  FinancialOutput, 
  SentimentOutput, 
  RiskOutput, 
  VerdictOutput, 
  ChallengeOutput 
} from "./types";

import { runResearchAgent } from "../agents/researchAgent";
import { runFinancialAgent } from "../agents/financialAgent";
import { runSentimentAgent } from "../agents/sentimentAgent";
import { runRiskAgent } from "../agents/riskAgent";
import { runJudgeAgent } from "../agents/judgeAgent";
import { runChallengeAgent } from "../agents/challengeAgent";

// --- Graph State Definition ---
export const GraphStateAnnotation = Annotation.Root({
  query: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  research: Annotation<ResearchOutput>({
    reducer: (x, y) => y ?? x,
  }),
  financial: Annotation<FinancialOutput>({
    reducer: (x, y) => y ?? x,
  }),
  sentiment: Annotation<SentimentOutput>({
    reducer: (x, y) => y ?? x,
  }),
  risk: Annotation<RiskOutput>({
    reducer: (x, y) => y ?? x,
  }),
  verdict: Annotation<VerdictOutput>({
    reducer: (x, y) => y ?? x,
  }),
  challenge: Annotation<ChallengeOutput>({
    reducer: (x, y) => y ?? x,
  }),
  status: Annotation<AgentStatus>({
    reducer: (x, y) => y ?? x,
    default: () => "idle",
  }),
  error: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  errors: Annotation<string[]>({
    reducer: (x, y) => (y ? x.concat(y) : x),
    default: () => [],
  }),
});

// --- Nodes ---
async function researchNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  const output = await runResearchAgent(state.query);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { research: output, errors };
}

async function financialNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  if (!state.research) throw new Error("Research state missing before Financial node.");
  const output = await runFinancialAgent(state.research);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { financial: output, errors };
}

async function sentimentNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  if (!state.research) throw new Error("Research state missing before Sentiment node.");
  const output = await runSentimentAgent(state.query, state.research);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { sentiment: output, errors };
}

async function riskNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  const output = await runRiskAgent(state);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { risk: output, errors };
}

async function judgeNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  const output = await runJudgeAgent(state);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { verdict: output, errors };
}

async function challengeNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  const output = await runChallengeAgent(state);
  const errors = (output as any).error ? [(output as any).error] : undefined;
  return { challenge: output, errors };
}

// --- Graph Builder ---
export function buildInvestmentGraph() {
  const workflow = new StateGraph(GraphStateAnnotation)
    .addNode("research_agent", researchNode)
    .addNode("financial_agent", financialNode)
    .addNode("sentiment_agent", sentimentNode)
    .addNode("risk_agent", riskNode)
    .addNode("judge_agent", judgeNode)
    .addNode("challenge_agent", challengeNode)
    // Sequential graph for auditability. Parallel execution (risk+sentiment) is v2 optimization.
    .addEdge(START, "research_agent")
    .addEdge("research_agent", "financial_agent")
    .addEdge("financial_agent", "sentiment_agent")
    .addEdge("sentiment_agent", "risk_agent")
    .addEdge("risk_agent", "judge_agent")
    .addEdge("judge_agent", "challenge_agent")
    .addEdge("challenge_agent", END);

  return workflow.compile();
}
