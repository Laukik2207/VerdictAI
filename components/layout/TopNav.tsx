"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, ArrowRightLeft, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CompanyMarketBadge } from "@/components/CompanyMarketBadge";

interface TopNavProps {
  company: string;
  showTabs?: boolean;
  microLabel?: React.ReactNode;
}

export function TopNav({ company, showTabs = true, microLabel }: TopNavProps) {
  const pathname = usePathname();
  const isReports = pathname?.startsWith("/reports/");
  const isThesis = pathname?.startsWith("/thesis/");
  
  const tabs = [
    { label: "Research", href: `/analysis/${company}`, active: !isReports && !isThesis },
    { label: "History", href: "#", active: false },
    { label: "Thesis", href: `/thesis/${company}`, active: isThesis },
    { label: "Reports", href: `/reports/${company}`, active: isReports }
  ];

  const handleExport = () => {
    // If we're on the reports page, we can trigger the same export logic
    // For now we just retrieve from localStorage
    const data = localStorage.getItem('verdictai_report_' + company);
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `verdict-${company.toLowerCase()}-report.json`;
      a.click();
    }
  };

  return (
    <header className="flex items-center justify-between h-[52px] w-full bg-bg-sidebar border-b border-border px-4 flex-shrink-0">
      
      {/* Left Area: Company Info */}
      <div className="flex items-center space-x-3 w-1/3">
        <div className="w-5 h-5 rounded-sm bg-accent flex items-center justify-center text-black text-xs font-bold">
          {company.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-bold text-text-primary">{company}</span>
        
        <CompanyMarketBadge company={company} />

        {microLabel && (
          <div className="flex items-center ml-2 border-l border-border pl-3">
            {microLabel}
          </div>
        )}
      </div>

      {/* Center Area: Tabs */}
      <div className="flex-1 flex justify-center h-full">
        {showTabs ? (
          <div className="flex space-x-8 h-full">
            {tabs.map((tab, idx) => (
              <Link key={idx} href={tab.href} className="relative h-full flex items-center">
                <button
                  className={cn(
                    "text-sm font-medium transition-colors",
                    tab.active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {tab.label}
                </button>
                {tab.active && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-text-primary rounded-t-sm" />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center text-sm text-text-secondary">
            Analysis Report / <span className="text-text-primary ml-1">{company}</span>
          </div>
        )}
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center justify-end space-x-4 w-1/3">
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1.5 h-8 px-3 rounded text-xs font-medium border border-border text-text-primary hover:bg-white/5 transition-colors">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-1.5 h-8 px-3 rounded text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
        
        <div className="h-4 w-px bg-border mx-2" />

        <div className="flex items-center space-x-3">
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-border cursor-pointer">
            <span className="text-xs font-medium text-text-muted">US</span>
          </div>
        </div>
      </div>
    </header>
  );
}
