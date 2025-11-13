module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#101016'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(79, 70, 229, 0.25)'
      }
    }
  },
  plugins: []
};
