<template>
  <div class="flex relative z-20 flex-col items-center px-8">
    <!-- Decoration -->
    <img
      src="/assets/deco-cyan.svg"
      alt="sparkles"
      class="absolute top-0 right-12 w-56 opacity-50 md:opacity-100 lg:w-72"
    />

    <!-- Section Title (TODO: create a whole component) -->
    <h2 class="mb-4 text-3xl font-bold text-center lg:text-4xl">
      {{ title }}
    </h2>

    <!-- Section paragrph -->
    <p
      class="w-full md:w-[500px] lg:w-[800px] text-center my-2 text-base md:text-lg text-bodyText"
    >
      {{ text }}
    </p>

    <!-- Roadmap Steps -->
    <div class="overflow-auto z-20 px-2 py-4 md:px-8 max-w-screen">
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
            <div
              class="text-sm md:text-tiny text-bodyText"
              v-html="md.render(step)"
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
  </div>
</template>

<script>
import { classNames } from "../../utils";
import MarkdownIt from "markdown-it";

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
  name: "RoadMapSection",
  props: {
    steps: { required: true },
    title: { required: true },
    text: { required: true },
  },
  data() {
    const md = new MarkdownIt();

    return {
      graphicalSteps,
      graphicalStepSeparatorGradients,
      md,
    };
  },
  methods: {
    classNames,
  },
};
</script>

<style scoped lang="styl">
@import "../../styles/theme.styl";
</style>