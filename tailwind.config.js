/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          yellow: '#FEF9C3',
          yellowDark: '#FDE047',
          blue: '#BFDBFE',
          blueDark: '#93C5FD',
          red: '#FECACA',
          redDark: '#FCA5A5',
          green: '#BBF7D0',
          greenDark: '#86EFAC',
          purple: '#E9D5FF',
          purpleDark: '#D8B4FE',
        },
        dmless: {
          primary: '#93C5FD',
          secondary: '#FDE047',
          accent: '#86EFAC',
          muted: '#FEF9C3',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
