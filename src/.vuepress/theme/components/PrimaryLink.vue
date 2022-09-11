<template>
  <Link :item="item">
    <div
      class="group bg-links hover:bg-linksHover text-black rounded-lg py-4 px-8 font-bold text-lg text-center z-[20] flex flex-row items-center relative"
    >
      <span>{{ item.text }}</span>
      <img
        v-if="icon"
        :src="icon"
        class="relative left-0 ml-5 w-5 h-5 duration-300 group-hover:left-1"
      />
    </div>
  </Link>
</template>

<script>
import Link from "@theme/components/Link.vue";

export default {
  name: "PrimaryLink",
  components: {
    Link,
  },
  props: {
    item: {
      required: true,
    },
    icon: String,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
