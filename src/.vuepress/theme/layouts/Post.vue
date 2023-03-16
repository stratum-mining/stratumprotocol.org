<template>
  <LayoutWrap>
    <Page>
      <template v-slot:top>
        <div class="page-heading">
          Blog
        </div>
      </template>
      <header class="post-header">
        <h1>{{ $page.title }}</h1>
        <PostMeta :post="$page" />
      </header>
      <Content />
    </Page>
  </LayoutWrap>
</template>

<script>
import LayoutWrap from '@theme/components/LayoutWrap.vue'
import Page from '@theme/components/Page.vue'
import PostMeta from '@theme/components/PostMeta.vue'

export default {
  name: 'Post',

  components: {
    LayoutWrap,
    Page,
    PostMeta
  }
}
</script>
