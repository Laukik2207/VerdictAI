import { getLlmFlash } from "../lib/services/providers/gemini";
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const schema = z.object({
  score: z.number().describe("A score from 0 to 100"),
  summary: z.string().describe("A short summary"),
  tags: z.array(z.string()).describe("List of relevant tags")
});

async function main() {
  console.log("Testing withStructuredOutput...");
  const llm = getLlmFlash();
  const structuredLlm = llm.withStructuredOutput(schema);
  
  try {
    const res = await structuredLlm.invoke("Evaluate the company Tesla.");
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (err: any) {
    console.error("Structured Output Error:", err.message);
  }
}

main();
