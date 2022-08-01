<template>
  <div
    :class="classNames('absolute top-0 w-screen bg-levelOne pt-8 md:pt-32')"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar @toggle-sidebar="toggleSidebar" />

    <!-- Top Section background -->
    <div
      class="absolute top-0 w-screen h-screen bg-cover bg-no-repeat bg-top flex flex-col"
      :style="{
        backgroundImage: `radial-gradient(41.01% 41.01% at 50% 50%, rgba(1, 20, 38, 0) 0%, rgba(1, 20, 38, 0.8) 100%), url(/assets/documentation-scene.svg)`,
      }"
    >
      <!-- Background Highlights -->
      <img
        class="w-max-content h-full max-w-full max-h-full m-auto"
        src="/assets/transparent-blur.svg"
      />
      <!-- Gradient filter on background image -->
      <div
        class="absolute z-[10] left-0 -bottom-14 h-52 w-full"
        :style="{
          backgroundImage: 'linear-gradient(#01142600 0%, #011426 80%)',
        }"
      />
    </div>

    <!-- Content & Sidebar -->
    <div class="relative w-screen lg:w-[1280px] mx-auto">
      <SideBar
        :class="
          classNames(
            'z-[30] l-0 pl-8 max-h-[600px] border-none lg:ml-[calc(50vw-640px)] bg-levelOne md:bg-transparent/25 mt-16 md:mt-32 w-[300px] md:w-max-content',
            isSidebarOpen && 'translate-x-0'
          )
        "
        :items="sidebarItems"
        id="hide-sidebar"
      />

      <!-- Main content -->
      <div
        class="relative bg-levelTwo z-[10] mx-3 lg:mx-8 py-6 px-6 md:py-8 md:px-12 my-14 lg:ml-[315px] lg:py-14 lg:px-24"
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
</style>
