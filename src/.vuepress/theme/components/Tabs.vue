<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select
        id="tabs"
        name="tabs"
        class="block px-4 py-2 w-full bg-transparent rounded-md border-2 border-solid border-bodyText text-bodyText focus:border-links"
        @change="onChange"
      >
        <option
          v-for="tab in tabs"
          :key="tab.name"
          :value="tab.value"
          :selected="tab.value === selected.value"
        >
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div
      class="hidden rounded-xl border-2 border-solid sm:block border-dark-600"
    >
      <nav class="flex space-x-4" aria-label="Tabs">
        <a
          v-for="tab in tabs"
          :key="tab.name"
          :href="tab.href"
          @click="$emit('tab-selected', tab)"
          :class="[
            tab.value === selected.value
              ? 'border-links text-links'
              : 'border-transparent text-bodyText',
            'px-4 py-2 font-medium text-sm rounded-xl bg-transparent border-2 border-solid',
          ]"
          :aria-current="tab.current ? 'page' : undefined"
          >{{ tab.name }}</a
        >
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onChange(event) {
      const selected = this.tabs.find(
        ({ value }) => event.target.value === value
      );
      this.$emit("tab-selected", selected);
    },
  },
  props: {
    tabs: { required: true, default: () => [] },
    selected: { required: true },
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
