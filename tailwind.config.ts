import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        xrock: {
          red: {
            DEFAULT: "#F83838",
            dark: "#980000",
            crimson: "#F00038",
          },
          black: "#080808",
          white: "#FFFFFF",
          gray: {
            50: "#F7F7F7",
            100: "#E8E8E8",
            300: "#D1D1D1",
            600: "#666666",
            800: "#262626",
            950: "#111111",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1280px",
        article: "760px",
      },
      borderRadius: {
        card: "14px",
        control: "9px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 12px -2px rgba(8, 8, 8, 0.05), 0 2px 6px -1px rgba(8, 8, 8, 0.03)",
        glow: "0 0 20px -3px rgba(248, 56, 56, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

