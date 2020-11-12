<template>
  <div :class="$style.Host">
    <template v-if="loading_ && !posts_.length">
      <!-- By default 20 posts are returned per page -->
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
      <CollapsedPostSkeleton />
    </template>

    <CollapsedPost
      :class="$style.Post"
      v-for="post in posts_"
      :key="post.id"
      :post="post"
    />

    <div
      :class="$style.NextPageButton"
      v-if="hasNextPage_ && !loading_"
      @click="loadNextPage_"
    >
      Next Page
    </div>
    <IndeterminateProgressBar v-if="posts_.length && loading_" />
  </div>
</template>

<script>
import CollapsedPost from '@/src/web/components/features/CollapsedPost';
import CollapsedPostSkeleton from '@/src/web/components/features/CollapsedPostSkeleton';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';

import FeedStore from '@/src/web/stores/Feed';

export default {
  components: {
    CollapsedPost,
    CollapsedPostSkeleton,
    IndeterminateProgressBar,
  },

  props: {
    index: {
      type: String,
      required: true,
    },

    // Optional filters
    author: String,
  },

  data() {
    return {
      loading_: false,
    };
  },

  computed: {
    query_() {
      const query = { index: this.index };

      const filters = new Map();
      if (this.author) {
        filters.set('author', this.author);
      }

      if (filters.size > 0) {
        query.filters = Object.fromEntries(filters.entries());
      }

      return query;
    },

    posts_() {
      return FeedStore.getters.posts(this.query_);
    },

    hasNextPage_() {
      return FeedStore.getters.hasNextPage(this.query_);
    },
  },

  methods: {
    loadNextPage_() {
      this.loading_ = true;
      FeedStore.dispatch('loadNextPage', this.query_).then(() => {
        this.loading_ = false;
      });
    },
  },

  watch: {
    query_: {
      immediate: true,
      handler() {
        if (!this.loading_ && !FeedStore.getters.loaded(this.query_)) {
          this.loadNextPage_();
        }
      },
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/sizing';

.Host {
  border-radius: 5px;
  border: 1px solid #000;
  position: relative;
}

.Post {
  & ~ .Post {
    border-top: 1px solid #EEE;
  }
}

.NextPageButton {
  @include fonts-nav-link;

  background: #FFF;
  bottom: 0;
  cursor: pointer;
  right: 50px;
  padding: 0 8px;
  position: absolute;
  transform: translateY(50%);
  z-index: 1;
}
</style>
