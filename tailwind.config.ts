import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        "1111": "1111",
        "1112": "1112",
        "1114": "1114",
      },
      colors: {
        green: "#6ee7b7",
        white: "#ffffff",
        gray: "#1D232A",
        lightGray: "#343740",
        foreground: "#E8EAED",
        card: "#1D232A",
        surface: "#141414",
      },
      fontFamily: {
        segoe: ['"Segoe UI Symbol"', "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [require("daisyui"), nextui({
    themes: {
      light: {

      },
      dark: {
        colors: {
          background: "#141414",
          foreground: "#1D232A",
          primary: {
            foreground: "#6ee7b7",
            DEFAULT: "red"
          }
        },
      }
    }
  })],
};
export default config;
