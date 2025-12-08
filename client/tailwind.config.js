/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  daisyui: {
    themes: ["light"],  // force light theme
  },
  plugins: [require('daisyui')],
};
