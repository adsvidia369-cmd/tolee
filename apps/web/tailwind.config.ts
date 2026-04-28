import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "#e8f1e4",
        foreground: "#042c42",
        primary: {
          DEFAULT: "#042c42",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#dbaf1c",
          foreground: "#042c42",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "#c9e4db",
          foreground: "#7c9e95",
        },
        accent: {
          DEFAULT: "#dbaf1c",
          foreground: "#042c42",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#042c42",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#042c42",
        },
        tolee: {
          DEFAULT: "#042c42",
          light: "#c9e4db",
          medium: "#7c9e95",
          foreground: "#ffffff",
        },
        brand: {
          DEFAULT: "#042c42",
          foreground: "#ffffff",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
