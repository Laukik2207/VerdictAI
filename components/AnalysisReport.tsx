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

  const baseAnim = ""; // Removed opacity-0 and animate-in to debug invisibility issue

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-10 pb-20">
      
      {/* 1. Report Header */}
      <div className={cn(baseAnim)}>
        <ReportHeader company={company} />
      </div>

      {/* 2. Company Snapshot */}
      <div className={cn(baseAnim)}>
        {report.research && <CompanySnapshot {...report.research} />}
      </div>

      {/* 3. Verdict Banner (Dominant) */}
      <div className={cn(baseAnim)}>
        {report.verdict && <VerdictBanner {...report.verdict} />}
      </div>

      {/* 4. Investment Thesis Detail */}
      <div className={cn(baseAnim, "space-y-4")}>
        <h3 className="font-headline text-xl text-white">Investment Thesis</h3>
        <div className="bg-brand-surface-container-low border border-white/5 p-6 rounded-xl space-y-4">
          <p className="text-brand-on-surface-variant text-base leading-relaxed">
            {report.verdict?.rationale}
          </p>
          <ul className="space-y-3 pt-4 border-t border-white/5">
            {(report.verdict?.reasoning || []).map((reason, i) => (
              <li key={i} className="flex gap-3 text-sm text-brand-on-surface-variant">
                <span className="text-accent mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Risk Board */}
      <div className={cn(baseAnim)}>
        {report.risk && <RiskBoard {...report.risk} />}
      </div>

      {/* 6. Market Sentiment Summary */}
      <div className={cn(baseAnim)}>
        <SentimentSummary sentiment={report.sentiment} />
      </div>

      {/* 7. Financial Overview */}
      <div className={cn(baseAnim)}>
        <FinancialOverview financial={report.financial} />
      </div>

      {/* 8. Devil's Advocate */}
      <div className={cn(baseAnim)}>
        {report.challenge && <CounterArguments {...report.challenge} />}
      </div>

      {/* 9. Agent Transparency Panel */}
      <div className={cn(baseAnim)}>
        <AgentTransparencyPanel report={report} />
      </div>

      {/* 10. Export Actions */}
      <div className={cn(baseAnim, "pt-8 border-t border-white/10 flex justify-center")}>
        <ExportButton report={report} company={company} />
      </div>

    </div>
  );
}
