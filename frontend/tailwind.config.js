/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xl-1300': '1300px',
      },
      colors: {
        primary: {
          DEFAULT: '#0066cc',
          dark: '#004499',
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", "Noto Sans", "Helvetica Neue", "Arial", "sans-serif"],
        satoshi: ["Satoshi", "Satoshi Placeholder", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
}

