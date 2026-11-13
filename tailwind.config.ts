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
        // Цвета акцента задаются CSS-переменными: у каждого заведения своя палитра (app/globals.css)
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-dark": "rgb(var(--c-accent-dark) / <alpha-value>)",
        "accent-soft": "rgb(var(--c-accent-soft) / <alpha-value>)",
        logo: "rgb(var(--c-logo) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
      boxShadow: {
        glow: "0 0 40px rgb(var(--c-accent) / 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;