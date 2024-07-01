import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
                card: "#252627",
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
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        background: "#fcfdfd",
                        foreground: "#0e1513",
                        primary: {
                            foreground: "#ecfdf8",
                            50: "#ecfdf8",
                            100: "#d1faee",
                            200: "#a7f3dd",
                            300: "#6ee7c5",
                            400: "#34d3a6",
                            500: "#10b989",
                            600: "#05966d",
                            700: "#047857",
                            800: "#065f46",
                            900: "#064e3a",
                            DEFAULT: "#047857",
                        },
                        secondary: {
                            foreground: "#186d5b",
                            50: "#f1fcf8",
                            100: "#d0f7ea",
                            200: "#a1eed5",
                            300: "#83e3c8",
                            400: "#3cc5a3",
                            500: "#23a98a",
                            600: "#198870",
                            700: "#186d5b",
                            800: "#18574b",
                            900: "#18493f",
                            DEFAULT: "#83e3c8",
                        },
                    },
                },
                dark: {
                    colors: {
                        background: "#020303",
                        foreground: "#eaf1ef",
                        primary: {
                            foreground: "#020303",
                            50: "#effef9",
                            100: "#c9feef",
                            200: "#88fbdb",
                            300: "#56f2cd",
                            400: "#23deb6",
                            500: "#0ac29d",
                            600: "#059c81",
                            700: "#097c69",
                            800: "#0d6256",
                            900: "#0d6256",
                            DEFAULT: "#88fbdb",
                        },
                        secondary: {
                            foreground: "#186d5b",
                            50: "#effaf5",
                            100: "#d8f3e6",
                            200: "#b3e7d0",
                            300: "#81d4b5",
                            400: "#4eb994",
                            500: "#2b9e7a",
                            600: "#1c7d61",
                            700: "#176551",
                            800: "#145141",
                            900: "#124237",
                            DEFAULT: "#1c7d61",
                        },
                    },
                },
            },
        }),
    ],
};
export default config;
