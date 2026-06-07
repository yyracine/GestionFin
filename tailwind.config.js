/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Dark grays → navy palette (activés en dark: mode)
        gray: {
          950: '#091628',
          900: '#0d1b3e',
          800: '#142047',
          700: '#1e2f5c',
        },
        navy: {
          deep: '#091628',
          DEFAULT: '#0d1b3e',
          mid: '#142047',
          light: '#1e2f5c',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
          dark: '#a8882e',
        },
        // primary → gold
        primary: {
          50:  '#fdf9f0',
          100: '#f5e8be',
          200: '#ebda8a',
          300: '#e8c96a',
          400: '#d9b647',
          500: '#c9a84c',
          600: '#c9a84c',
          700: '#a8882e',
          800: '#806518',
          900: '#4a3a10',
          950: '#2a2008',
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
      boxShadow: {
        gold: '0 4px 16px rgba(201,168,76,.28)',
        'gold-lg': '0 6px 22px rgba(201,168,76,.38)',
      },
    },
  },
  plugins: [],
}
