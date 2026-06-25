import { MarketData } from "./types";
import { fetchYahooMarketData } from "./yahoo";
import { fetchAlphaVantageMarketData } from "./alphavantage";
import { fetchPolygonMarketData } from "./polygon";
import { resolveTickerWithRanking } from "@/lib/utils/tickerResolver";

export async function getMarketData(company: string): Promise<MarketData> {
  const privateState: MarketData = {
    company,
    ticker: null,
    exchange: "PRIVATE",
    exchangeCountry: null,
    price: null,
    localCurrency: null,
    convertedPrices: { USD: null, INR: null, EUR: null },
    change: null,
    changePct: null,
    marketState: "PRIVATE",
    updatedAt: Date.now(),
  };

  const unknownState: MarketData = {
    ...privateState,
    exchange: "UNKNOWN",
    marketState: "UNKNOWN",
  };

  let ticker: string | null = null;
  try {
    ticker = await resolveTickerWithRanking(company);
  } catch (error) {
    console.error("Search failure:", error);
    return unknownState;
  }

  // ONLY show PRIVATE if: No ticker AND No exchange AND No price.
  if (!ticker) {
    return privateState;
  }

  // 1. Primary: Yahoo Finance
  let data = await fetchYahooMarketData(company, ticker);
  if (data) return data;

  // 2. Fallback: Alpha Vantage
  data = await fetchAlphaVantageMarketData(company, ticker);
  if (data) return data;

  // 3. Fallback: Polygon
  data = await fetchPolygonMarketData(company, ticker);
  if (data) return data;

  // 4. All failed -> Unknown (we had a ticker, but couldn't get price/exchange)
  return unknownState;
}
