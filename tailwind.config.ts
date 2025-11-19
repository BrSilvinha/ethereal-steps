import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema Oscuro Elegante con Pasteles
        dark: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0f3460',
        },
        pastel: {
          rose: '#FFB5D8',
          lavender: '#D4C5E8',
          mint: '#C5E8DB',
          peach: '#FFDAB9',
          sky: '#C5E3F6',
        },
        accent: {
          gold: '#D4AF37',
          silver: '#C0C0C0',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        'gradient-pastel': 'linear-gradient(135deg, #FFB5D8 0%, #D4C5E8 50%, #C5E8DB 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
