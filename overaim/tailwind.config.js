/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'overwatch-orange': '#f99e1a',
        'overwatch-blue': '#00c3f7',
        'overwatch-dark': '#1e1e1e',
        'overwatch-gray': '#2c2c2c',
        'overwatch-light-gray': '#a8a8a8',
      },
      fontFamily: {
        'overwatch': ['Futura', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}