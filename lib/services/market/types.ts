export type MarketState = "OPEN" | "CLOSED" | "PREMARKET" | "AFTER_HOURS" | "PRIVATE" | "UNKNOWN";

export interface MarketData {
  company: string;
  ticker: string | null;
  exchange: string | null;
  exchangeCountry: string | null;
  price: number | null;
  localCurrency: string | null;
  convertedPrices: {
    USD: number | null;
    INR: number | null;
    EUR: number | null;
  };
  change: number | null;
  changePct: number | null;
  marketState: MarketState;
  updatedAt: number;
}
