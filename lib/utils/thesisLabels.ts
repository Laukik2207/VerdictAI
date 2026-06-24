export function generatePillarLabel(reasoning: string, index: number): string {
  if (!reasoning) return `0${index + 1}. KEY FACTOR`;

  // Simple heuristic: Take the first few words, strip punctuation, uppercase
  const words = reasoning.split(" ").slice(0, 3);
  let label = words.join(" ").replace(/[.,;:!?]/g, "").toUpperCase();

  // If it's too long, truncate
  if (label.length > 25) {
    label = label.substring(0, 22) + "...";
  }

  return `0${index + 1}. ${label}`;
}
