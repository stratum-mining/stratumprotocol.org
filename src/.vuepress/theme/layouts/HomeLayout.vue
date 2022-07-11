<template>
  <div class="container" @scroll="handleScroll">
    <div
      class="top-section-container"
      :style="{
        backgroundImage: `radial-gradient(#01142600 0%,#011426 100%), url(${data.background})`,
      }"
    >
      <nav class="navigation" v-if="data.links">
        <div
          class="navigation-links"
          v-for="link of data.links"
          :key="link.url"
        >
          <NavLink :item="{ link: link.url, text: link.title }"></NavLink>
        </div>
      </nav>

      <div class="hero-section">
        <img :src="data.heroImage" />
        <div class="hero-tagline">
          {{ data.tagline }}
        </div>

        <div class="hero-use-case">
          <div class="hero-use-case-text">{{ data.actionText }}</div>
          <div class="hero-use-case-ctas">
            <a
              v-for="feature of data.features"
              :key="feature.value"
              :href="`#${feature.value}`"
              @click="scrollTo($event, feature.value)"
            >
              <button>{{ feature.title }}</button>
            </a>
          </div>
        </div>

        <div class="sub-action">
          Or check out our
          <a
            class="external-link"
            href="https://github.com/stratum-mining"
            target="_blank"
            rel="noopener noreferrer"
            >documentation</a
          >
          and
          <a
            class="external-link"
            href="https://github.com/stratum-mining"
            target="_blank"
            rel="noopener noreferrer"
            >contribute</a
          >
        </div>
      </div>

      <div
        class="footer"
        v-bind:style="{ opacity: showGradientBg ? '0' : '1' }"
      >
        {{ data.footer }}
      </div>

      <div
        class="bg-gradient"
        v-bind:style="{
          opacity: showGradientBg ? '1' : '0',
        }"
      ></div>
    </div>

    <div class="features-section flex-col">
      <div class="introduction flex-col">
        <h1>{{ data.introductionTitle }}</h1>
        <p>{{ data.introductionText }}</p>
        <NavLink
          :item="{
            link: data.introductionCtaLink,
            text: data.introductionCtaTitle,
          }"
        >
        </NavLink>

        <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            class="arrow-right"
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
          </svg> -->
      </div>

      <div
        v-for="(feature, index) of data.features"
        :key="feature.value"
        class="feature flex-row"
        v-bind:style="{
          flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
        }"
        :id="feature.value"
      >
        <div class="feature-text flex-col">
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.text }}</p>
        </div>
        <div class="feature-image flex-col">
          <img :src="feature.image" />
          <img
            :src="feature.imageOverlay"
            class="image-overlay"
            v-bind:style="{ [index % 2 === 0 ? 'right' : 'left']: '-100px' }"
          />
        </div>
      </div>
    </div>

    <footer class="footer">
      {{ data.footer }}
    </footer>

    <img class="bottom-scene" src="/assets/home-bottom.svg" />
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

<style scoped lang="css">
.container {
  position: relative;
  width: 100vw;
  min-height: 300vh;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: #011426;
}

.top-section-container {
  position: relative;
  height: 100vh;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.navigation {
  margin-top: 48px;
  width: calc(100% - 120px);
  padding: 0 60px;
}

.navigation-links {
  margin-bottom: 24px;
  text-align: right;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-section > img {
  position: relative;
  width: max-content;
  margin: auto;
}

.hero-tagline {
  margin-top: 32px;
  width: max-content;
  font-size: 24px;
}

.hero-use-case {
  margin-top: 56px;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 24px;
}

.hero-use-case-ctas {
  margin-top: 29px;
  width: 100;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.hero-use-case-text {
  width: max-content;
}

.hero-use-case-ctas button {
  width: 224px;
}

.sub-action {
  margin-top: 108px;
  font-size: 24px;
}

.external-link {
  position: relative;
  text-decoration: underline;
  cursor: pointer;
  z-index: 15;
}

.footer {
  font-size: 15px;
  margin-bottom: 24px;
  color: #c1ddf9;
  transition: opacity 0.2s;
  z-index: 30;
}

.bg-gradient {
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: -150px;
  height: 400px;
  width: 100%;
  transition: opacity 0.3s;
  background: linear-gradient(#01142600 0%, #011426 60%);
}

.features-section {
  padding-top: 150px;
  margin-bottom: 340px;
  z-index: 20;
}

.introduction {
  margin-bottom: 86px;
}

.introduction > h1 {
  margin-bottom: 32px;
}

.introduction > p {
  width: 1040px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 48px;
}

.introduction > a {
  font-size: 20px;
  color: #22c55e;
}

.arrow-right {
  width: 20px;
  height: 19px;
  margin-left: 10px;
}

.feature {
  width: 1140px;
  justify-content: space-between;
  margin-bottom: 144px;
  scroll-margin-top: 200px;
}

.feature-text {
  width: 460px;
  align-items: flex-start !important;
}

.feature-text > h2 {
  border-bottom: none;
  margin-bottom: 24px;
  margin-top: 0;
}

.feature-text > p {
  margin: 0;
  text-align: left;
}

.feature-image {
  position: relative;
  width: 550px;
  height: 340px;
  border-radius: 24px;
}

.feature-image > img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 24px;
  z-index: 20;
}

.feature-image > .image-overlay {
  position: absolute;
  bottom: 200px;
  z-index: 15;
}

.bottom-scene {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: auto;
  z-index: 10;
}
</style>
