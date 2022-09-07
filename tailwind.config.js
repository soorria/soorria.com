/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const drac = {
  bg: '#282a36',
  'bg-dark': '#21222c',
  curr: '#44475a',
  fg: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
}

module.exports = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        drac,
        current: 'currentColor',
        'var-col': 'var(--col)',
        'var-bg': 'var(--bg)',
      },
      fontFamily: {
        display: ["'Poppins'", ...fontFamily.sans],
        mono: ["'JetBrains Mono'", ...fontFamily.mono],
      },
      screens: {},
      rotate: {
        20: '20deg',
      },
      spacing: {
        em: '1em',
      },
      typography: () => {
        const { fg, pink, purple, comment } = drac
        return {
          DEFAULT: {
            css: {
              color: fg,
              a: {
                color: pink,
                '&:hover': {
                  color: purple,
                },
                '&:focus': {
                  color: purple,
                },
              },
              'a code': {
                color: pink,
              },
              'h1,h2,h3,h4,h5,h6,blockquote,strong,b,i,em': {
                color: fg,
              },
              blockquote: {
                borderLeftColor: purple,
              },
              hr: {
                borderTopColor: comment,
                opacity: 0.5,
              },
              thead: {
                color: fg,
                borderBottomColor: fg,
              },
              'tbody tr': {
                borderBottomColor: fg,
              },
              'figure figcaption': {
                color: fg,
                opacity: 0.8,
              },
              img: {
                width: '100%',
                borderRadius: '1rem',
              },
            },
          },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('hocus-within', ['&:hover', '&:focus-within'])
      addVariant('group-hocus', [':merge(.group):hover &', ':merge(.group):focus &'])
    }),
  ],
}
