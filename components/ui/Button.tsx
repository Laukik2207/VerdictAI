import React from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none rounded";
    
    const variants = {
      primary: "bg-accent text-white hover:bg-opacity-90",
      ghost: "bg-transparent text-brand-on-background hover:bg-brand-surface-variant",
      danger: "bg-transparent border border-brand-error text-brand-error hover:bg-brand-error hover:text-white",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
