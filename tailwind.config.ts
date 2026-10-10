import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bazar: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        rise: {
          bg: "#ecfdf5",
          text: "#047857",
          border: "#a7f3d0",
        },
        fall: {
          bg: "#fef2f2",
          text: "#b91c1c",
          border: "#fecaca",
        },
      },
      fontFamily: {
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
