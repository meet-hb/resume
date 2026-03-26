/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0b",
        primary: "#00b4d8", // Bright Blue
        secondary: "#0077b6", // Deep Blue
        accent: "#90e0ef", // Cyan
        glass: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00b4d8, 0 0 10px #00b4d8' },
          '100%': { boxShadow: '0 0 20px #00b4d8, 0 0 30px #00b4d8' },
        }
      }
    },
  },
  plugins: [],
}
