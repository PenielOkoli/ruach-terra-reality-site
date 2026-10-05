import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: { paper: '#f4f1ea', navy: '#082e56', ink: '#181a18', clay: '#6b6257', sand: '#cdbb9d', line: '#cfc9be', rust: '#a44c2a' },
      fontFamily: { display: ['var(--font-display)', 'sans-serif'], body: ['var(--font-body)', 'sans-serif'] },
      boxShadow: { float: '0 24px 60px rgba(5, 24, 50, .13)' },
    },
  },
  plugins: [],
};

export default config;
