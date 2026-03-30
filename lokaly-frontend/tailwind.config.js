/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f0',
          100: '#ffeedd',
          200: '#ffd4a8',
          300: '#ffb46a',
          400: '#ff8c2a',
          500: '#e8720a',
          600: '#c45c00',
          700: '#9e4900',
          800: '#7a3800',
          900: '#5c2a00',
        },
        earth: {
          50:  '#faf6f0',
          100: '#f0e8d8',
          200: '#ddc9a8',
          300: '#c4a472',
          400: '#a87d45',
          500: '#8b6030',
          600: '#6e4a22',
          700: '#543818',
          800: '#3d280f',
          900: '#291a08',
        },
        kente: {
          green:  '#1a6b3c',
          gold:   '#d4a017',
          red:    '#b5311a',
          indigo: '#2c3e8c',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body:    ['system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
