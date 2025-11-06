/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050A1F',
        starlight: '#9FC9FF',
        aurora: '#8B5CF6',
        nebula: '#FF80BF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'star-field': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.28) 0, rgba(255,255,255,0) 60%), radial-gradient(circle at 80% 10%, rgba(148,163,255,0.28) 0, rgba(148,163,255,0) 55%), radial-gradient(circle at 50% 80%, rgba(248,113,113,0.2) 0, rgba(248,113,113,0) 65%)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(-1%)' },
          '50%': { transform: 'translateY(1%)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 12s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
