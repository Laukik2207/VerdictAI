import fs from "fs";
import path from "path";
import { buildInvestmentGraph } from "../lib/graph/investmentGraph";

async function run() {
  const company = process.argv[2] || "Tesla";
  console.log(`\nStarting analysis for: ${company}\n`);

  const graph = buildInvestmentGraph();

  const inputs = {
    query: company,
    status: "running" as const,
  };

  let finalState: any = {};

  try {
    for await (const output of await graph.stream(inputs)) {
      for (const [nodeName, nodeState] of Object.entries(output)) {
        console.log(`\n==================================================`);
        console.log(`[NODE COMPLETED]: ${nodeName}`);
        console.log(`==================================================`);
        console.log(JSON.stringify(nodeState, null, 2));
        
        // Accumulate state to dump later
        finalState = { ...finalState, ...nodeState };
      }
    }
    
    console.log("\nGraph Execution Complete.");
    
    const logsDir = path.join(process.cwd(), "llm_logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    const filePath = path.join(logsDir, `integration_${company.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(finalState, null, 2), "utf8");
    console.log(`\nSaved complete graph output to ${filePath}`);

  } catch (err) {
    console.error("Graph Execution Failed:", err);
  }
}

run();
