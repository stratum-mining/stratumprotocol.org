<template>
  <div
    class="flex overflow-hidden relative flex-col items-center w-screen min-h-screen bg-levelOne"
  >
    <div
      class="flex relative flex-col justify-center items-center w-full min-h-screen bg-no-repeat bg-cover"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <nav
        class="top-0 right-0 justify-end mt-8 w-full md:absolute md:flex"
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
        <!-- StratumV2 Logo -->
        <img class="relative w-3/5 md:w-[220px] m-auto" :src="data.heroImage" />

        <!-- Logo tagline -->
        <div class="mt-8 text-lg text-center max-w-full w-[750px] lg:text-2xl">
          {{ data.tagline }}
        </div>

        <!-- Website main heading -->
        <h1 class="mt-12 mb-0 text-3xl lg:text-5xl">{{ data.heroTitle }}</h1>

        <!-- Introduction -->
        <p
          class="w-full max-w-[90vw] xl:w-[1200px] text-center mb-12 text-xl lg:text-2xl"
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

    <!-- Features section -->
    <div class="px-6 py-24 space-y-24 md:py-36 md:space-y-36">
      <div class="flex z-20 flex-col">
        <h1 class="mb-16 text-3xl lg:text-5xl">{{ data.whyTitle }}</h1>
        <div class="grid-cols-2 gap-10 2xl:grid">
          <div
            v-for="why of data.why"
            :key="why.value"
            class="w-full md:w-[700px] md:flex md:space-x-8 mb-10"
            :id="why.value"
          >
            <img
              class="p-5 mb-5 w-10 h-10 rounded-2xl md:mb-0 bg-icon"
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

      <!-- Section highlighting entities supporting StratumV2 development -->
      <div class="flex relative z-20 flex-col">
        <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.supportersTitle }}</h1>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-12 text-xl lg:text-2xl"
        >
          {{ data.supportersText }}
        </p>

        <div class="flex flex-wrap justify-center items-center mb-10">
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
      <div class="flex relative z-20 flex-col">
        <h1 class="mb-8 text-3xl lg:text-5xl">{{ data.endorsementsTitle }}</h1>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-12 text-xl lg:text-2xl"
        >
          {{ data.endorsementsText }}
        </p>

        <div class="flex flex-wrap justify-center items-center mb-10">
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

export default {
  name: "Home",

  components: {
    NavLink,
    PrimaryLink,
    SecondaryLink,
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
