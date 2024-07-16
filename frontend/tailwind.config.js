export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-0.5': 'span 0.5 / span 0.5',
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'md': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '8xl': '5rem',
        '10xl': '6rem'
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700,
      },
      animation: {
        typewriter: 'typewriter var(--time) steps(var(--typewriter-steps)) forwards',
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%"
          }
        },
        caret: {
          to: {
            left: "100%"
          }
        },
      },
      blink: {
        '0%': {
          opacity: '0',
        },
        '0.1%': {
          opacity: '0',
        },
        '50%': {
          opacity: '0',
        },
        '50.1%': {
          opacity: '0',
        },
        '100%': {
          opacity: '0',
        },
      },
      screens: {
        'sm': '500px',
        'md': '800px',
        'lg': '1200px',
        'xl': '1500px',
      },
      minHeight: {
        'xlminh': '850px',
      },
      maxHeight: {
        'xlmaxh': '1100px',
      },
      height: {
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          'accent': '#A290FC',
          'primary': '#FF00FF',
          'secondary': '#00FF00',
          'neutral': '#00FFFF',
          'base-100': '#050505', //background
          'base-200': '#101010', //card1
          'base-300': '#191919', //card2 and outline
          'neutral-content': '#323232', //card3
          'info-content': '#282828', //card4
          'base-content': '#E6E6E6', //text1
          'info': '#999999', //text2
          'success': '#ADADAD', //listcard icon
          'warning': '#979797', //listcard text
          'error': '#191919', 
          'error-content': '#FFFFFF', 
        },
      },
    ],
  },
}
