import React from "react";
import { FinancialOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";
import { cn } from "@/lib/utils/cn";

interface FinancialOverviewProps {
  financial: FinancialOutput | undefined;
}

export function FinancialOverview({ financial }: FinancialOverviewProps) {
  if (!financial) return null;

  // Extract or fallback metrics
  const metrics = financial.metrics || {};
  const revGrowth = metrics["Rev Growth"] || metrics["RevGrowth"] || "—";
  const profitability = metrics["NetIncome"] || metrics["Gross Margin"] || metrics["GrossMargin"] || "—";
  const valuation = metrics["P/E Ratio"] || metrics["PERatio"] || "—";
  const cashFlow = metrics["FCF"] || metrics["FreeCashFlow"] || "—";

  const score = (financial as any).score || 85;

  const rows = [
    { label: 'Revenue Growth (YoY)', value: revGrowth, highlight: true },
    { label: 'Gross Margin', value: profitability, highlight: false },
    { label: 'P/E Ratio (FWD)', value: valuation, highlight: false },
    { label: 'Free Cash Flow', value: cashFlow, highlight: true },
  ];

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="space-y-0">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-b-0">
            <span className="text-[#666] text-xs">{row.label}</span>
            <span className={cn("text-sm font-mono", row.highlight ? 'text-[#00D4A0]' : 'text-white')}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex justify-between mb-2">
          <span className="text-[#666] text-[10px] uppercase font-mono tracking-widest">Market Share</span>
          <span className="text-white text-[10px] font-mono">
            {score ? `${score}%` : '—'}
          </span>
        </div>
        <div className="w-full h-[3px] bg-[#1a1a1a] rounded-full">
          <div 
            className="h-full bg-[#00D4A0] rounded-full transition-all duration-1000"
            style={{ width: `${score ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
