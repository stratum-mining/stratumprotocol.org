<template>
  <div
    class="container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="top-scene flex-col">
      <img class="top-scene-blur" src="/assets/transparent-blur.svg" />
    </div>

    <header class="documentation-header flex-row">
      <img class="logo" src="/assets/stratum-v2-logo-with-text.svg" />
      <nav class="flex-row">
        <NavLink
          v-for="link of data.nav"
          :key="link.link"
          class="nav-link body-text"
          :item="{ link: link.link, text: link.text }"
        />
      </nav>
    </header>

    <SideBar class="sidebar" :items="sidebarItems" />

    <div class="content-container">
      <div v-if="data.pageHeading" class="page-heading">
        {{ data.pageHeading }}
      </div>

      <Content />
    </div>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import { resolveSidebarItems } from "../../utils";
import SideBar from "@theme/components/Sidebar.vue";

export default {
  name: "Home",
  components: { NavLink, SideBar },

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

<style scoped lang="css">
.container {
  position: absolute;
  top: 0;
  width: 100vw;
  background: #011426;
}

.documentation-header {
  position: relative;
  z-index: 10;
  justify-content: space-between;
  margin-top: 32px;
  padding: 0 56px;
}

.documentation-header > logo {
  height: 52px;
}

.documentation-header .nav-link {
  margin-left: 48px;
  font-family: Rubik;
  cursor: pointer;
}

.documentation-header .nav-link:hover {
  color: #22c55e;
}

.content-container {
  position: relative;
  z-index: 10;
  width: 810px;
  min-height: 1765px;
  background: #031c34;
  margin: 54px auto;
  padding: 56px 80px;
}

.top-scene {
  position: absolute;
  width: 100vw;
  height: 100vh;

  background-image: radial-gradient(
      41.01% 41.01% at 50% 50%,
      rgba(1, 20, 38, 0) 0%,
      rgba(1, 20, 38, 0.8) 100%
    ),
    url(/assets/documentation-scene.svg);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top;
}

.top-scene::after {
  position: absolute;
  content: "";
  z-index: 10;
  left: 0;
  bottom: -50px;
  height: 200px;
  width: 100%;
  transition: opacity 0.3s;
  background: linear-gradient(#01142600 0%, #011426 80%);
}

.top-scene-blur {
  width: max-content;
  height: 100%;
  margin: auto;
}

.sidebar {
  background: transparent;
  border: none;
  width: 300px;
  height: 844px;
  margin-left: 54px;
  margin-top: 68px;
}
</style>
