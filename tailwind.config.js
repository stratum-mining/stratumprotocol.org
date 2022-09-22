/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/.vuepress/**/*.{js,md,vue}"],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#081b30",
          200: "#051426",
          300: "#031C34",
          400: "#0E3A64",
          500: "#154D83",
          600: "#183559",
        },
        bodyText: "#C1DDF8",
        docsText: "#9BB6D1",
        links: "#5BEBF3",
        linksHover: "#ACFBFF",
        accent: "#FAF0E6",
        white: "#ffffff",
        icon: "#031E38",
        iconHover: "#042849",
        accent: "#5BEBF3",
        firstStep: "#53F6AE",
        secondStep: "#FF8337",
        thirdStep: "#FFCC00",
        fourthStep: "#5BEBF3",
      },
      spacing: {
        18: "72px",
      },
      maxWidth: {
        screen: "100vw",
      },
      fontFamily: {
        sans: ["Rubik"],
        title: ["SpaceGrotesk"],
      },
      fontSize: {
        tiny: ["15px", "22px"],
      },
    },
  },
  plugins: [],
};
