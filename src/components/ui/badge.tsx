import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "pending" | "warning" | "error" | "teal" | "gold" | "charity" | "neutral";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "neutral", size = "sm", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full tracking-wide uppercase font-mono";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-4 gap-1",
    md: "px-2.5 py-1 text-xs leading-4 gap-1.5",
  };

  const variantStyles = {
    success: "bg-emerald-50 dark:bg-emerald-950/40 text-status-success border border-status-success/30",
    pending: "bg-blue-50 dark:bg-blue-950/40 text-status-pending border border-status-pending/30",
    warning: "bg-amber-50 dark:bg-amber-950/40 text-status-warning border border-status-warning/30",
    error: "bg-red-50 dark:bg-red-950/40 text-status-error border border-status-error/30",
    teal: "bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/30",
    gold: "bg-gold-light dark:bg-gold/15 text-gold-dark dark:text-gold border border-gold/40",
    charity: "bg-charity-light dark:bg-charity/15 text-charity-dark dark:text-charity border border-charity/30",
    neutral: "bg-neutral-light dark:bg-white/10 text-neutral-gray dark:text-neutral-300 border border-neutral-gray/20 dark:border-white/10",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
