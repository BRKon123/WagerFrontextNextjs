import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#f6bc58",
        secondary: "#dfa249",
        success: "#3dd179",
        danger: "#ce4646",
        "back-0": "#0e1013",
        "back-1": "#121418",
        "gray-0": "#828998",
        "gray-1": "#2a2e38",
        "gray-2": "#0e0f13",
        "gray-3": "#121418",
      },
      utilities: {
        ".hide-scrollbar": {
          /* Hide scrollbar for WebKit browsers */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* Hide scrollbar for other browsers */
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
      },
      screens: {
        xs: "500px",
      },
      width: {
        "1/7": "14.2857143%",
        "1/8": "12.5%",
        "1/9": "11.1111111%",
        "1/10": "10%",
        "1/11": "9.0909091%",
        "1/12": "8.3333333%",
      },
      maxWidth: {
        "7xl": "81.25rem", // 1300px / 16px per rem = 81.25rem
      },
    },
  },
  plugins: [],
};
export default config;
