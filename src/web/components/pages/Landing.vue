<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
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
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import Avatar from '@/src/web/components/layout/Avatar';
import CollapsedPost from '@/src/web/components/features/CollapsedPost';
import CollapsedPostSkeleton from '@/src/web/components/features/CollapsedPostSkeleton';
import ElementIcon from '@/vendor/element-ui/Icon';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import FeedStore from '@/src/web/stores/Feed';
import PostStore from '@/src/web/stores/Post';

export default {
  components: {
    Avatar,
    CollapsedPost,
    CollapsedPostSkeleton,
    ElementIcon,
    IndeterminateProgressBar,
    PageFooter,
    PageHeader,
    PageRibbon,
  },

  data() {
    return {
      loading_: false,
    };
  },

  computed: {
    posts_() {
      const index = this.$route.path.slice(1);
      return FeedStore.state.feeds[index].ids.map(
        (id) => PostStore.state.posts[id]
      );
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
        if (!FeedStore.state.feeds[index].ids.length) {
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
