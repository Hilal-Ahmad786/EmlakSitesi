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
                primary: {
                    DEFAULT: "#1a2b4b", // Deep Navy
                    dark: "#0f1a2e",
                    light: "#2a4270",
                },
                secondary: {
                    DEFAULT: "#f4f1ea", // Warm Beige
                    foreground: "#1a2b4b",
                },
                accent: {
                    gold: "#c5a059", // Gold
                    goldLight: "#e5c585",
                },
                text: {
                    primary: "#1a2b4b",
                    secondary: "#64748b",
                },
                border: "#e2e8f0",
                "background-alt": "#f8fafc",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                serif: ["var(--font-playfair)", "serif"],
            },
        },
    },
    plugins: [],
};
export default config;
