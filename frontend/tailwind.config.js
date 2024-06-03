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
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '10xl' : '6rem'
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
    },
  },
  plugins: [
    require('daisyui'),
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
          'neutral-content': '#282828', //card3
          'base-content': '#E6E6E6', //text1
          'info': '#999999', //text2
          'success': '#ADADAD', //listcard icon
          'warning': '#979797', //listcard text
        },
      },
    ],
  },
}
