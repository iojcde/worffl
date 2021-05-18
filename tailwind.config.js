// tailwind.config.js
const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./app/**/*.{js,ts,jsx,tsx}"],
  important: true,
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      success: "#0070F3",
      bg: "#FAFAFA",
      selection: "#79FFE1",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
}
