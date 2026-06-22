"use client";

import React, { useState } from "react";
import { GraphState } from "@/lib/graph/types";
import { Button } from "./ui/Button";
import { Download, Copy, Check } from "lucide-react";

interface ExportButtonProps {
  report: GraphState;
  company: string;
}

export function ExportButton({ report, company }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    a.download = `verdict-${company.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = async () => {
    // Attempt to compile a 1-paragraph summary from the report
    const summary = report.verdict?.rationale || report.research?.summary || "No summary available.";
    
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy summary:", err);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Button variant="ghost" size="sm" onClick={handleExportJson} className="space-x-2">
        <Download className="w-4 h-4" />
        <span>Export JSON</span>
      </Button>
      
      <Button variant="ghost" size="sm" onClick={handleCopySummary} className="space-x-2">
        {copied ? <Check className="w-4 h-4 text-verdict-invest" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? "Copied" : "Copy Summary"}</span>
      </Button>
    </div>
  );
}
