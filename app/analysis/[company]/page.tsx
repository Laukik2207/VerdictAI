"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAnalysis, AGENT_ORDER } from "@/hooks/useAnalysis";
import { ExecutionTimeline } from "@/components/ExecutionTimeline";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const companyRaw = Array.isArray(params.company) ? params.company[0] : params.company;
  const company = decodeURIComponent(companyRaw || "");
  const isMock = searchParams?.get("mock") === "true";

  const {
    agentStatuses,
    agentOutputs,
    elapsedMs,
    report,
    isComplete,
    error,
  } = useAnalysis(company, isMock);

  if (error) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-surface-container-low border border-brand-error/20 rounded-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-error/10 text-brand-error flex items-center justify-center mx-auto text-3xl mb-4">
            !
          </div>
          <h2 className="text-xl font-medium text-white">Analysis Failed</h2>
          <p className="text-sm text-brand-on-surface-variant">{error}</p>
          <Button variant="danger" className="w-full" onClick={() => router.push("/")}>
            Return to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background text-brand-on-background">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full h-16 border-b border-white/5 bg-brand-background/80 backdrop-blur-xl z-50 flex items-center px-4 md:px-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-sm text-brand-on-surface-variant hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto h-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight mb-2">
            {company}
          </h1>
          <p className="text-sm font-mono text-brand-outline uppercase tracking-wider">
            {isComplete ? "Analysis complete" : "Analysis in progress..."}
          </p>
        </header>

        {/* Split Layout */}
        <div className="flex-1 flex flex-col md:flex-row gap-12 relative">
          
          {/* Left: Timeline (40%) */}
          <div className="w-full md:w-[40%] flex-shrink-0">
            <div className="sticky top-28">
              <ExecutionTimeline
                agentStatuses={agentStatuses}
                agentOutputs={agentOutputs}
                elapsedMs={elapsedMs}
                company={company}
              />
            </div>
          </div>

          {/* Right: Content (60%) */}
          <div className="w-full md:w-[60%] flex-1 relative">
            {/* During execution: Agent Cards */}
            <div 
              className={cn(
                "w-full space-y-4 transition-all duration-700 ease-in-out absolute inset-0 top-0 left-0",
                isComplete ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
              )}
            >
              {AGENT_ORDER.map(agentName => {
                const status = agentStatuses[agentName];
                if (status === "idle") return null;

                // Grab corresponding output
                let output = undefined;
                if (agentName === "ResearchAgent") output = agentOutputs.research;
                if (agentName === "FinancialAgent") output = agentOutputs.financial;
                if (agentName === "SentimentAgent") output = agentOutputs.sentiment;
                if (agentName === "RiskAgent") output = agentOutputs.risk;
                if (agentName === "JudgeAgent") output = agentOutputs.verdict;
                if (agentName === "ChallengeAgent") output = agentOutputs.challenge;

                return (
                  <AgentCard
                    key={agentName}
                    agentName={agentName}
                    status={status}
                    elapsedMs={elapsedMs[agentName]}
                    output={output}
                  />
                );
              })}
            </div>

            {/* Complete: Report Placeholder */}
            <div
              className={cn(
                "w-full bg-brand-surface-container-low border border-white/10 rounded-xl p-8 flex items-center justify-center min-h-[400px] transition-all duration-700 delay-300 ease-in-out absolute inset-0 top-0 left-0",
                !isComplete ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
              )}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-verdict-invest/10 flex items-center justify-center">
                  <span className="text-verdict-invest text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-medium text-white">Report Generated</h3>
                <p className="text-brand-on-surface-variant text-sm max-w-sm mx-auto">
                  Report component comes in Phase 5. The analysis has successfully concluded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
