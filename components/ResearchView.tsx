import React, { useEffect, useRef } from "react";
import { Search, TrendingUp, MessageCircle, AlertTriangle, Gavel } from "lucide-react";
import { AgentName, AgentStatus } from "@/hooks/useAnalysis";
import { GraphState } from "@/lib/graph/types";
import { LogEntry } from "@/lib/utils/logFormatter";
import { getAgentStatusText } from "@/lib/utils/agentStatusText";
import { cn } from "@/lib/utils/cn";

interface ResearchViewProps {
  agentStatuses: Record<AgentName, AgentStatus>;
  agentOutputs: Partial<GraphState>;
  elapsedMs: Record<AgentName, number>;
  logEntries: LogEntry[];
  company: string;
}

const STEPS = [
  { id: "ResearchAgent", label: "RESEARCH", icon: Search },
  { id: "FinancialAgent", label: "FINANCIALS", icon: TrendingUp },
  { id: "SentimentAgent", label: "SENTIMENT", icon: MessageCircle },
  { id: "RiskAgent", label: "RISK", icon: AlertTriangle },
  { id: "JudgeAgent", label: "VERDICT", icon: Gavel },
];

export function ResearchView({ agentStatuses, agentOutputs, logEntries, company }: ResearchViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the log container
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logEntries]);

  const renderStepIcon = (agentId: string, label: string, Icon: any) => {
    let status = agentStatuses[agentId as AgentName] || "idle";
    let isComplete = status === "done";
    let isCurrent = status === "running";

    if (label === "VERDICT") {
      const judgeStatus = agentStatuses.JudgeAgent || "idle";
      const challengeStatus = agentStatuses.ChallengeAgent || "idle";
      isComplete = judgeStatus === "done" && challengeStatus === "done";
      isCurrent = judgeStatus === "running" || challengeStatus === "running";
      if (!isComplete && !isCurrent) {
        status = "idle";
      }
    }
    
    return (
      <div key={label} className="flex flex-col items-center gap-3">
        <div className="relative">
          {/* Pulsing ring for current step */}
          {isCurrent && (
            <div className="absolute inset-0 rounded-full border-[2px] border-[#00D4A0] animate-[pingRing_1.5s_ease-out_infinite]" style={{
              animationName: 'pingRing',
              animationDuration: '1.5s',
              animationTimingFunction: 'ease-out',
              animationIterationCount: 'infinite'
            }}>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pingRing {
                  0% { box-shadow: 0 0 0 0 rgba(0,212,160,0.4); }
                  70% { box-shadow: 0 0 0 8px rgba(0,212,160,0); }
                  100% { box-shadow: 0 0 0 0 rgba(0,212,160,0); }
                }
              `}} />
            </div>
          )}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500",
            isComplete ? "bg-[#00D4A0]" : isCurrent ? "bg-[#00D4A0]" : "bg-[#1a1a1a]"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-colors duration-500",
              (isComplete || isCurrent) ? "text-black" : "text-[#444]"
            )} />
          </div>
        </div>
        <span className={cn(
          "text-[10px] font-medium tracking-wider uppercase transition-colors duration-500",
          (isComplete || isCurrent) ? "text-[#00D4A0]" : "text-[#444]"
        )}>
          {label}
        </span>
      </div>
    );
  };

  const renderAgentCard = (agentName: AgentName, title: string, Icon: any) => {
    const status = agentStatuses[agentName];
    let output = undefined;
    if (agentName === "ResearchAgent") output = agentOutputs.research;
    if (agentName === "FinancialAgent") output = agentOutputs.financial;
    if (agentName === "SentimentAgent") output = agentOutputs.sentiment;
    if (agentName === "RiskAgent") output = agentOutputs.risk;

    const statusText = getAgentStatusText(agentName, status, output, company);

    return (
      <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-accent" />
            <h3 className="text-white text-base font-semibold">{title}</h3>
          </div>
          
          <div className={cn(
            "text-[11px] font-mono font-medium",
            status === "done" ? "text-accent" : 
            status === "running" ? "text-accent animate-pulse" : 
            status === "error" ? "text-status-fail" : 
            "text-text-muted"
          )}>
            {status === "done" && "COMPLETE"}
            {status === "running" && "PROCESSING..."}
            {status === "error" && "ERROR"}
            {status === "idle" && "QUEUED"}
          </div>
        </div>

        {/* Progress bar — 3px height, full width */}
        <div className="w-full h-[3px] bg-[#1a1a1a] rounded-full mt-3 mb-3">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === 'done' && "w-full bg-[#00D4A0]",
              status === 'running' && "w-[55%] bg-[#00D4A0] animate-pulse",
              status === 'error' && "w-full bg-red-500",
              status === 'idle' && "w-0"
            )}
          />
        </div>

        <div className="mt-auto">
          <p className="font-mono text-[12px] italic text-[#666]">
            {statusText}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* SECTION A — Search Bar */}
      <div className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-5 h-5 text-text-secondary" />
          <input 
            type="text" 
            readOnly 
            value={company}
            className="bg-transparent border-none outline-none text-white text-base w-full cursor-default"
          />
        </div>
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-[11px] font-bold tracking-wider uppercase">LIVE ANALYSIS</span>
        </div>
      </div>

      {/* SECTION B — 5-Step Progress Icons */}
      <div className="flex justify-between items-center px-4 md:px-12 py-2">
        {STEPS.map(step => renderStepIcon(step.id, step.label, step.icon))}
      </div>

      {/* SECTION C — Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderAgentCard("ResearchAgent", "Research Agent", Search)}
        {renderAgentCard("FinancialAgent", "Financial Agent", TrendingUp)}
        {renderAgentCard("SentimentAgent", "Sentiment Agent", MessageCircle)}
        {renderAgentCard("RiskAgent", "Risk Agent", AlertTriangle)}
      </div>

      {/* SECTION D — Live Execution Log */}
      <div className="bg-[#0a0a0a] border border-border rounded-lg flex flex-col h-[240px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">
            LIVE EXECUTION LOG
          </span>
          <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-status-fail/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-status-warn/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-status-pass/80" />
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-[12px] space-y-2 scroll-smooth"
        >
          {logEntries.slice(-20).map((log) => {
            const isBold = /COMPLETE|DETECTED|CALIBRATED|CONFIRMED|VERDICT|ERROR/i.test(log.text);
            return (
              <div key={log.id} className="flex gap-2">
                <span className="text-[#555555] whitespace-nowrap">{log.timestamp}</span>
                <span className={cn(
                  "font-mono text-xs",
                  isBold ? 'text-[#00D4A0] font-semibold' : 'text-[#666]'
                )}>
                  {log.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
