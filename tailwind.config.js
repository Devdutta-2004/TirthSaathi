/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040E1E',
          900: '#071830',
          850: '#0B2245',
          800: '#0F2C59',
          700: '#163E7D',
          600: '#1E53A3'
        },
        gold: {
          950: '#451A03',
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
          300: '#FCD34D',
          200: '#FDE68A',
          100: '#FEF3C7',
          50: '#FFFDF5'
        },
        sandstone: {
          900: '#292524',
          800: '#44403C',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50: '#FAF8F5'
        },
        yatra: {
          blue: '#0E5ABF',
          bright: '#1570E8',
          sky: '#4EA8DE',
          light: '#EEF6FF',
          bg: '#FAF7F0',
          dark: '#0A1828',
          muted: '#5A6E85',
          saffron: '#EA580C',
          amber: '#F59E0B',
          gold: '#F6C453',
          sacred: '#C2410C',
          emerald: '#059669',
          crimson: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heritage: ['Marcellus', 'Cinzel', 'Georgia', 'serif'],
        devanagari: ['Yatra One', 'Rozha One', 'serif'],
        royal: ['Cinzel Decorative', 'Cinzel', 'serif']
      },
      boxShadow: {
        'gold-sm': '0 2px 10px -1px rgba(245, 158, 11, 0.15), 0 1px 4px -1px rgba(0, 0, 0, 0.05)',
        'gold-md': '0 8px 25px -4px rgba(245, 158, 11, 0.22), 0 4px 10px -2px rgba(11, 34, 69, 0.06)',
        'gold-lg': '0 15px 35px -5px rgba(217, 119, 6, 0.3), 0 8px 20px -4px rgba(7, 24, 48, 0.12)',
        'temple': '0 12px 36px -6px rgba(7, 24, 48, 0.12), 0 4px 14px -2px rgba(245, 158, 11, 0.08)',
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.45)',
        'glow-blue': '0 0 30px rgba(21, 112, 232, 0.35)'
      },
      borderRadius: {
        'arch': '32px 32px 20px 20px',
        'mandap': '40px 40px 24px 24px'
      }
    },
  },
  plugins: [],
}
