/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

export default ({
  Vue, 
  options, 
  router, 
  siteData, 
}) => {
  router.options.scrollBehavior = async (to, from, savedPosition) => {
    if (to.hash){
      const elem = document.querySelector(to.hash)
      // vue-router does not incorporate scroll-margin-top on its own.
      if (elem) {
        const offset = parseFloat(getComputedStyle(elem).scrollMarginTop)
        return {
          selector: to.hash,
          offset: { y: offset }
        }
      }

      if (savedPosition) return savedPosition
      return { x: 0, y: 0 }
    } else {
        return { x: 0, y: 0 }
    }
  }
};
