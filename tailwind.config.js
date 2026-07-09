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
        brand: {
          dark: '#121212',          // Jolly Cabs Premium Dark
          navy: '#1E1E1E',          // Secondary Dark Gray
          deepNavy: '#0A0A0A',      // Pure Black Accent
          gold: '#FFC107',          // Taxi Yellow
          lightGold: '#FFD54F',     // Lighter Yellow
          textDark: '#121212',      // Primary Text Dark
          textGray: '#6B7280',      // Text Gray
          bgLight: '#F8F9FA',       // Light Page Background
          cardWhite: '#FFFFFF',
          success: '#10B981',       // Success Emerald
          danger: '#D32F2F',        // Danger Red
          info: '#1976D2',
          borderLight: '#F0F0F0',   // Sleek Clean Border
          whatsapp: '#25D366',
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        stats: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(255, 255, 255, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'premium': '0 10px 30px -10px rgba(18, 18, 18, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(18, 18, 18, 0.25)',
        'gold-glow': '0 4px 14px 0 rgba(255, 193, 7, 0.39)',
        'gold-glow-lg': '0 8px 25px 0 rgba(255, 193, 7, 0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.06), 0 10px 24px rgba(0,0,0,0.1)',
        'nav': '0 2px 20px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'check-draw': 'checkDraw 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 193, 7, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255, 193, 7, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        checkDraw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFC107, #FFE082)',
        'dark-gradient': 'linear-gradient(180deg, #121212, #0A0A0A)',
        'hero-gradient': 'linear-gradient(135deg, #121212 0%, #1E1E1E 50%, #121212 100%)',
      },
    },
  },
  plugins: [],
}
