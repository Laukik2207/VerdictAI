import { ChatOpenAI } from "@langchain/openai";

const getOpenRouterConfig = () => ({
  apiKey: process.env.OPENROUTER_API_KEY,
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "VerdictAI",
    },
  },
});

export const getLlmFlash = () => new ChatOpenAI({
  modelName: "google/gemini-2.5-flash",
  temperature: 0.3,
  maxTokens: 1000,
  ...getOpenRouterConfig(),
});

export const getLlmJudge = () => new ChatOpenAI({
  modelName: "google/gemini-2.5-flash",
  temperature: 0.1,
  maxTokens: 1000,
  ...getOpenRouterConfig(),
});

export const getLlmChallenge = () => new ChatOpenAI({
  modelName: "google/gemini-2.5-flash",
  temperature: 0.7,
  maxTokens: 1000,
  ...getOpenRouterConfig(),
});
