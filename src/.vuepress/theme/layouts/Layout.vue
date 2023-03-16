<template>
  <LayoutWrap>
    <Page>
      <template v-slot:top>
        <div v-if="$page.frontmatter.pageHeading" class="page-heading">
          {{ $page.frontmatter.pageHeading }}
        </div>
      </template>
      <Content />
    </Page>
  </LayoutWrap>
</template>

<script>
import LayoutWrap from '@theme/components/LayoutWrap.vue'
import Page from '@theme/components/Page.vue'

export default {
  components: {
    LayoutWrap,
    Page
  }
}
</script>
