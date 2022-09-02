<template>
  <div
    class="flex overflow-hidden relative flex-col items-center w-screen min-h-screen bg-levelOne"
    @scroll="handleScroll"
  >
    <div
      class="flex relative flex-col justify-center items-center w-full min-h-screen bg-no-repeat bg-cover"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <nav
        class="absolute top-0 right-0 justify-end mt-8 w-full md:flex"
        v-if="data.links"
      >
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
        <img class="relative w-3/5 md:w-[220px] m-auto" :src="data.heroImage" />
        <div class="mt-8 text-lg text-center max-w-full w-[750px] lg:text-2xl">
          {{ data.tagline }}
        </div>



     <h1 class="mt-12 mb-0 text-3xl lg:text-5xl">{{ data.heroTitle }}</h1>
     <p class="w-full max-w-[90vw] xl:w-[1200px] text-center mb-12 text-xl lg:text-2xl">
       {{ data.heroText }}
     </p>
   <PrimaryLink title="Explore Documentation" url="" icon='/assets/arrow-right.svg' />
      </div>


    </div>

<div class='py-24 md:py-36 space-y-24 md:space-y-36 px-6'>
    <div class="z-20 flex flex-col">
      <h1 class="mb-16 text-3xl lg:text-5xl">{{ data.whyTitle }}</h1>
      <div class="2xl:grid grid-cols-2 gap-10">
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
            <p class="text-xl lg:text-2xl">
              {{ why.text }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="z-20 flex flex-col">
      <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.supportersTitle }}</h1>
      <p class="w-full md:w-[500px] lg:w-[800px] text-center mb-12 text-xl lg:text-2xl">
        {{ data.supportersText }}
      </p>

      <div class="flex flex-wrap justify-center items-center mb-10">
        <a
          v-for="(supporter, index) of data.supporters"
          :key="supporter.value"
          class="my-10 mx-5"
          :id="supporter.value"
          :href="supporter.link"
        >
          <img :src="supporter.image" />
        </a>
      </div>
      <PrimaryLink title="Support Developers" url="" />
    </div>

    <div class="z-20 flex flex-col">
      <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.endorsementsTitle }}</h1>
      <p class="w-full md:w-[500px] lg:w-[800px] text-center mb-12 text-xl lg:text-2xl">
        {{ data.endorsementsText }}
      </p>

      <div class="flex flex-wrap justify-center items-center mb-10">
        <a
          v-for="(endorsement, index) of data.endorsements"
          :key="endorsement.value"
          class="my-10 mx-5 z-[20]"
          :id="endorsement.value"
          :href="endorsement.link"
        >
          <img :src="endorsement.image" />
        </a>
      </div>
      <PrimaryLink title="Show support for SV2" url="" />
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
import PrimaryLink from "@theme/components/PrimaryLink.vue";

export default {
  name: "Home",

  components: {
    NavLink,
    PrimaryLink,
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
