<template>
  <a
    :href="url"
    class="bg-links rounded-lg py-4 px-8 font-bold text-lg text-center"
    >{{ title }} <img v-if="icon" :src="icon"
  /></a>
</template>

<script>
export default {
  name: "PrimaryLink",

  props: {
    title: String,
    url: String,
    icon: String,
  },
};
</script>
