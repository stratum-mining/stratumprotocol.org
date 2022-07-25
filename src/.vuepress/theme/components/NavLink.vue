<template>
  <RouterLink
    v-if="isInternal"
    class="hover:text-links flex flew-row align-center"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    <img class="mr-3" v-if="iconUrl" :src="iconUrl" />
    <span class="leading-6">{{ item.text }}</span>
  </RouterLink>
  <a
    v-else
    :href="link"
    class="hover:text-links flex flew-row align-center"
    :target="target"
    :rel="rel"
    @focusout="focusoutAction"
  >
    <img class="mr-3" v-if="iconUrl" :src="iconUrl" />
    <span class="leading-6">{{ item.text }}</span>
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from "../../utils";
export default {
  name: "NavLink",
  props: {
    item: {
      required: true,
    },
    iconUrl: String,
  },
  computed: {
    link() {
      return ensureExt(this.item.link);
    },
    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(
          (rootLink) => rootLink === this.link
        );
      }
      return this.link === "/";
    },
    isNonHttpURI() {
      return isMailto(this.link) || isTel(this.link);
    },
    isBlankTarget() {
      return this.target === "_blank";
    },
    isInternal() {
      return !isExternal(this.link) && !this.isBlankTarget;
    },
    target() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.target) {
        return this.item.target;
      }
      return isExternal(this.link) ? "_blank" : "";
    },
    rel() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.rel === false) {
        return null;
      }
      if (this.item.rel) {
        return this.item.rel;
      }
      return this.isBlankTarget ? "noopener noreferrer" : null;
    },
  },
  methods: {
    focusoutAction() {
      this.$emit("focusout");
    },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
