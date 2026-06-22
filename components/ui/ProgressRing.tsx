"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ProgressRingProps extends React.SVGProps<SVGSVGElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 4,
  colorClass = "text-indigo",
  className,
  ...props
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - ((mounted ? value : 0) / 100) * circumference;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      className={cn("transform -rotate-90", className)}
      {...props}
    >
      <circle
        className="text-brand-surface-variant"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={cn("transition-all duration-1000 ease-out", colorClass)}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}
