import type { Config } from "tailwindcss";

/** Semantic token helper — keeps Tailwind opacity modifiers (bg-x/40) working. */
const t = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        // Гадаргуу — :root дээр цайвар, .night дотор гүн (app/tokens.css)
        cream: t("--c-cream"),
        ivory: t("--c-ivory"),
        aqua: t("--c-aqua"),
        ink: t("--c-ink"),
        muted: t("--c-muted"),
        line: t("--c-line"),
        surface: {
          1: t("--c-s1"),
          2: t("--c-s2"),
          3: t("--c-s3"),
          4: t("--c-s4"),
          5: t("--c-s5"),
        },
        primary: {
          50: t("--c-p50"),
          100: t("--c-p100"),
          200: t("--c-p200"),
          300: t("--c-p300"),
          400: t("--c-p400"),
          500: t("--c-p500"),
          600: t("--c-p600"),
          700: t("--c-p700"),
          800: t("--c-p800"),
          900: t("--c-p900"),
          DEFAULT: t("--c-p500"),
        },
        accent: {
          50: t("--c-a50"),
          100: t("--c-a100"),
          200: t("--c-a200"),
          300: t("--c-a300"),
          400: t("--c-a400"),
          500: t("--c-a500"),
          600: t("--c-a600"),
          700: t("--c-a700"),
          DEFAULT: t("--c-a300"),
        },
        jade: {
          400: t("--c-j400"),
          500: t("--c-j500"),
          600: t("--c-j600"),
          DEFAULT: t("--c-j500"),
        },
        deep: {
          600: t("--c-d600"),
          700: t("--c-d700"),
          800: t("--c-d800"),
          DEFAULT: t("--c-d600"),
        },
        // Чимэглэлийн өнгө — хоёр сэдэвт ижил (ихэвчлэн тунгалаг гэрэлтэлт)
        blue: { 300: "#8FB4F0", 400: "#5E8DE0", 500: "#3B6FD4", 600: "#2C57AE", 700: "#274C9A", 900: "#1B3568", DEFAULT: "#3B6FD4" },
        grape: { 200: "#E4D6FF", 300: "#C9A8FF", 400: "#9B6EF0", 500: "#8454D8", 600: "#6B40B4", 700: "#56309A", DEFAULT: "#8454D8" },
        lavender: { 100: "#F3EFFF", 200: "#ECE6FF", 300: "#DCD0FF", 400: "#C6B4FA", DEFAULT: "#DCD0FF" },
        blush: { 100: "#FDEEF4", 200: "#FBDCE8", 300: "#F7BFD4", 400: "#F09CBC", 500: "#E97BA8", DEFAULT: "#F09CBC" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: { xl2: "1.125rem", "4xl": "2rem", "5xl": "2.75rem" },
      boxShadow: {
        soft: "0 12px 44px -16px rgb(var(--shadow-tint) / 0.22)",
        card: "0 10px 34px -14px rgb(var(--shadow-tint) / 0.18)",
        lift: "0 26px 64px -24px rgb(var(--shadow-tint) / 0.30)",
        glow: "0 0 64px -12px rgb(var(--c-p500) / 0.45)",
        "glow-grape": "0 0 64px -14px rgba(132,84,216,0.40)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(50% 55% at 10% 8%, rgb(var(--c-p500) / 0.14) 0%, transparent 60%), radial-gradient(45% 50% at 92% 6%, rgba(155,110,240,0.10) 0%, transparent 58%), radial-gradient(50% 55% at 78% 100%, rgba(240,156,188,0.10) 0%, transparent 60%), radial-gradient(40% 45% at 40% 90%, rgb(var(--c-a300) / 0.08) 0%, transparent 60%)",
        cosmic: "linear-gradient(160deg, #0B1020 0%, #0E1830 35%, #0F2130 70%, #0B1020 100%)",
        "primary-grad": "var(--grad-primary)",
        "magic-grad": "var(--grad-magic)",
        "gold-grad": "var(--grad-gold)",
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
