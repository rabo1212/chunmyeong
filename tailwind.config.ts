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
          // 배경 (순수 블랙 — A24 스타일)
          bg: "#000000",
          surface: "#0a0a0a",
          card: "#111111",
          elevated: "#1a1a1a",
          // 텍스트 (크림 화이트)
          text: "#f0ede6",
          muted: "#8a8680",
          dim: "#4a4744",
          // 악센트 (골드 크림)
          accent: "#d4c5a0",
          "accent-soft": "#b8a882",
          cream: "#f5f0e8",
          gold: "#d4c5a0",
          red: "#ef4444",
          // 하위 호환
          ivory: "#f5f0e8",
          navy: "#000000",
          deep: "#0a0a0a",
          beige: "#8a8680",
          charcoal: "#1a1a1a",
        },
        oheng: {
          wood: "#4ade80",
          fire: "#f87171",
          earth: "#fbbf24",
          metal: "#e2e8f0",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 197, 160, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 197, 160, 0.3)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #d4c5a0 0%, #b8a882 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
