/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f2',
          100: '#dceee3',
          200: '#bcddc9',
          300: '#8fc4a5',
          400: '#5da47d',
          500: '#3a8560',
          600: '#2d6a4f',
          700: '#255540',
          800: '#1f4434',
          900: '#1a382c',
          950: '#0d1f18',
        },
        earth: {
          100: '#f5ede0',
          200: '#e8d5b5',
          300: '#d4b483',
          400: '#c49a5c',
          500: '#b8843a',
          600: '#9a6d2f',
          700: '#7a5525',
        },
        amber: {
          400: '#f4a261',
          500: '#e76f51',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 },              '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};