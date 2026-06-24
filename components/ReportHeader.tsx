import React from "react";
import { Badge } from "./ui/Badge";

export function ReportHeader({ company }: { company: string }) {
  const dateStr = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return (
    <header className="w-full pb-8 border-b border-white/10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <h1 className="font-display text-4xl md:text-5xl text-white font-medium tracking-tight">
          {company}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant="neutral">Analysis Report</Badge>
          <span className="text-sm font-mono text-brand-on-surface-variant">
            {dateStr}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm font-medium text-accent">Powered by 6 AI Agents</span>
      </div>
    </header>
  );
}
