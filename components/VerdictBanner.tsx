import React from "react";
import { VerdictOutput } from "@/lib/graph/types";
import { ProgressRing } from "./ui/ProgressRing";

export function VerdictBanner(props: VerdictOutput) {
  const { decision, rationale, confidence, thesis, reasoning, assumptions } = props;
  const isInvest = decision === "invest";

  return (
    <div className="flex flex-col space-y-8 bg-brand-surface-container-low border border-white/10 rounded-xl p-8 overflow-hidden relative">
      {/* Top Banner Area */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h2 className="text-xs font-mono text-brand-outline mb-2 uppercase tracking-widest">
            Final Verdict
          </h2>
          <h1
            className={`text-[72px] font-bold leading-none tracking-tight ${
              isInvest ? "text-verdict-invest" : "text-verdict-pass"
            }`}
          >
            {decision.toUpperCase()}
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing
            value={confidence}
            size={96}
            strokeWidth={8}
            colorClass={isInvest ? "text-verdict-invest" : "text-verdict-pass"}
          />
          <span className="mt-3 text-xs font-mono text-brand-outline">
            {confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Thesis */}
      <div>
        <h3 className="text-lg font-medium text-brand-on-background mb-3">Investment Thesis</h3>
        <p className="text-base text-brand-on-surface-variant leading-relaxed">
          {thesis || rationale}
        </p>
      </div>

      {/* Reasoning List */}
      <div>
        <h3 className="text-sm font-medium text-brand-on-background mb-4">Core Reasoning</h3>
        <ul className="space-y-3">
          {reasoning.map((point, idx) => (
            <li key={idx} className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-brand-on-surface-variant leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Assumptions */}
      <div className="pt-6 mt-2 border-t border-white/5">
        <h3 className="text-xs font-mono text-brand-outline mb-3 uppercase">Key Assumptions</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {assumptions.map((assumption, idx) => (
            <li key={idx} className="text-xs text-brand-outline-variant flex items-start">
              <span className="mr-2 opacity-50">•</span>
              {assumption}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
