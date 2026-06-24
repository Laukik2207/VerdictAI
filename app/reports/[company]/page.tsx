"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ReportDocument } from "@/components/ReportDocument";
import { GraphState } from "@/lib/graph/types";
import { Plus } from "lucide-react";

export default function ReportsPage() {
  const params = useParams();
  const router = useRouter();
  
  const companyRaw = Array.isArray(params.company) ? params.company[0] : params.company;
  const company = decodeURIComponent(companyRaw || "");

  const [report, setReport] = useState<GraphState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('verdictai_report_' + company);
    if (data) {
      try {
        setReport(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse report from localStorage", e);
      }
    }
    setLoading(false);
  }, [company]);

  if (loading) {
    return (
      <AppShell company={company} isComplete={true} rightPanel={<DocumentSidebar company={company} />}>
        <div className="w-full flex justify-center items-center h-full">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell company={company} isComplete={true} rightPanel={<DocumentSidebar company={company} />}>
        <div className="w-full h-full flex flex-col justify-center items-center text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-2">No report found</h2>
          <p className="text-text-secondary mb-8">Run an analysis first to generate an institutional report.</p>
          
          <button 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 bg-accent text-black px-6 py-3 rounded-md font-bold hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Analysis</span>
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell company={company} isComplete={true} rightPanel={<DocumentSidebar company={company} />}>
      {/* Container to enforce center alignment and padding */}
      <div className="w-full h-full overflow-y-auto flex justify-center">
        <ReportDocument report={report} company={company} />
      </div>
    </AppShell>
  );
}
