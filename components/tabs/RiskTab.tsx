import React from "react";
import { RiskOutput } from "@/lib/graph/types";
import { AlertTriangle, Info, ShieldAlert, Activity, GitCommit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RiskTabProps {
  risk: RiskOutput | null;
  status: "idle" | "running" | "done" | "error";
}

export function RiskTab({ risk, status }: RiskTabProps) {
  if (status === "running" || (status === "idle" && !risk)) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-64 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-white/5 rounded-xl" />
          <div className="h-48 bg-white/5 rounded-xl" />
          <div className="h-48 bg-white/5 rounded-xl" />
        </div>
        <div className="h-32 bg-white/5 rounded-xl border-l-4 border-amber-500/50" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full p-8 border border-red-500/20 rounded-xl bg-red-500/5 text-center">
        <p className="text-red-400">Error loading risk data.</p>
      </div>
    );
  }

  if (!risk) {
    return null;
  }

  const riskScore = risk.score || (risk.level === "HIGH" ? 85 : risk.level === "MEDIUM" ? 50 : 20);
  
  let scoreColor = "text-[#00D4A0]";
  let scoreInterpretation = "Low Risk — Favorable conditions for investment";
  if (riskScore >= 67) {
    scoreColor = "text-red-500";
    scoreInterpretation = "High Risk — Significant concerns identified";
  } else if (riskScore >= 34) {
    scoreColor = "text-amber-500";
    scoreInterpretation = "Moderate Risk — Proceed with due diligence";
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* SECTION A — Risk Matrix Hero & Overall Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Matrix (2x2) */}
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-6 flex flex-col">
          <h2 className="text-white text-[16px] font-bold mb-6">Risk Matrix</h2>
          
          <div className="flex-1 relative pl-8 pb-8">
            {/* Y Axis */}
            <div className="absolute left-0 top-0 bottom-8 w-8 flex items-center justify-center">
              <span className="text-[10px] text-text-muted uppercase tracking-widest -rotate-90 whitespace-nowrap">
                IMPACT
              </span>
            </div>
            {/* X Axis */}
            <div className="absolute left-8 right-0 bottom-0 h-8 flex items-center justify-center">
              <span className="text-[10px] text-text-muted uppercase tracking-widest">
                LIKELIHOOD
              </span>
            </div>

            <div className="w-full h-full min-h-[240px] grid grid-cols-2 grid-rows-2 gap-1 bg-[#1a1a1a] rounded-lg border border-white/5 relative">
              {/* Quadrants */}
              <div className="bg-red-500/10 p-2 border-b border-r border-white/5 flex items-start justify-between">
                <span className="text-[10px] font-bold text-red-500/70">CRITICAL — MONITOR</span>
              </div>
              <div className="bg-red-500/20 p-2 border-b border-white/5 flex items-start justify-end">
                <span className="text-[10px] font-bold text-red-500">IMMEDIATE ACTION</span>
              </div>
              <div className="bg-white/5 p-2 border-r border-white/5 flex items-end justify-between">
                <span className="text-[10px] font-bold text-text-muted">WATCH LIST</span>
              </div>
              <div className="bg-amber-500/10 p-2 flex items-end justify-end">
                <span className="text-[10px] font-bold text-amber-500/70">MANAGE ACTIVELY</span>
              </div>

              {/* Mock Risk Dots based on risk level */}
              <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10 top-[20%] left-[30%] group">
                <div className="absolute hidden group-hover:block w-48 bg-[#222] border border-white/10 p-2 rounded shadow-xl -top-2 left-6 text-xs text-white z-20">
                  <span className="font-bold text-blue-400 block mb-1">Competition Risk</span>
                  {risk.competitionRisk}
                </div>
              </div>
              <div className="absolute w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10 top-[60%] left-[80%] group">
                <div className="absolute hidden group-hover:block w-48 bg-[#222] border border-white/10 p-2 rounded shadow-xl -top-2 right-6 text-xs text-white z-20">
                  <span className="font-bold text-purple-400 block mb-1">Operational Risk</span>
                  {risk.operationalRisk}
                </div>
              </div>
              <div className="absolute w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-[0_0_10px_rgba(245,158,11,0.8)] z-10 top-[15%] left-[75%] group">
                <div className="absolute hidden group-hover:block w-48 bg-[#222] border border-white/10 p-2 rounded shadow-xl -top-2 right-6 text-xs text-white z-20">
                  <span className="font-bold text-amber-400 block mb-1">Market Risk</span>
                  {risk.marketRisk}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Risk Score */}
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-white text-[16px] font-bold mb-8">Overall Risk Score</h2>
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" fill="none" stroke="#1a1a1a" strokeWidth="12" />
              <circle 
                cx="96" cy="96" r="88" fill="none" 
                stroke={riskScore >= 67 ? "#ef4444" : riskScore >= 34 ? "#f59e0b" : "#00D4A0"} 
                strokeWidth="12" 
                strokeDasharray="552" 
                strokeDashoffset={552 - (552 * riskScore) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
              <span className={cn("text-6xl font-bold tracking-tighter", scoreColor)}>{riskScore}</span>
              <span className="text-text-muted text-sm font-bold">/ 100</span>
            </div>
          </div>
          <span className={cn("text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", 
            riskScore >= 67 ? "bg-red-500/10 border-red-500/30 text-red-500" : 
            riskScore >= 34 ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : 
            "bg-[#00D4A0]/10 border-[#00D4A0]/30 text-[#00D4A0]"
          )}>
            {risk.level} RISK
          </span>
          <p className="text-xs text-text-secondary mt-4">
            {scoreInterpretation}
          </p>
        </div>
      </div>

      {/* SECTION B — Risk Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              Competition Risk
            </h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              External
            </span>
          </div>
          <p className="text-sm text-text-secondary flex-1 mb-6">
            {risk.competitionRisk || "Significant competitive pressures identified in the sector."}
          </p>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[65%]" />
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-purple-400" />
              Operational Risk
            </h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Internal
            </span>
          </div>
          <p className="text-sm text-text-secondary flex-1 mb-6">
            {risk.operationalRisk || "Execution and operational challenges present moderate risk."}
          </p>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-[45%]" />
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              Market Risk
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Systemic
            </span>
          </div>
          <p className="text-sm text-text-secondary flex-1 mb-6">
            {risk.marketRisk || "Macroeconomic factors and market volatility exposures."}
          </p>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[80%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION E — Risk Summary */}
        <div className="bg-bg-card border border-border rounded-xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500" />
          <h2 className="text-white text-[16px] font-bold mb-4">Risk Summary</h2>
          <p className="text-text-secondary text-[14px] leading-[1.7] whitespace-pre-wrap">
            {/* Using factors/mitigations as a proxy for summary since riskSummary doesn't exist in type */}
            {risk.factors?.join(" ") || "Detailed qualitative risk summary is currently unavailable."}
          </p>
          {risk.mitigations && risk.mitigations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">Key Mitigations</h4>
              <ul className="list-disc pl-4 text-[13px] text-text-secondary space-y-1">
                {risk.mitigations.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* SECTION C — Information Gaps */}
        <div className="bg-[#1a1a1a] border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-amber-500 text-[16px] font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Information Gaps
          </h2>
          <p className="text-[12px] text-text-muted mb-4">
            These gaps increase uncertainty in the analysis and should be verified manually.
          </p>
          
          <ul className="space-y-3">
            {risk.missingInfo && risk.missingInfo.length > 0 ? (
              risk.missingInfo.map((info, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90">{info}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00D4A0] shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">No significant information gaps identified in the current data set.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
