export interface YahooQuote {
  exchange: string;
  shortname: string;
  quoteType: string;
  symbol: string;
  score: number;
  typeDisp: string;
  longname: string;
}

export async function resolveTickerWithRanking(company: string): Promise<string | null> {
  const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(company)}`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error(`Search failed with status: ${res.status}`);
  }

  const data = await res.json();
  const quotes: YahooQuote[] = data?.quotes || [];
    
    if (quotes.length === 0) return null;

    // Filter out unrelated types early if needed, or just let scoring handle it
    const validQuotes = quotes.filter(q => q.quoteType === "EQUITY" || q.quoteType === "ETF");

    if (validQuotes.length === 0) return null;

    let bestScore = -Infinity;
    let bestQuote: YahooQuote | null = null;

    const targetCompanyLower = company.toLowerCase();

    for (const q of validQuotes) {
      let score = 0;
      const shortNameLower = (q.shortname || "").toLowerCase();
      const longNameLower = (q.longname || "").toLowerCase();
      const symbolLower = (q.symbol || "").toLowerCase();
      const exchange = (q.exchange || "").toUpperCase();

      // +100 exact company name (or very close prefix)
      if (shortNameLower === targetCompanyLower || longNameLower === targetCompanyLower) {
        score += 100;
      } else if (shortNameLower.includes(targetCompanyLower) || longNameLower.includes(targetCompanyLower)) {
        score += 50;
      } else {
        score -= 100; // unrelated
      }

      // +50 exchange known
      if (exchange) {
        score += 50;
      }

      // +40 listed market (Prefer order: NSE, BSE, NASDAQ, NYSE, LSE, TSE)
      if (["NSI", "NSE", "BSE", "NMS", "NASDAQ", "NYQ", "NYSE", "LSE", "TSE"].includes(exchange)) {
        score += 40;
      }

      // Prefer Indian markets explicitly
      if (q.symbol.endsWith(".NS")) {
        score += 60; // Extra boost for NSE
      } else if (q.symbol.endsWith(".BO")) {
        score += 30; // Fallback for BSE
      }

      // +20 symbol similarity (if symbol matches start of company name)
      if (targetCompanyLower.startsWith(symbolLower.replace(".ns", "").replace(".bo", ""))) {
        score += 20;
      }

      // -50 ETF
      if (q.quoteType === "ETF") {
        score -= 50;
      }

      // -50 crypto
      if (q.quoteType === "CRYPTOCURRENCY") {
        score -= 50;
      }

      if (score > bestScore) {
        bestScore = score;
        bestQuote = q;
      }
    }

    if (bestQuote) {
      console.log(`[DEBUG] Company: ${company} | Ticker: ${bestQuote.symbol} | Exchange: ${bestQuote.exchange} | Confidence: ${bestScore}`);
      return bestQuote.symbol;
    }

    return null;
}
