import { MarketData } from "./types";
import { getExchangeRates, convertCurrency } from "@/lib/utils/currency";

export async function fetchAlphaVantageMarketData(company: string, ticker: string): Promise<MarketData | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.log("Alpha Vantage skipped: Missing API key");
    return null;
  }

  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Alpha Vantage API returned ${res.status}`);

    const data = await res.json();
    const quote = data?.["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return null;
    }

    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"]);
    const changePctStr = quote["10. change percent"] || "0%";
    const changePct = parseFloat(changePctStr.replace("%", ""));
    const localCurrency = "USD"; // Alpha vantage global quote doesn't explicitly return currency

    const rates = await getExchangeRates();
    const convertedPrices = {
      USD: convertCurrency(price, localCurrency, "USD", rates),
      INR: convertCurrency(price, localCurrency, "INR", rates),
      EUR: convertCurrency(price, localCurrency, "EUR", rates),
    };

    return {
      company,
      ticker,
      exchange: "Alpha Vantage",
      exchangeCountry: "US",
      price,
      localCurrency,
      convertedPrices,
      change,
      changePct,
      marketState: "OPEN", // Alpha Vantage doesn't provide real-time state in this endpoint easily
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Alpha Vantage fetch failed:", error);
    return null;
  }
}
