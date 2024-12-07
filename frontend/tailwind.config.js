/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
        borderWidth: {
            '1': '1px'
        }
    },
  },
  plugins: [],
}

