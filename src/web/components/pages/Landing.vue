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
          v-if="hasNextPage_ && !loading_"
          @click="loadNextPage_"
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

import FeedStore from '@/src/web/stores/Feed';

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
    };
  },

  computed: {
    posts_() {
      const index = this.$route.path.slice(1);
      return FeedStore.state.feeds[index].posts;
    },

    hasNextPage_() {
      const index = this.$route.path.slice(1);
      return !!FeedStore.state.feeds[index].cursor.next;
    },
  },

  methods: {
    loadNextPage_() {
      const index = this.$route.path.slice(1);

      this.loading_ = true;
      FeedStore.dispatch('loadNextPage', index).then(() => {
        this.loading_ = false;
      });
    },
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        const index = this.$route.path.slice(1);
        if (!FeedStore.state.feeds[index].posts.length) {
          this.loadNextPage_();
        }
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
