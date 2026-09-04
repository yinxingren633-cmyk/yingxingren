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
        wandor: {
          dark: '#0a0a0a',
          text: '#1a1a1a',
          muted: '#767676',
          prompt: '#905831',
        },
        invisible: {
          dark: '#0a0a0a',
          text: '#1a1a1a',
          muted: '#767676',
          prompt: '#905831',
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
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Special Elite"', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
