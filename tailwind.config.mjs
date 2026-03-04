/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#20A1AA',
        secondary: '#424242',
        tertiary: '#ffcc44',
      },
      fontFamily: {
        sans: ['BentonSans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['CaslonGraphiqueEF', 'Georgia', 'serif'],
      },
      screens: {
        'xs': '350px',
        'xs2': '394px',
        'sm': '450px',
        'sm2': '530px',
        'sm3': '610px',
        'md': '760px',
        'md2': '768px',
        'lg': '940px',
        'xl': '1100px',
        '2xl': '1260px',
      },
    },
  },
  plugins: [],
};
