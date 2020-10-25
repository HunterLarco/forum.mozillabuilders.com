<template>
  <div :class="$style.Host">
    <PageHeader>
      <template v-slot:nav>
        <router-link to="/hot" :selected="$route.path.slice(1) == 'hot'"
          >Hot</router-link
        >
        <router-link to="/new" :selected="$route.path.slice(1) == 'new'"
          >New</router-link
        >
      </template>

      <template v-slot:buttons>
        <router-link to="/submit">
          <span v-if="$sizing.gt('mobile')">Post a new topic</span>
          <span v-else>Post</span>
        </router-link>
      </template>
    </PageHeader>

    <PageRibbon>
      <div :class="$style.Posts">
        <template v-if="!posts_.length">
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
          <SkeletonCollapsedPost />
        </template>

        <CollapsedPost
          :class="$style.Post"
          v-for="post in posts_"
          :key="post.id"
          :post="post"
        />

        <div
          :class="$style.NextPageButton"
          v-if="nextCursor_ && !loading_"
          @click="loadNextPage_(false)"
        >
          Next Page
        </div>
        <IndeterminateProgressBar v-if="posts_.length && loading_" />
      </div>
    </PageRibbon>

    <PageFooter />
  </div>
</template>

<script>
import CollapsedPost from '@/src/web/components/layout/CollapsedPost';
import ElementIcon from '@/vendor/element-ui/Icon';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import SkeletonCollapsedPost from '@/src/web/components/skeleton/CollapsedPost';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    CollapsedPost,
    ElementIcon,
    IndeterminateProgressBar,
    PageFooter,
    PageHeader,
    PageRibbon,
    SkeletonCollapsedPost,
  },

  data() {
    return {
      loading_: false,
      error_: null,

      posts_: [],
      nextCursor_: null,
    };
  },

  methods: {
    loadNextPage_(initialLoad) {
      const index = this.$route.path.slice(1);

      if (initialLoad) {
        this.error_ = null;
        this.posts_ = [];
        this.nextCursor_ = null;
      } else if (!this.nextCursor_ || this.loading_) {
        return;
      }

      this.loading_ = true;
      apiFetch('aurora/posts/query', { index, cursor: this.nextCursor_ })
        .then(({ posts, cursor }) => {
          this.posts_ = this.posts_.concat(posts);
          this.nextCursor_ = cursor.next;
          this.error_ = null;
          this.loading_ = false;
        })
        .catch((error) => {
          this.error_ = error.message;
        });
    },
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        this.loadNextPage_(true);
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

.LoadingIndicator {
  @include fonts-body;

  padding: 30px;
  text-align: center;

  & > * {
    vertical-align: middle;
  }
}

.Posts {
  border-radius: 5px;
  border: 1px solid #000;
  margin: 30px;
  position: relative;

  @include sizing-mobile {
    margin: 15px;
  }
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
