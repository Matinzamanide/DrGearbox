/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('https://i.ibb.co/fDXcBMd/automasion3-1.webp')"
      },
      boxShadow:{
        custom : '0 4px 10px rgba(0,152,153,0.8)',
        customDark:'0px 4px 10px rgba(0,0,0,0.5)'
      },
      
    },
  },
  plugins: [],
}

