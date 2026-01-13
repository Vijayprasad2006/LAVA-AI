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
        'brand-orange': '#FFA116',
        'text-primary': '#1a1a1a',
        'text-secondary': '#6b7280',
        'border-tertiary': '#e5e5e5',
        'fill-3': '#f5f5f5',
        'fill-4': '#e8e8e8',
        'layer-01': '#ffffff',
        'overlay-3': '#ffffff',
        'sd-accent': '#f5f5f5',
        'sd-muted-foreground': '#8c8c8c',
        'gpt-sidebar': '#000000',
        'gpt-main': '#000000',
        'gpt-user': '#000000',
        'gpt-assistant': '#111111',
        'gpt-input': '#1e1e1e',
        'gpt-text': '#FFFFFF',
        'gpt-subtext': '#9ca3af',
        'gpt-border': 'rgba(255,255,255,0.15)',
        'gpt-hover': '#2A2B32',
      },
      maxWidth: {
        'container': '1200px',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        swing: {
          '0%': { transform: 'rotate(10deg)' },
          '50%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
        swing: 'swing 2s ease-in-out infinite',
        glitch: 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both',
      },
    },
  },
  plugins: [],
}
