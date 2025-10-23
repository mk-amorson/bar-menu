/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Винтажная палитра на основе черного и #204828
        'vintage': {
          'black': '#0a0a0a',
          'charcoal': '#1a1a1a',
          'dark-gray': '#2a2a2a',
          'medium-gray': '#3a3a3a',
          'light-gray': '#4a4a4a',
          'green': '#204828',
          'green-light': '#2a5a35',
          'green-dark': '#1a3a20',
          'green-vintage': '#1e4a2e',
          'green-muted': '#2d4a3a',
          'accent': '#3a5a4a',
          'gold': '#d4af37',
          'gold-light': '#e6c547',
          'bronze': '#cd7f32',
          'copper': '#b87333',
        },
      },
    },
  },
  plugins: [],
}
