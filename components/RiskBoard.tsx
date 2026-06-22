import React from "react";
import { RiskOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

export function RiskBoard(props: RiskOutput) {
  const { competitionRisk, operationalRisk, marketRisk, missingInfo, score, level } = props;

  // Simple helper to parse generic "LOW/MEDIUM/HIGH" if needed, though the prompt implies we just show the content.
  // We'll use the overall level for the main badge, but we can also display it individually if it was in the type.
  const levelColorMap = {
    LOW: "invest",
    MEDIUM: "neutral",
    HIGH: "pass",
  } as const;

  const scorePercentage = Math.max(0, Math.min(100, score));

  return (
    <Card className="p-6 space-y-6">
      {/* Header & Risk Score Bar */}
      <div className="flex flex-col space-y-4 pb-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-brand-on-background">Risk Analysis</h2>
          <Badge variant={levelColorMap[level] || "neutral"}>{level} RISK</Badge>
        </div>
        
        {/* Horizontal Score Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-brand-outline">
            <span>Risk Score</span>
            <span>{scorePercentage}/100</span>
          </div>
          <div className="w-full h-1.5 bg-brand-surface-variant rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                scorePercentage > 70 ? "bg-verdict-pass" : scorePercentage > 30 ? "bg-amber-500" : "bg-verdict-invest"
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Columns for Risks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/5">
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-brand-outline uppercase">Competition</h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">{competitionRisk}</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-brand-outline uppercase">Operational</h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">{operationalRisk}</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-brand-outline uppercase">Market</h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">{marketRisk}</p>
        </div>
      </div>

      {/* Missing Information */}
      {missingInfo && missingInfo.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono text-brand-outline uppercase">Information Gaps</h3>
          <ul className="space-y-2">
            {missingInfo.map((info, idx) => (
              <li key={idx} className="text-sm italic text-brand-outline-variant flex items-start">
                <span className="mr-2 opacity-50">-</span>
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
