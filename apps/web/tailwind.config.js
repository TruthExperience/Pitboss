/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
