"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { GraphState } from "@/lib/graph/types";
import { TrendingUp, TrendingDown, CheckCircle2, Diamond, Triangle, Circle, ArrowRight } from "lucide-react";
import { PerformanceCorridorChart } from "@/components/PerformanceCorridorChart";
import { cn } from "@/lib/utils/cn";

export default function ThesisPage() {
  const params = useParams();
  const router = useRouter();
  
  const companyRaw = Array.isArray(params.company) ? params.company[0] : params.company;
  const company = decodeURIComponent(companyRaw || "");

  const [report, setReport] = useState<GraphState | null>(null);
  const [loading, setLoading] = useState(true);

  // Variables state
  const [variables, setVariables] = useState({
    operatingMargin: 54.5,
    fedFundsRate: 5.25,
    chinaSalesRecovery: 'MED',
    aiRoiVelocity: 8.2
  });

  const [liveConfidence, setLiveConfidence] = useState(84);
  const [logicMessages, setLogicMessages] = useState<{agent: string, text: string, color: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const data = localStorage.getItem('verdictai_report_' + company);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setReport(parsed);
        setLiveConfidence(parsed.verdict?.confidence || 84);
      } catch (e) {
        console.error("Failed to parse report from localStorage", e);
      }
    }
    setLoading(false);
  }, [company]);

  // Recalculate confidence
  useEffect(() => {
    if (!report) return;
    const base = report.verdict?.confidence || 84;
    const marginEffect = (variables.operatingMargin - 54.5) * 0.3;
    const rateEffect = -(variables.fedFundsRate - 5.25) * 0.8;
    const chinaEffect = variables.chinaSalesRecovery === 'LOW' ? -4 : variables.chinaSalesRecovery === 'HIGH' ? +3 : 0;
    const aiEffect = (variables.aiRoiVelocity - 8.2) * 0.5;
    
    const newConf = Math.min(99, Math.max(10, base + marginEffect + rateEffect + chinaEffect + aiEffect));
    setLiveConfidence(parseFloat(newConf.toFixed(1)));
  }, [variables, report]);

  // Staggered chat messages on mount
  useEffect(() => {
    if (report && !initialLoadDone.current) {
      initialLoadDone.current = true;
      const t1 = setTimeout(() => {
        setLogicMessages(prev => [...prev, { agent: "Agent Alpha", text: `Challenging Q3 revenue guidance. Demand for H100 exceeds TSMC capacity by 12%.`, color: "text-[#00D4A0]" }]);
      }, 500);
      const t2 = setTimeout(() => {
        setLogicMessages(prev => [...prev, { agent: "Agent Delta", text: `Counter: ${report.verdict?.thesis?.slice(0, 60) || "Strategic moat remains unchallenged."}...`, color: "text-[#6366f1]" }]);
      }, 1500);
      const t3 = setTimeout(() => {
        setLogicMessages(prev => [...prev, { agent: "Agent Gamma", text: `Risk assessment: ${report.risk?.operationalRisk?.slice(0, 50) || "Supply chain vulnerabilities exist."}...`, color: "text-[#f59e0b]" }]);
      }, 2500);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [report, company]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logicMessages]);

  if (loading) {
    return (
      <AppShell company={company} isComplete={true}>
        <div className="w-full flex justify-center items-center h-full">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell company={company} isComplete={true}>
        <div className="w-full h-full flex flex-col justify-center items-center text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-2">No analysis found</h2>
          <p className="text-text-secondary mb-8">Run an analysis first to stress-test the verdict.</p>
        </div>
      </AppShell>
    );
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setLogicMessages(prev => [...prev, { agent: "User", text: chatInput, color: "text-white" }]);
    setChatInput("");
    
    setTimeout(() => {
      const responses = [
        `Analyzing your challenge... Confidence adjusted.`,
        `Cross-referencing with ${report.research?.sector || "Tech"} sector benchmarks...`,
        `Agent consensus: your point has been factored into the variance model.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setLogicMessages(prev => [...prev, { agent: "Synthesis Engine", text: randomResponse, color: "text-[#6366f1]" }]);
    }, 800);
  };

  const handleLockScenario = () => {
    alert("Scenario locked. Exporting to report...");
  };

  // derived target values
  const bull12m = (liveConfidence * 14).toFixed(2);
  const base12m = (liveConfidence * 10).toFixed(2);
  const bear12m = (liveConfidence * 7).toFixed(2);

  const bullTitle = (report.verdict?.thesis || "Unrivaled AI Dominance").split(" ").slice(0, 3).join(" ").replace(/[.,;:!?]/g, "");
  const bearTitle = (report.challenge?.weakestAssumption || "Margin compression risks ahead").slice(0, 25);

  return (
    <AppShell 
      company={company} 
      isComplete={true}
      microLabel={<span className="font-mono text-[11px] text-text-muted">STRESS TEST V4.2</span>}
    >
      <div className="w-full max-w-6xl mx-auto p-6 md:p-10 pb-40 flex flex-col gap-8">
        
        {/* SECTION 1: Page Header */}
        <section className="flex justify-between items-end">
          <div className="flex flex-col gap-3 max-w-[600px]">
            <div>
              <span className="inline-block border border-accent bg-accent/10 text-accent text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                ACTIVE DEBATE
              </span>
            </div>
            <h1 className="text-[32px] font-black text-white leading-none tracking-tight">
              Challenge the Verdict — {company}
            </h1>
            <p className="text-[14px] text-[#888] leading-relaxed">
              Deep stress-testing of current institutional consensus via multi-agent dialectic analysis and adversarial variable shifting.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">CONFIDENCE SCORE</span>
            <span className="text-[36px] font-bold text-accent transition-all duration-300">
              {liveConfidence.toFixed(1)}%
            </span>
          </div>
        </section>

        {/* SECTION 2: 3-Column Debate Row */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr_1fr] gap-4">
          
          {/* BULL CARD */}
          <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] text-accent uppercase font-mono font-bold tracking-widest">PRIMARY THESIS (BULL)</span>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-[18px] font-bold text-white mb-4">{bullTitle}</h2>
            <div className="space-y-3 mb-6 flex-1">
              {(report.verdict?.reasoning || []).slice(0, 3).map((r, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[13px] text-text-secondary">{r}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest">BULL TARGET</span>
                <span className="text-[13px] font-bold text-accent">${bull12m}</span>
              </div>
              <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-accent w-full" />
              </div>
            </div>
          </div>

          {/* AGENT DEBATE CENTER */}
          <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 to-transparent pointer-events-none" />
            <div className="relative w-[60px] h-[60px] mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#6366f1]/50 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full bg-[#6366f1]/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="w-full h-full bg-[#6366f1] rounded-full flex items-center justify-center relative z-10">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <span className="text-[12px] text-[#6366f1] uppercase font-mono font-bold tracking-widest mb-1">AGENTS DEBATING...</span>
            <span className="text-[10px] text-text-muted mb-6">SYNTHESIS IN PROGRESS</span>
            
            <div className="flex flex-col gap-3 w-full text-left">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[12px] text-white">Supply Chain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[12px] text-accent">Challenging Capex Sustainability</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-text-muted" />
                <span className="text-[12px] text-text-muted">Macro Factor Evaluation</span>
              </div>
            </div>
          </div>

          {/* BEAR CARD */}
          <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] text-[#f59e0b] uppercase font-mono font-bold tracking-widest">COUNTER-THESIS (BEAR)</span>
              <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <h2 className="text-[18px] font-bold text-white mb-4">{bearTitle}...</h2>
            <div className="space-y-3 mb-6 flex-1">
              {(report.challenge?.counterArguments || []).slice(0, 3).map((r, i) => {
                const Icon = i === 0 ? Diamond : i === 1 ? Triangle : Circle;
                const color = i === 0 ? "text-[#ef4444]" : i === 1 ? "text-[#f59e0b]" : "text-[#f97316]";
                return (
                  <div key={i} className="flex gap-2 items-start">
                    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0 fill-current", color)} />
                    <span className="text-[13px] text-text-secondary">{r}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest">BEAR TARGET</span>
                <span className="text-[13px] font-bold text-[#ef4444]">${bear12m}</span>
              </div>
              <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#ef4444] w-[60%]" />
              </div>
            </div>
          </div>

        </section>

        {/* SECTION 3: Dynamic Sensitivity & Shift */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          
          {/* SENSITIVITY CARD */}
          <div className="bg-bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[16px] font-bold text-white">Dynamic Variable Sensitivity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* OPERATING MARGIN */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">OPERATING MARGIN (%)</span>
                  <span className="text-[24px] font-bold text-white">{variables.operatingMargin.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="40" max="65" step="0.5" 
                  value={variables.operatingMargin}
                  onChange={e => setVariables({...variables, operatingMargin: parseFloat(e.target.value)})}
                  style={{ '--value': `${((variables.operatingMargin - 40) / (65 - 40)) * 100}%`, '--slider-fill': '#00D4A0' } as any}
                />
                <div className="flex justify-between items-center mt-2 text-[10px] text-text-muted">
                  <span>MIN (40%)</span><span>TARGET</span><span>MAX (65%)</span>
                </div>
              </div>

              {/* FED FUNDS RATE */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">FED FUNDS RATE (%)</span>
                  <span className="text-[24px] font-bold text-white">{variables.fedFundsRate.toFixed(2)}%</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.25" 
                  value={variables.fedFundsRate}
                  onChange={e => setVariables({...variables, fedFundsRate: parseFloat(e.target.value)})}
                  style={{ '--value': `${((variables.fedFundsRate - 0) / (10 - 0)) * 100}%`, '--slider-fill': '#6366f1' } as any}
                />
                <div className="flex justify-between items-center mt-2 text-[10px] text-text-muted">
                  <span>0% DOVE</span><span>CURRENT</span><span>10% HAWK</span>
                </div>
              </div>

              {/* CHINA SALES RECOVERY */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">CHINA SALES RECOVERY</span>
                  <span className="text-[20px] font-bold text-white">
                    {variables.chinaSalesRecovery === 'LOW' ? 'LOW' : variables.chinaSalesRecovery === 'MED' ? 'MODERATE' : 'ROBUST'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {['LOW','MED','HIGH'].map(val => (
                    <button 
                      key={val}
                      onClick={() => setVariables({...variables, chinaSalesRecovery: val})}
                      className={cn(
                        "flex-1 py-2 rounded-md border text-[12px] font-bold transition-colors",
                        variables.chinaSalesRecovery === val 
                          ? "bg-[#2a2a2a] border-white text-white" 
                          : "bg-[#1a1a1a] border-border text-text-muted hover:text-text-secondary"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI ROI ADOPTION */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">AI ROI ADOPTION VELOCITY</span>
                  <span className="text-[20px] font-bold text-white">{variables.aiRoiVelocity.toFixed(1)} / 10</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.1" 
                  value={variables.aiRoiVelocity}
                  onChange={e => setVariables({...variables, aiRoiVelocity: parseFloat(e.target.value)})}
                  style={{ '--value': `${((variables.aiRoiVelocity - 0) / (10 - 0)) * 100}%`, '--slider-fill': '#00D4A0' } as any}
                />
              </div>
            </div>
          </div>

          {/* VERDICT SHIFT CARD */}
          <div className="bg-bg-card border-2 border-[#6366f1] rounded-xl p-5 flex flex-col">
            <h2 className="text-[16px] font-bold text-white">Verdict Shift</h2>
            <p className="text-[12px] text-text-muted mb-4">Real-time re-evaluation under selected parameters.</p>
            
            <div className="bg-[#0d0d0d] rounded-lg p-3 border border-border flex-1 flex flex-col relative overflow-hidden mb-4">
              <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] text-text-muted uppercase">LOGIC STREAM</span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[160px] space-y-2 pr-2 custom-scrollbar">
                {logicMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className={cn("text-[12px] font-bold whitespace-nowrap", msg.color)}>
                      [{msg.agent}]
                    </span>
                    <span className="text-[12px] text-white break-words">{msg.text}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChatSubmit} className="mt-3 flex h-8">
                <input 
                  type="text" 
                  placeholder="Challenge a specific point..." 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-border border-r-0 rounded-l-md px-3 text-[12px] text-white focus:outline-none focus:border-[#6366f1]"
                />
                <button type="submit" className="bg-[#6366f1] text-white px-3 rounded-r-md hover:bg-[#4f46e5] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <button 
              onClick={handleLockScenario}
              className="w-full bg-[#1a1a1a] border border-border text-white text-[12px] uppercase font-mono py-3 rounded-md hover:bg-white/5 transition-colors"
            >
              LOCK SCENARIO
            </button>
          </div>

        </section>

        {/* SECTION 4: Performance Chart */}
        <section>
          <PerformanceCorridorChart baseConfidence={liveConfidence} verdict={report.verdict?.decision || "INVEST"} />
        </section>

      </div>

      {/* SECTION 5: 3-Column Price Target Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:pl-[240px] z-40">
        <div className="bg-[#0d0d0d] border-t border-border grid grid-cols-3 h-[72px]">
          <div className="flex flex-col items-center justify-center border-r border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-0.5">12M PT (BULL)</span>
            <span className="text-[20px] font-bold text-accent">${bull12m}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-border">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-0.5">12M PT (BASE)</span>
            <span className="text-[20px] font-bold text-white">${base12m}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono mb-0.5">12M PT (BEAR)</span>
            <span className="text-[20px] font-bold text-[#ef4444]">${bear12m}</span>
          </div>
        </div>
      </div>

    </AppShell>
  );
}
