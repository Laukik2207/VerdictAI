import { useState, useEffect, useCallback } from "react";
import { GraphState, AgentStatus, SSEEvent } from "@/lib/graph/types";

export type AgentName = 
  | "ResearchAgent" 
  | "FinancialAgent" 
  | "SentimentAgent" 
  | "RiskAgent" 
  | "JudgeAgent" 
  | "ChallengeAgent";

export const AGENT_ORDER: AgentName[] = [
  "ResearchAgent",
  "FinancialAgent",
  "SentimentAgent",
  "RiskAgent",
  "JudgeAgent",
  "ChallengeAgent"
];

// Mock data from Phase 2
const mockResearch = {
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

const mockFinancial = {
  metrics: { Revenue: "$60.9B", NetIncome: "$29.7B", FCF: "$26.9B" },
  trend: "positive" as const,
  analysis: "Exceptional margin expansion driven by H100 mix.",
};

const mockSentiment = {
  score: 95,
  label: "bullish" as const,
  details: "Unanimous buy ratings from tier-1 banks following GTC.",
};

const mockRisk = {
  competitionRisk: "AMD's MI300 and internal hyperscaler silicon (TPU, Trainium) are capturing some low-end inference workloads.",
  operationalRisk: "Highly dependent on TSMC in Taiwan for 100% of leading-edge node manufacturing.",
  marketRisk: "Overall tech sector rotation or a 'AI winter' macro event could compress the multiple significantly.",
  missingInfo: ["Exact B100 yield rates", "China export restriction financial impact estimates for next FY"],
  score: 65,
  level: "MEDIUM" as const,
  factors: ["Geopolitics", "Valuation"],
  mitigations: ["Diversifying assembly to US/Europe", "Aggressive product roadmap"],
};

const mockVerdict = {
  decision: "invest" as const,
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

const mockChallenge = {
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

const MOCK_REPORT: GraphState = {
  query: "",
  status: "done",
  research: mockResearch,
  financial: mockFinancial,
  sentiment: mockSentiment,
  risk: mockRisk,
  verdict: mockVerdict,
  challenge: mockChallenge,
};

export function useAnalysis(company: string, isMock: boolean = false) {
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentName, AgentStatus>>({
    ResearchAgent: "idle",
    FinancialAgent: "idle",
    SentimentAgent: "idle",
    RiskAgent: "idle",
    JudgeAgent: "idle",
    ChallengeAgent: "idle",
  });
  const [agentOutputs, setAgentOutputs] = useState<Partial<GraphState>>({});
  const [elapsedMs, setElapsedMs] = useState<Record<AgentName, number>>({} as any);
  const [report, setReport] = useState<GraphState | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMockTimeline = useCallback(() => {
    // Reset state
    setAgentStatuses({
      ResearchAgent: "idle",
      FinancialAgent: "idle",
      SentimentAgent: "idle",
      RiskAgent: "idle",
      JudgeAgent: "idle",
      ChallengeAgent: "idle",
    });
    setAgentOutputs({});
    setElapsedMs({} as any);
    setReport(null);
    setIsComplete(false);
    setError(null);

    const timeline = [
      { name: "ResearchAgent", start: 0, end: 1500, outputKey: "research", outputData: mockResearch },
      { name: "FinancialAgent", start: 1600, end: 3000, outputKey: "financial", outputData: mockFinancial },
      { name: "SentimentAgent", start: 3100, end: 4200, outputKey: "sentiment", outputData: mockSentiment },
      { name: "RiskAgent", start: 4300, end: 5200, outputKey: "risk", outputData: mockRisk },
      { name: "JudgeAgent", start: 5300, end: 6500, outputKey: "verdict", outputData: mockVerdict },
      { name: "ChallengeAgent", start: 6600, end: 8000, outputKey: "challenge", outputData: mockChallenge },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    timeline.forEach((step) => {
      // Start event
      timeouts.push(
        setTimeout(() => {
          setAgentStatuses(prev => ({ ...prev, [step.name]: "running" }));
        }, step.start)
      );

      // Done event
      timeouts.push(
        setTimeout(() => {
          setAgentStatuses(prev => ({ ...prev, [step.name]: "done" }));
          setAgentOutputs(prev => ({ ...prev, [step.outputKey]: step.outputData }));
          setElapsedMs(prev => ({ ...prev, [step.name]: step.end - step.start }));
        }, step.end)
      );
    });

    timeouts.push(
      setTimeout(() => {
        setIsComplete(true);
        setReport({ ...MOCK_REPORT, query: company });
      }, 8100)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [company]);

  const startRealTimeline = useCallback(() => {
    // Real implementation for Phase 9 using fetch() and ReadableStream
    // For now, if called, we just throw or do nothing until Phase 9.
    const abortController = new AbortController();
    
    const run = async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: company }),
          signal: abortController.signal,
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
               // handle event type
            } else if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              try {
                const event: SSEEvent = JSON.parse(dataStr);
                // Implementation will go here in Phase 9
                // On agent_start: set running, mark start time
                // On agent_done: set done, calc elapsedMs, store output
                // On agent_error: set error
                // On complete: set isComplete, store report
              } catch (e) {
                console.error("Failed to parse SSE data", e);
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An error occurred during analysis.");
        }
      }
    };

    run();

    return () => abortController.abort();
  }, [company]);

  useEffect(() => {
    if (isMock) {
      return startMockTimeline();
    } else {
      return startRealTimeline();
    }
  }, [isMock, startMockTimeline, startRealTimeline]);

  return {
    agentStatuses,
    agentOutputs,
    elapsedMs,
    report,
    isComplete,
    error,
  };
}
