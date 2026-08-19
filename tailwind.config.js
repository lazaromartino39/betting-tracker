/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626', // Red
        dark: '#1F2937', // Black/Dark
        success: '#10B981', // Green
        accent: '#7C2D12', // Dark Red
      },
      backgroundColor: {
        'pickit-dark': '#0F172A',
        'pickit-red': '#DC2626',
        'pickit-green': '#10B981',
      },
    },
  },
  plugins: [],
}
