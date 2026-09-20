"use client";

import React from "react";

export type Theme = "light" | "dark" | "system";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return {
    theme: "light" as Theme,
    resolvedTheme: "light" as Theme,
    setTheme: (_theme: Theme) => {},
    toggleTheme: () => {},
  };
}
