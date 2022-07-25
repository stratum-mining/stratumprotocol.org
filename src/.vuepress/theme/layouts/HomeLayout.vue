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
      <nav
        class="flex justify-end mt-8 lg:mt-12 w-full mb-12"
        v-if="data.links"
      >
        <div class="mr-8 lg:mr-16">
          <div
            class="flex justify-end align-center mb-4 lg:mb-8 text-right ml-auto"
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
          class="relative w-max-content max-w-[90%] m-auto"
          :src="data.heroImage"
        />
        <div class="mt-8 w-max-content text-center text-lg lg:text-2xl">
          {{ data.tagline }}
        </div>

        <div class="mt-14 flex flex-col items-center text-lg lg:text-2xl">
          <div class="w-max-content">{{ data.actionText }}</div>
          <div class="mt-8 w-full flex flex-rol flex-wrap justify-center">
            <a
              v-for="feature of data.features"
              :key="feature.value"
              :href="`#${feature.value}`"
              @click="scrollTo($event, feature.value)"
            >
              <button
                class="relative z-[30] w-44 lg:w-56 mb-6 lg:mb-8 rounded-lg text-sm lg:text-lg mx-3 py-2 lg:px-8 lg:py-4 bg-transparent cursor-pointer text-white border-solid border-[1.5px] border-white hover:border-links hover:text-links"
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
        class="text-xs lg:text-base text-center mb-6 text-bodyText transition-opacity z-[30]"
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

    <div class="flex flex-col pt-36 mb-80 z-[20]">
      <div class="flex flex-col mb-44 lg:mb-80">
        <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.introductionTitle }}</h1>
        <p
          class="w-[1040px] max-w-[90vw] text-center mt-O mb-12 mx-auto text-base lg:text-lg"
        >
          {{ data.introductionText }}
        </p>
        <RouterLink class="text-xl text-links" :to="data.introductionCtaLink">
          {{ data.introductionCtaTitle }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-[20px] h-[19px] ml-2"
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
          <h2 class="border-b-none mb-6 mt-0">{{ feature.title }}</h2>
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
      class="text-xs lg:text-base text-center mb-6 text-bodyText transition-opacity z-[20]"
    >
      {{ data.footer }}
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
