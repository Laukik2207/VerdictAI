import React from "react";
import { ChallengeOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";

export function CounterArguments(props: ChallengeOutput) {
  const { counterVerdict, weakestAssumption, alternativeThesis, counterArguments } = props;

  return (
    <div className="relative pl-6 border-l-4 border-verdict-pass py-2">
      <h2 className="text-lg font-medium text-brand-on-background flex items-center mb-6">
        Devil's Advocate <span className="ml-2 text-sm">🔴</span>
      </h2>

      <div className="space-y-8">
        {/* Counter Verdict */}
        <div>
          <h3 className="text-xs font-mono text-brand-outline mb-2 uppercase">Counter-Verdict</h3>
          <p className="text-xl font-semibold text-brand-on-background leading-snug">
            {counterVerdict}
          </p>
        </div>

        {/* Alternative Thesis */}
        <div>
          <h3 className="text-xs font-mono text-brand-outline mb-2 uppercase">Alternative Thesis</h3>
          <p className="text-sm italic text-brand-on-surface-variant leading-relaxed">
            "{alternativeThesis}"
          </p>
        </div>

        {/* Numbered Counterarguments List */}
        <div>
          <h3 className="text-xs font-mono text-brand-outline mb-4 uppercase">Key Friction Points</h3>
          <ol className="space-y-4">
            {counterArguments.map((arg, idx) => (
              <li key={idx} className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-black/30 border border-white/10 text-xs font-mono text-brand-outline mr-4 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm text-brand-on-surface-variant leading-relaxed">{arg}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Weakest Assumption Callout */}
        <Card className="p-4 bg-amber-500/10 border-amber-500/20">
          <h3 className="text-xs font-mono text-amber-500/80 mb-2 uppercase font-semibold tracking-wider">
            Critical Vulnerability (Weakest Assumption)
          </h3>
          <p className="text-sm text-amber-500/90 leading-relaxed">
            {weakestAssumption}
          </p>
        </Card>
      </div>
    </div>
  );
}
