/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50:  '#fdf6f0',
          100: '#f7e8d8',
          200: '#edcfae',
          300: '#e0ad7c',
          400: '#d08a50',
          500: '#c47232',
          600: '#b05e27',
          700: '#924921',
          800: '#763b1f',
          900: '#5e301c',
          950: '#2c1810',
        },
        terra: {
          50:  '#fdf3ee',
          100: '#fbe3d4',
          200: '#f6c4a9',
          300: '#ef9c74',
          400: '#e7703d',
          500: '#c4622d',
          600: '#a94e22',
          700: '#8b3d1c',
          800: '#72321a',
          900: '#5e2b18',
        },
        gold: {
          50:  '#fdfaed',
          100: '#faf2cc',
          200: '#f5e394',
          300: '#efd05b',
          400: '#e8bc2d',
          500: '#d4a017',
          600: '#b87d10',
          700: '#935c11',
          800: '#794915',
          900: '#673d17',
        },
        cream: {
          50:  '#fefdf9',
          100: '#fdf8ef',
          200: '#f9efd9',
          300: '#f4e3be',
          400: '#edd49e',
          500: '#e5c27d',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      screens: {
        xs: '475px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
