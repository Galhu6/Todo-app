module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#64ffda',
      },
      keyframes: {
        fade: {
          from: { opacity: '0.3' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fade: 'fade 1s ease-in-out',
      },
    },
  },
  plugins: [],
}
