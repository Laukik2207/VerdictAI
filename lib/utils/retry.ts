export async function withRetry<T>(fn: () => Promise<T>, retries: number = 1, delayMs: number = 2000): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      // Only retry on typical rate limit or network errors
      if (attempt <= retries && (error.status === 429 || error.message?.includes("429") || error.code === "ECONNRESET")) {
        console.warn(`[Retry] API error (429/Network). Retrying ${attempt}/${retries} in ${delayMs}ms...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Retry limit exceeded.");
}
