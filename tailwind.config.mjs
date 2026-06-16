/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a', // Dark/Premium
        accent: '#C9A84C',  // Exact Luxopack Gold
      },
      fontFamily: {
        sans: ['"Century Gothic"', 'AppleGothic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
