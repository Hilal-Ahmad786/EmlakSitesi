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
                background: "var(--color-background)",
                foreground: "var(--color-text-primary)",
                primary: {
                    DEFAULT: "#1a2b4b",
                    light: "#243b5f",
                    dark: "#0d1929",
                    darker: "#050b14",
                },
                secondary: {
                    DEFAULT: "#faf9f7",
                    foreground: "#1a2b4b",
                },
                accent: {
                    gold: "#d4af37",
                    goldLight: "#e5c565",
                    goldDark: "#b8952f",
                    warm: "#c9a67d",
                },
                text: {
                    primary: "#1a2b4b",
                    secondary: "#5a6a7a",
                    muted: "#8a9aab",
                    onDark: "#f5f5f5",
                },
                border: {
                    DEFAULT: "#e5e7eb",
                    light: "#f0f1f3",
                },
                "background-alt": "#faf9f7",
                "background-luxury": "#f8f6f2",
                success: "#22c55e",
                warning: "#f59e0b",
                error: "#ef4444",
                info: "#3b82f6",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                serif: ["var(--font-playfair)", "Georgia", "serif"],
            },
            fontSize: {
                'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'section': ['2.75rem', { lineHeight: '1.2' }],
                'subsection': ['1.75rem', { lineHeight: '1.3' }],
            },
            spacing: {
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
            },
            boxShadow: {
                'luxury': '0 25px 50px -12px rgb(26 43 75 / 0.15)',
                'card': '0 4px 20px -2px rgb(26 43 75 / 0.08)',
                'card-hover': '0 12px 40px -8px rgb(26 43 75 / 0.15)',
                'header': '0 4px 30px -5px rgb(26 43 75 / 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.7s ease-out',
                'fade-in-up': 'fadeInUp 0.7s ease-out',
                'slide-up': 'slideUp 0.7s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'gold-shimmer': 'goldShimmer 2s infinite',
                'scale-in': 'scaleIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                goldShimmer: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [],
};

export default config;
