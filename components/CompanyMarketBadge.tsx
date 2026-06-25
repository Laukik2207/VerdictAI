"use client";

import React from "react";
import { useMarket } from "@/hooks/useMarket";
import { formatCurrency, CurrencyCode } from "@/lib/utils/currency";
import { Skeleton } from "./ui/Skeleton";
import { cn } from "@/lib/utils/cn";

interface CompanyMarketBadgeProps {
  company: string;
}

const CURRENCIES: CurrencyCode[] = ["USD", "INR", "EUR"];

export function CompanyMarketBadge({ company }: CompanyMarketBadgeProps) {
  const { data, isLoading, currency, setCurrency } = useMarket(company);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 ml-4">
        <Skeleton className="w-12 h-5 bg-white/5 rounded" />
        <Skeleton className="w-16 h-5 bg-white/5 rounded" />
      </div>
    );
  }

  // If we couldn't get data or it's explicitly private
  if (!data || data.marketState === "PRIVATE" || data.marketState === "UNKNOWN" || !data.convertedPrices) {
    const isUnknown = !data || data.marketState === "UNKNOWN";
    return (
      <div className="flex items-center space-x-2 ml-4">
        <span className="px-1.5 py-0.5 rounded bg-white/5 text-text-muted text-[10px] font-mono uppercase border border-white/5">
          {isUnknown ? "MARKET DATA UNAVAILABLE" : "PRIVATE"}
        </span>
      </div>
    );
  }

  const handleCurrencyToggle = () => {
    const currentIndex = CURRENCIES.indexOf(currency);
    const nextIndex = (currentIndex + 1) % CURRENCIES.length;
    setCurrency(CURRENCIES[nextIndex]);
  };

  const currentPrice = data.convertedPrices[currency];
  
  // Format change percentage
  const isPositive = data.changePct !== null && data.changePct >= 0;
  const changeColor = isPositive ? "text-[#00D4A0]" : "text-red-500";
  const changeArrow = isPositive ? "▲" : "▼";
  const changeText = data.changePct !== null ? `${Math.abs(data.changePct).toFixed(2)}%` : "";

  // Market status color
  let statusColor = "bg-gray-500";
  switch (data.marketState) {
    case "OPEN": statusColor = "bg-[#00D4A0]"; break;
    case "CLOSED": statusColor = "bg-gray-500"; break;
    case "PREMARKET": statusColor = "bg-amber-500"; break;
    case "AFTER_HOURS": statusColor = "bg-blue-500"; break;
  }

  return (
    <div className="flex items-center space-x-3 ml-4">
      {/* Exchange Badge */}
      <span className="px-1.5 py-0.5 rounded bg-white/10 text-text-secondary text-[10px] font-mono uppercase">
        {data.exchange || "UNKNOWN"}
      </span>

      {/* Live Price & Change */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-mono font-medium text-white">
          {formatCurrency(currentPrice, currency)}
        </span>
        {changeText && (
          <span className={cn("text-[10px] font-mono", changeColor)}>
            {changeArrow} {changeText}
          </span>
        )}
      </div>

      {/* Market Status Dot */}
      <div className="flex items-center" title={`Market: ${data.marketState}`}>
        <div className={cn("w-2 h-2 rounded-full", statusColor)} />
      </div>

      {/* Currency Toggle */}
      <button 
        onClick={handleCurrencyToggle}
        title="Switch Currency"
        className="px-1.5 py-0.5 rounded border border-white/10 text-text-muted hover:text-white hover:bg-white/5 transition-colors text-[10px] font-mono"
      >
        {currency}
      </button>
    </div>
  );
}
