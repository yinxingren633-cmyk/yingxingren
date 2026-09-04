/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#000000',
          surface: '#0a0a0c',
          card: 'rgba(18, 18, 22, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        cyan: {
          accent: '#00f2fe',
          glow: 'rgba(0, 242, 254, 0.35)',
        },
        blue: {
          accent: '#4facfe',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
