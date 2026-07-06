import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        // Нүүр хуудасны кино маягийн гүн өнгөний палитр
        cream: "#0F1828", ivory: "#0D1524", aqua: "#132030",
        ink: "#E9F2F0", muted: "#9FB6B2", line: "#233349",
        primary: { 50: "#10262C", 100: "#14403F", 200: "#A4E9E1", 300: "#7CDCD2", 400: "#36C6BA", 500: "#16AFA4", 600: "#4CC8BD", 700: "#7CDCD2", 800: "#A9EAE3", 900: "#103F3C", DEFAULT: "#16AFA4" },
        accent: { 50: "#2A2412", 100: "#3D3517", 200: "#EBD392", 300: "#DFBC5E", 400: "#E3BE62", 500: "#DFBC5E", 600: "#EBD392", 700: "#F5E8C4", DEFAULT: "#DFBC5E" },
        deep: { 600: "#9FE0DA", 700: "#B9EBE6", 800: "#CDF2EE", DEFAULT: "#9FE0DA" },
        jade: { 400: "#34BBA2", 500: "#1B9E86", 600: "#14806C", DEFAULT: "#1B9E86" },
        blue: { 300: "#8FB4F0", 400: "#5E8DE0", 500: "#3B6FD4", 600: "#2C57AE", 700: "#274C9A", 900: "#1B3568", DEFAULT: "#3B6FD4" },
        grape: { 200: "#E4D6FF", 300: "#C9A8FF", 400: "#B488FB", 500: "#9B6EF0", 600: "#8454D8", 700: "#6B40B4", DEFAULT: "#9B6EF0" },
        lavender: { 200: "#ECE6FF", 300: "#DCD0FF", 400: "#C6B4FA", DEFAULT: "#DCD0FF" },
        blush: { 200: "#FBDCE8", 300: "#F7BFD4", 400: "#F09CBC", 500: "#E97BA8", DEFAULT: "#F09CBC" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: { "xl2": "1.125rem", "4xl": "2rem", "5xl": "2.75rem" },
      boxShadow: {
        soft: "0 12px 44px -16px rgba(16,92,87,0.22)",
        card: "0 10px 34px -14px rgba(16,92,87,0.20)",
        lift: "0 26px 64px -24px rgba(16,92,87,0.32)",
        glow: "0 0 64px -12px rgba(22,175,164,0.5)",
        "glow-grape": "0 0 64px -14px rgba(155,110,240,0.5)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(50% 55% at 10% 8%, rgba(22,175,164,0.20) 0%, transparent 60%), radial-gradient(45% 50% at 92% 6%, rgba(155,110,240,0.16) 0%, transparent 58%), radial-gradient(50% 55% at 78% 100%, rgba(240,156,188,0.16) 0%, transparent 60%), radial-gradient(40% 45% at 40% 90%, rgba(184,145,47,0.10) 0%, transparent 60%)",
        cosmic:
          "linear-gradient(160deg, #0B1020 0%, #0E1830 35%, #0F2130 70%, #0B1020 100%)",
        "primary-grad": "linear-gradient(135deg, #2BC8BB 0%, #16AFA4 45%, #0F9189 100%)",
        "magic-grad": "linear-gradient(120deg, #16AFA4 0%, #5E8DE0 38%, #9B6EF0 68%, #F09CBC 100%)",
        "gold-grad": "linear-gradient(135deg, #DFBC5E 0%, #B8912F 100%)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(22px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        spinSlow: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        ripple: { "0%": { transform: "scale(0.85)", opacity: "0.55" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        driftUp: { "0%": { transform: "translateY(0)", opacity: "0" }, "12%": { opacity: "1" }, "88%": { opacity: "1" }, "100%": { transform: "translateY(-120px)", opacity: "0" } },
        glowPulse: { "0%,100%": { opacity: "0.5", transform: "scale(1)" }, "50%": { opacity: "0.9", transform: "scale(1.05)" } },
        gradientShift: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
        floaty: "floaty 8s ease-in-out infinite",
        spinSlow: "spinSlow 70s linear infinite",
        ripple: "ripple 7s ease-out infinite",
        driftUp: "driftUp 16s linear infinite",
        glowPulse: "glowPulse 7s ease-in-out infinite",
        gradientShift: "gradientShift 14s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
