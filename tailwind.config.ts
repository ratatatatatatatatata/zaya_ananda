import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        cream: "#FBF8F3",
        ink: "#1C1830",
        muted: "#6B6580",
        line: "#ECE6DD",
        primary: {
          50: "#F2EEFF", 100: "#E6DEFF", 200: "#CDBCFF", 300: "#B49BFF",
          400: "#9B79FB", 500: "#7C5CF2", 600: "#6D4AE0", 700: "#5A3CC0",
          800: "#472F99", 900: "#2F1F66", DEFAULT: "#6D4AE0",
        },
        accent: {
          50: "#FBF4E2", 100: "#F6E8C2", 200: "#EFD68C", 300: "#E6C25A",
          400: "#D8B24A", 500: "#C99A2E", 600: "#A87E22", 700: "#85631C",
          DEFAULT: "#C99A2E",
        },
        jade: { 400: "#3FC9B0", 500: "#23B49A", 600: "#179680", DEFAULT: "#23B49A" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.75rem" },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28,24,48,0.18)",
        card: "0 6px 28px -10px rgba(28,24,48,0.14)",
        lift: "0 22px 60px -22px rgba(45,31,102,0.40)",
        glow: "0 0 70px -12px rgba(124,92,242,0.45)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(60% 70% at 15% 20%, rgba(124,92,242,0.35) 0%, transparent 60%), radial-gradient(55% 60% at 85% 15%, rgba(201,154,46,0.28) 0%, transparent 55%), radial-gradient(70% 80% at 70% 90%, rgba(35,180,154,0.22) 0%, transparent 60%)",
        "primary-grad": "linear-gradient(135deg, #7C5CF2 0%, #6D4AE0 45%, #5A3CC0 100%)",
        "gold-grad": "linear-gradient(135deg, #E6C25A 0%, #C99A2E 100%)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        spinSlow: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        floaty: "floaty 7s ease-in-out infinite",
        spinSlow: "spinSlow 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
