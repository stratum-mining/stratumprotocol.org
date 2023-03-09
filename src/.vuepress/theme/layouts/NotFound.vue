<template>
  <div
    class="flex overflow-hidden fixed flex-col justify-center items-center w-screen h-screen bg-center bg-no-repeat bg-cover bg-dark-200"
    :style="{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.background})`,
    }"
  >
    <div class="flex flex-col items center max-w-[800px]">
      <h1 class="text-[142px]">404</h1>
      <h2 class="mx-8 text-3xl text-center">{{ content.title }}</h2>
      <!-- CTA to Home -->
      <PrimaryLink class="mt-6" :item="{ text: content.cta, link: '/' }" />
      <p class="max-w-[280px] text-center text-bodyText text-sm mt-10">
        {{ content.text }}
      </p>
    </div>
  </div>
</template>

<script>
import PrimaryLink from "@theme/components/PrimaryLink.vue";

import { classNames } from "../../utils";

const contents = [
  {
    title:
      "Looks like the page you were looking for took off without you, but the rocketship hasn’t departed. Hope on in!",
    text: "This will just take you to the home page, where possibilities are limitless 🐋",
    cta: "Dream on",
    background: "/assets/404-background-1.png",
  },
  {
    title: "Can’t find your page? Never stop dreaming.",
    text: "Get ready for takeoff while you explore around. That page has to be somewhere...",
    cta: "Board the ship",
    background: "/assets/404-background-2.png",
  },
  {
    title:
      "Looks like you overshot your destination  and landed in an uninhabitable galaxy. ",
    text: "This will just take you to the home page. Sadly, time travel is not possible (yet).",
    cta: "Rewind time to try again",
    background: "/assets/404-background-3.png",
  },
];

export default {
  name: "NotFound",
  components: { PrimaryLink },
  methods: { classNames },
  data() {
    return {
      content: contents[Math.floor(Math.random() * contents.length)],
    };
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
