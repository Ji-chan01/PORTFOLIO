/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--color-accent))',
        'accent-dark': 'rgb(var(--color-accent-dark))',
        'bg-light': '#F9FAFB',
        'bg-dark': '#18181B',
        'surface-light': '#FFFFFF',
        'surface-dark': '#27272A',
        'border-light': '#E5E7EB',
        'border-dark': '#3F3F46',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fill-bar': 'fillBar 1.2s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fillBar: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-width)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
