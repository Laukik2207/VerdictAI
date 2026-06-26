import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

const llmFlash = new ChatOpenAI({
  modelName: "google/gemini-flash-1.5",
  temperature: 0.3,
  ...openRouterConfig,
});

async function main() {
  try {
    console.log("Testing openrouter gemini-1.5-flash...");
    const res = await llmFlash.invoke("Say hello!");
    console.log("Success:", res.content);
  } catch (err: any) {
    console.error("OpenRouter Error:", err.message);
  }
}

main();
