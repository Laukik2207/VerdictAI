import { ChatOpenAI } from "@langchain/openai";

const openRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "VerdictAI",
    },
  },
};

export const llmFlash = new ChatOpenAI({
  modelName: "google/gemini-1.5-flash",
  temperature: 0.3,
  ...openRouterConfig,
});

export const llmJudge = new ChatOpenAI({
  modelName: "google/gemini-1.5-pro",
  temperature: 0.1,
  ...openRouterConfig,
});

export const llmChallenge = new ChatOpenAI({
  modelName: "google/gemini-1.5-pro",
  temperature: 0.7,
  ...openRouterConfig,
});
