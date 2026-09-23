/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#6B1625', 700: '#561120', 800: '#3F0C17', 900: '#2A0810', 50: '#FBF1F2' },
        saffron: { DEFAULT: '#E67E22', 600: '#C96A14', 100: '#FBE6D0' },
        gold: { DEFAULT: '#C89B3C', 300: '#E3C77E', 100: '#F4E6C4' },
        ivory: '#FFF9F0',
        cream: '#F7EBD8',
        ink: '#2B1A14',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        deva: ['"Noto Serif Devanagari"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(107,22,37,0.25)',
        card: '0 2px 0 rgba(200,155,60,0.35), 0 14px 30px -18px rgba(63,12,23,0.45)',
      },
      keyframes: {
        flame: { '0%,100%': { transform: 'scale(1,1) rotate(-2deg)' }, '50%': { transform: 'scale(0.92,1.08) rotate(2deg)' } },
        glow: { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '0.9' } },
        fall: {
          '0%': { transform: 'translate3d(0,-10%,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '100%': { transform: 'translate3d(var(--dx,30px),110vh,0) rotate(360deg)', opacity: '0' },
        },
        rise: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        flame: 'flame 2.4s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite',
        rise: 'rise 0.9s ease-out both',
        spinSlow: 'spinSlow 120s linear infinite',
      },
    },
  },
  plugins: [],
}
