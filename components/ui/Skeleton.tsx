import React from "react";
import { cn } from "@/lib/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded",
    card: "h-32 w-full rounded-lg",
    circle: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={cn(
        "bg-brand-surface-variant animate-shimmer relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
