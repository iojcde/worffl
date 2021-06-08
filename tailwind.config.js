// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['{pages,app}/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        success: '#0070F3',
        bg: '#FAFAFA',
        selection: '#79FFE1',
        black: colors.black,
        white: colors.white,
        gray: colors.trueGray,
        indigo: colors.indigo,
        red: colors.rose,
        teal: colors.teal,
        blue: colors.blue,
        violet: colors.violet,
        yellow: colors.amber,
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
}
