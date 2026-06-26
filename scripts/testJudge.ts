import { getLlmJudge } from "../lib/services/providers/gemini";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Testing judge agent llm...");
  try {
    const llm = getLlmJudge();
    const res = await llm.invoke("Say hello!");
    console.log("Success:", res.content);
  } catch (err: any) {
    console.error("Judge Agent Error:", err.message);
  }
}

main();
