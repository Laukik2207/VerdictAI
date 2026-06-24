import { AgentName, AgentStatus } from "@/hooks/useAnalysis";

export function getAgentStatusText(agent: AgentName, status: AgentStatus, output: any, company: string = "Target"): string {
  if (status === "idle") return "> Agent initialized.";
  if (status === "error") return "> CRITICAL ERROR: Agent execution failed.";

  if (status === "running") {
    switch (agent) {
      case "ResearchAgent": return `> Scanning global markets and indexing SEC EDGAR filings for ${company}...`;
      case "FinancialAgent": return `> Ingesting 10-K and 10-Q documents. Calibrating DCF models...`;
      case "SentimentAgent": return `> Scraping earnings call transcripts and analyst social sentiment...`;
      case "RiskAgent": return `> Awaiting upstream inputs from Sentiment and Financials.`;
      case "JudgeAgent": return `> Synthesizing multi-agent outputs to reach a final verdict...`;
      case "ChallengeAgent": return `> Constructing the bear case to stress-test primary assumptions...`;
      default: return `> Processing...`;
    }
  }

  if (status === "done") {
    switch (agent) {
      case "ResearchAgent": return `> Analysis of ${company} market positioning finished. ${output?.metrics?.length || 4} key metrics extracted.`;
      case "FinancialAgent": return `> 10-K and 10-Q ingestion complete. Financial trends mapped successfully.`;
      case "SentimentAgent": return `> Sentiment aggregation complete. Institutional consensus is primarily ${output?.label || "neutral"}.`;
      case "RiskAgent": return `> Risk modeling complete. Overall threat level assessed as ${output?.level || "MEDIUM"}.`;
      case "JudgeAgent": return `> Verdict rendered: ${String(output?.decision || "PASS").toUpperCase()}. Confidence level: ${output?.confidence || 0}%.`;
      case "ChallengeAgent": return `> Bear case generated. Weaknesses identified in primary thesis.`;
      default: return `> Execution complete.`;
    }
  }

  return "> Status unknown.";
}
