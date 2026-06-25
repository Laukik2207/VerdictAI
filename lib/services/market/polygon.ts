import { MarketData } from "./types";
import { getExchangeRates, convertCurrency } from "@/lib/utils/currency";

export async function fetchPolygonMarketData(company: string, ticker: string): Promise<MarketData | null> {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) {
    console.log("Polygon skipped: Missing API key");
    return null;
  }

  try {
    const res = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${apiKey}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Polygon API returned ${res.status}`);

    const data = await res.json();
    const tickerData = data?.ticker;

    if (!tickerData) {
      return null;
    }

    const price = tickerData.day?.c || tickerData.lastQuote?.P || tickerData.prevDay?.c || null;
    if (price === null) return null;

    const change = tickerData.todaysChange || 0;
    const changePct = tickerData.todaysChangePerc || 0;
    const localCurrency = "USD"; // Polygon US stock snapshots are in USD

    const rates = await getExchangeRates();
    const convertedPrices = {
      USD: convertCurrency(price, localCurrency, "USD", rates),
      INR: convertCurrency(price, localCurrency, "INR", rates),
      EUR: convertCurrency(price, localCurrency, "EUR", rates),
    };

    return {
      company,
      ticker,
      exchange: "US Market",
      exchangeCountry: "US",
      price,
      localCurrency,
      convertedPrices,
      change,
      changePct,
      marketState: "OPEN", // Polygon doesn't give a simple OPEN/CLOSED boolean here without more calls
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Polygon fetch failed:", error);
    return null;
  }
}
