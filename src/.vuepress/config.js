const { description } = require("../../package");

module.exports = {
  title: "Stratum V2 The next-gen protocol for pooled mining",
  description: description,
  base: "/",
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["link", { rel: "icon", href: "/assets/stratum-v2-icon.svg" }],
  ],

  themeConfig: {
    logo: "/assets/stratum-v2-icon.svg",
    editLinks: false,
    lastUpdated: false,
    sidebarDepth: 2,
    sidebar: {
      "/implementation/": "auto",
      "/": "auto",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Reference Implementation", link: "https://github.com/stratum-mining/stratum" },
      { text: "Documentation", link: "/overview.html" },
      { text: "Getting Started", link: "/getting-started.html" },
      { text: "Specification", link: "/specification.html" },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],

  postcss: {
    plugins: [require("tailwindcss")(), require("autoprefixer")],
  },
};
