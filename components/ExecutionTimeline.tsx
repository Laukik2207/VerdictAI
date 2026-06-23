import React from "react";
import { GraphState, AgentStatus } from "@/lib/graph/types";
import { AgentName, AGENT_ORDER } from "@/hooks/useAnalysis";
import { AgentStatusDot } from "./AgentStatusDot";
import { cn } from "@/lib/utils/cn";

interface ExecutionTimelineProps {
  agentStatuses: Record<AgentName, AgentStatus>;
  agentOutputs: Partial<GraphState>;
  elapsedMs: Record<AgentName, number>;
  company: string;
}

const STEP_NAMES: Record<AgentName, string> = {
  ResearchAgent: "Research",
  FinancialAgent: "Financial Analysis",
  SentimentAgent: "Market Sentiment",
  RiskAgent: "Risk Evaluation",
  JudgeAgent: "Generating Verdict",
  ChallengeAgent: "Challenge Review",
};

export function ExecutionTimeline({
  agentStatuses,
  agentOutputs,
  elapsedMs,
  company,
}: ExecutionTimelineProps) {
  const isComplete = agentStatuses.ChallengeAgent === "done";
  
  const totalElapsed = Object.values(elapsedMs).reduce((a, b) => a + (b || 0), 0);

  const getSummary = (step: AgentName) => {
    switch (step) {
      case "ResearchAgent":
        return `${company} — ${agentOutputs.research?.sector || "Processing"}`;
      case "FinancialAgent":
        // Mocking a financial score if not present in types
        return `Score: ${85}/100`;
      case "SentimentAgent":
        return `Sentiment: ${agentOutputs.sentiment?.score || 0}/100`;
      case "RiskAgent":
        return `Risk Score: ${agentOutputs.risk?.score || 0}/100`;
      case "JudgeAgent":
        return `${(agentOutputs.verdict?.decision || "").toUpperCase()} at ${agentOutputs.verdict?.confidence || 0}% confidence`;
      case "ChallengeAgent":
        return `Counterarguments: ${agentOutputs.challenge?.counterArguments?.length || 0}`;
      default:
        return "";
    }
  };

  return (
    <div className="w-full py-8">
      <div className="relative space-y-8">
        {/* Vertical line behind the dots */}
        <div className="absolute left-[4.5px] top-2 bottom-6 w-[1px] bg-white/10 z-0" />

        {AGENT_ORDER.map((step, idx) => {
          const status = agentStatuses[step];
          const isIdle = status === "idle";
          const isRunning = status === "running";
          const isDone = status === "done";
          const isError = status === "error";

          return (
            <div key={step} className={cn("relative z-10 flex gap-6", isIdle && "opacity-40")}>
              <div className="pt-1.5 flex-shrink-0">
                <AgentStatusDot status={status} />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-sm font-medium", isRunning ? "text-indigo animate-pulse" : "text-white")}>
                    {STEP_NAMES[step]}
                  </h3>
                  {isDone && elapsedMs[step] && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-surface-variant text-brand-on-surface-variant">
                      {(elapsedMs[step] / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                
                <div className="text-sm font-mono text-brand-on-surface-variant min-h-[20px]">
                  {isRunning && <span className="animate-pulse">Analyzing...</span>}
                  {isDone && <span>{getSummary(step)}</span>}
                  {isError && <span className="text-brand-error">Failed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm font-mono text-brand-outline">
          <span>Total Execution Time</span>
          <span>{(totalElapsed / 1000).toFixed(1)}s</span>
        </div>
      )}
    </div>
  );
}
