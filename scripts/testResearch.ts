import { runResearchAgent } from "../lib/agents/researchAgent";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Testing research agent...");
  const res = await runResearchAgent("Tata Steel");
  console.log("Research Result:", JSON.stringify(res, null, 2));
}

main();
