<template>
  <IndexPost :title="title" />
</template>

<script>
import IndexPost from './IndexPost.vue'
import { capitalize } from '../filters'

export default {
  name: 'FrontmatterPagination',

  components: {
    IndexPost
  },

  computed: {
    title () {
      return this.$page.path.startsWith('/blog/tags/')
        ? capitalize(this.$page.frontmatter.title)
        : `Posts by ${this.$page.frontmatter.title}`
    }
  }
}
</script>
