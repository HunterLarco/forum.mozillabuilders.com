<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader>
        <template v-slot:nav>
          <router-link to="/hot">Hot</router-link>
          <router-link to="/new">New</router-link>
        </template>

        <template v-slot:buttons>
          <router-link to="/submit">
            <span v-if="$sizing.gt('mobile')">Post a new topic</span>
            <span v-else>Post</span>
          </router-link>
        </template>
      </PageHeader>

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

import FeedStore from '@/src/web/stores/Feed';

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
      return FeedStore.state.posts[this.$route.params.id] || null;
    },
  },

  watch: {
    'route$.params.id': {
      immediate: true,
      handler() {
        this.loading_ = true;
        FeedStore.dispatch('refreshPost', this.$route.params.id).finally(() => {
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
