/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */
const openVideo = (embedEl) => {
  const lazyAttr = "data-src";
  const iframe = embedEl.querySelector(`iframe[${lazyAttr}]`);
  if (iframe) {
    const src = iframe.getAttribute(lazyAttr);
    iframe.setAttribute("src", src);
  }
};

const handleClick = (e) => {
  // youtube previews
  if (e.target.matches(".ytEmbed")) {
    e.preventDefault();
    openVideo(e.target);
  }
};

export default ({ Vue, options, router, siteData }) => {
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    if (to.hash) {
      const elem = document.querySelector(to.hash);
      // vue-router does not incorporate scroll-margin-top on its own.
      if (elem) {
        const offset = parseFloat(getComputedStyle(elem).scrollMarginTop);
        return {
          selector: to.hash,
          offset: { y: offset },
        };
      }

      if (savedPosition) return savedPosition;
      return { x: 0, y: 0 };
    } else {
      return { x: 0, y: 0 };
    }
  };
  if (typeof process === "undefined" || process.env.VUE_ENV !== "server") {
    router.onReady(() => {
      const { app } = router;
      // initial page rendering
      app.$once("hook:mounted", () => {
        // temporary fix for https://github.com/vuejs/vuepress/issues/2428
        setTimeout(() => {
          const { hash } = document.location;
          if (hash.length > 1) {
            const id = hash.substring(1);
            const element = document.getElementById(id);
            if (element) element.scrollIntoView();
          }
        }, 500);
      });

      document.addEventListener("click", handleClick);
      document.addEventListener("keyup", (e) => {
        if (e.code === "Enter") handleClick(e);
      });
    });
  }
};
