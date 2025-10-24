/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ff00ff",
          purple: "#8000FF",
          cyan: "#00FFFF",
          yellow: "#FFFF00",
          blue: "#0080FF",
          green: "#00FF41",
        },
        "dark-bg": "#131a24",
        "terminal-bg": "#131a24",
        "terminal-border": "#C8C8C8",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        terminal: ["'Courier New'", "monospace"],
      },
      animation: {
        flicker: "flicker 1.5s infinite alternate",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        flicker: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0.8 },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 0, 128, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 0, 128, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
