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
          // 배경 (웜 베이지)
          bg: "#f5f0e8",
          surface: "#ece5d9",
          card: "#e8e0d2",
          elevated: "#dfd6c6",
          // 텍스트 (다크 브라운)
          text: "#2c2825",
          muted: "#4a4540",
          dim: "#6b6560",
          // 악센트 (딥 골드)
          accent: "#8b7748",
          "accent-soft": "#a08c5a",
          cream: "#f5f0e8",
          gold: "#8b7748",
          red: "#c53030",
          // 하위 호환
          ivory: "#f5f0e8",
          navy: "#2c2825",
          deep: "#ece5d9",
          beige: "#6b6560",
          charcoal: "#dfd6c6",
        },
        oheng: {
          wood: "#4ade80",
          fire: "#f87171",
          earth: "#fbbf24",
          metal: "#4b5563",
          water: "#60a5fa",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-kr)", "serif"],
        sans: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 119, 72, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 119, 72, 0.3)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #8b7748 0%, #a08c5a 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
