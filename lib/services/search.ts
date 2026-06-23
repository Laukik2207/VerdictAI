import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "tavily";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// 3-5 queries per analysis to stay within Tavily free tier
export const searchTool = tool(async ({ query }) => {
  try {
    const result = await tvly.search(query, { maxResults: 5 });
    return JSON.stringify(result.results);
  } catch (err: any) {
    return JSON.stringify({ error: err.message });
  }
}, {
  name: "search",
  description: "Search the web for real-time information and recent news.",
  schema: z.object({
    query: z.string().describe("The search query"),
  }),
});
