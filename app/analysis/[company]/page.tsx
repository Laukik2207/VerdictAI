"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAnalysis, AGENT_ORDER } from "@/hooks/useAnalysis";
import { ExecutionTimeline } from "@/components/ExecutionTimeline";
import { AgentCard } from "@/components/AgentCard";
import { AnalysisReport } from "@/components/AnalysisReport";
import { Button } from "@/components/ui/Button";
import { AppShell } from "@/components/layout/AppShell";
import { CompanySnapshotPanel } from "@/components/CompanySnapshotPanel";

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

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-card border border-status-pass/20 rounded-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-status-pass/10 text-status-pass flex items-center justify-center mx-auto text-3xl mb-4">
            !
          </div>
          <h2 className="text-xl font-medium text-white">Analysis Failed</h2>
          <p className="text-sm text-text-secondary">{error}</p>
          <button 
            className="w-full py-2 border border-border text-text-primary rounded hover:bg-white/5 transition-colors" 
            onClick={() => router.push("/")}
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppShell 
      company={company} 
      isComplete={isComplete}
      rightPanel={
        <CompanySnapshotPanel 
          company={company} 
          researchOutput={(report?.research || agentOutputs.research) ?? null} 
        />
      }
    >
      <div className="w-full max-w-5xl mx-auto p-6 md:p-10">
        {!isComplete ? (
          <div className="flex flex-col gap-10">
            <header className="mb-4">
              <h1 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight mb-2">
                {company}
              </h1>
              <p className="text-sm font-mono text-accent uppercase tracking-wider animate-pulse">
                Analysis in progress...
              </p>
            </header>

            <div className="flex flex-col md:flex-row gap-12">
              {/* Left: Timeline */}
              <div className="w-full md:w-[40%] flex-shrink-0">
                <div className="sticky top-10">
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
                     <div key={agentName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <AgentCard
                        agentName={agentName}
                        status={status}
                        elapsedMs={elapsedMs[agentName]}
                        output={output}
                      />
                     </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center mt-4">
            {report && <AnalysisReport report={report} company={company} />}
          </div>
        )}
      </div>
    </AppShell>
  );
}
