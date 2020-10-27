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
        <IndeterminateProgressBar v-if="loading_" />

        <template v-if="post_">
          <Post :class="$style.Post" :post="post_" />

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
import CollapsedPost from '@/src/web/components/layout/CollapsedPost';
import CommentThread from '@/src/web/components/layout/CommentThread';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import Post from '@/src/web/components/layout/Post';

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
      error_: null,
      post_: null,
    };
  },

  watch: {
    'route$.params.id': {
      immediate: true,
      handler() {
        const feedPost = FeedStore.state.posts[this.$route.params.id];
        if (feedPost) {
          this.post_ = feedPost;
        }

        this.loading_ = true;
        apiFetch('aurora/posts/get', { id: this.$route.params.id })
          .then(({ post }) => {
            this.post_ = post;
            this.error_ = null;
          })
          .catch((error) => {
            this.error_ = error.message;
          })
          .finally(() => {
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
