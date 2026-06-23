import React from "react";
import { SentimentOutput } from "@/lib/graph/types";
import { Card } from "./ui/Card";
import { cn } from "@/lib/utils/cn";

interface SentimentSummaryProps {
  sentiment: SentimentOutput | undefined;
}

export function SentimentSummary({ sentiment }: SentimentSummaryProps) {
  if (!sentiment) return null;

  const score = sentiment.score || 0;
  
  // Fallbacks since our mock doesn't include these arrays explicitly yet
  const bullSignals = (sentiment as any).bullSignals || [
    "High institutional accumulation in the last quarter",
    "Options flow extremely bullish on near-term expirations",
    "Management tone highly confident during latest earnings call"
  ];
  const bearSignals = (sentiment as any).bearSignals || [
    "Retail sentiment showing signs of exhaustion",
    "Some insider selling detected"
  ];
  const headlines = (sentiment as any).headlines || [
    "Analyst raises price target to street-high",
    "Strong Q3 expected amidst supply chain constraints",
    "Market dominance expands into adjacent sectors"
  ];

  return (
    <section className="space-y-4">
      <h3 className="font-headline text-xl text-white">Market Sentiment</h3>
      
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          
          {/* Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-brand-on-surface-variant">Overall Sentiment</span>
              <span className="text-2xl font-mono font-bold text-white">{score}<span className="text-sm text-brand-outline font-normal">/100</span></span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative">
              <div 
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                  score >= 60 ? "bg-gradient-to-r from-amber-500 to-verdict-invest" :
                  score <= 40 ? "bg-gradient-to-r from-amber-500 to-brand-error" :
                  "bg-amber-500"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-sm text-brand-on-surface-variant">{sentiment.details}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            {/* Bullish */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-verdict-invest uppercase">Bullish Signals</span>
              <ul className="space-y-2">
                {bullSignals.map((signal: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-verdict-invest mt-1.5 shrink-0" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bearish */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-brand-error uppercase">Bearish Signals</span>
              <ul className="space-y-2">
                {bearSignals.map((signal: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-error mt-1.5 shrink-0" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Headlines */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <span className="text-xs font-mono text-brand-outline uppercase">Recent Headlines</span>
            <div className="flex flex-col gap-2">
              {headlines.map((headline: string, i: number) => (
                <span key={i} className="text-xs italic text-brand-outline">"{headline}"</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
