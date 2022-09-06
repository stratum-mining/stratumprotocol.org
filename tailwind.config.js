/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/.vuepress/**/*.{js,md,vue}"],
  theme: {
    extend: {
      colors: {
        levelOne: "#011426",
        levelTwo: "#031C34",
        levelThree: "#0E3A64",
        bodyText: "#C1DDF8",
        links: "#22C55E",
        accent: "#FAF0E6",
        white: "#ffffff",
        icon: "#031E38",
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
      },
      fontSize: {
        tiny: ["15px", "22px"],
      },
    },
  },
  plugins: [],
};
