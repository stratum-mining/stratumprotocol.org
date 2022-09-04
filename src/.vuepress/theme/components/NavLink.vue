<template>
  <Link :item="item">
    <div class="flex hover:text-links flew-row align-center">
      <img class="mr-3 w-6 h-6" v-if="iconUrl" :src="iconUrl" />
      <span class="leading-6">{{ item.text }}</span>
    </div>
  </Link>
</template>

<script>
import Link from "@theme/components/Link.vue";

export default {
  name: "NavLink",
  components: { Link },
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
