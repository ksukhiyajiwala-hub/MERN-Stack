module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
      },
    },
  },
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // General components folder
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Most common Vite/React structure
    ".//**/*.{js,ts,jsx,tsx,mdx}", // optional
  ],
};
