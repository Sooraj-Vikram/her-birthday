/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Design tokens for "watercolor dreamy garden" direction
        parchment: "#F7F1E8", // base background
        blush: "#E8B4B8", // primary flower / accent pink
        sage: "#8A9B7E", // secondary accent, stems & leaves
        gold: "#C9A86A", // flower 7 glow, unlock moments
        ink: "#3D3226", // body text
        dusk: "#6B5B73", // ending / evening palette
      },
      fontFamily: {
        // Handwritten style reserved for titles only, per brief
        hand: ["Caveat", "cursive"],
        serif: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: 0 },
          "10%": { opacity: 1 },
          "100%": { transform: "translateY(-120px) translateX(20px)", opacity: 0 },
        },
      },
      animation: {
        sway: "sway 6s ease-in-out infinite",
        drift: "drift 8s ease-in infinite",
      },
    },
  },
  plugins: [],
};
