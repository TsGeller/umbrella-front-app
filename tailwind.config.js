/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Ton ancienne base
        dark: "#0D1117",
        card: "#161B22",
        accent: "#00E676",

        // Palette “Umbrella Hyperfin”
        brand: {
          DEFAULT: "#5A6CFF",
          light: "#7C84FF",
          dark: "#3A4BFF",
        },
        accentNeo: "#20E3B2", // nouveau accent turquoise
        surface: {
          dark: "#0B0F1A",
          card: "#141A29",
        },
        text: {
          high: "#E8ECF2",
          med: "#9AA5B8",
        },
        success: "#00D28A",
        danger: "#FF4D4F",
        warning: "#FFB020",
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.25)",
        glow: "0 0 12px rgba(90,108,255,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        DEFAULT: "1rem",
        xl: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
