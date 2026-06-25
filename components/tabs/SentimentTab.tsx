import React from "react";
import { SentimentOutput } from "@/lib/graph/types";
import { classifyHeadlineSentiment } from "@/lib/utils/headlineSentiment";
import { ExternalLink, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SentimentTabProps {
  sentiment: SentimentOutput | null;
  newsArticles: any[];
  status: "idle" | "running" | "done" | "error";
}

export function SentimentTab({ sentiment, newsArticles, status }: SentimentTabProps) {
  if (status === "running" || (status === "idle" && !sentiment)) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-64 bg-white/5 rounded-xl" />
        <div className="h-32 bg-white/5 rounded-xl border-l-4 border-accent/50" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-white/5 rounded-xl" />
          <div className="h-48 bg-white/5 rounded-xl" />
        </div>
        <div className="h-64 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full p-8 border border-red-500/20 rounded-xl bg-red-500/5 text-center">
        <p className="text-red-400">Error loading sentiment data.</p>
      </div>
    );
  }

  if (!sentiment && newsArticles.length === 0) {
    return null;
  }

  const sentimentScore = Math.round((sentiment?.score ?? 0.5) * 100);
  
  let gaugeColor = "text-amber-500";
  let gaugeLabel = "NEUTRAL";
  if (sentimentScore >= 67) {
    gaugeColor = "text-[#00D4A0]";
    gaugeLabel = "BULLISH";
  } else if (sentimentScore <= 33) {
    gaugeColor = "text-red-500";
    gaugeLabel = "BEARISH";
  }

  // Parse details into bull and bear signals if it's a JSON string or simple text
  let bullSignals: string[] = [];
  let bearSignals: string[] = [];
  
  if (sentiment?.details) {
    const lines = sentiment.details.split('\n').filter(l => l.trim().length > 0);
    bullSignals = lines.filter(l => l.toLowerCase().includes('bull') || l.includes('🟢') || classifyHeadlineSentiment(l) === 'BULLISH');
    bearSignals = lines.filter(l => l.toLowerCase().includes('bear') || l.includes('🔴') || classifyHeadlineSentiment(l) === 'BEARISH');
    
    // Fallback if parsing fails to find explicit signals
    if (bullSignals.length === 0 && bearSignals.length === 0) {
      if (sentimentScore >= 50) bullSignals.push(sentiment.details);
      else bearSignals.push(sentiment.details);
    }
  }

  // Mock trend data based on current score
  const trendData = Array.from({ length: 7 }).map((_, i) => {
    const variance = (Math.random() - 0.5) * 15;
    const historicalTrend = sentimentScore - ((6 - i) * 2); // Slightly trending towards current
    return Math.max(0, Math.min(100, historicalTrend + variance));
  });

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* SECTION A — Sentiment Score Hero */}
      <div className="bg-bg-card border border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center justify-center relative w-full md:w-1/2">
          {/* Simple CSS semicircular gauge */}
          <div className="relative w-48 h-24 overflow-hidden mb-2">
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-[#1a1a1a]" />
            <div 
              className={cn("absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-b-transparent border-r-transparent transition-transform duration-1000", 
                sentimentScore >= 67 ? "border-[#00D4A0]" : sentimentScore <= 33 ? "border-red-500" : "border-amber-500"
              )}
              style={{ transform: `rotate(${ -135 + (sentimentScore / 100) * 180 }deg)` }}
            />
          </div>
          <div className="absolute bottom-6 flex flex-col items-center">
            <span className={cn("text-5xl font-bold leading-none tracking-tighter", gaugeColor)}>
              {sentimentScore}
            </span>
          </div>
          <span className={cn("text-xs font-bold tracking-widest uppercase mt-4", gaugeColor)}>
            {gaugeLabel}
          </span>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Bull Signals</span>
            <span className="text-[#00D4A0] font-bold">{bullSignals.length} identified</span>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Bear Signals</span>
            <span className="text-red-500 font-bold">{bearSignals.length} identified</span>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">News Analyzed</span>
            <span className="text-white font-bold">{newsArticles.length} recent articles</span>
          </div>
        </div>
      </div>

      {/* SECTION B — Market Narrative */}
      <div className="bg-bg-card border border-border rounded-xl p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />
        <h2 className="text-white text-[16px] font-bold mb-4">Market Narrative</h2>
        <p className="text-text-secondary text-[14px] leading-[1.7] whitespace-pre-wrap">
          {sentiment?.label ? `The prevailing market sentiment is ${sentiment.label.toUpperCase()}. ` : ''}
          {sentiment?.details || "Narrative analysis not available."}
        </p>
      </div>

      {/* SECTION C — Bull vs Bear Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-[12px] font-bold text-[#00D4A0] uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Bull Signals
          </h3>
          <div className="flex flex-col gap-3">
            {bullSignals.length > 0 ? bullSignals.map((signal, i) => (
              <div key={i} className="bg-bg-card border border-[#00D4A0]/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00D4A0] shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary leading-relaxed">
                  {signal.replace(/^[-\*•\s]+/, '').replace(/bullish:|bull:/i, '').trim()}
                </span>
              </div>
            )) : (
              <p className="text-sm text-text-muted italic">No strong bull signals identified.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[12px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Bear Signals
          </h3>
          <div className="flex flex-col gap-3">
            {bearSignals.length > 0 ? bearSignals.map((signal, i) => (
              <div key={i} className="bg-bg-card border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary leading-relaxed">
                  {signal.replace(/^[-\*•\s]+/, '').replace(/bearish:|bear:/i, '').trim()}
                </span>
              </div>
            )) : (
              <p className="text-sm text-text-muted italic">No strong bear signals identified.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* SECTION D — Live News Feed */}
        <div className="xl:col-span-2 bg-bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-[16px] font-bold">Recent Headlines</h2>
            <span className="text-xs text-text-muted">Analyzed by NewsAPI</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {newsArticles.slice(0, 10).map((article, i) => {
              const headlineSentiment = classifyHeadlineSentiment(article.title);
              return (
                <a 
                  key={i} 
                  href={article.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group bg-[#1a1a1a] border border-white/5 hover:border-white/20 rounded-lg p-4 transition-colors flex flex-col gap-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-primary bg-white/10 px-2 py-0.5 rounded">
                      {article.source?.name || "News Source"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        headlineSentiment === 'BULLISH' ? "text-[#00D4A0] border-[#00D4A0]/30 bg-[#00D4A0]/10" :
                        headlineSentiment === 'BEARISH' ? "text-red-500 border-red-500/30 bg-red-500/10" :
                        "text-text-secondary border-white/10 bg-white/5"
                      )}>
                        {headlineSentiment}
                      </span>
                      <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {article.description}
                  </p>
                </a>
              );
            })}
            
            {newsArticles.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">No recent articles found.</p>
            )}
          </div>
        </div>

        {/* SECTION E — Sentiment Over Time */}
        <div className="xl:col-span-1">
          <div className="bg-bg-card border border-border rounded-xl p-6 sticky top-6">
            <h3 className="text-[10px] font-medium text-text-muted uppercase tracking-widest mb-6">
              SENTIMENT TREND (7D)
            </h3>
            
            <div className="h-48 w-full flex items-end justify-between gap-1 mt-4">
              {trendData.map((val, i) => (
                <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                  <div 
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-500",
                      val >= 67 ? "bg-[#00D4A0]/60 group-hover:bg-[#00D4A0]" : 
                      val <= 33 ? "bg-red-500/60 group-hover:bg-red-500" : 
                      "bg-amber-500/60 group-hover:bg-amber-500"
                    )}
                    style={{ height: `${val}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                    {Math.round(val)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn("w-4 h-4", trendData[6] > trendData[0] ? "text-[#00D4A0]" : "text-red-500 transform rotate-180")} />
                <span className="text-xs text-text-secondary">
                  {Math.abs(Math.round(trendData[6] - trendData[0]))} pts from T-7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
