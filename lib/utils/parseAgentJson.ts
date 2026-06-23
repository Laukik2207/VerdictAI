export function parseAgentJson<T>(rawText: string, agentName: string): T {
  let cleanedText = rawText.trim();
  
  // Strip markdown fences
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleanedText) as T;
  } catch (error) {
    console.warn(`[${agentName}] Failed to parse JSON cleanly. Attempting substring extraction...`);
    
    // Fallback: Find the first '{' and the last '}'
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const extractedText = rawText.substring(startIndex, endIndex + 1);
      try {
        return JSON.parse(extractedText) as T;
      } catch (innerError) {
        throw new Error(`[${agentName}] Failed to parse JSON even after extraction. Raw: ${rawText}`);
      }
    }
    
    throw new Error(`[${agentName}] Could not extract any JSON object from response.`);
  }
}
