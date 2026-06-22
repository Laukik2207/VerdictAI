import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Skeleton } from "@/components/ui/Skeleton";
import { AgentStatusDot } from "@/components/AgentStatusDot";
import { AgentCard } from "@/components/AgentCard";
import { CompanySnapshot } from "@/components/CompanySnapshot";
import { VerdictBanner } from "@/components/VerdictBanner";
import { RiskBoard } from "@/components/RiskBoard";
import { CounterArguments } from "@/components/CounterArguments";
import { ExportButton } from "@/components/ExportButton";

const mockResearch = {
  sector: "Technology",
  hq: "Santa Clara, CA",
  founded: "1993",
  businessModel: "Designs and manufactures advanced GPUs and semiconductor products for gaming, professional visualization, datacenter, and auto markets.",
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

const mockVerdict = {
  decision: "invest" as const,
  rationale: "Unprecedented demand for AI infrastructure with an unassailable software moat.",
  confidence: 92,
  thesis: "NVDA remains a multi-year compounding play on global AI capex spend. Despite high valuations, the earnings growth sustainably outpaces multiple expansion.",
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

export default function DevPage() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-on-background p-8 pb-32 space-y-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-8">VerdictAI Component Library</h1>
        
        {/* Buttons */}
        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-mono text-brand-outline border-b border-white/10 pb-2">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-mono text-brand-outline border-b border-white/10 pb-2">Badges & Spinners</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="invest">INVEST</Badge>
            <Badge variant="pass">PASS</Badge>
            <Badge variant="neutral">NEUTRAL</Badge>
            <Badge variant="running">RUNNING</Badge>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </section>

        {/* Progress & Skeletons */}
        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-mono text-brand-outline border-b border-white/10 pb-2">Indicators</h2>
          <div className="flex gap-8 items-center">
            <ProgressRing value={92} size={64} colorClass="text-verdict-invest" />
            <ProgressRing value={45} size={64} colorClass="text-brand-outline" />
            <ProgressRing value={12} size={64} colorClass="text-verdict-pass" />
          </div>
          <div className="space-y-2 mt-4 max-w-sm">
            <Skeleton variant="circle" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="card" />
          </div>
        </section>

        {/* Agent Cards */}
        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-mono text-brand-outline border-b border-white/10 pb-2">Agent Cards</h2>
          <div className="space-y-4 max-w-lg">
            <AgentCard agentName="ResearchAgent" status="idle" />
            <AgentCard agentName="FinancialAgent" status="running" elapsedMs={2450} />
            <AgentCard agentName="RiskAgent" status="done" elapsedMs={12040} output={mockRisk} />
            <AgentCard agentName="SentimentAgent" status="error" elapsedMs={400} output="Failed to fetch API" />
          </div>
        </section>

        {/* Feature Components */}
        <section className="space-y-8 mb-12">
          <h2 className="text-xl font-mono text-brand-outline border-b border-white/10 pb-2">Feature Layouts</h2>
          
          <VerdictBanner {...mockVerdict} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CompanySnapshot {...mockResearch} />
            <div className="space-y-8">
              <RiskBoard {...mockRisk} />
              <Card className="p-6">
                <ExportButton report={{ query: "NVDA", status: "done", verdict: mockVerdict, research: mockResearch }} company="NVIDIA" />
              </Card>
            </div>
          </div>

          <CounterArguments {...mockChallenge} />
          
        </section>
      </div>
    </div>
  );
}
