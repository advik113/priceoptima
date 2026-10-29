/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#171717',
          light: '#222222',
          dark: '#111111',
          subtle: '#2a2a2a',
        },
        warmblack: {
          DEFAULT: '#252321',
          dark: '#1a1918',
          deep: '#131211',
          border: '#373330',
          surface: '#2a2825',
        },
        ivory: {
          DEFAULT: '#F2EDE4',
          dim: '#D6CFC3',
          muted: '#A8A297',
          light: '#FAF7F2',
        },
        bronze: {
          DEFAULT: '#B58B61',
          light: '#CCA47C',
          dark: '#8C6843',
          glow: 'rgba(181, 139, 97, 0.15)',
          border: 'rgba(181, 139, 97, 0.3)',
        },
        olive: {
          DEFAULT: '#7A8275',
          dark: '#4C5347',
          light: '#9AA295',
          subtle: 'rgba(122, 130, 117, 0.18)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'warm-radial': 'radial-gradient(circle at 50% 20%, rgba(181, 139, 97, 0.08) 0%, rgba(37, 35, 33, 0) 70%)',
        'subtle-grid': 'linear-gradient(to right, rgba(242, 237, 228, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(242, 237, 228, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}

