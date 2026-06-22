import fs from "fs";
import path from "path";

export function logAgentOutput(agent: string, input: any, output: any): void {
  if (process.env.VERCEL) return;

  try {
    const logDir = path.join(process.cwd(), "llm_logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const timestamp = Date.now();
    const filePath = path.join(logDir, `${agent}_${timestamp}.json`);
    
    const logData = {
      timestamp: new Date(timestamp).toISOString(),
      agent,
      input,
      output,
    };
    
    fs.promises.writeFile(filePath, JSON.stringify(logData, null, 2))
      .catch((err) => console.error("Error writing llm log asynchronously:", err));
  } catch (err) {
    console.error("Error setting up llm logger:", err);
  }
}
