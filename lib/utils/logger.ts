import fs from "fs";
import path from "path";

export function logLlmInteraction(agentName: string, input: any, output: any) {
  try {
    const logDir = path.join(process.cwd(), "llm_logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const logFile = path.join(logDir, `${agentName}-${timestamp}.json`);

    const logData = {
      agent: agentName,
      timestamp: new Date().toISOString(),
      input,
      output,
    };

    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Logger] Failed to write log for ${agentName}:`, err);
  }
}
