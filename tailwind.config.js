/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 6%)",
        foreground: "hsl(210 40% 96%)",
        card: "hsl(222 47% 9%)",
        "card-foreground": "hsl(210 40% 96%)",
        primary: "hsl(199 89% 48%)",
        "primary-foreground": "hsl(0 0% 100%)",
        secondary: "hsl(222 30% 14%)",
        "secondary-foreground": "hsl(210 40% 96%)",
        muted: "hsl(222 30% 14%)",
        "muted-foreground": "hsl(215 20% 55%)",
        accent: "hsl(160 84% 39%)",
        "accent-foreground": "hsl(0 0% 100%)",
        destructive: "hsl(0 72% 51%)",
        "destructive-foreground": "hsl(0 0% 98%)",
        border: "hsl(222 30% 16%)",
        profit: "hsl(160 84% 39%)",
        loss: "hsl(0 72% 51%)",
        warning: "hsl(45 93% 47%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "spin-slow": "spin 1s linear infinite",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}