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
        primary: {
          DEFAULT: "#14BFFB",
          dark: "#0e9bd9",
        },
        secondary: {
          DEFAULT: "#D300E5",
          dark: "#a900b8",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        border: "var(--border)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
      transitionProperty: {
        'opacity': 'opacity',
      },
    },
  },
  plugins: [],
};

export default config; 