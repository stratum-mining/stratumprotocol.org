const postcss = require("../../postcss.config");
const { description } = require("../../package");
const { resolve } = require("path");
const slugify = require("./slugify");

const preprocessMarkdown = resolve(__dirname, "preprocessMarkdown");
const baseUrl = "https://stratumprotocol.org";
const pageSuffix = "/";
const logo = "/assets/stratum-v2-icon.svg";
const sitemap = {
  hostname: baseUrl,
  exclude: ["/404.html"],
};

const blogSidebar = [
  ["/blog/", "Articles"],
  ["/blog/tags/", "Tags"],
  ["/blog/author/", "Authors"],
];

const specificationSidebar = [
  ["/specification/00-Abstract", "0. Abstract"],
  ["/specification/01-Motivation", "1. Motivation"],
  ["/specification/02-Design-Goals", "2. Design Goals"],
  ["/specification/03-Protocol-Overview", "3. Protocol Overview"],
  ["/specification/04-Protocol-Security", "4. Protocol Security"],
  ["/specification/05-Mining-Protocol", "5. Mining Protocol"],
  ["/specification/06-Job-Declaration-Protocol", "6. Job Declaration Protocol"],
  [
    "/specification/07-Template-Distribution-Protocol",
    "7. Template Distribution Protocol",
  ],
  ["/specification/08-Message-Types", "8. Message Types"],
  ["/specification/09-Extensions", "9. Extensions"],
  ["/specification/10-Discussion.md", "10. Discussion"],
];

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
    [
      "link",
      {
        rel: "preload",
        href: "/fonts/rubik-regular.woff2",
        as: "font",
        crossorigin: true,
      },
    ],
    [
      "link",
      {
        rel: "preload",
        href: "/fonts/space-grotesk-700.woff2",
        as: "font",
        crossorigin: true,
      },
    ],
  ],

  chainWebpack(config) {
    config.module
      .rule("md")
      .test(/\.md$/)
      .use(preprocessMarkdown)
      .loader(preprocessMarkdown)
      .end();
  },

  themeConfig: {
    logo,
    editLinks: false,
    lastUpdated: false,
    sidebarDepth: 2,
    sidebar: {
      "/_blog/": blogSidebar,
      "/blog/": blogSidebar,
      "/specification/": specificationSidebar,
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
      { text: "Blog", link: "/blog/" },
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
        backgroundTransition: true,
        staticIcon: false,
      },
    ],
    ["sitemap", sitemap],
    [
      "@vuepress/blog",
      {
        sitemap,
        directories: [
          {
            id: "blog",
            dirname: "_blog",
            path: "/blog/",
            itemPermalink: "/blog/:slug",
            pagination: {
              lengthPerPage: 10,
              getPaginationPageTitle(pageNumber) {
                return `Page ${pageNumber}`;
              },
            },
          },
        ],
        frontmatters: [
          {
            id: "tags",
            keys: ["tags"],
            path: "/blog/tags/",
            title: "",
            frontmatter: {
              title: "Tags",
            },
            pagination: {
              getPaginationPageTitle(pageNumber, key) {
                return `${capitalize(key)} - Page ${pageNumber}`;
              },
            },
          },
          {
            id: "author",
            keys: ["author", "authors"],
            path: "/blog/author/",
            title: "",
            frontmatter: {
              title: "Authors",
            },
            pagination: {
              getPaginationPageTitle(pageNumber, key) {
                return `${key} - Page ${pageNumber}`;
              },
            },
          },
        ],
      },
    ],
  ],

  markdown: {
    pageSuffix,
    slugify,
  },

  postcss,
};
