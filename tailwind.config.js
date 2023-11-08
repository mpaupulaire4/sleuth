import konstaKonfig from 'konsta/config'

/** @type {import('tailwindcss').Config} */
export default konstaKonfig({
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
