import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E1A',
        surface: '#111827',
        'surface-raised': '#1C2433',
        border: '#2A3545',
        primary: '#00D4A0',
        danger: '#FF4D6A',
        amber: '#F59E0B',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8B9BB4',
        'text-muted': '#4A5568',
        'primary-dim': 'rgba(0, 212, 160, 0.15)',
        'danger-dim': 'rgba(255, 77, 106, 0.15)',
        'amber-dim': 'rgba(245, 158, 11, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'data-sm': ['12px', { lineHeight: '1.5', letterSpacing: '0' }],
        'data': ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
        'data-lg': ['16px', { lineHeight: '1.5', letterSpacing: '0' }],
        'data-xl': ['20px', { lineHeight: '1.4', letterSpacing: '0' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '400ms',
      },
      animation: {
        'flash-green': 'flashGreen 400ms ease-out',
        'flash-red': 'flashRed 400ms ease-out',
        'marquee': 'marquee 30s linear infinite',
        'marquee-pause': 'marquee 30s linear infinite paused',
      },
      keyframes: {
        flashGreen: {
          '0%': { backgroundColor: 'rgba(0, 212, 160, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(255, 77, 106, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
