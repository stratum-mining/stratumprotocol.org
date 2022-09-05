<template>
  <!-- Container -->
  <div class="overflow-scroll px-2 py-4 md:px-8 max-w-screen">
    <!-- Scrolling Container -->
    <div class="flex flex-col w-max md:w-max md:flex-row">
      <div
        v-for="(step, index) of steps"
        :key="`roadmap-step-${index}`"
        :class="
          classNames(
            'flex flex-row-reverse justify-center',
            index % 2 === 0 ? 'md:flex-col' : 'md:flex-col-reverse'
          )
        "
      >
        <!-- Step Textual Content -->
        <div
          :class="
            classNames(
              'flex flex-col w-64  ml-3 md:ml-0 md:w-52 md:h-72 md:my-6 justify-start',
              index % 2 === 0 && 'md:justify-end'
            )
          "
        >
          <markdown-it-vue
            class="text-sm md:text-tiny text-bodyText"
            :content="step"
          />
        </div>

        <!-- Graphical Step -->
        <div
          class="flex flex-col justify-start items-start w-18 md:h-18 md:w-max md:flex-row"
        >
          <img
            :src="graphicalSteps[(index + 1) % 4]"
            :class="classNames(`z-[${index}]  md:mt-0 -mt-1.5`)"
          />
          <!-- index >= steps.length - 1 ? '-mt-16' : '-mt-1.5' -->
          <div
            v-if="index < steps.length - 1"
            :class="
              classNames(
                'md:w-[160px] md:h-0.5 ml-2 md:-ml-2.5 md:mt-16 bg-gradient-to-b md:bg-gradient-to-r h-[160px] w-0.5',
                graphicalStepSeparatorGradients[(index + 1) % 4]
              )
            "
          />
        </div>

        <!-- necessary to equibrate flex column on medium+ devices -->
        <div class="hidden my-6 w-52 h-72 md:block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { classNames } from "../../utils";
import MarkdownItVue from "markdown-it-vue";

const graphicalSteps = [
  "/assets/progress-1.svg",
  "/assets/progress-2.svg",
  "/assets/progress-3.svg",
  "/assets/progress-4.svg",
];

const graphicalStepSeparatorGradients = [
  "from-firstStep to-secondStep",
  "from-secondStep to-thirdStep",
  "from-thirdStep to-fourthStep",
  "from-fourthStep to-firstStep",
];
export default {
  name: "RoadMapSteps",
  components: { MarkdownItVue },
  props: {
    steps: { required: true },
  },
  data() {
    // const md = new MarkdownIt();

    return {
      graphicalSteps,
      graphicalStepSeparatorGradients,
      // md,
    };
  },
  methods: {
    classNames: classNames,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>
