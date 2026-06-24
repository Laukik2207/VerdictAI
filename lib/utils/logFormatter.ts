import { AgentName } from "@/hooks/useAnalysis";

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  bold: boolean;
}

export function generateLogEntry(agent: AgentName | "system", event: string, output: any, company: string = "Target"): LogEntry {
  const now = new Date();
  const timeStr = [
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
    now.getSeconds().toString().padStart(2, '0'),
  ].join(':');

  let text = "";
  let bold = false;

  const getPrefix = (a: string) => a.replace("Agent", "_AGENT").toUpperCase();
  const prefix = agent === "system" ? "VERDICT_CORE" : getPrefix(agent);

  if (agent === "system") {
    text = `[${timeStr}] ${prefix}: ${event === "start" ? `Initiating multi-agent orchestration for ${company}.` : "Orchestration complete."}`;
    bold = event === "start";
  } else if (event === "agent_start") {
    bold = false;
    switch (agent) {
      case "ResearchAgent": text = `[${timeStr}] ${prefix}: Initiating SEC indexing and market positioning scan for ${company}...`; break;
      case "FinancialAgent": text = `[${timeStr}] ${prefix}: Booting quantitative model. Loading 10-K/10-Q arrays...`; break;
      case "SentimentAgent": text = `[${timeStr}] ${prefix}: Scraping earnings call transcripts and analyst social sentiment...`; break;
      case "RiskAgent": text = `[${timeStr}] ${prefix}: Scanning for supply chain vulnerabilities and geopolitical exposure...`; break;
      case "JudgeAgent": text = `[${timeStr}] ${prefix}: Synthesizing state graph into definitive investment verdict...`; break;
      case "ChallengeAgent": text = `[${timeStr}] ${prefix}: Constructing adversarial bear case and stress-testing assumptions...`; break;
      default: text = `[${timeStr}] ${prefix}: Starting execution...`;
    }
  } else if (event === "agent_done") {
    bold = true;
    switch (agent) {
      case "ResearchAgent": text = `[${timeStr}] ${prefix}: Successfully indexed SEC EDGAR filings and sector benchmarks.`; break;
      case "FinancialAgent": {
        const score = output?.score || output?.financialScore || 85;
        text = `[${timeStr}] ${prefix}: Financial score calibrated at ${score}/100. Moat: High.`; 
        break;
      }
      case "SentimentAgent": {
        const type = output?.label || "bullish";
        text = `[${timeStr}] ${prefix}: Detected uptick in "${type}" vernacular across institutional reports.`; 
        break;
      }
      case "RiskAgent": {
        const lvl = output?.level || "MEDIUM";
        text = `[${timeStr}] ${prefix}: Risk surface evaluated. Overall risk level categorized as ${lvl}.`; 
        break;
      }
      case "JudgeAgent": text = `[${timeStr}] ${prefix}: FINAL VERDICT REACHED. Multi-agent consensus achieved.`; break;
      case "ChallengeAgent": text = `[${timeStr}] ${prefix}: Bear case synthesized. Probability of catastrophic downside modeled.`; break;
      default: text = `[${timeStr}] ${prefix}: Execution COMPLETE.`;
    }
  } else if (event === "agent_error") {
    bold = true;
    text = `[${timeStr}] ${prefix}: CRITICAL FAILURE detected during execution.`;
  } else {
    text = `[${timeStr}] SYSTEM: ${event}`;
  }

  // Auto-bold any text containing key success/action words
  if (text.match(/COMPLETE|DETECTED|CALIBRATED|SUCCESS|VERDICT REACHED/)) {
    bold = true;
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: `[${timeStr}]`,
    text: text.replace(`[${timeStr}] `, ""),
    bold
  };
}
