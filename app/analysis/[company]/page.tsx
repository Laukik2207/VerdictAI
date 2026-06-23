"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAnalysis, AGENT_ORDER } from "@/hooks/useAnalysis";
import { ExecutionTimeline } from "@/components/ExecutionTimeline";
import { AgentCard } from "@/components/AgentCard";
import { AnalysisReport } from "@/components/AnalysisReport";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Activity } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const companyRaw = Array.isArray(params.company) ? params.company[0] : params.company;
  const company = decodeURIComponent(companyRaw || "");

  const {
    agentStatuses,
    agentOutputs,
    elapsedMs,
    report,
    isComplete,
    error,
  } = useAnalysis(company);

  const [showTimelineModal, setShowTimelineModal] = useState(false);

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
    <div className="min-h-screen bg-brand-background text-brand-on-background relative">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full h-16 border-b border-white/5 bg-brand-background/80 backdrop-blur-xl z-50 flex items-center justify-between px-4 md:px-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-sm text-brand-on-surface-variant hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Search</span>
        </button>
        
        {isComplete && (
          <button 
            onClick={() => setShowTimelineModal(!showTimelineModal)}
            className="flex items-center gap-2 text-sm font-mono text-indigo hover:text-white transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>View Timeline</span>
          </button>
        )}
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 w-full max-w-7xl mx-auto min-h-screen flex flex-col">
        
        {!isComplete ? (
          <>
            <header className="mb-12">
              <h1 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight mb-2">
                {company}
              </h1>
              <p className="text-sm font-mono text-brand-outline uppercase tracking-wider animate-pulse">
                Analysis in progress...
              </p>
            </header>

            {/* Split Layout for Execution */}
            <div className="flex-1 flex flex-col md:flex-row gap-12">
              {/* Left: Timeline */}
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

              {/* Right: Agent Cards */}
              <div className="w-full md:w-[60%] flex-1 space-y-4">
                {AGENT_ORDER.map((agentName) => {
                  const status = agentStatuses[agentName];
                  if (status === "idle") return null;

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
            </div>
          </>
        ) : (
          /* Report View (Centered) */
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-500 ease-out">
            {report && <AnalysisReport report={report} company={company} />}
          </div>
        )}
      </main>

      {/* Timeline Modal / Flyout when Report is Complete */}
      {isComplete && showTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full md:w-[400px] h-full bg-brand-surface-container-highest border-l border-white/10 p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-lg text-white">Execution Timeline</h3>
              <button 
                onClick={() => setShowTimelineModal(false)}
                className="text-brand-on-surface-variant hover:text-white p-2"
              >
                Close
              </button>
            </div>
            <ExecutionTimeline
              agentStatuses={agentStatuses}
              agentOutputs={agentOutputs}
              elapsedMs={elapsedMs}
              company={company}
            />
          </div>
        </div>
      )}
    </div>
  );
}
