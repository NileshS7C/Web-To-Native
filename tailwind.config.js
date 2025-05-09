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
        player_table: "#667085",
        matchTextColor: "#343C6A",
        matchModalTextColor: "#8D8D8D",
        "1c0e0eb3": "#1C0E0EB3",
        white: "#FFFFFF",
        richBlue: {
          5: "#1570EF",
          600: "#19367F",
        },
        grey: {
          100: "#718EBF",
          200: "#F7F9FC",
          300: "#667085",
          500: "#667085",
          600: "#101828",
          900: "#2B2F38",
        },
      },
      backgroundColor: {
        customColor: "#FFFFFF",
      },
      screens: {
        portrait: { raw: "(orientation: portrait)" },
        landscape: { raw: "(orientation: landscape)" },
        ipad_air: "820px",
        tab: "920px",
        xl: "1280px",
        "2xl": "1536px",
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none", // Hide scrollbar in IE and Edge
          "scrollbar-width": "none", // Hide scrollbar in Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar in Chrome, Safari, and Edge
          },
        },
      });
    },
  ],
};
