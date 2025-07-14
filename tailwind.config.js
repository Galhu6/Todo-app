/** @type {import('tailwindcss'.Config)} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx, ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#7C3AED',
          500: '#6D28D9',
          600: '#5B21B6',
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
}
