export function getAgentStatusText(
  agent: string,
  status: 'idle' | 'running' | 'done' | 'error',
  output: any,
  company: string
): string {
  if (status === 'idle') return '> Agent initialized.'
  
  const texts: Record<string, Record<string, string>> = {
    ResearchAgent: {
      running: `> Scanning market data and indexing ${company} profile...`,
      done: output?.products?.length
        ? `> Analysis complete. ${output.products.length} products identified. Sector: ${output.sector || 'confirmed'}.`
        : `> ${company} market positioning analysis complete.`,
      error: '> Research agent encountered an error. Partial data retained.'
    },
    FinancialAgent: {
      running: '> Ingesting financial statements and calibrating DCF model...',
      done: output?.financialScore !== undefined
        ? `> Financial score calibrated: ${output.financialScore}/100. ${output.revenueGrowth || ''}`
        : '> Financial model complete.',
      error: '> Financial data unavailable. Proceeding with estimates.'
    },
    SentimentAgent: {
      running: '> Scraping earnings call transcripts and analyst social sentiment...',
      done: output?.sentimentScore !== undefined
        ? `> Sentiment mapped: ${output.bullSignals?.length || 0} bullish, ${output.bearSignals?.length || 0} bearish signals.`
        : '> Sentiment analysis complete.',
      error: '> Sentiment data limited. Using available signals.'
    },
    RiskAgent: {
      running: '> Awaiting upstream inputs from Sentiment and Financials...',
      done: output?.riskScore !== undefined
        ? `> Risk matrix complete. Overall risk score: ${output.riskScore}/100.`
        : '> Risk evaluation complete.',
      error: '> Risk assessment incomplete. Default risk levels applied.'
    },
    JudgeAgent: {
      running: '> Synthesizing committee inputs. Deliberating...',
      done: output?.verdict
        ? `> Verdict issued: ${output.verdict} at ${output.confidence}% confidence.`
        : '> Committee verdict issued.',
      error: '> Judge agent failed. Manual review required.'
    },
    ChallengeAgent: {
      running: '> Running adversarial stress-test against primary verdict...',
      done: output?.counterArguments?.length
        ? `> ${output.counterArguments.length} counter-arguments generated. Devil's advocate complete.`
        : '> Challenge analysis complete.',
      error: '> Challenge agent failed. Proceeding without counterarguments.'
    }
  }

  return texts[agent]?.[status] ?? `> ${agent} ${status}.`
}
