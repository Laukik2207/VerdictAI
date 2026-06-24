import React from "react";
import { ResearchOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

export function CompanySnapshot(props: ResearchOutput) {
  const { sector, hq, founded, businessModel, revenueModel, metrics } = props;

  return (
    <Card className="p-6 space-y-8">
      {/* 3-col top */}
      <div className="grid grid-cols-3 gap-6 pb-6 border-b border-white/5">
        <div>
          <h4 className="text-xs font-mono text-brand-outline mb-1 uppercase tracking-wider">Sector</h4>
          <p className="text-sm font-medium text-brand-on-background">{sector}</p>
        </div>
        <div>
          <h4 className="text-xs font-mono text-brand-outline mb-1 uppercase tracking-wider">Headquarters</h4>
          <p className="text-sm font-medium text-brand-on-background">{hq}</p>
        </div>
        <div>
          <h4 className="text-xs font-mono text-brand-outline mb-1 uppercase tracking-wider">Founded</h4>
          <p className="text-sm font-medium text-brand-on-background">{founded}</p>
        </div>
      </div>

      {/* Business Model */}
      <div>
        <h3 className="text-sm font-medium text-brand-on-background mb-2">Business Model</h3>
        <p className="text-sm text-brand-on-surface-variant leading-relaxed">
          {businessModel}
        </p>
      </div>

      {/* Revenue Model Chips */}
      <div>
        <h3 className="text-sm font-medium text-brand-on-background mb-3">Revenue Streams</h3>
        <div className="flex flex-wrap gap-2">
          {(revenueModel || []).map((model, idx) => (
            <Badge key={idx} variant="neutral">
              {model}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics 2x2 Grid */}
      <div>
        <h3 className="text-sm font-medium text-brand-on-background mb-3">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          {(metrics || []).map((metric, idx) => (
            <div key={idx} className="bg-black/20 rounded border border-white/5 p-4 flex flex-col justify-center">
              <span className="text-xs font-mono text-brand-outline mb-1">{metric?.label || ""}</span>
              <span className="text-lg font-medium text-brand-on-background">{metric?.value || ""}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
