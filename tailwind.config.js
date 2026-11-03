/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sea: {
          950: '#081626',
          900: '#0e2236',
          800: '#14304b',
          700: '#1c4063',
          600: '#27537d',
        },
        graphite: {
          950: '#0b0e13',
          900: '#0c0f14',
          800: '#12161e',
          700: '#1a2029',
          600: '#262e3a',
        },
        bronze: {
          300: '#ddc294',
          400: '#d0af7c',
          500: '#c2a36b',
          600: '#a7854f',
          700: '#87693c',
        },
        ivory: {
          50: '#f6f2e7',
          100: '#ece6da',
          200: '#d9d0bd',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        stage: '1280px',
      },
    },
  },
  plugins: [],
}
