"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AgentStatus } from "@/lib/graph/types";
import { AgentStatusDot } from "./AgentStatusDot";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Skeleton } from "./ui/Skeleton";
import { ChevronDown } from "lucide-react";

interface AgentCardProps {
  agentName: string;
  status: AgentStatus;
  output?: any;
  elapsedMs?: number;
}

export function AgentCard({ agentName, status, output, elapsedMs }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatElapsed = (ms?: number) => {
    if (!ms) return "";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const isExpandable = status === "done" || status === "error" || status === "running";

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/5",
          !isExpandable && "cursor-default hover:bg-transparent"
        )}
      >
        <div className="flex items-center space-x-3">
          <AgentStatusDot status={status} />
          <span className="font-medium text-brand-on-background">{agentName}</span>
          {status !== "idle" && (
            <Badge variant={status === "running" ? "running" : status === "error" ? "pass" : "neutral"}>
              {status}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-brand-on-surface-variant font-mono">
          {elapsedMs && <span>{formatElapsed(elapsedMs)}</span>}
          {isExpandable && (
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isExpanded && "transform rotate-180"
              )}
            />
          )}
        </div>
      </button>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-t border-white/5",
          isExpanded ? "max-h-[800px] opacity-100 overflow-y-auto scroll-hidden" : "max-h-0 opacity-0 overflow-hidden border-t-0"
        )}
      >
        <div className="p-4 bg-black/20">
          {status === "running" && (
            <div className="space-y-3">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-4/5" />
              <Skeleton variant="text" className="w-3/5" />
            </div>
          )}
          {status === "done" && output && (
            <pre className="text-xs font-mono text-brand-on-surface whitespace-pre-wrap">
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
          {status === "error" && (
            <div className="text-sm text-brand-error">
              {output || "An unknown error occurred during execution."}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
