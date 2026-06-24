import React from "react";
import { ResearchOutput } from "@/lib/graph/types";
import { Info, ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Skeleton } from "./ui/Skeleton";

interface CompanySnapshotPanelProps {
  company: string;
  researchOutput: ResearchOutput | null;
}

export function CompanySnapshotPanel({ company, researchOutput }: CompanySnapshotPanelProps) {
  const isLoading = !researchOutput;
  
  // Try to find Market Cap, P/E Ratio from metrics
  const getMetric = (labelSubstring: string) => {
    if (!researchOutput?.metrics) return null;
    return researchOutput.metrics.find(m => m.label.toLowerCase().includes(labelSubstring))?.value;
  };

  const marketCap = getMetric("market cap") || "---";
  const peRatio = getMetric("p/e") || "---";
  
  // Dummy 24H change and volatility for UI purposes
  const dailyChange = "+2.4%";
  const volatility = "High";

  return (
    <div className="p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-text-primary">Company Snapshot</h2>
        <Info className="w-4 h-4 text-text-muted" />
      </div>

      {/* Company Card */}
      <div className="flex flex-col items-center justify-center py-6 border-b border-border mb-6">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold mb-4">
          {company.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-4xl font-bold text-text-primary tracking-tighter mb-1">
          {company.substring(0, 4).toUpperCase()}
        </h1>
        <span className="text-xs font-mono text-text-secondary uppercase mb-2">
          NASDAQ
        </span>
        <p className="text-sm text-text-muted text-center">
          {company}
        </p>
      </div>

      {/* Industry */}
      <div className="mb-8">
        <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2">
          Industry
        </h3>
        {isLoading ? (
          <Skeleton variant="text" className="w-3/4" />
        ) : (
          <p className="text-sm text-text-primary">
            {researchOutput.sector}
          </p>
        )}
      </div>

      {/* 2x2 Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col p-3 bg-bg-card border border-border rounded-lg">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">Market Cap</span>
          {isLoading ? <Skeleton variant="text" className="w-1/2" /> : <span className="text-sm font-bold text-text-primary">{marketCap}</span>}
        </div>
        <div className="flex flex-col p-3 bg-bg-card border border-border rounded-lg">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">P/E Ratio</span>
          {isLoading ? <Skeleton variant="text" className="w-1/2" /> : <span className="text-sm font-bold text-text-primary">{peRatio}</span>}
        </div>
        <div className="flex flex-col p-3 bg-bg-card border border-border rounded-lg">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">24H Change</span>
          <span className="text-sm font-bold text-accent">{dailyChange}</span>
        </div>
        <div className="flex flex-col p-3 bg-bg-card border border-border rounded-lg">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">Volatility</span>
          <span className="text-sm font-bold text-text-primary">{volatility}</span>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="flex-1 mb-6">
        <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-4">
          Quick Insights
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <ArrowUpRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-text-secondary leading-snug">
              {isLoading ? <Skeleton variant="text" /> : (researchOutput.keyPoints?.[0] || "Revenue growth accelerating across core business units.")}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-text-secondary leading-snug">
              {isLoading ? <Skeleton variant="text" /> : (researchOutput.keyPoints?.[1] || "Margin profile remains stable despite supply chain constraints.")}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-status-pass mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-text-secondary leading-snug">
              {isLoading ? <Skeleton variant="text" /> : (researchOutput.keyPoints?.[2] || "Regulatory scrutiny increasing in key European markets.")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full py-2.5 rounded-md border border-border text-xs font-medium text-text-primary hover:bg-white/5 transition-colors mt-auto">
        View Full Company Profile
      </button>
    </div>
  );
}
