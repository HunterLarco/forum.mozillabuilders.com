<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader />

      <PageRibbon>
        <template v-if="!post_">
          <IndeterminateProgressBar v-if="loading_" />
        </template>

        <template v-if="post_">
          <Post :class="$style.Post" :post="post_" />

          <IndeterminateProgressBar v-if="loading_" />

          <CommentThread
            :class="$style.Comments"
            :post="post_"
            :comments="post_.comments"
            v-if="post_.comments"
          >
          </CommentThread>
        </template>
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import CollapsedPost from '@/src/web/components/features/CollapsedPost';
import CommentThread from '@/src/web/components/features/CommentThread';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import Post from '@/src/web/components/features/Post';

import PostStore from '@/src/web/stores/Post';

import * as commentHelpers from '@/src/web/helpers/data/Comment';
import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    CollapsedPost,
    CommentThread,
    IndeterminateProgressBar,
    PageFooter,
    PageHeader,
    PageRibbon,
    Post,
  },

  data() {
    return {
      loading_: false,
    };
  },

  computed: {
    post_() {
      return PostStore.state.posts[this.$route.params.id] || null;
    },
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.loading_ = true;
        PostStore.dispatch('refreshPost', this.$route.params.id).finally(() => {
          this.loading_ = false;
        });
      },
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';
@import '@/src/web/sass/sizing';

.Host {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;
}

.Post {
  background: #FFF;
  border-bottom: 1px solid #EEE;
}

.Comments {
  background: #FFF;
  padding: 30px;

  @include sizing-mobile {
    padding: 20px;
  }
}
</style>
