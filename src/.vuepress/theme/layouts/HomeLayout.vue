<template>
  <div
    class="flex overflow-hidden relative flex-col items-center w-screen min-h-screen bg-dark-200"
  >
    <div
      class="box-border flex relative flex-col justify-center items-center py-0 w-full h-screen bg-no-repeat bg-cover md:pt-20"
      :style="{
        backgroundImage: `url(${data.background})`,
      }"
    >
      <Navbar @toggle-sidebar="toggleSidebar" />

      <Sidebar @close="isSidebarOpen = false" :isOpen="isSidebarOpen" />

      <div class="flex flex-col items-center w-screen">
        <!-- StratumV2 Logo -->
        <img
          class="relative w-3/5 max-w-[220px] m-auto"
          :src="data.heroImage"
        />
        <!-- Logo tagline -->
        <h1
          class="box-border px-4 mt-16 mb-0 max-w-full text-xl text-center sm:text-3xl font-title md:text-4xl lg:text-5xl"
        >
          {{ data.tagline }}
        </h1>

        <!-- Introduction -->
        <p
          class="w-full max-w-[90vw] xl:w-[960px] text-center my-14 text-base sm:text-xl box-border px-4 text-bodyText"
        >
          {{ data.heroText1 }}
          <span class="text-accent">{{ data.heroTextHighlight }}</span>
          {{ data.heroText2 }}
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
    <div class="relative px-6 pb-24 space-y-24 w-screen md:pb-36 md:space-y-36">
      <!-- Configurations section -->
      <div class="flex relative z-20 flex-col px-8 mt-10">
        <h2 class="mb-12 text-2xl font-bold text-center lg:text-4xl">
          {{ data.configurationTitle }}
        </h2>

        <Tabs
          :tabs="data.configurationTabs"
          :selected="selectedConfigurationTab"
          @tab-selected="selectedConfigurationTab = $event"
        />

        <p
          class="text-base md:text-lg text-bodyText w-full lg:w-[775px] text-center my-10"
        >
          {{ selectedConfigurationTab.textContent }}
        </p>

        <img
          :src="selectedConfigurationTab.visualSrc"
          alt="diagram"
          class="hidden w-full xl:w-auto md:block"
        />
        <img
          :src="selectedConfigurationTab.mobileVisualSrc"
          alt="diagram"
          class="block w-full max-w-96 md:hidden"
        />

        <img
          src="/assets/deco-orange.svg"
          alt="sparkles"
          class="absolute left-20 -bottom-44 w-96 opacity-50 md:opacity-100 lg:w-128"
        />
      </div>

      <!-- Features section -->
      <div class="flex relative z-20 flex-col px-8">
        <img
          src="/assets/deco-cyan.svg"
          alt="sparkles"
          class="absolute right-24 -bottom-32 w-56 opacity-50 md:opacity-100 lg:w-72"
        />
        <h2 class="z-20 mb-16 text-3xl font-bold text-center lg:text-4xl">
          {{ data.whyTitle }}
        </h2>

        <div class="grid z-20 gap-10 md:grid-cols-2">
          <div
            v-for="why of data.why"
            :key="why.value"
            class="mb-10 md:flex md:space-x-8"
            :id="why.value"
          >
            <img
              class="box-content p-3 mb-3 w-6 h-6 rounded-xl md:mb-0 bg-icon"
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

      <!-- Road map (hidden for now) -->
      <!-- <RoadMapSection
        :steps="data.roadmapSteps"
        :title="data.roadmapTitle"
        :text="data.roadmapTagline"
      /> -->

      <!-- Specification Authors section -->
      <div class="flex relative z-30 flex-col px-16">
        <h2 class="z-20 mb-4 text-3xl font-bold text-center lg:text-4xl">
          {{ data.specificationAuthorsTitle }}
        </h2>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-4 md:mb-8 text-base md:text-lg text-bodyText z-20"
        >
          {{ data.specificationAuthorsText }}
        </p>
        <div class="flex flex-col items-center mt-8 md:items-start md:flex-row">
          <div class="flex flex-col space-y-8">
            <div
              v-for="author of data.authors"
              :key="author.name"
              :class="
                classNames(
                  'relative w-64 h-48 bg-center bg-cover rounded-xl flex flex-col-reverse items-center'
                )
              "
              :style="{ backgroundImage: `url(${author.image})` }"
            >
              <div
                class="bottom-4 py-1 mb-2 w-32 text-xs text-center bg-white rounded-full text-dark-300"
              >
                {{ author.name }}
              </div>
            </div>
          </div>
          <div
            class="flex flex-col max-w-[500px] text-sm md:ml-16 mt-8 md:mt-0"
          >
            <div
              v-for="(block, index) of data.specificationAuthorsContent"
              :key="`specificationAuthorsContent-content-${index}`"
              class="mb-8"
            >
              <h4 v-if="block.title" class="m-0 text-xl">{{ block.title }}</h4>
              <p
                v-if="block.content"
                class="m-0 mt-4 text-base text-justify text-bodyText"
              >
                {{ block.content }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section highlighting entities supporting StratumV2 development -->
      <div class="flex relative z-20 flex-col px-8">
        <!-- Decoration -->
        <img
          src="/assets/planet.png"
          alt="planet"
          class="absolute right-0 bottom-0 w-56 lg:w-80"
        />
        <img
          src="/assets/deco-yellow.svg"
          alt="sparkles"
          class="absolute left-16 -top-72 w-56 opacity-50 xl:-top-44 md:opacity-100 lg:w-72"
        />

        <!-- Section title -->
        <h2 class="mb-4 text-2xl font-bold text-center lg:text-4xl">
          {{ data.supportersTitle }}
        </h2>
        <p
          class="w-full md:w-[500px] lg:w-[800px] text-center mb-10 md:mb-12 text-base md:text-lg text-bodyText z-20"
        >
          {{ data.supportersText1 }}
        </p>

        <!-- Supporters category selection -->
        <Tabs
          :tabs="data.supportersTabs"
          :selected="selectedSupportersTab"
          @tab-selected="selectedSupportersTab = $event"
        />

        <div class="flex z-20 flex-row flex-wrap mx-auto mt-8 mb-12 max-w-5xl">
          <a
            v-for="supporter of displayedSupporters"
            :key="supporter.value"
            class="flex justify-center items-center p-5 m-4 w-60 h-32 rounded-lg bg-icon hover:bg-dark-500"
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

      <img
        src="/assets/deco-yellow.svg"
        alt="sparkles"
        class="absolute right-6 top-12 w-56 opacity-50 md:opacity-100 lg:w-72"
      />
    </div>

    <!-- Page Footer -->
    <footer
      class="text-base text-center mb-6 text-bodyText transition-opacity z-[20] px-8"
    >
      <p class="text-white">
        {{ data.footerTitle }}
      </p>

      <!-- Links to StratumV2's social medias -->
      <div class="flex justify-center items-center mb-10 space-x-8">
        <a v-for="link of data.footerLinks" :key="link.url" :href="link.url">
          <img
            :src="link.icon"
            class="p-3 w-8 h-8 rounded-full bg-dark-400 hover:bg-dark-500"
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

      <p class="mt-40 text-sm" v-html="data.footerBottom" />
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
import RoadMapSection from "@theme/components/RoadMapSection.vue";
import Tabs from "@theme/components/Tabs.vue";
import Navbar from "@theme/components/Navbar.vue";
import Sidebar from "@theme/components/Sidebar.vue";

import { classNames } from "../../utils";

export default {
  name: "Home",

  components: {
    NavLink,
    PrimaryLink,
    SecondaryLink,
    RoadMapSection,
    Tabs,
    Navbar,
    Sidebar,
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },

  data() {
    return {
      selectedConfigurationTab: {},
      selectedSupportersTab: {},
      isSidebarOpen: false,
    };
  },

  created() {
    this.selectedConfigurationTab = this.data.configurationTabs[0];
    this.selectedSupportersTab = this.data.supportersTabs[0];
  },

  computed: {
    data() {
      return this.$page.frontmatter;
    },
    displayedSupporters() {
      if (!this.selectedSupportersTab?.supporters) return this.data.supporters;

      return this.data.supporters.filter(({ value }) =>
        this.selectedSupportersTab.supporters.includes(value)
      );
    },
  },

  methods: {
    classNames,
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
