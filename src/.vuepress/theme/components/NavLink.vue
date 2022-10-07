<template>
  <Link :item="item">
    <div
      :class="
        classNames(
          'flex flew-row align-center text-sm lg:text-base px-4 py-1.5 rounded-xl',
          isActive($route, item.link)
            ? 'text-white bg-dark-500 hover:text-white'
            : 'hover:text-links text-bodyText'
        )
      "
    >
      <img class="mr-3 w-6 h-6" v-if="iconUrl" :src="iconUrl" />
      <span class="leading-6">{{ item.text }}</span>
    </div>
  </Link>
</template>

<script>
import Link from "@theme/components/Link.vue";
import { classNames, isActive } from "../../utils";

export default {
  name: "NavLink",
  components: { Link },
  methods: {
    isActive,
    classNames,
  },
  props: {
    item: {
      required: true,
    },
    iconUrl: String,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
