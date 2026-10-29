import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        coal: "#111111",
        snow: "#FFFFFF",
        accent: "#F113F1",
        "accent-dark": "#B90EB9",
        "accent-soft": "#F55CF5",
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(241, 19, 241, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;