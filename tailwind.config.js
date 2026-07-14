/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',    // orange-50
          100: '#ffedd5',   // orange-100
          500: '#f97316',   // orange-500
          600: '#ea580c',   // orange-600
          700: '#c2410c',   // orange-700
        },
        teal: {
          50: '#fff7ed',    // orange-50
          100: '#ffedd5',   // orange-100
          200: '#fed7aa',   // orange-200
          300: '#fdbb74',   // orange-300
          400: '#fb923c',   // orange-400
          500: '#f97316',   // orange-500
          600: '#ea580c',   // orange-605/600
          605: '#ea580c',   // orange-605
          650: '#c2410c',   // orange-700
          700: '#c2410c',   // orange-700
          800: '#9a3412',   // orange-800
        },
        indigo: {
          50: '#fef2f2',    // red-50
          100: '#fee2e2',   // red-100
          500: '#ef4444',   // red-500
          600: '#dc2626',   // red-600
          605: '#dc2626',   // red-605
          650: '#b91c1c',   // red-700
          700: '#b91c1c',   // red-700
          800: '#991b1b',   // red-800
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
