/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        accent: '#3b82f6',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
      },
      boxShadow: {
        glow: '0 0 30px rgba(59,130,246,0.35)',
      },
    },
  },
  plugins: [],
};
