"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { Spinner } from "./ui/Spinner";
import { cn } from "@/lib/utils/cn";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus
    inputRef.current?.focus();
    
    // Load recent
    const stored = localStorage.getItem("verdict_recent_searches");
    if (stored) {
      try {
        setRecent(JSON.parse(stored).slice(0, 3));
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = (overrideQuery ?? query).trim();
    
    if (!targetQuery) {
      setError("Please enter a company name.");
      return;
    }

    setError("");
    setLoading(true);

    // Save to recent
    const newRecent = [targetQuery, ...recent.filter(q => q !== targetQuery)].slice(0, 3);
    setRecent(newRecent);
    localStorage.setItem("verdict_recent_searches", JSON.stringify(newRecent));

    router.push('/analysis/' + encodeURIComponent(targetQuery));
  };

  const removeRecent = (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    const newRecent = recent.filter(item => item !== q);
    setRecent(newRecent);
    localStorage.setItem("verdict_recent_searches", JSON.stringify(newRecent));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form 
        onSubmit={handleSubmit}
        className="relative w-full flex items-center"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          placeholder="Enter company name (e.g. Tesla, Stripe, Zepto)"
          className={cn(
            "w-full h-14 pl-6 pr-14 bg-black/20 border border-white/10 rounded-xl",
            "text-brand-on-background placeholder:text-brand-on-surface-variant/50 text-lg",
            "focus:outline-none focus:border-indigo/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
            "transition-all duration-300 disabled:opacity-50",
            error && "border-brand-error focus:border-brand-error focus:shadow-none"
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo hover:text-white hover:bg-indigo/20 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-indigo"
        >
          {loading ? <Spinner size="md" className="text-indigo" /> : <ArrowRight className="w-6 h-6" />}
        </button>
      </form>
      
      {error && (
        <span className="text-brand-error text-sm mt-2 font-medium">{error}</span>
      )}

      {recent.length > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
          <span className="text-xs font-mono text-brand-outline mr-1">Recent:</span>
          {recent.map((q) => (
            <button
              key={q}
              onClick={() => handleSubmit(undefined, q)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface-variant/50 border border-white/5 rounded-full text-sm text-brand-on-surface-variant hover:text-primary hover:bg-brand-surface-variant transition-colors group"
            >
              <span>{q}</span>
              <div 
                onClick={(e) => removeRecent(e, q)}
                className="opacity-50 hover:opacity-100 hover:text-brand-error transition-all"
              >
                <X className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
