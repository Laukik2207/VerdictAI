import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";

interface AppShellProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  activeSection?: string;
  company: string;
  isComplete: boolean;
  microLabel?: ReactNode;
}

export function AppShell({ children, rightPanel, company, isComplete, microLabel }: AppShellProps) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden font-body text-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav company={company} showTabs={!isComplete} microLabel={microLabel} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-bg-primary">
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
