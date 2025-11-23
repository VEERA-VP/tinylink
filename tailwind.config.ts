import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(215 20% 20%)",
        background: "hsl(222.2 84% 4.9%)",
        foreground: "hsl(210 40% 98%)"
      }
    }
  },
  plugins: []
};

export default config;
