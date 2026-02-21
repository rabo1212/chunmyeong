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
        cm: {
          navy: "#1a1a2e",
          deep: "#16213e",
          beige: "#e2d9c8",
          gold: "#c9a96e",
          ivory: "#faf8f5",
          red: "#d4483b",
          charcoal: "#2d2d2d",
        },
        oheng: {
          wood: "#4a7c59",
          fire: "#d4483b",
          earth: "#c9a96e",
          metal: "#e8e8e8",
          water: "#2c5f7c",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-kr)", "serif"],
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201, 169, 110, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(201, 169, 110, 0.5)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
