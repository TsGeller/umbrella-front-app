/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0D1117",
        card: "#161B22",
        accent: "#00E676",
      },
      borderRadius:{
        DEFAULT: '1rem',   // <--- arrondi par défaut (~16px)
        xl: '1.25rem',
      }
    },
  },
}