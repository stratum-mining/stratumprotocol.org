<template>
  <div>
    <aside
      v-bind:class="{
        [classNames(
          'sidebar-transform',
          'fixed box-border overflow-auto z-40',
          'bg-dark-300 lg:bg-transparent',
          'border-white border-t-0 border-l-0 border-r-2 border-b-2 border-solid rounded-br-3xl lg:border-none',
          'w-screen max-w-sm text-lg max-h-screen md:max-h-[600px] h-fit',
          'left-0 top-0 lg:top-auto pt-20 pb-6 lg:pt-0 pl-12 xl:ml-[calc(50vw-640px)]'
        )]: true,
        open: isOpen,
      }"
    >
      <div class="overflow-auto w-full">
        <NavLinks class="block pb-6 lg:hidden" />

        <template v-if="items">
          <hr class="mr-12 lg:hidden" />
          <SidebarLinks :depth="0" :items="items" />
        </template>
      </div>
    </aside>

    <div
      @click="$emit('close')"
      class="fixed top-0 left-0 z-30 h-screen bg-gray-800/25"
      v-bind:class="{ [isOpen ? 'w-screen' : 'w-0']: true }"
    />
  </div>
</template>

<script>
import SidebarLinks from "@theme/components/SidebarLinks.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import { classNames } from "../../utils";

export default {
  name: "Sidebar",
  components: { SidebarLinks, NavLinks },
  props: ["items", "isOpen"],
  methods: {
    classNames,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";

.sidebar-transform {
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
