<template>
  <LayoutWrap>
    <Page>
      <template v-slot:top>
        <div v-if="$page.frontmatter.pageHeading" class="page-heading">
          {{ $page.frontmatter.pageHeading }}
        </div>
        <div v-else-if="$page.path.startsWith('/specification/')" class="page-heading">
          Specification
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
