/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#F8F6FF',
          surface: '#FFFFFF',
          violet: '#7C3AED',
          cyan: '#06B6D4',
          softCyan: '#E0F7FA',
          dark: '#0F172A',
          muted: '#64748B',
        },
      },
      boxShadow: {
        'glow-violet': '0 0 20px -3px rgba(124, 58, 237, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'soft': '0 12px 40px rgba(124, 58, 237, 0.06)',
      },
    },
  },
  plugins: [],
};
