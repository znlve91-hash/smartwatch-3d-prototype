/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#F8F6FF',
        'brand-bg-secondary': '#F1EFFF',
        'brand-purple': '#7C3AED',
        'brand-purple-glow': '#DDD6FE',
        'brand-cyan': '#06B6D4',
        'brand-cyan-soft': '#E0F7FA',
        'brand-text-primary': '#0F172A',
        'brand-text-secondary': '#475569',
        'brand-text-muted': '#94A3B8',
        aura: {
          bg: '#F8F6FF',
          'bg-secondary': '#F1EFFF',
          purple: {
            DEFAULT: '#7C3AED',
            light: '#DDD6FE',
            glow: '#DDD6FE',
            dark: '#5B21B6',
            50: '#F5F3FF',
            100: '#EDE9FE',
            200: '#DDD6FE',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            light: '#E0F7FA',
            soft: '#E0F7FA',
            dark: '#0E7490',
            50: '#ECFEFF',
            100: '#CFFAFE',
            200: '#A5F3FC',
            400: '#22D3EE',
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490',
          },
          slate: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#94A3B8',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(124, 58, 237, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(124, 58, 237, 0.15)',
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.35)',
        'purple-glow': '0 0 20px rgba(124, 58, 237, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
