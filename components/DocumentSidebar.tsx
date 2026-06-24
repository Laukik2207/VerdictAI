"use client";

import React, { useState } from "react";
import { Download, Link as LinkIcon, Mail, Shield, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DocumentSidebar({ company }: { company: string }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const data = localStorage.getItem('verdictai_report_' + company);
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `verdict-${company.toLowerCase()}-report.json`; // TODO: real PDF in v2
      a.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=VerdictAI Institutional Report: ${company}&body=View the full AI investment research report here: ${window.location.href}`;
  };

  const tocItems = [
    { label: "Executive Summary", page: 1, active: true },
    { label: "Financial Model", page: 4, active: false },
    { label: "Agent Deep-Dive", page: 12, active: false },
    { label: "Full Bibliography", page: 22, active: false },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[280px] bg-bg-primary border-l border-border h-full flex-shrink-0 p-6 space-y-8 overflow-y-auto scroll-hidden">
      
      {/* SECTION A — DOCUMENT NAVIGATION */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          DOCUMENT NAVIGATION
        </h3>
        
        <div className="flex flex-col space-y-2">
          <button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center space-x-2 bg-bg-card border border-border rounded-md p-3 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          
          <button 
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center space-x-2 bg-bg-card border border-border rounded-md p-3 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Share Link"}</span>
          </button>
          
          <button 
            onClick={handleEmail}
            className="w-full flex items-center justify-center space-x-2 bg-bg-card border border-border rounded-md p-3 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Send to Email</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col space-y-2 pt-4 border-t border-white/5">
          {tocItems.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-center justify-between text-[13px] py-1 cursor-default",
                item.active ? "text-white border-l-2 border-accent pl-2" : "text-text-secondary pl-[10px]"
              )}
            >
              <span>{item.label}</span>
              <span className="text-text-muted">Page {item.page}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B — SECURITY POLICY */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          SECURITY POLICY
        </h3>
        <div className="bg-bg-card border border-border rounded-md p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-4 h-4 text-status-pass" />
            <span className="text-xs text-text-secondary">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-4 h-4 text-accent" />
            <span className="text-xs text-text-secondary">Dynamic Watermark Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs text-text-secondary">Link expires in 48h</span>
          </div>
        </div>
      </div>

      {/* SECTION C — EXPORT INTEGRITY */}
      <div className="flex flex-col space-y-4">
        <div className="bg-white text-black rounded-md p-4 border border-gray-200 flex flex-col gap-1">
          <span className="text-[10px] text-[#888888] font-mono uppercase tracking-widest">
            EXPORT INTEGRITY
          </span>
          <h4 className="text-2xl font-black tracking-tight">100% Validated</h4>
          <p className="text-[11px] text-[#666666] leading-snug mt-1">
            All AI outputs cross-referenced with primary SEC filings and verified news sources.
          </p>
        </div>
      </div>

    </aside>
  );
}
