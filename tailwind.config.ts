import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Photo Tak palette: warm paper, editorial ink, crimson accent, sand highlight
        paper: "#faf8f4",
        cloud: "#f1ece3",
        ink: "#1b1a17",
        charcoal: "#1a1a1c",
        coal: "#242427",
        crimson: "#c0392b",
        crimsonsoft: "#d64a3b",
        sand: "#c9a26b",
        muted: "#6f6a61",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 34px -18px rgba(27,26,23,0.35)",
        lift: "0 26px 50px -24px rgba(27,26,23,0.45)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
