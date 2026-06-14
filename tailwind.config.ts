import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50:  '#fdf4f7',
          100: '#fce8ef',
          200: '#f8d0e0',
          300: '#f2adc8',
          400: '#e87faa',
          500: '#c43a6e',
          600: '#a52d5a',
          700: '#8b2749',
          800: '#6b3352',
          900: '#3d0e25',
        },
        gold: {
          300: '#e8d5a3',
          400: '#d4b86a',
          500: '#c9a84c',
          600: '#b8912e',
          700: '#9a7425',
        },
        cream: {
          50:  '#fdfaf6',
          100: '#fdf7f0',
          200: '#faeee0',
        }
      },
    },
  },
  plugins: [],
};
export default config;
