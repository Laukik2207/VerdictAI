"use client";

import React, { useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAnalysis } from "@/hooks/useAnalysis";
import { AppShell } from "@/components/layout/AppShell";
import { CompanySnapshotPanel } from "@/components/CompanySnapshotPanel";
import { ResearchTab } from "@/components/tabs/ResearchTab";
import { FinancialsTab } from "@/components/tabs/FinancialsTab";
import { SentimentTab } from "@/components/tabs/SentimentTab";
import { RiskTab } from "@/components/tabs/RiskTab";
import { VerdictTab } from "@/components/tabs/VerdictTab";
import { formatCompanyName } from "@/lib/utils/formatCompany";

function AnalysisPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const companyRaw = Array.isArray(params.company) ? params.company[0] : params.company;
  const company = decodeURIComponent(companyRaw || "");
  const activeTab = searchParams?.get('tab') ?? 'research';

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

  // Determine whether to show the right panel (only in research tab for now to save space, or globally but let's keep it global if not complete, or based on tab)
  // The user said "This is the CURRENT research/timeline view — keep it... live log, right panel."
  // Wait, if it's on Financials tab, does it show right panel? AppShell has right panel space. Let's keep it visible everywhere unless we are done? Or maybe let's just keep AppShell's logic: show if not complete. 
  // For the tabs themselves:

  const renderTabContent = () => {
    switch (activeTab) {
      case 'financials':
        return (
          <FinancialsTab 
            financial={report?.financial || agentOutputs.financial || null}
            alphaVantage={report?.alphaVantage || agentOutputs.alphaVantage || null}
            status={agentStatuses.FinancialAgent}
          />
        );
      case 'sentiment':
        return (
          <SentimentTab 
            sentiment={report?.sentiment || agentOutputs.sentiment || null}
            newsArticles={report?.newsArticles || agentOutputs.newsArticles || []}
            status={agentStatuses.SentimentAgent}
          />
        );
      case 'risk':
        return (
          <RiskTab 
            risk={report?.risk || agentOutputs.risk || null}
            status={agentStatuses.RiskAgent}
          />
        );
      case 'verdict':
        // Show skeleton or loading if judge/challenge not done
        if (agentStatuses.JudgeAgent === 'running' || agentStatuses.ChallengeAgent === 'running' || !report) {
          return (
             <div className="w-full space-y-6 animate-pulse">
                <div className="h-64 bg-white/5 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-48 bg-white/5 rounded-xl" />
                  <div className="h-48 bg-white/5 rounded-xl" />
                  <div className="h-48 bg-white/5 rounded-xl" />
                </div>
              </div>
          );
        }
        return <VerdictTab report={report} company={company} />;
      case 'research':
      default:
        return (
          <ResearchTab 
            agentStatuses={agentStatuses}
            agentOutputs={agentOutputs}
            elapsedMs={elapsedMs}
            logEntries={logEntries}
            company={company}
          />
        );
    }
  };

  return (
    <AppShell 
      company={formatCompanyName(company)} 
      isComplete={isComplete}
      agentStatuses={agentStatuses}
      rightPanel={
        <CompanySnapshotPanel 
          company={formatCompanyName(company)} 
          researchOutput={(report?.research || agentOutputs.research) ?? null} 
        />
      }
    >
      <div className="w-full max-w-5xl mx-auto p-6 md:p-10 pb-32">
        {renderTabContent()}
      </div>
    </AppShell>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <AnalysisPageContent />
    </Suspense>
  );
}
