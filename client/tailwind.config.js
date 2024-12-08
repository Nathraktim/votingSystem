/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      helvetica: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    fontWeight: {
      thin: 100,
      ultraLight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
      heavy: 800,
      black: 900,
    },
  },
  plugins: [],
}