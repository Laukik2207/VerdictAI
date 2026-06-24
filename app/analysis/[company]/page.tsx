"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnalysis } from "@/hooks/useAnalysis";
import { AppShell } from "@/components/layout/AppShell";
import { CompanySnapshotPanel } from "@/components/CompanySnapshotPanel";
import { ResearchView } from "@/components/ResearchView";
import { VerdictView } from "@/components/VerdictView";
import { formatCompanyName } from "@/lib/utils/formatCompany";

export default function AnalysisPage() {
  const params = useParams();
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
    logEntries,
  } = useAnalysis(company);

  useEffect(() => {
    if (isComplete && report) {
      localStorage.setItem('verdictai_report_' + company, JSON.stringify(report));
      localStorage.setItem('verdictai_last_company', company);
    }
  }, [isComplete, report, company]);

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
      company={formatCompanyName(company)} 
      isComplete={isComplete}
      rightPanel={
        <CompanySnapshotPanel 
          company={formatCompanyName(company)} 
          researchOutput={(report?.research || agentOutputs.research) ?? null} 
        />
      }
    >
      <div className="w-full max-w-5xl mx-auto p-6 md:p-10 pb-32">
        {!isComplete ? (
          <ResearchView 
            agentStatuses={agentStatuses}
            agentOutputs={agentOutputs}
            elapsedMs={elapsedMs}
            logEntries={logEntries}
            company={company}
          />
        ) : (
          report ? <VerdictView report={report} company={company} /> : null
        )}
      </div>
    </AppShell>
  );
}
