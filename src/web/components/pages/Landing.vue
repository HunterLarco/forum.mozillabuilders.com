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
      <div :class="$style.Content">
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

        <IndeterminateProgressBar
          v-observe-visibility="onInfiniteLoaderVisibility_"
          v-if="!posts_.length || nextCursor_"
        />
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

      infiniteLoaderVisible_: false,
    };
  },

  methods: {
    onInfiniteLoaderVisibility_(visible) {
      this.infiniteLoaderVisible_ = visible;
      if (!this.error_ && !this.loading_ && visible) {
        this.loadNextPage_();
      }
    },

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

          setTimeout(() => {
            if (this.infiniteLoaderVisible_) {
              this.loadNextPage_();
            }
          }, 100);
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

.Host {
  @include layout-fill;

  background: #F0F0F0;
  overflow-x: hidden;
  overflow-y: scroll;
}

.Content {
  background: #FFF;
  margin-bottom: 40px;

  @media (max-width: 1260px) {
    margin-bottom: 0;
  }
}

.LoadingIndicator {
  @include fonts-body;

  padding: 30px;
  text-align: center;

  & > * {
    vertical-align: middle;
  }
}

.Post {
  & ~ .Post {
    border-top: 1px solid #EEE;
  }
}
</style>
