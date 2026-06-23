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

// --- Mock Data ---
const MOCK_RESEARCH_OUTPUT: ResearchOutput = {
  sector: "Technology",
  hq: "Santa Clara, CA",
  founded: "1993",
  businessModel: "Designs and manufactures advanced GPUs and semiconductor products.",
  revenueModel: ["Hardware Sales", "Datacenter Licensing", "Software Subscriptions"],
  metrics: [
    { label: "Market Cap", value: "$2.2T" },
    { label: "P/E Ratio", value: "72.4" },
    { label: "Rev Growth", value: "265% YoY" },
    { label: "Gross Margin", value: "76.0%" },
  ],
  summary: "NVIDIA dominates the AI hardware accelerator market.",
  keyPoints: ["Monopoly in training hardware", "CUDA software moat", "Supply chain risks"],
  sources: ["SEC 10-K", "Q4 Earnings Transcript"],
};

const MOCK_FINANCIAL_OUTPUT: FinancialOutput = {
  metrics: { Revenue: "$60.9B", NetIncome: "$29.7B", FCF: "$26.9B" },
  trend: "positive",
  analysis: "Exceptional margin expansion driven by H100 mix.",
};

const MOCK_SENTIMENT_OUTPUT: SentimentOutput = {
  score: 95,
  label: "bullish",
  details: "Unanimous buy ratings from tier-1 banks following GTC.",
};

const MOCK_RISK_OUTPUT: RiskOutput = {
  competitionRisk: "AMD's MI300 and internal hyperscaler silicon (TPU, Trainium) are capturing some low-end inference workloads.",
  operationalRisk: "Highly dependent on TSMC in Taiwan for 100% of leading-edge node manufacturing.",
  marketRisk: "Overall tech sector rotation or a 'AI winter' macro event could compress the multiple significantly.",
  missingInfo: ["Exact B100 yield rates", "China export restriction financial impact estimates for next FY"],
  score: 65,
  level: "MEDIUM",
  factors: ["Geopolitics", "Valuation"],
  mitigations: ["Diversifying assembly to US/Europe", "Aggressive product roadmap"],
};

const MOCK_VERDICT_OUTPUT: VerdictOutput = {
  decision: "invest",
  rationale: "Unprecedented demand for AI infrastructure with an unassailable software moat.",
  confidence: 92,
  thesis: "NVDA remains a multi-year compounding play on global AI capex spend.",
  reasoning: [
    "Hyperscalers have committed $100B+ to datacenter buildouts over the next 24 months.",
    "No viable near-term competitor to CUDA architecture in the developer ecosystem.",
    "Gross margins expanding due to pricing power on H100/B100 chips."
  ],
  assumptions: [
    "AI adoption continues to scale linearly or exponentially.",
    "TSMC can meet wafer demand without geopolitical interruption."
  ],
};

const MOCK_CHALLENGE_OUTPUT: ChallengeOutput = {
  counterVerdict: "The AI hardware bubble is pricing in perfection, making any earnings miss catastrophic.",
  weakestAssumption: "Hyperscalers will continue to spend infinitely on GPUs before seeing software ROI.",
  alternativeThesis: "Once the initial training cluster buildout is complete, demand shifts to cheaper inference chips where NVDA has lower margins and higher competition.",
  counterArguments: [
    "Revenue growth will inevitably decelerate by FY26 due to the law of large numbers.",
    "Customer concentration is extremely high (top 4 customers = 40% revenue).",
    "Geopolitical tension in Taiwan represents an un-hedgable existential risk."
  ],
  weaknesses: ["Valuation risk"],
  finalAdjustments: "Reduced confidence by 5%",
};

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
});

// --- Stub Nodes ---
async function researchNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { research: MOCK_RESEARCH_OUTPUT };
}

async function financialNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { financial: MOCK_FINANCIAL_OUTPUT };
}

async function sentimentNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { sentiment: MOCK_SENTIMENT_OUTPUT };
}

async function riskNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { risk: MOCK_RISK_OUTPUT };
}

async function judgeNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { verdict: MOCK_VERDICT_OUTPUT };
}

async function challengeNode(state: typeof GraphStateAnnotation.State): Promise<Partial<GraphState>> {
  return { challenge: MOCK_CHALLENGE_OUTPUT };
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
