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
            <button v-for="feature of data.features" :key="feature.value">
              {{ feature.title }}
            </button>
          </div>
        </div>

        <div class="sub-action">
          Or check out our
          <a
            class="external-link"
            href="https://github.com/lightningnetwork/lnd"
            target="_blank"
            rel="noopener noreferrer"
            >documentation</a
          >
          and
          <a
            class="external-link"
            href="https://github.com/lightningnetwork/lnd"
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
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showGradientBg = window.scrollY > 0;
      console.log(this);
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
  border: #fff solid 1px;
  border-radius: 8px;
  background: unset;
  color: #fff;
  padding: 16px 32px;
  cursor: pointer;
  font-size: 20px;
  margin: 0 12px;

  width: 224px;
}

.hero-use-case-ctas button:hover {
  border: #22c55e solid 1px;
  color: #22c55e;
}

.sub-action {
  margin-top: 108px;
  font-size: 24px;
}

.external-link {
  text-decoration: underline;
}

.footer {
  font-size: 15px;
  margin-bottom: 24px;
  color: #c1ddf9;
  transition: opacity 0.2s;
}

.bg-gradient {
  position: absolute;
  left: 0;
  bottom: -150px;
  height: 400px;
  width: 100%;
  transition: opacity 0.3s;
  background: linear-gradient(#01142600 0%, #011426 60%);
}
</style>
