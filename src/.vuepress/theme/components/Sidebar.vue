<template>
  <aside
    :class="
      classNames(
        'fixed box-border overflow-scroll z-[30] left-0 pl-8 max-h-[600px] border-none xl:ml-[calc(50vw-640px)] bg-levelOne md:bg-transparent/25 w-[300px] md:w-max-content'
      )
    "
  >
    <NavLinks class="block lg:hidden" />

    <slot name="top" />

    <SidebarLinks :depth="0" :items="items" />
    <slot name="bottom" />
  </aside>
</template>

<script>
import SidebarLinks from "@theme/components/SidebarLinks.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import { classNames } from "../../utils";

export default {
  name: "Sidebar",
  components: { SidebarLinks, NavLinks },
  props: ["items"],
  methods: {
    classNames: classNames,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
