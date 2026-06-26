// Using native fetch

async function main() {
  const res = await fetch("https://openrouter.ai/api/v1/models");
  const data = await res.json();
  const models = data.data;
  const geminiModels = models.filter((m: any) => m.id.includes("gemini"));
  console.log("Gemini Models available:");
  geminiModels.forEach((m: any) => console.log(m.id));
}

main();
