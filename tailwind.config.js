/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ShippingSorted color scheme
        background: '#1A1A1A',
        foreground: '#FFFFFF',
        card: '#2A2A2A',
        'card-foreground': '#FFFFFF',
        primary: '#BFFF00',
        'primary-foreground': '#1A1A1A',
        secondary: '#2A2A2A',
        'secondary-foreground': '#FFFFFF',
        muted: '#2A2A2A',
        'muted-foreground': '#888888',
        accent: '#BFFF00',
        border: 'rgba(191, 255, 0, 0.2)',
        input: 'rgba(191, 255, 0, 0.1)',
        // Additional shades
        'green-bright': '#BFFF00',
        'green-dim': '#A6DF00',
        'dark-bg': '#1A1A1A',
        'dark-card': '#2A2A2A',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      }
    },
  },
  plugins: [],
} 