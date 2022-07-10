// Forked from https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/theme-default/components/SidebarLinks.vue

<template>
  <ul v-if="items.length" class="sidebar-links">
    <li class="sidebar-link-item body-text" v-for="(item, i) in items" :key="i">
      <SidebarGroup
        v-if="item.type === 'group'"
        :item="item"
        :open="i === openGroupIndex"
        :collapsable="item.collapsable || item.collapsible"
        :depth="depth"
        @toggle="toggleGroup(i)"
        v-bind:class="{ active: isActive(item) }"
      />
      <SidebarLink
        v-else
        :sidebar-depth="sidebarDepth"
        :item="item"
        v-bind:class="{ active: isActive(item) }"
      />
    </li>
  </ul>
</template>

<script>
import SidebarGroup from "@theme/components/SidebarGroup.vue";
import SidebarLink from "@theme/components/SidebarLink.vue";
import { isActive } from "../../utils";
export default {
  name: "SidebarLinks",
  components: { SidebarGroup, SidebarLink },
  props: [
    "items",
    "depth", // depth of current sidebar links
    "sidebarDepth", // depth of headers to be extracted
    "initialOpenGroupIndex",
  ],
  data() {
    return {
      openGroupIndex: this.initialOpenGroupIndex || 0,
    };
  },
  watch: {
    $route() {
      this.refreshIndex();
    },
  },
  created() {
    this.refreshIndex();
  },
  methods: {
    refreshIndex() {
      const index = resolveOpenGroupIndex(this.$route, this.items);
      if (index > -1) {
        this.openGroupIndex = index;
      }
    },
    toggleGroup(index) {
      this.openGroupIndex = index === this.openGroupIndex ? -1 : index;
    },
    isActive(page) {
      console.log(this.$route, page);
      if (!page.path) return false;
      return isActive(this.$route, page.path);
    },
  },
};
function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (descendantIsActive(route, item)) {
      return i;
    }
  }
  return -1;
}
function descendantIsActive(route, item) {
  if (item.type === "group") {
    const childIsActive = item.path && isActive(route, item.path);
    const grandChildIsActive = item.children.some((child) => {
      if (child.type === "group") {
        return descendantIsActive(route, child);
      } else {
        return child.type === "page" && isActive(route, child.path);
      }
    });
    return childIsActive || grandChildIsActive;
  }
  return false;
}
</script>

<style scoped>
.sidebar-link-item {
  margin-bottom: 24px;

  font-family: "Rubik";
  font-style: normal;
  font-weight: 400;
}

.sidebar-link-item a:hover {
  color: #22c55e;
}

.active a {
  color: #22c55e;
}
</style>
