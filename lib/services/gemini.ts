import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Flash chosen for latency; upgrade to Pro for higher reasoning depth
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.3,
});
