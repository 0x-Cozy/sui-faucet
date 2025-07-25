/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'twk-everett': ['"TWK Everett"', 'sans-serif'],
        'inter-tight': ['"Inter Tight Medium"', 'Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
        'orbitron': ['Orbitron', 'monospace'],
        'space-mono': ['Space Mono', 'monospace'],
      },
      colors: {
        'sui-blue': '#4DA2FF',
        'sui-dark': '#030F1C',
        'sui-darker': '#011829',
        'sui-border': '#2e3b4e',
        'sui-light-blue': '#6fbcf0',
      },
    },
  },
  plugins: [],
} 