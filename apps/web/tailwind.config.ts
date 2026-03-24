import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yi Wu luxury palette
        ink: {
          DEFAULT: "#0C0B0A",
          50:  "#FAF8F5",
          100: "#F0EDE8",
          200: "#D8D3CC",
          300: "#B8B0A5",
          400: "#8A8078",
          500: "#6B6560",
          600: "#4A4540",
          700: "#2C2926",
          800: "#1A1816",
          900: "#0C0B0A",
        },
        gold: {
          DEFAULT: "#C4A96D",
          light:   "#DFC48C",
          dark:    "#9A7A42",
          muted:   "#8A7455",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          dark:    "#F0EBE2",
        },
        // Keep primary for app pages (less prominent)
        primary: {
          DEFAULT: "#C4A96D",
          600: "#C4A96D",
          700: "#9A7A42",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["6rem",   { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display":    ["3.5rem", { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
        "headline":   ["2rem",   { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        "widest-luxury": "0.25em",
        "wide-luxury":   "0.15em",
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1.2s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
