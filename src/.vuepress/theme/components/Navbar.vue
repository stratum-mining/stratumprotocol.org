<template>
  <header class="relative z-[20] bg-transparent border-b-none flex flex-row justify-between h-12 mt-8 px-10 lg:h-20 lg:mt-12 lg:px-14">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />

    <RouterLink :to="$localePath" class="h-full">
      <img
        v-if="$site.themeConfig.logo"
        class="h-full"
        src="/assets/stratum-v2-logo-with-text.svg"
        :alt="$siteTitle"
      />
    </RouterLink>

    <div
      class="hidden lg:block"
    >
      <NavLink v-for="item of nav" :key="item.link" :item="item" class="hover:text-links mr-8 text-sm lg:text-lg lg:mr-12" />
    </div>
  </header>
</template>

<script>
import SearchBox from "@SearchBox";
import SidebarButton from "@theme/components/SidebarButton.vue";
import NavLink from "@theme/components/NavLink.vue";

export default {
  name: "Navbar",
  components: {
    SidebarButton,
    NavLink,
    SearchBox,
  },
  data() {
    return {
      linksWrapMaxWidth: null,
    };
  },
  computed: {
    nav() {
      return this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || [];
    },
  },
  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, "paddingLeft")) +
      parseInt(css(this.$el, "paddingRight"));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener("resize", handleLinksWrapWidth, false);
  },
};
function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="stylus">
@import "../../styles/theme.styl";
</style>
