import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        pocifico: ["Pacifico", "cursive"],
        alegreya: ["var(--font-alegreya)", "serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        sans: ["var(--font-oswald)", "sans-serif"],
        serif: ["var(--font-alegreya)", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0b3393",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-draw-horizontal": {
          "0%": { width: "0%" },
          "50%": { width: "100%" },
          "100%": { width: "0%" },
        },
        "border-draw-vertical": {
          "0%": { height: "0%" },
          "50%": { height: "100%" },
          "100%": { height: "0%" },
        },
        "shimmer-continuous": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        breathing: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.98)" },
          "50%": { opacity: "0.8", transform: "scale(1)" },
        },
        "gradient-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "border-draw-top": {
          "0%": { left: "0", width: "0%" },
          "25%": { left: "0", width: "100%" },
          "75%": { left: "100%", width: "0%" },
          "100%": { left: "100%", width: "0%" },
        },
        "border-draw-right": {
          "0%": { top: "0", height: "0%" },
          "25%": { top: "0", height: "100%" },
          "75%": { top: "100%", height: "0%" },
          "100%": { top: "100%", height: "0%" },
        },
        "border-draw-bottom": {
          "0%": { right: "0", width: "0%" },
          "25%": { right: "0", width: "100%" },
          "75%": { right: "100%", width: "0%" },
          "100%": { right: "100%", width: "0%" },
        },
        "border-draw-left": {
          "0%": { bottom: "0", height: "0%" },
          "25%": { bottom: "0", height: "100%" },
          "75%": { bottom: "100%", height: "0%" },
          "100%": { bottom: "100%", height: "0%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-draw-horizontal":
          "border-draw-horizontal 2.8s ease-in-out infinite",
        "border-draw-vertical":
          "border-draw-vertical 2.8s ease-in-out infinite",
        "shimmer-continuous": "shimmer-continuous 3s ease-in-out infinite",
        breathing: "breathing 3s ease-in-out infinite",
        "gradient-flow": "gradient-flow 4s ease-in-out infinite",
        "border-draw-top": "border-draw-top 4s linear infinite",
        "border-draw-right": "border-draw-right 4s linear infinite",
        "border-draw-bottom": "border-draw-bottom 4s linear infinite",
        "border-draw-left": "border-draw-left 4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
