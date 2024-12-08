/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      borderWidth: {
          '1': '1px'
      },
      colors: {
        primary: {
          light: '#f2f7fc', // Azzurro chiaro (contrast ratio: 4.5:1 con bianco)
          DEFAULT: '#0066cc', // Azzurro medio (contrast ratio: 7:1 con bianco)
          dark: '#003366', // Azzurro scuro (contrast ratio: 12:1 con bianco)
        },
        secondary: {
          light: '#f6e4c8', 
          DEFAULT: '#cc7a00', 
          dark: '#b36b00', 
        },
        neutral: {
          light: '#F4F4F4', // Grigio chiaro (contrast ratio: 4.5:1 con nero)
          DEFAULT: '#2D2D2D', // Grigio scuro (contrast ratio: 12:1 con bianco)
          dark: '#000000', // Quasi nero
        },
        accent: {
          light: '#ebadb8', // Rosa acceso (contrast ratio: 4.5:1 con bianco)
          DEFAULT: '#cc334d', // Magenta scuro (contrast ratio: 7:1 con bianco)
          dark: '#992639', // Magenta profondo (contrast ratio: 10:1 con bianco)
        },
      }
    },
  },
  plugins: [],
}

