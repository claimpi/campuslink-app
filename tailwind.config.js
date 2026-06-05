/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF3366',
          light: '#FF6B8E',
          dark: '#CC1144',
        },
        secondary: '#7B2FBE',
        accent: '#FF8C00',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#13131A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C27',
        },
      },
      fontFamily: {
        heading: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF3366, #FF6B35)',
        'gradient-secondary': 'linear-gradient(135deg, #7B2FBE, #FF3366)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700, #FF8C00)',
        'gradient-ocean': 'linear-gradient(135deg, #00C9FF, #0066FF)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-heart': 'bounceHeart 0.6s ease-out',
        'swipe-left': 'swipeLeft 0.35s ease-out forwards',
        'swipe-right': 'swipeRight 0.35s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-120%) rotate(-20deg)', opacity: '0' },
        },
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(120%) rotate(20deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
