<template>
  <div
    class="flex overflow-hidden relative flex-col items-center w-screen min-h-screen bg-levelOne"
    @scroll="handleScroll"
  >
    <div
      class="flex relative flex-col justify-center items-center w-full h-screen bg-no-repeat bg-cover"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <nav class="absolute top-0 right-0 justify-end mt-8 w-full md:flex" v-if="data.links">
        <div class="flex flex-wrap justify-around md:block md:mr-8 lg:mr-16">
          <div
            class="justify-end mb-4 md:flex align-center lg:mb-8 md:text-right md:ml-auto"
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
          class="relative w-11/12 md:w-[220px] m-auto"
          :src="data.heroImage"
        />
        <div class="mt-8 text-lg text-center w-[680px] lg:text-2xl ">
          {{ data.tagline }}
        </div>
      </div>
    </div>

    <div class="flex flex-col pt-36 mb-10 z-[20]">
      <div class="flex flex-col mb-44">
        <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.introductionTitle }}</h1>
        <p
          class="w-[1040px] max-w-[90vw] text-center mt-O mb-12 mx-auto text-base lg:text-2xl"
        >
          {{ data.introductionText }}
        </p>
        <RouterLink :to="data.introductionCtaLink">
          <button
            class="flex flex-row items-center px-8 h-16 text-white rounded-lg border-none cursor-pointer group bg-links"
          >
            <span class="text-lg font-semibold">
              {{ data.introductionCtaTitle }}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="relative left-0 ml-4 w-6 h-6 duration-200 group-hover:left-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </RouterLink>
      </div>

      <div
        v-for="(feature, index) of data.features"
        :key="feature.value"
        class="flex flex-row flex-wrap max-w-[1140px] w-[90vw] justify-between mb-24 md:mb-36 scroll-mt-52 px-12"
        v-bind:style="{
          flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        }"
        :id="feature.value"
      >
        <div class="flex flex-col w-[460px] items-start mx-auto mb-8 md:mb-12">
          <h2 class="mt-0 mb-6 border-b-none">{{ feature.title }}</h2>
          <p class="m-0 text-left">{{ feature.text }}</p>
        </div>
        <div
          class="flex flex-col items-center justify-center relative max-w-[550px] max-h-[340px] rounded-3xl mx-auto"
        >
          <img
            class="z-[20] max-w-full max-h-full rounded-3xl"
            :src="feature.image"
          />
          <img
            :src="feature.imageOverlay"
            class="absolute b-[200px] z-[15]"
            v-bind:style="{ [index % 2 === 0 ? 'right' : 'left']: '-100px' }"
          />
        </div>
      </div>
    </div>

    <footer
      class="text-base text-center mb-6 text-bodyText transition-opacity z-[20] flex flex-wrap justify-center items-center"
    >
      <span class="pb-3 mx-3">
        {{ data.footer }}
      </span>

      <span
        v-for="link of data.footerLinks"
        :key="link.url"
        class="pb-3 ml-3 md:ml-0"
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