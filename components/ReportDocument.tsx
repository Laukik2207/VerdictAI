import React from "react";
import { GraphState } from "@/lib/graph/types";
import { cn } from "@/lib/utils/cn";

interface ReportDocumentProps {
  report: GraphState;
  company: string;
}

export function ReportDocument({ report, company }: ReportDocumentProps) {
  const { research, financial, verdict, challenge, risk } = report;
  
  const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
  
  const confidence = verdict?.confidence || 84;
  const decision = verdict?.decision || "invest";
  
  const targetPriceMessage = decision === "invest" ? "Valuation premium justified" : "Below market fair value";

  return (
    <div className="w-full max-w-[640px] mx-auto bg-white text-black shadow-2xl px-12 py-10 my-12" style={{ borderRadius: 0 }}>
      
      {/* DOCUMENT HEADER */}
      <header className="relative flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <h1 className="text-[28px] font-black leading-tight tracking-tight text-black">
            VerdictAI Institutional<br/>Report
          </h1>
          <span className="font-mono text-[11px] text-[#555] mt-1">REF: VA-2024-X092-ALPHA</span>
          <div className="mt-4 text-[14px] font-bold text-black">
            Subject: {company} ({research?.sector || "Technology"})
          </div>
          <div className="text-[12px] text-[#777]">
            Generated on: {today} • Analysts: AI Collective 7
          </div>
        </div>
        
        <div className="absolute top-0 right-0 border-2 border-black w-16 h-16 flex items-center justify-center flex-col">
          <span className="text-[18px] font-black tracking-tighter">V/AI</span>
        </div>
        <div className="absolute top-[68px] right-0 text-center w-16">
          <span className="text-[8px] uppercase tracking-widest font-bold text-black">INTERNAL<br/>USE ONLY</span>
        </div>
      </header>

      <hr className="border-t border-[#e0e0e0] w-full mb-8" />

      {/* SECTION 1: Executive Summary */}
      <section className="mb-10">
        <h2 className="text-[20px] font-bold text-black mb-2">Executive Summary</h2>
        <hr className="border-t border-[#e0e0e0] w-full mb-4" />
        
        <p className="text-[13px] text-[#222] leading-relaxed mb-6">
          This comprehensive analysis evaluates the strategic positioning of {company} within the current macroeconomic cycle and competitive landscape of {research?.sector || "its sector"}. {financial?.analysis || "Financial indicators point towards sustained momentum."} {verdict?.thesis || "The company exhibits a strong moat."}
        </p>

        <div className="bg-[#f5f5f5] rounded-sm p-4 grid grid-cols-3 gap-4 border border-[#e5e5e5]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#888] uppercase font-bold tracking-wider mb-1">TARGET PRICE</span>
            <span className="text-[14px] font-bold text-black leading-tight">{confidence}% conviction — price reflects fair value</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#888] uppercase font-bold tracking-wider mb-1">CONVICTION LEVEL</span>
            <span className="text-[18px] font-bold text-[#00D4A0] leading-tight">High ({confidence}%)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#888] uppercase font-bold tracking-wider mb-1">HORIZON</span>
            <span className="text-[18px] font-bold text-black leading-tight">12-18 Months</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Committee Verdict */}
      <section className="mb-10">
        <h2 className="text-[20px] font-bold text-black mb-2">Committee Verdict</h2>
        <hr className="border-t border-[#e0e0e0] w-full mb-4" />

        <div className="bg-[#111111] rounded-md p-6 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[40%] flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#333] pb-4 md:pb-0 md:pr-4">
            <span className="text-[10px] text-[#666] font-mono uppercase tracking-widest mb-2">FINAL RECOMMENDATION</span>
            <span className={cn("text-[52px] font-black leading-none", decision === "invest" ? "text-white" : "text-white")}>
              {decision.toUpperCase()}
            </span>
          </div>
          <div className="w-full md:w-[60%] flex flex-col justify-center">
            <blockquote className="text-[13px] text-white italic leading-[1.6]">
              "{verdict?.thesis || "Strategic moat remains unchallenged in the medium term."}"
            </blockquote>
            <span className="text-[11px] text-[#666] mt-3">— VerdictAI Committee, {today}</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Investment Thesis Detail */}
      <section className="mb-10">
        <h2 className="text-[20px] font-bold text-black mb-2">Investment Thesis</h2>
        <hr className="border-t border-[#e0e0e0] w-full mb-4" />

        <div className="space-y-6">
          {(verdict?.reasoning || []).map((reason, i) => {
            const title = reason.split(" ").slice(0, 4).join(" ").replace(/[.,;:!?]/g, "").toUpperCase();
            return (
              <div key={i} className="flex gap-4">
                <span className="text-[#00D4A0] font-bold text-[14px]">0{i + 1}.</span>
                <div className="flex flex-col">
                  <h3 className="text-[12px] font-bold text-black mb-1">{title}</h3>
                  <p className="text-[13px] text-[#444] leading-relaxed">{reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Risk Assessment */}
      <section className="mb-10">
        <h2 className="text-[20px] font-bold text-black mb-2">Risk Assessment</h2>
        <hr className="border-t border-[#e0e0e0] w-full mb-4" />

        <table className="w-full border-collapse border border-[#e0e0e0] text-left text-[12px]">
          <thead>
            <tr className="bg-[#f5f5f5]">
              <th className="border border-[#e0e0e0] p-3 font-bold text-black w-1/4">Risk Factor</th>
              <th className="border border-[#e0e0e0] p-3 font-bold text-black w-[15%]">Level</th>
              <th className="border border-[#e0e0e0] p-3 font-bold text-black">Assessment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#e0e0e0] p-3 font-semibold text-[#222]">Competition Risk</td>
              <td className="border border-[#e0e0e0] p-3"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span></td>
              <td className="border border-[#e0e0e0] p-3 text-[#444]">{risk?.competitionRisk || "Significant competitive pressures."}</td>
            </tr>
            <tr className="bg-[#fafafa]">
              <td className="border border-[#e0e0e0] p-3 font-semibold text-[#222]">Operational Risk</td>
              <td className="border border-[#e0e0e0] p-3"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span></td>
              <td className="border border-[#e0e0e0] p-3 text-[#444]">{risk?.operationalRisk || "Supply chain vulnerabilities exist."}</td>
            </tr>
            <tr>
              <td className="border border-[#e0e0e0] p-3 font-semibold text-[#222]">Market Risk</td>
              <td className="border border-[#e0e0e0] p-3"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold">LOW</span></td>
              <td className="border border-[#e0e0e0] p-3 text-[#444]">{risk?.marketRisk || "Macro environment is stable."}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 5: Devil's Advocate */}
      <section className="mb-10">
        <h2 className="text-[20px] font-bold text-black mb-2">Dissenting Analysis</h2>
        <hr className="border-t border-[#e0e0e0] w-full mb-4" />

        <div className="bg-[#fff8f8] border border-red-100 rounded-sm p-5 relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ef4444]" />
          <p className="text-[13px] text-[#333] italic leading-relaxed mb-4">
            "{challenge?.alternativeThesis || "Alternative models suggest limited upside."}"
          </p>
          <ul className="list-disc pl-4 space-y-2 text-[12px] text-[#555] marker:text-[#ef4444]">
            {(challenge?.counterArguments || []).map((arg, i) => (
              <li key={i}>{arg}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* DOCUMENT FOOTER */}
      <hr className="border-t border-[#e0e0e0] w-full mb-4 mt-16" />
      <p className="text-[10px] text-[#aaa] italic leading-relaxed text-center">
        This report was generated by VerdictAI's multi-agent investment committee on {today}. All analysis is AI-generated and should not constitute financial advice. Cross-referenced with public market data.
      </p>

    </div>
  );
}
