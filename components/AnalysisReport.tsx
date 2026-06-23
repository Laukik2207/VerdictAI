import React from "react";
import { GraphState } from "@/lib/graph/types";
import { ReportHeader } from "./ReportHeader";
import { CompanySnapshot } from "./CompanySnapshot";
import { VerdictBanner } from "./VerdictBanner";
import { RiskBoard } from "./RiskBoard";
import { SentimentSummary } from "./SentimentSummary";
import { FinancialOverview } from "./FinancialOverview";
import { CounterArguments } from "./CounterArguments";
import { AgentTransparencyPanel } from "./AgentTransparencyPanel";
import { ExportButton } from "./ExportButton";
import { cn } from "@/lib/utils/cn";

interface AnalysisReportProps {
  report: GraphState;
  company: string;
}

export function AnalysisReport({ report, company }: AnalysisReportProps) {
  // Staggered animation utility classes based on 50ms increments
  const getStagger = (index: number) => {
    // Next.js Tailwind config usually doesn't have arbitrary delay out of the box dynamically via string concatenation
    // So we use inline styles for the exact delay, or rely on a standard set. 
    // I'll use inline styles for clean staggering.
    return { animationDelay: `${index * 50}ms` };
  };

  const baseAnim = "opacity-0 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards duration-500 ease-out";

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-10 pb-20">
      
      {/* 1. Report Header */}
      <div className={cn(baseAnim)} style={getStagger(0)}>
        <ReportHeader company={company} />
      </div>

      {/* 2. Company Snapshot */}
      <div className={cn(baseAnim)} style={getStagger(2)}>
        {report.research && <CompanySnapshot {...report.research} />}
      </div>

      {/* 3. Verdict Banner (Dominant) */}
      <div className={cn("opacity-0 animate-in fade-in zoom-in-95 fill-mode-forwards duration-700 ease-out")} style={getStagger(4)}>
        {report.verdict && <VerdictBanner {...report.verdict} />}
      </div>

      {/* 4. Investment Thesis Detail */}
      <div className={cn(baseAnim, "space-y-4")} style={getStagger(5)}>
        <h3 className="font-headline text-xl text-white">Investment Thesis</h3>
        <div className="bg-brand-surface-container-low border border-white/5 p-6 rounded-xl space-y-4">
          <p className="text-brand-on-surface-variant text-base leading-relaxed">
            {report.verdict?.rationale}
          </p>
          <ul className="space-y-3 pt-4 border-t border-white/5">
            {report.verdict?.reasoning.map((reason, i) => (
              <li key={i} className="flex gap-3 text-sm text-brand-on-surface-variant">
                <span className="text-indigo mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Risk Board */}
      <div className={cn(baseAnim)} style={getStagger(6)}>
        {/* We need to pass risk score/level since RiskBoard expects score and level natively or via output */}
        {report.risk && <RiskBoard {...report.risk} />}
      </div>

      {/* 6. Market Sentiment Summary */}
      <div className={cn(baseAnim)} style={getStagger(7)}>
        <SentimentSummary sentiment={report.sentiment} />
      </div>

      {/* 7. Financial Overview */}
      <div className={cn(baseAnim)} style={getStagger(8)}>
        <FinancialOverview financial={report.financial} />
      </div>

      {/* 8. Devil's Advocate */}
      <div className={cn(baseAnim)} style={getStagger(9)}>
        {report.challenge && <CounterArguments {...report.challenge} />}
      </div>

      {/* 9. Agent Transparency Panel */}
      <div className={cn(baseAnim)} style={getStagger(10)}>
        <AgentTransparencyPanel report={report} />
      </div>

      {/* 10. Export Actions */}
      <div className={cn(baseAnim, "pt-8 border-t border-white/10 flex justify-center")} style={getStagger(11)}>
        <ExportButton report={report} company={company} />
      </div>

    </div>
  );
}
