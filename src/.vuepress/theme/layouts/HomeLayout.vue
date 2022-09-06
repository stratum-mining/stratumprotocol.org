<template>
  <div
    class="flex overflow-hidden relative flex-col items-center w-screen min-h-screen bg-levelOne"
  >
    <div
      class="py-20 md:py-0 flex relative flex-col justify-center items-center w-full min-h-screen bg-no-repeat bg-cover"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <div class="flex flex-col items-center w-screen">
        <!-- StratumV2 Logo -->
        <img class="relative w-3/5 md:w-[220px] m-auto" :src="data.heroImage" />

        <!-- Logo tagline -->
        <div
          class="mt-8 text-base text-center max-w-full px-4 w-[750px] lg:text-xl box-border"
        >
          {{ data.tagline }}
        </div>

        <!-- Website main heading -->
        <h1 class="mt-12 mb-4 text-4xl font-bold md:mb-8 lg:text-6xl">
          {{ data.heroTitle }}
        </h1>

        <!-- Introduction -->
        <p
          class="w-full max-w-[90vw] xl:w-[960px] text-center mb-12 text-base sm:text-xl box-border px-4 text-bodyText"
        >
          {{ data.heroText }}
          <span class="text-accent">{{ data.heroTextHighlight }}</span
          >.
        </p>

        <!-- CTA to Documentation -->
        <PrimaryLink
          :item="{
            text: data.documentationCtaText,
            link: data.documentationCtaLink,
          }"
          icon="/assets/arrow-right.svg"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="top-shadow px-6 pb-24 space-y-24 w-screen md:pb-36 md:space-y-36 relative"
    >
      <img
        src="/assets/deco-yellow.png"
        alt="sparkles"
        class="absolute right-0 top-0 w-56 lg:w-96"
      />

      <!-- Diagram section -->
      <div class="flex z-20 flex-col px-8 relative">
        <img src="/assets/diagram.png" alt="diagram" class="w-full xl:w-auto" />
      </div>

      <!-- Features section -->
      <div class="flex z-20 flex-col px-8 relative">
        <img
          src="/assets/deco-magenta.png"
          alt="sparkles"
          class="absolute left-0 bottom-0 w-96 lg:w-auto"
        />
        <h2 class="z-20 mb-16 text-3xl font-bold text-center lg:text-4xl">
          {{ data.whyTitle }}
        </h2>
        <div class="z-20 grid gap-10 md:grid-cols-2">
          <div
            v-for="why of data.why"
            :key="why.value"
            class="mb-10 md:flex md:space-x-8"
            :id="why.value"
          >
            <img
              class="box-content p-5 mb-5 w-10 h-10 rounded-2xl md:mb-0 bg-icon"
              :src="why.image"
            />
            <div class="max-w-sm md:max-w-md">
              <h3 class="m-0 text-base font-bold md:text-lg">
                {{ why.title }}
              </h3>
              <p class="text-base md:text-lg text-bodyText">
                {{ why.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Road map -->
      <div class="flex relative z-20 flex-col items-center">
        <h2 class="mb-8 text-3xl font-bold text-center lg:text-4xl">
          {{ data.roadmapTitle }}
        </h2>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-20 md:mb-6 text-base md:text-lg text-bodyText"
        >
          {{ data.roadmapTagline }}
        </p>
        <RoadMapSteps :steps="data.roadmapSteps" />
      </div>

      <!-- Section highlighting entities supporting StratumV2 development -->
      <div class="flex relative z-20 flex-col relative">
        <img
          src="/assets/deco-cyan.png"
          alt="sparkles"
          class="absolute right-0 top-0 w-56 lg:w-auto"
        />
        <h2 class="mb-8 text-2xl font-bold text-center lg:text-4xl">
          {{ data.supportersTitle }}
        </h2>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-20 md:mb-6 text-base md:text-lg text-bodyText z-20"
        >
          {{ data.supportersText }}
        </p>

        <div
          class="max-w-7xl mx-auto z-20 flex flex-wrap justify-center items-center mb-10"
        >
          <a
            v-for="supporter of data.supporters"
            :key="supporter.value"
            class="mx-5 my-10"
            :id="supporter.value"
            :href="supporter.link"
          >
            <img :src="supporter.image" />
          </a>
        </div>
        <PrimaryLink
          :item="{
            text: data.supportDevelopersText,
            link: data.supportDevelopersLink,
          }"
        />
      </div>

      <!-- Section highlighting entities approving StratumV2 development -->
      <div class="flex relative z-20 flex-col relative">
        <img
          src="/assets/planet.png"
          alt="planet"
          class="absolute right-0 bottom-0 w-56 lg:w-80"
        />
        <h2 class="mb-8 text-2xl font-bold text-center lg:text-4xl">
          {{ data.endorsementsTitle }}
        </h2>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-20 md:mb-6 text-base md:text-lg text-bodyText z-20"
        >
          {{ data.endorsementsText }}
        </p>

        <div
          class="max-w-7xl mx-auto flex flex-wrap justify-center items-center mb-10"
        >
          <a
            v-for="endorsement of data.endorsements"
            :key="endorsement.value"
            class="my-10 mx-5 z-[20]"
            :id="endorsement.value"
            :href="endorsement.link"
          >
            <img :src="endorsement.image" />
          </a>
        </div>
        <PrimaryLink
          :item="{
            text: data.showSupportText,
            link: data.showSupportLink,
          }"
        />
      </div>
    </div>

    <!-- Page Footer -->
    <footer
      class="text-base text-center mb-6 text-bodyText transition-opacity z-[20]"
    >
      <p class="text-white">
        {{ data.footerTitle }}
      </p>

      <!-- Links to StratumV2's social medias -->
      <div class="flex justify-center items-center mb-10 space-x-8">
        <a v-for="link of data.footerLinks" :key="link.url" :href="link.url">
          <img
            :src="link.icon"
            class="p-3 w-8 h-8 rounded-full bg-levelThree"
          />
        </a>
      </div>

      <!-- CTA to Documentation -->
      <SecondaryLink
        :item="{
          text: data.readDocumentationText,
          link: data.readDocumentationLink,
        }"
      />

      <p class="mt-40 text-sm">
        {{ data.footerBottom }}
      </p>
    </footer>

    <img
      class="absolute left-0 bottom-0 w-screen h-auto z-[10]"
      src="/assets/home-bottom.png"
    />
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import PrimaryLink from "@theme/components/PrimaryLink.vue";
import SecondaryLink from "@theme/components/SecondaryLink.vue";
import RoadMapSteps from "@theme/components/RoadMapSteps.vue";

export default {
  name: "Home",

  components: {
    NavLink,
    PrimaryLink,
    SecondaryLink,
    RoadMapSteps,
  },

  computed: {
    data() {
      return this.$page.frontmatter;
    },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
