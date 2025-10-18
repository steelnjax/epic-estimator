/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Planner color palette
        planner: {
          blue: '#0078d4',
          'blue-dark': '#106ebe',
          'blue-light': '#2b88d8',
          'blue-hover': '#005a9e',
          'gray-bg': '#faf9f8',
          'gray-light': '#f3f2f1',
          'gray-border': '#edebe9',
          'gray-text': '#605e5c',
          'gray-text-light': '#8a8886',
        },
        primary: {
          blue: '#0078d4',
          teal: '#00b7c3',
          dark: '#005a9e',
        },
        status: {
          green: '#107c10',
          orange: '#ff8c00',
          red: '#d13438',
          gray: '#8a8886',
        },
        size: {
          small: '#c8e6c9',
          medium: '#ffecb3',
          large: '#bbdefb',
        },
      },
    },
  },
  plugins: [],
}
