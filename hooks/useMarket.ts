import { useState, useEffect } from "react";
import { MarketData } from "@/lib/services/market/types";
import { CurrencyCode } from "@/lib/utils/currency";

const CURRENCY_STORAGE_KEY = "verdict_currency";

export function useMarket(company: string) {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Default to USD but check localStorage on mount
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
    if (saved && ["USD", "INR", "EUR"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchMarket() {
      if (!company) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/market/${encodeURIComponent(company)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch market data");
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMarket();

    return () => {
      isMounted = false;
    };
  }, [company]);

  return {
    data,
    isLoading,
    error,
    currency,
    setCurrency,
  };
}
