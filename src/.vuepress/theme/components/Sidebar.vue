<template>
  <aside
    :class="
      classNames(
        'fixed box-border overflow-scroll z-[30] border-none',
        'bg-dark-300 lg:bg-transparent',
        'w-screen max-w-sm text-lg h-screen md:h-[600px]',
        'left-0 top-0 lg:top-auto pt-16 lg:pt-0 pl-12 xl:ml-[calc(50vw-640px)]'
      )
    "
  >
    <div class="overflow-scroll w-full h-full">
      <NavLinks class="block lg:hidden" />

      <slot name="top" />

      <SidebarLinks :depth="0" :items="items" />
      <slot name="bottom" />
    </div>
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
