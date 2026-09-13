import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        klarna: {
          pink: '#FFB3C7',
          rose: '#FF85A1',
          dark: '#E60067',
          black: '#0B0F19',
          card: '#151C2C',
          cardHover: '#1C253B',
          accent: '#FF3366',
          cyan: '#38BDF8',
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-pink': '0 0 25px -5px rgba(255, 133, 161, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-klarna': 'linear-gradient(135deg, #FFB3C7 0%, #FF3366 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(21, 28, 44, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
