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
        "custom-white": "#ffffff",
      },
      maxWidth: {
        "8xl": "96rem",
        68: "17rem",
      },
      width: {
        "1/10": "10%",
        "4/10": "40%",
        68: "17rem",
      },
      minWidth: {
        68: "17rem",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
