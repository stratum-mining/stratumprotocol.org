<template>
  <header
    :class="
      classNames(
        'fixed top-0 left-0 z-[50] border-b-none flex flex-row justify-between duration-200',
        'px-4 py-6 md:px-10 lg:px-14 w-screen box-border',
        'h-24 lg:h-28',
        hasScrolled ? 'hidden'
      )
    "
  >
    <div class="flex flex-row items-center h-full">
      <SidebarButton class="-mt-2" @toggle-sidebar="$emit('toggle-sidebar')" />

      <RouterLink
        v-show="withLogo"
        :to="$localePath"
        class="ml-6 h-full lg:ml-0"
      >
        <img
          v-if="$site.themeConfig.logo"
          class="h-full"
          src="/assets/stratum-v2-icon-with-text.svg"
          :alt="$siteTitle"
        />
      </RouterLink>
    </div>

    <div class="hidden lg:block">
      <div class="flex space-x-8">
        <NavLink v-for="item of nav" :key="item.link" :item="item" />
      </div>
    </div>
  </header>
</template>

<script>
import SearchBox from "@SearchBox";
import SidebarButton from "@theme/components/SidebarButton.vue";
import NavLink from "@theme/components/NavLink.vue";
import { classNames, isActive } from "../../utils";

export default {
  name: "Navbar",
  components: {
    SidebarButton,
    NavLink,
    SearchBox,
  },
  data() {
    return {
      hasScrolled: false,
    };
  },
  props: {
    links: {
      required: false,
    },
    withLogo: {
      default: false,
    },
  },
  computed: {
    nav() {
      return this.links || this.$site.themeConfig.nav || [];
    },
  },
  methods: {
    classNames,
    isActive,
    handleScroll: function () {
      this.hasScrolled = window.scrollY > 0;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed: function () {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="stylus">
@import "../../styles/theme.styl";
</style>
