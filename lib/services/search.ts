// @ts-ignore: package export maps might not resolve correctly
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// 3-5 queries per analysis to stay within Tavily free tier
export const searchTool = new TavilySearchResults({
  maxResults: 5,
});
