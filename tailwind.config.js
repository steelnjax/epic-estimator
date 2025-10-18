/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3B82F6',
          teal: '#14B8A6',
          dark: '#1E40AF',
        },
        status: {
          green: '#10B981',
          orange: '#F59E0B',
          red: '#EF4444',
          gray: '#6B7280',
        },
        size: {
          small: '#BFDBFE',
          medium: '#5EEAD4',
          large: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}
