// Pattern: invoke llm → extract content → strip markdown fences → JSON.parse
// On parse failure: retry once with explicit JSON reminder
// On second failure: return partial output with error flag

import { getModel } from "../services/modelRouter";
import { buildSentimentPrompt } from "../prompts/sentimentPrompt";
import { fetchCompanyNews as fetchNews } from "../services/providers/news";
import { SentimentOutput, SentimentSchema, ResearchOutput } from "../graph/types";
import { logLlmInteraction } from "../utils/logger";

export async function runSentimentAgent(company: string, research: ResearchOutput): Promise<{ output: SentimentOutput, newsArticles: any[] }> {
  let news: any[] = [];
  try {
    news = await fetchNews(company);
  } catch (err) {
    console.warn("[SentimentAgent] Could not fetch news", err);
  }

  const prompt = buildSentimentPrompt(company, research, news);
  const structuredLlm = getModel("sentiment").withStructuredOutput(SentimentSchema, { name: "extract_sentiment" });

  try {
    const startTime = Date.now();
    const parsed = await structuredLlm.invoke(prompt);
    const latency = Date.now() - startTime;

    logLlmInteraction("SentimentAgent", { research, newsCount: news.length }, JSON.stringify(parsed), {
      provider: "gemini-2.0-flash",
      tokens: 0,
      latency,
      costEstimate: 0,
    });

    return {
      output: parsed,
      newsArticles: news
    };
  } catch (err: any) {
    console.error("[SentimentAgent] Execution failed:", err);
    return {
      output: {
        score: 0.5,
        label: "neutral",
        details: "Sentiment data unavailable",
        error: "Sentiment agent failed: " + err.message
      } as any,
      newsArticles: []
    };
  }
}
