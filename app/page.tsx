"use client";

import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils/cn";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setMounted(true);
    } else {
      // Small delay to ensure smooth paint before animation
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-brand-background overflow-hidden px-4">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      
      {/* Radial Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8">
        
        {/* Wordmark & Tagline */}
        <div className="space-y-4">
          <h1 
            className={cn(
              "font-display text-5xl md:text-7xl text-white tracking-tight",
              "transition-all duration-[400ms] ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span className="font-normal">Verdict</span>
            <span className="font-bold text-indigo drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">AI</span>
          </h1>
          
          <p 
            className={cn(
              "text-lg md:text-xl font-medium text-brand-on-surface-variant",
              "transition-all duration-[400ms] delay-100 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            The AI Investment Committee
          </p>
        </div>

        {/* Search Bar Container */}
        <div 
          className={cn(
            "w-full md:w-[60%] pt-4",
            "transition-all duration-[400ms] delay-200 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <SearchBar />
        </div>

        {/* Hint Text */}
        <p 
          className={cn(
            "text-xs font-mono text-brand-outline pt-8",
            "transition-all duration-[400ms] delay-300 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Analyzes public and private companies — powered by Gemini
        </p>
      </div>
    </main>
  );
}
