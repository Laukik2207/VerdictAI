export interface FinancialOverview {
  marketCap: string;
  sector: string;
  industry: string;
  peRatio: string;
  profitMargin: string;
  revenueGrowth: string;
  debtToEquity: string;
  roe: string;
  description: string;
}

export async function fetchFinancialOverview(ticker: string): Promise<FinancialOverview | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.warn("Alpha Vantage API key missing. Skipping financial overview fetch.");
    return null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;
    const res = await fetch(url, {
      next: { revalidate: Number(process.env.FINANCE_CACHE_TTL) || 86400 },
    });

    if (!res.ok) {
      console.error(`Alpha Vantage returned ${res.status}`);
      return null;
    }

    const data = await res.json();
    
    // Alpha Vantage returns empty object {} if ticker is not found
    if (!data || Object.keys(data).length === 0 || !data.Symbol) {
      return null;
    }

    return {
      marketCap: data.MarketCapitalization || "Unknown",
      sector: data.Sector || "Unknown",
      industry: data.Industry || "Unknown",
      peRatio: data.PERatio || "Unknown",
      profitMargin: data.ProfitMargin || "Unknown",
      revenueGrowth: data.QuarterlyRevenueGrowthYOY || "Unknown",
      debtToEquity: data.DebtToEquity || "Unknown",
      roe: data.ReturnOnEquityTTM || "Unknown",
      description: data.Description || "No description available.",
    };
  } catch (error) {
    console.error("Financial overview fetch failed:", error);
    return null;
  }
}
