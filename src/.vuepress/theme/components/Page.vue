<template>
  <div class="relative z-[10] mx-3 pt-4 lg:mx-8 pb-4 lg:ml-[315px] px-6 md:px-12 lg:px-24">
    <slot name="top" />

    <div class="text-docsText">
      <slot />
    </div>

    <slot name="bottom" />
  </div>
</template>

<script>
export default {
}
</script>
