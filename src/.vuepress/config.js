const postcss = require("../../postcss.config");
const { description } = require("../../package");

const pageSuffix = "/";
const logo = "/assets/stratum-v2-icon.svg";

module.exports = {
  title: "Stratum V2 The next-gen protocol for pooled mining",
  description,
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["link", { rel: "icon", href: logo }],
  ],

  themeConfig: {
    logo,
    editLinks: false,
    lastUpdated: false,
    sidebarDepth: 2,
    sidebar: {
      "/implementation/": "auto",
      "/": "auto",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/docs/" },
      { text: "Getting Started", link: "/getting-started/" },
      {
        text: "Reference Implementation",
        link: "https://github.com/stratum-mining/stratum",
      },
      { text: "Specification", link: "/specification/" },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    [
      "clean-urls",
      {
        normalSuffix: pageSuffix,
        indexSuffix: pageSuffix,
        notFoundPath: "/404.html",
      },
    ],
    [
      "code-copy",
      {
        color: "#8F979E",
        backgroundTransition: false,
        staticIcon: true,
      },
    ],
  ],

  postcss,
};
