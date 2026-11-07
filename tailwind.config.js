/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 🍮 布丁狗配色 Pudding Dog palette
        cream: {
          50: '#FFFDF7',
          100: '#FFF8E7',
          200: '#FFF0C9',
          300: '#FEE7A8'
        },
        pudding: {
          100: '#FFF0C9',
          200: '#FEE6A6',
          300: '#FBDA82',
          400: '#F6CD6B',
          500: '#F2C14E',
          600: '#E0A934',
          700: '#C98F24'
        },
        cocoa: {
          50: '#F8EEE2',
          100: '#EBD8BE',
          300: '#C99A64',
          400: '#A9713F',
          500: '#8B5A2B',
          600: '#6B4423',
          700: '#543419',
          800: '#3E2612'
        }
      },
      fontFamily: {
        rounded: ['"Varela Round"', '"Noto Sans TC"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        puff: '0 6px 0 rgba(139, 90, 43, 0.25)',
        'puff-sm': '0 3px 0 rgba(139, 90, 43, 0.25)'
      },
      borderRadius: {
        blob: '28px'
      }
    }
  },
  plugins: []
}
