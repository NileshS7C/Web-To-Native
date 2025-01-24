/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Public Sans", "sans-serif"], // Add "Public Sans" as the default sans font
      },
      spacing: {
        30: "30px",
      },
      colors: {
        customColor: "#232323",
        tour_List_Color: "#718EBF",
      },
      backgroundColor: {
        customColor: "#FFFFFF",
      },
      screens: {
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
