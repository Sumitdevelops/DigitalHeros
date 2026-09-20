import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Disable dark mode completely - keep original light theme only
  darkMode: [] as unknown as "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D7C7F",
          hover: "#0A6568",
          light: "#E0F7F7",
          dark: "#084F51",
        },
        gold: {
          DEFAULT: "#D4A856",
          hover: "#BD9343",
          light: "#FFF9E6",
          dark: "#9E782A",
        },
        charity: {
          DEFAULT: "#FF6B35",
          hover: "#E85620",
          light: "#FFE5D9",
          dark: "#C7420E",
        },
        neutral: {
          dark: "#1A1A2E",
          gray: "#6B7280",
          light: "#F3F4F6",
          card: "#FFFFFF",
          border: "rgba(107, 114, 128, 0.2)",
          slate: {
            900: "#0B0F15",
            800: "#121824",
            700: "#1B2433",
            600: "#2A364F",
          }
        },
        status: {
          success: "#10B981",
          pending: "#3B82F6",
          warning: "#F59E0B",
          error: "#EF4444",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "JetBrains Mono",
          "monospace",
        ],
      },
      spacing: {
        "space-1": "8px",
        "space-2": "16px",
        "space-3": "24px",
        "space-4": "32px",
        "space-5": "48px",
        "space-6": "64px",
        "space-7": "80px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.1)",
        cardHover: "0 4px 12px rgba(13,124,127,0.15)",
        goldGlow: "0 4px 16px rgba(212,168,86,0.25)",
        tealGlow: "0 4px 16px rgba(13,124,127,0.25)",
        charityGlow: "0 4px 16px rgba(255,107,53,0.25)",
      },
      borderRadius: {
        standard: "8px",
        card: "8px",
        modal: "12px",
      }
    },
  },
  plugins: [],
};

export default config;
