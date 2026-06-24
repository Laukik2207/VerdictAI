import React, { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface RightPanelProps {
  children: ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <aside className="hidden xl:flex flex-col w-[280px] bg-bg-sidebar border-l border-border h-full flex-shrink-0 relative">
      <div className="absolute top-3 left-0 -ml-3 w-6 h-6 bg-bg-sidebar border border-border rounded-full flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors z-10">
        <ChevronRight className="w-3 h-3 text-text-secondary" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </aside>
  );
}
