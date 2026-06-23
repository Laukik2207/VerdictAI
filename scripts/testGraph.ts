import { buildInvestmentGraph } from "../lib/graph/investmentGraph";

async function run() {
  const company = process.argv[2] || "Stripe";
  console.log(`\nStarting analysis for: ${company}\n`);

  const graph = buildInvestmentGraph();

  const inputs = {
    query: company,
    status: "running" as const,
  };

  try {
    for await (const output of await graph.stream(inputs)) {
      // output is keyed by the node name that just completed
      for (const [nodeName, nodeState] of Object.entries(output)) {
        console.log(`\n==================================================`);
        console.log(`[NODE COMPLETED]: ${nodeName}`);
        console.log(`==================================================`);
        console.log(JSON.stringify(nodeState, null, 2));
      }
    }
    
    console.log("Graph Execution Complete.");
  } catch (err) {
    console.error("Graph Execution Failed:", err);
  }
}

run();
