<template>
  <RouterLink
    v-if="isInternal"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    <slot />
  </RouterLink>
  <a v-else :href="link" :target="target" :rel="rel" @focusout="focusoutAction">
    <slot />
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from "../../utils";
export default {
  name: "Link",
  props: {
    item: {
      required: true,
    },
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