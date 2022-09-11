<template>
  <div
    :class="classNames('absolute top-0 w-screen bg-dark-100 pt-8 lg:pt-32')"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Background Image -->
    <img class="fixed top-0 left-0 z-10 w-screen" src="/assets/dark-bg.svg" />

    <!-- Background Lights -->
    <img
      class="fixed -top-[700px] z-10 m-auto left-1/2"
      :style="{ transform: 'translateX(-50%)' }"
      src="/assets/transparent-blur.svg"
    />

    <Navbar @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar Overlay -->
    <div
      @click="toggleSidebar(false)"
      class="fixed top-0 left-0 z-30 h-screen bg-gray-800/25"
      v-bind:class="{ [isSidebarOpen ? 'w-screen' : 'w-0']: true }"
    />

    <!-- Content & Sidebar -->
    <div class="relative mx-auto w-screen max-w-7xl">
      <SideBar
        class="nav-sidebar"
        v-bind:class="{ open: isSidebarOpen }"
        :items="sidebarItems"
      />

      <!-- Main content -->
      <div
        class="relative z-[10] mx-3 lg:mx-8 mt-14 mb-28 lg:ml-[315px] px-6 md:px-12 lg:px-24 py-6 md:py-8 lg:py-14"
      >
        <div v-if="data.pageHeading" class="page-heading">
          {{ data.pageHeading }}
        </div>

        <Content />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@theme/components/Navbar.vue";
import { classNames, resolveSidebarItems } from "../../utils";
import SideBar from "@theme/components/Sidebar.vue";

export default {
  name: "Home",
  components: { Navbar, SideBar },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },

  data() {
    return {
      isSidebarOpen: false,
    };
  },

  computed: {
    data() {
      return this.$page.frontmatter;
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },
  },

  methods: {
    classNames: classNames,
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },
    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";

.nav-sidebar {
  transform: translateX(-100%);
  transition: transform .2s ease;

  @media (min-width: 1024px){
    transform: translateX(0);
  }
}

.open {
  transform: translateX(0)
}
</style>