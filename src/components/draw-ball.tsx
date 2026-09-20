import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DrawBallProps {
  number: number;
  isMatched?: boolean;
  size?: "sm" | "md" | "lg";
  delayMs?: number;
  highlightBest?: boolean;
}

export function DrawBall({
  number,
  isMatched = false,
  size = "md",
  delayMs = 0,
  highlightBest = false,
}: DrawBallProps) {
  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg sm:text-xl",
  };

  return (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={cn(
        "relative rounded-full flex items-center justify-center font-mono font-bold select-none transition-all duration-300 shadow-sm animate-in zoom-in-75",
        sizeClasses[size],
        isMatched
          ? "bg-gradient-to-br from-gold to-amber-500 text-neutral-dark border-2 border-amber-300 shadow-goldGlow scale-105"
          : highlightBest
          ? "bg-gradient-to-br from-amber-400 to-gold text-neutral-dark border-2 border-amber-200 shadow-goldGlow"
          : "bg-white text-neutral-dark border-2 border-neutral-gray/25 hover:border-primary"
      )}
    >
      <span>{number}</span>

      {isMatched && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-success text-white rounded-full flex items-center justify-center shadow-xs text-[9px]">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
    </div>
  );
}
