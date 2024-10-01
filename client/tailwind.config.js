import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter Tight", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        bitter: ["Bitter", "serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        "custom-pink": "#f31261",
      },
      maxWidth: {
        "8xl": "96rem",
      },
      width: {
        "1/10": "10%",
        "4/10": "40%",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
