export type CurrencyCode = "USD" | "INR" | "EUR";

// In-memory cache for the serverless function (optional, but fetch caching handles it mostly)
let cachedRates: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

// Fallback rates if the API fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
};

/**
 * Fetches live FX rates with USD as base.
 * Caches for 6 hours.
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < CACHE_TTL) {
    return cachedRates;
  }

  try {
    // open.er-api.com provides free exchange rates without API key
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 }, // Next.js cache for 6 hours
    });
    
    if (!res.ok) {
      throw new Error(`FX API returned ${res.status}`);
    }

    const data = await res.json();
    if (data && data.rates) {
      cachedRates = data.rates;
      lastFetchTime = now;
      return data.rates;
    }
    
    throw new Error("Invalid FX API response");
  } catch (error) {
    console.warn("Failed to fetch live FX rates, using fallback rates:", error);
    return FALLBACK_RATES;
  }
}

/**
 * Converts an amount from one currency to another using the provided rates (USD-based).
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: CurrencyCode,
  rates: Record<string, number>
): number | null {
  if (amount == null || isNaN(amount)) return null;
  
  const rateFrom = rates[from] || FALLBACK_RATES[from] || 1;
  const rateTo = rates[to] || FALLBACK_RATES[to] || 1;

  // Convert to USD first, then to target currency
  const amountInUSD = amount / rateFrom;
  const targetAmount = amountInUSD * rateTo;

  return targetAmount;
}

/**
 * Formats a currency amount with the correct symbol and decimals.
 */
export function formatCurrency(amount: number | null, currency: CurrencyCode | string): string {
  if (amount == null || isNaN(amount)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
