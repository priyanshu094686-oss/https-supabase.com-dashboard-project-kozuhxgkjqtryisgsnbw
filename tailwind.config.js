/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF4',
          100: '#F9F4E1',
          200: '#F3E5AB',
          300: '#E7D175',
          400: '#DFBA52',
          500: '#D4AF37', // Classic luxury gold
          600: '#C5A059',
          700: '#A37E36',
          800: '#7F5F26',
          900: '#523C16',
        },
        spa: {
          black: '#07080a',
          dark: '#0e1117',
          card: '#141822',
          surface: '#1a1f2c',
          border: 'rgba(212, 175, 55, 0.15)',
          'border-bright': 'rgba(212, 175, 55, 0.4)',
          text: '#F5F5F5',
          muted: '#9E9DA6',
          gold: '#D4AF37',
          champagne: '#F4ECE1'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        luxury: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(212, 175, 55, 0.15)',
        'gold': '0 4px 25px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 40px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #A37E36 100%)',
        'gold-metallic': 'linear-gradient(90deg, #B38F46 0%, #F4E5A8 50%, #B38F46 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0e1117 0%, #07080a 100%)',
      }
    },
  },
  plugins: [],
}

