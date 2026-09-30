/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Nunito', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F4EDE2',
          300: '#EBE0CE',
        },
        honey: {
          50: '#FDF6EC',
          100: '#FAE8D1',
          200: '#F4CC9E',
          300: '#EDB074',
          400: '#E5944E',
          500: '#D9772E',
          600: '#BC5E1E',
          700: '#974918',
          800: '#723916',
          900: '#5C3015',
        },
        sage: {
          50: '#F2F7F3',
          100: '#E2EEE5',
          200: '#C5DCCB',
          300: '#9CC0A6',
          400: '#74A37F',
          500: '#588865',
          600: '#466D51',
          700: '#395742',
          800: '#2F4636',
          900: '#283B2D',
        },
        coral: {
          50: '#FDF3F0',
          100: '#FAE3DC',
          200: '#F4C2B3',
          300: '#EC9D87',
          400: '#E37C61',
          500: '#D96144',
          600: '#BC4A30',
          700: '#973A26',
          800: '#722E20',
          900: '#5C271D',
        },
        ink: {
          50: '#F7F4F1',
          100: '#EDE7E0',
          200: '#D8CFC4',
          300: '#B5A89A',
          400: '#8A7D6E',
          500: '#6B5F52',
          600: '#544A40',
          700: '#3F372F',
          800: '#2D2722',
          900: '#1E1916',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(61, 53, 48, 0.08)',
        card: '0 8px 30px -8px rgba(61, 53, 48, 0.12)',
        warm: '0 10px 40px -12px rgba(217, 119, 46, 0.25)',
        lift: '0 16px 50px -16px rgba(61, 53, 48, 0.22)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gentlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        scaleIn: 'scaleIn 0.3s ease-out both',
        gentlePulse: 'gentlePulse 2.5s ease-in-out infinite',
        slideUp: 'slideUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
