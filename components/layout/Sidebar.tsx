"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, BarChart2, DollarSign, MessageSquare, AlertTriangle, Gavel, FileText, HelpCircle, Archive } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  
  // Try to extract company from pathname to preserve it across tabs
  const isReports = pathname?.startsWith("/reports/");
  const isAnalysis = pathname?.startsWith("/analysis/");
  const match = pathname?.match(/\/(analysis|reports)\/(.+)/);
  const company = match ? match[2] : "";

  const navItems = [
    { label: "Research", icon: BarChart2, id: "research", href: `/analysis/${company}#research`, active: isAnalysis },
    { label: "Financials", icon: DollarSign, id: "financial", href: `/analysis/${company}#financials`, active: isAnalysis },
    { label: "Sentiment", icon: MessageSquare, id: "sentiment", href: `/analysis/${company}#sentiment`, active: isAnalysis },
    { label: "Risk", icon: AlertTriangle, id: "risk", href: `/analysis/${company}#risk`, active: isAnalysis },
    { label: "Verdict", icon: Gavel, id: "verdict", href: `/analysis/${company}#verdict`, active: isAnalysis },
    { label: "Reports", icon: FileText, id: "reports", href: `/reports/${company}`, active: isReports },
  ];

  const bottomItems = [
    { label: "Help", icon: HelpCircle, id: "help" },
    { label: "Archive", icon: Archive, id: "archive" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] bg-bg-sidebar border-r border-border h-full flex-shrink-0">
      {/* Logo Area */}
      <div className="flex flex-col items-center justify-center pt-8 pb-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-2">
          {/* Logo Mark */}
          <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 20L20 4" stroke="#00D4A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">VerdictAI</span>
        </div>
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mt-1">
          Institutional Research
        </span>
      </div>

      {/* New Analysis Button */}
      <div className="p-4 border-b border-border">
        <Link href="/">
          <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-border rounded-md text-text-primary text-sm font-medium hover:bg-white hover:text-black transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <Link key={item.id} href={company ? item.href : "#"}>
            <button
              className={cn(
                "w-full flex items-center space-x-3 h-10 px-3 rounded-md text-xs font-medium transition-colors group",
                item.active
                  ? "bg-accent/10 border-l-2 border-accent text-accent"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4", item.active ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
              <span>{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="p-3 border-t border-border space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center space-x-3 h-10 px-3 rounded-md text-xs font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors group"
          >
            <item.icon className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
