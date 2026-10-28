/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF7F2',        // Warm luxury ecru / oat canvas
          surface: '#FFFFFF',   // Crisp clean white card/surface
          subtle: '#F4EFEA',    // Soft sand / cashmere tint
          border: '#E8E2D8',    // Refined warm border
          borderLight: '#F0ECE4',
          text: '#171615',      // Deep warm charcoal black
          muted: '#6E6B65',     // Elegant warm slate/stone
          accent: '#B84A2A',    // Sophisticated Warm Terracotta / Brick Rose
          'accent-hover': '#9E3E22',
          'accent-light': '#FDF2EE',
          sand: '#EFEAE2',
          gold: '#C5A880',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.05), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'hover': '0 12px 30px -4px rgba(28, 25, 23, 0.08), 0 4px 10px -2px rgba(28, 25, 23, 0.04)',
        'modal': '0 25px 50px -12px rgba(28, 25, 23, 0.18)',
      },
    },
  },
  plugins: [],
};
