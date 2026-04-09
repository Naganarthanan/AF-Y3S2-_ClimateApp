// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f4c81",
        accent: "#0ea5e9",
        warn: "#f97316",
      },
    },
  },
  plugins: [],
};