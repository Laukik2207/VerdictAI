import React from "react";
import { cn } from "@/lib/utils/cn";
import { AgentStatus } from "@/lib/graph/types";

interface AgentStatusDotProps {
  status: AgentStatus;
  className?: string;
}

export function AgentStatusDot({ status, className }: AgentStatusDotProps) {
  const statusColors = {
    idle: "bg-brand-surface-variant",
    running: "bg-indigo animate-pulse",
    done: "bg-verdict-invest",
    error: "bg-brand-error",
  };

  return (
    <div
      className={cn(
        "w-2.5 h-2.5 rounded-full flex-shrink-0",
        statusColors[status],
        className
      )}
      aria-label={`Agent status: ${status}`}
    />
  );
}
