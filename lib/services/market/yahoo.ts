import { MarketData, MarketState } from "./types";
import { getExchangeRates, convertCurrency } from "@/lib/utils/currency";

export async function fetchYahooMarketData(company: string, ticker: string): Promise<MarketData | null> {
  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    if (!res.ok) {
      throw new Error(`Yahoo API returned ${res.status}`);
    }

    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;

    if (!meta || !meta.regularMarketPrice) {
      return null;
    }

    const localCurrency = meta.currency || "USD";
    const price = meta.regularMarketPrice;
    
    // Calculate change
    const prevClose = meta.chartPreviousClose;
    let change = null;
    let changePct = null;
    if (prevClose) {
      change = price - prevClose;
      changePct = (change / prevClose) * 100;
    }

    // Market state (simplified)
    const marketState: MarketState = "OPEN"; // v8 chart doesn't give a simple string, assume OPEN if we got prices

    // Prepare converted prices
    const rates = await getExchangeRates();
    const convertedPrices = {
      USD: convertCurrency(price, localCurrency, "USD", rates),
      INR: convertCurrency(price, localCurrency, "INR", rates),
      EUR: convertCurrency(price, localCurrency, "EUR", rates),
    };

    return {
      company,
      ticker,
      exchange: meta.fullExchangeName || meta.exchangeName || null,
      exchangeCountry: null, // not directly available in v8 chart meta usually
      price,
      localCurrency,
      convertedPrices,
      change,
      changePct,
      marketState,
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Yahoo Finance fetch failed:", error);
    return null;
  }
}
