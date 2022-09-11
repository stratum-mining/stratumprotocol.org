<template>
  <Link :item="item">
    <div
      class="px-8 py-4 text-lg font-bold text-center rounded-lg bg-levelThree hover:bg-levelThreeHover"
    >
      {{ item.text }}
    </div>
  </Link>
</template>

<script>
import Link from "@theme/components/Link.vue";

export default {
  name: "SecondaryLink",
  components: { Link },
  props: {
    item: { required: true },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
