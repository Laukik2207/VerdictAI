"use client";

import React, { useState } from "react";
import { GraphState } from "@/lib/graph/types";
import { AGENT_ORDER } from "@/hooks/useAnalysis";
import { AgentCard } from "./AgentCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AgentTransparencyPanelProps {
  report: GraphState;
}

export function AgentTransparencyPanel({ report }: AgentTransparencyPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-brand-surface-container-low border border-white/10 rounded-xl hover:bg-brand-surface-variant transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-headline text-lg text-white">How AI Reached This Decision</span>
          <span className="text-xs font-mono text-brand-outline uppercase">Agent Reasoning Trail</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-brand-outline" /> : <ChevronDown className="w-5 h-5 text-brand-outline" />}
      </button>

      {expanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {AGENT_ORDER.map((agentName) => {
            // Map the corresponding output for the agent card
            let output = undefined;
            if (agentName === "ResearchAgent") output = report.research;
            if (agentName === "FinancialAgent") output = report.financial;
            if (agentName === "SentimentAgent") output = report.sentiment;
            if (agentName === "RiskAgent") output = report.risk;
            if (agentName === "JudgeAgent") output = report.verdict;
            if (agentName === "ChallengeAgent") output = report.challenge;

            return (
              <AgentCard
                key={agentName}
                agentName={agentName}
                status="done"
                elapsedMs={0} // Not deeply relevant for the final report display
                output={output}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
