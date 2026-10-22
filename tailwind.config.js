/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tests/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F8F6FF',
        'bg-secondary': '#FFFFFF',
        'bg-accent-soft': '#E0F7FA',
        'brand-purple': '#7C3AED',
        'brand-cyan': '#06B6D4',
        'text-main': '#0F172A',
        'text-muted': '#64748B',
        'border-soft': '#EDE9FE',
        'border-subtle': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
