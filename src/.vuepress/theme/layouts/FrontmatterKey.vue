<template>
  <LayoutWrap>
    <Page>
      <template v-slot:top>
        <div class="page-heading">
          Blog
        </div>
      </template>
      <div class="content__default">
        <h1 v-if="this.$page.path.startsWith('/blog/tags/')">Tags</h1>
        <h1 v-else>Authors</h1>
        <ul>
          <li v-for="item in items" :key="item.name">
            <router-link :to="item.path">{{ displayName(item.name) }}</router-link>
          </li>
        </ul>
      </div>
    </Page>
  </LayoutWrap>
</template>

<script>
import LayoutWrap from '@theme/components/LayoutWrap.vue'
import Page from '@theme/components/Page.vue'
import { capitalize } from '../filters'

export default {
  name: 'FrontmatterKey',

  components: {
    LayoutWrap,
    Page
  },

  computed: {
    items() {
      return this.$frontmatterKey.list
    }
  },

  methods: {
    displayName(name) {
      return this.$page.path.startsWith('/blog/tags/') ? capitalize(name) : name
    }
  }
}
</script>
