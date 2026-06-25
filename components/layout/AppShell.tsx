import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";

import { AgentName, AgentStatus } from "@/hooks/useAnalysis";

interface AppShellProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  activeSection?: string;
  company: string;
  isComplete: boolean;
  microLabel?: ReactNode;
  agentStatuses?: Record<AgentName, AgentStatus>;
}

export function AppShell({ children, rightPanel, company, isComplete, microLabel, agentStatuses }: AppShellProps) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden font-body text-text-primary">
      <Sidebar agentStatuses={agentStatuses} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav company={company} showTabs={!isComplete} microLabel={microLabel} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto scroll-hidden bg-bg-primary">
            {children}
          </main>
          {rightPanel && !isComplete && (
            <RightPanel>
              {rightPanel}
            </RightPanel>
          )}
        </div>
      </div>
    </div>
  );
}
