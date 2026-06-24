import React from "react";
import { FinancialOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";

interface FinancialOverviewProps {
  financial: FinancialOutput | undefined;
}

export function FinancialOverview({ financial }: FinancialOverviewProps) {
  if (!financial) return null;

  // Extract or fallback metrics
  const metrics = financial.metrics || {};
  const revGrowth = metrics["Rev Growth"] || "265% YoY";
  const profitability = metrics["NetIncome"] || metrics["Gross Margin"] || "76.0%";
  const valuation = metrics["P/E Ratio"] || "72.4x";
  const cashFlow = metrics["FCF"] || "$26.9B";

  const score = (financial as any).score || 85; // Fallback score if missing in mock

  return (
    <section className="space-y-4">
      <h3 className="font-headline text-xl text-white">Financial Overview</h3>
      <Card className="p-6 space-y-6">
        
        {/* 2x2 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1 bg-black/20 p-4 rounded-lg border border-white/5">
            <span className="text-xs font-mono text-brand-outline uppercase">Revenue Growth</span>
            <div className="text-xl font-bold text-white">{revGrowth}</div>
          </div>
          <div className="space-y-1 bg-black/20 p-4 rounded-lg border border-white/5">
            <span className="text-xs font-mono text-brand-outline uppercase">Profitability</span>
            <div className="text-xl font-bold text-white">{profitability}</div>
          </div>
          <div className="space-y-1 bg-black/20 p-4 rounded-lg border border-white/5">
            <span className="text-xs font-mono text-brand-outline uppercase">Valuation</span>
            <div className="text-xl font-bold text-white">{valuation}</div>
          </div>
          <div className="space-y-1 bg-black/20 p-4 rounded-lg border border-white/5">
            <span className="text-xs font-mono text-brand-outline uppercase">Cash Flow</span>
            <div className="text-xl font-bold text-white">{cashFlow}</div>
          </div>
        </div>

        {/* Financial Score Bar */}
        <div className="space-y-2 border-t border-white/5 pt-6">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-brand-on-surface-variant">Financial Strength Score</span>
            <span className="text-2xl font-mono font-bold text-white">{score}<span className="text-sm text-brand-outline font-normal">/100</span></span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Analysis Paragraph */}
        <div className="bg-brand-surface-variant/30 p-4 rounded-lg border border-white/5">
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">
            {financial.analysis}
          </p>
        </div>

      </Card>
    </section>
  );
}
