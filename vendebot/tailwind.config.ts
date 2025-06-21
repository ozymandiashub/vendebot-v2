import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', 
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Custom primary color
        secondary: '#9333EA', // Custom secondary color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom font family
      },
    },
  },
  plugins: [],
};

export default config;