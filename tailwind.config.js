/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-focus': 'var(--color-primary-focus)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#6366f1",
          "primary-focus": "#4f46e5",
          "secondary": "#a855f7",
          "accent": "#06b6d4",
          "neutral": "#1e1e2e",
          "base-100": "#0f0f1a",
          "base-200": "#1a1a2e",
          "base-300": "#16213e",
          "base-content": "#e2e8f0",
          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
        light: {
          "primary": "#6366f1",
          "primary-focus": "#4f46e5",
          "secondary": "#a855f7",
          "accent": "#06b6d4",
          "neutral": "#f1f5f9",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#1e293b",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}
