<template>
  <div
    :class="classNames('absolute top-0 w-screen bg-dark-100 pt-8 lg:pt-32')"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Background Image -->
    <img
      class="fixed top-0 left-0 z-10 h-2/3 lg:h-auto lg:w-screen"
      src="/assets/dark-bg.svg"
    />

    <!-- Background Lights -->
    <img
      class="fixed left-1/2 z-10 m-auto w-2/3 md:w-1/2"
      :style="{ transform: 'translateX(-50%) translateY(-70%)' }"
      src="/assets/transparent-blur.svg"
    />

    <Navbar withLogo @toggle-sidebar="toggleSidebar" />

    <!-- Content & Sidebar -->
    <div class="relative mx-auto mt-20 w-screen max-w-7xl">
      <SideBar
        @close="isSidebarOpen = false"
        :isOpen="isSidebarOpen"
        :items="sidebarItems"
      />

      <!-- Main content -->
      <div
        class="relative z-[10] mx-3 pt-4 lg:mx-8 mb-28 lg:ml-[315px] px-6 md:px-12 lg:px-24"
      >
        <div v-if="data.pageHeading" class="page-heading">
          {{ data.pageHeading }}
        </div>

        <div class="text-docsText">
          <Content />
        </div>
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
</style>
