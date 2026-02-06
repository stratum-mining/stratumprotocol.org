/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/wizard-island.jsx',
    './node_modules/sv2-wizard/dist/**/*.{js,jsx,ts,tsx}',
  ],
  important: '[data-wizard-container]',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        background: 'var(--background)',
      },
    },
  },
  plugins: [],
};
