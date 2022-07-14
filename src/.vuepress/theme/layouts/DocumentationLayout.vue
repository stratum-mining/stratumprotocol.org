<template>
  <div
    class="absolute t-0 w-screen bg-levelOne"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div
      class="absolute w-screen h-screen bg-cover bg-no-repeat bg-top flex flex-col"
      :style="{
        backgroundImage: `radial-gradient(41.01% 41.01% at 50% 50%, rgba(1, 20, 38, 0) 0%, rgba(1, 20, 38, 0.8) 100%), url(/assets/documentation-scene.svg)`,
      }"
    >
      <img
        class="w-max-content h-full max-w-full max-h-full m-auto"
        src="/assets/transparent-blur.svg"
      />
      <div
        class="absolute z-[10] left-0 -bottom-14 h-52 w-full"
        :style="{
          backgroundImage: 'linear-gradient(#01142600 0%, #011426 80%)',
        }"
      />
    </div>

    <Navbar @toggle-sidebar="toggleSidebar" />

    <div class="relative w-[1280px] mx-auto">
      <SideBar
        class="ml-[calc(50vw-640px)] z-[30] bg-transparent border-none w-max-content mt-32 pl-8 max-h-[600px]"
        :items="sidebarItems"
      />

      <div
        class="relative bg-levelTwo z-[10] mx-8 py-8 px-12 my-14 lg:ml-[315px] lg:py-14 lg:px-24"
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
import { resolveSidebarItems } from "../../utils";
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

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },
  },

  methods: {
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
</style>
