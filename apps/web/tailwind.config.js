/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        cardBorder: "var(--card-border)",
        accent: "var(--accent)",
        accentHover: "var(--accent-hover)",
        muted: "var(--muted)",
        mutedDark: "var(--muted-dark)",
      },
    },
  },
  plugins: [],
};
