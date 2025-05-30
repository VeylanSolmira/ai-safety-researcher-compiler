/** @type {import('tailwindcss').Config} */
// Tailwind CSS is a utility-first CSS framework
// This config file customizes Tailwind's default styles and adds your design system
module.exports = {
  darkMode: 'media', // or 'class' if you want manual toggle
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for your AI safety theme
        'ai-primary': '#2563eb',
        'ai-secondary': '#7c3aed',
        'ai-danger': '#dc2626',
        'ai-success': '#16a34a',
      },
    },
  },
  plugins: [],
}