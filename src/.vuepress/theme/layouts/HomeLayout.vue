<template>
  <div
    class="relative w-screen min-h-screen overflow-hidden flex flex-col items-center bg-levelOne"
    @scroll="handleScroll"
  >
    <div
      class="relative h-screen w-full bg-cover bg-no-repeat flex flex-col items-center justify-between"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <nav class="md:flex justify-end mt-8 w-full" v-if="data.links">
        <div class="flex flex-wrap justify-around md:block md:mr-8 lg:mr-16">
          <div
            class="md:flex justify-end align-center mb-4 lg:mb-8 md:text-right md:ml-auto"
            v-for="link of data.links"
            :key="link.url"
          >
            <NavLink
              :iconUrl="link.icon"
              :item="{ link: link.url, text: link.title }"
            ></NavLink>
          </div>
        </div>
      </nav>

      <div class="flex flex-col items-center w-screen">
        <img
          class="relative w-11/12 md:w-[600px] m-auto"
          :src="data.heroImage"
        />
        <div class="w-max-content text-center text-lg lg:text-2xl">
          {{ data.tagline }}
        </div>

        <div class="mt-14 flex flex-col items-center text-lg lg:text-2xl">
          <div class="w-max-content">{{ data.actionText }}</div>
          <div class="mt-6 w-full md:flex flex-rol flex-wrap justify-center">
            <a
              v-for="feature of data.features"
              :key="feature.value"
              :href="`#${feature.value}`"
              @click="scrollTo($event, feature.value)"
            >
              <button
                class="relative z-[30] w-44 lg:w-56 mb-6 rounded-lg text-sm lg:text-lg mx-3 py-2 lg:px-8 lg:py-4 bg-transparent cursor-pointer text-white border-solid border-[1.5px] border-white hover:border-links hover:text-links font-bold block md:inline"
              >
                {{ feature.title }}
              </button>
            </a>
          </div>
        </div>

        <div
          class="mt-28 mx-4 text-center text-base lg:text-2xl relative z-[15]"
        >
          Or check out our
          <a
            class="relative underline cursor-pointer"
            href="https://github.com/stratum-mining"
            target="_blank"
            rel="noopener noreferrer"
            >documentation</a
          >
          and
          <a
            class="underline cursor-pointer"
            href="https://github.com/stratum-mining"
            target="_blank"
            rel="noopener noreferrer"
            >contribute</a
          >
        </div>
      </div>

      <div
        class="text-center mb-6 text-bodyText transition-opacity z-[30]"
        v-bind:style="{ opacity: showGradientBg ? '0' : '1' }"
      >
        {{ data.footer }}
      </div>

      <div
        class="absolute z-[10] left-0 -bottom-36 h-96 w-full transition-opacity"
        v-bind:style="{
          opacity: showGradientBg ? '1' : '0',
          background: 'linear-gradient(#01142600 0%, #011426 60%)',
        }"
      ></div>
    </div>

    <div class="z-20 flex flex-col mb-24 md:mb-36 px-12">
      <h1 class="mb-16 text-3xl lg:text-5xl">{{ data.whyTitle }}</h1>

      <div class="flex flex-wrap justify-around">
        <div
          v-for="(why, index) of data.why"
          :key="why.value"
          class="w-full md:w-[700px] md:flex md:space-x-8 mb-10"
          :id="why.value"
        >
          <img
            class="mb-5 md:mb-0 h-10 w-10 bg-icon rounded-2xl p-5"
            :src="why.image"
          />
          <div>
            <h2 class="m-0 text-2xl">{{ why.title }}</h2>
            <p class="text-2xl">
              {{ why.text }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer
      class="text-2xl text-center mb-6 text-bodyText transition-opacity z-[20] flex flex-wrap justify-center items-center"
    >
      <span class="mx-3 pb-3">
        {{ data.footer }}
      </span>

      <span
        v-for="link of data.footerLinks"
        :key="link.url"
        class="ml-3 md:ml-0 pb-3"
      >
        <NavLink :iconUrl="link.icon" :item="{ link: link.url }" class="w-9" />
      </span>
    </footer>

    <img
      class="absolute left-0 bottom-0 w-screen h-auto z-[10]"
      src="/assets/home-bottom.svg"
    />
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";

export default {
  name: "Home",

  components: {
    NavLink,
  },

  data() {
    return { showGradientBg: false };
  },

  computed: {
    data() {
      return this.$page.frontmatter;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showGradientBg = window.scrollY > 0;
    },
    scrollTo(event, anchor) {
      event.preventDefault();
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
