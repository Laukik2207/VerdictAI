import React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "invest" | "pass" | "neutral" | "running";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variants = {
    invest: "bg-verdict-invest/10 text-verdict-invest border-verdict-invest/20",
    pass: "bg-verdict-pass/10 text-verdict-pass border-verdict-pass/20",
    neutral: "bg-brand-surface-variant text-brand-on-surface border-white/10",
    running: "bg-indigo/10 text-indigo border-indigo/20 animate-pulse",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
