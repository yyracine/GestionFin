/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        income: {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
        },
        expense: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
