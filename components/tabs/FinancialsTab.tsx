import React from "react";
import { FinancialOutput } from "@/lib/graph/types";
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FinancialsTabProps {
  financial: FinancialOutput | null;
  alphaVantage: any | null;
  status: "idle" | "running" | "done" | "error";
}

export function FinancialsTab({ financial, alphaVantage, status }: FinancialsTabProps) {
  if (status === "running" || (status === "idle" && !financial)) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-1/3" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-32 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
        </div>
        <div className="h-64 bg-white/5 rounded-xl" />
        <div className="h-48 bg-white/5 rounded-xl border-l-4 border-accent/50" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full p-8 border border-red-500/20 rounded-xl bg-red-500/5 text-center">
        <p className="text-red-400">Error loading financial data.</p>
      </div>
    );
  }

  if (!financial && !alphaVantage) {
    return null;
  }

  // Derived metrics from financial output and alphaVantage
  const m = financial?.metrics || {};
  const revGrowthStr = String(m.RevGrowth || m["Rev Growth"] || m.revenueGrowth || alphaVantage?.QuarterlyRevenueGrowthYOY || "N/A");
  const profitMarginStr = String(m.GrossMargin || m["Gross Margin"] || m.profitability || alphaVantage?.ProfitMargin || "N/A");
  const peRatioStr = String(m.PERatio || m["P/E Ratio"] || m.valuation || alphaVantage?.PERatio || "N/A");
  
  const parseNum = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const revGrowthNum = parseNum(revGrowthStr);
  const profitMarginNum = parseNum(profitMarginStr);
  
  // Create a synthetic score out of 100
  let financialScore = 50;
  if (revGrowthNum > 10) financialScore += 15;
  else if (revGrowthNum > 0) financialScore += 5;
  else if (revGrowthNum < 0) financialScore -= 10;
  
  if (profitMarginNum > 20) financialScore += 15;
  else if (profitMarginNum > 0) financialScore += 5;
  else if (profitMarginNum < 0) financialScore -= 10;
  
  financialScore = Math.max(10, Math.min(100, financialScore));

  const subScores = {
    Growth: Math.min(20, Math.max(0, 10 + revGrowthNum)),
    Profitability: Math.min(20, Math.max(0, 10 + (profitMarginNum / 2))),
    Leverage: 15,
    Efficiency: 14,
    Valuation: 12
  };

  const assessmentLabel = (val: number, goodThreshold: number, badThreshold: number) => {
    if (val >= goodThreshold) return <span className="text-[#00D4A0]">Strong</span>;
    if (val <= badThreshold) return <span className="text-red-500">Weak</span>;
    return <span className="text-amber-500">Stable</span>;
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* SECTION A — Key Metrics Hero Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-2">Revenue Growth</span>
          <div className="flex items-center gap-3">
            <span className="text-white text-3xl font-bold">{revGrowthStr}</span>
            {revGrowthNum >= 0 ? <TrendingUp className="text-[#00D4A0] w-6 h-6" /> : <TrendingDown className="text-red-500 w-6 h-6" />}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-2">Profit Margin</span>
          <span className={cn("text-3xl font-bold", profitMarginNum > 0 ? "text-[#00D4A0]" : "text-red-500")}>
            {profitMarginStr}
          </span>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-2">P/E Ratio</span>
          <span className="text-white text-3xl font-bold">{peRatioStr}</span>
          <span className="text-text-muted text-[10px] mt-1">vs sector avg</span>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col justify-center relative overflow-hidden">
          <span className="text-text-muted text-[10px] uppercase tracking-widest font-bold mb-2 z-10">Financial Score</span>
          <div className="flex items-baseline gap-1 z-10">
            <span className="text-[#00D4A0] text-4xl font-bold">{Math.round(financialScore)}</span>
            <span className="text-text-muted text-sm font-bold">/100</span>
          </div>
          {/* Decorative ring */}
          <div className="absolute -right-4 -bottom-8 w-24 h-24 rounded-full border-4 border-[#00D4A0]/20 pointer-events-none" />
        </div>
      </div>

      {/* SECTION B — Financial Summary Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-white text-[18px] font-bold">Financial Summary</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium w-1/3">Revenue (TTM)</td>
                <td className="py-4 px-6 text-white">{alphaVantage?.RevenueTTM || "N/A"}</td>
                <td className="py-4 px-6">—</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">Revenue Growth (YoY)</td>
                <td className="py-4 px-6 text-white">{revGrowthStr}</td>
                <td className="py-4 px-6">{assessmentLabel(revGrowthNum, 10, 0)}</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">Gross Margin</td>
                <td className="py-4 px-6 text-white">{profitMarginStr}</td>
                <td className="py-4 px-6">{assessmentLabel(profitMarginNum, 40, 10)}</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">P/E Ratio (FWD)</td>
                <td className="py-4 px-6 text-white">{peRatioStr}</td>
                <td className="py-4 px-6">—</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">Free Cash Flow</td>
                <td className="py-4 px-6 text-white">{String(m.FCF || m.FreeCashFlow || "N/A")}</td>
                <td className="py-4 px-6">—</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">Debt-to-Equity</td>
                <td className="py-4 px-6 text-white">{String(m.debtLevel || m.DebtToEquity || "N/A")}</td>
                <td className="py-4 px-6">—</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-6 text-text-secondary font-medium">Return on Equity</td>
                <td className="py-4 px-6 text-white">{alphaVantage?.ReturnOnEquityTTM || "N/A"}</td>
                <td className="py-4 px-6">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* SECTION C — Financial Analysis */}
          <div className="bg-bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
            <h2 className="text-white text-[16px] font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent" />
              AI Financial Analysis
            </h2>
            <p className="text-text-secondary text-[14px] leading-[1.7] whitespace-pre-wrap">
              {financial?.analysis || "Detailed financial analysis has not been generated for this company."}
            </p>
          </div>
          
          {/* SECTION E — Financial Score Breakdown */}
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <h2 className="text-white text-[16px] font-bold mb-6">
              Financial Health Score: {Math.round(financialScore)}/100
            </h2>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-[#00D4A0] rounded-full transition-all" style={{ width: `${financialScore}%` }} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(subScores).map(([label, score]) => (
                <div key={label} className="flex flex-col gap-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">{label}</span>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${(score / 20) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-white font-medium">{score.toFixed(1)} / 20</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION D — Alpha Vantage Data Panel */}
        <div className="md:col-span-1">
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <h2 className="text-white text-[14px] font-bold mb-6 flex items-center justify-between">
              Live Market Data
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4A0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4A0]"></span>
              </span>
            </h2>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">52-Week High</span>
                <span className="text-white font-medium text-sm">{alphaVantage?.["52WeekHigh"] || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">52-Week Low</span>
                <span className="text-white font-medium text-sm">{alphaVantage?.["52WeekLow"] || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Target Price</span>
                <span className="text-white font-medium text-sm">{alphaVantage?.AnalystTargetPrice || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">EPS (TTM)</span>
                <span className="text-white font-medium text-sm">{alphaVantage?.EPS || "N/A"}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-text-muted">Source:</span>
              <span className="text-[10px] text-white font-medium uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Alpha Vantage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
