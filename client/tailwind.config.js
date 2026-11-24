/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { light: '#FDF8F2', DEFAULT: '#F5EBE0' },
        maroon: { light: '#4A2630', DEFAULT: '#3E1F26', dark: '#2D1119' },
        saffron: '#E08A1E',
        rust: '#C0502A',
        'dark-brown': '#3A1A1F',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
      }
    },
  },
  plugins: [],
}
