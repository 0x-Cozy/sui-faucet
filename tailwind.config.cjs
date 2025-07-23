module.exports = {
  darkMode: "class",
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
      },
    },
  },
  plugins: [],
}; 