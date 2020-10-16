<template>
  <div :class="$style.Host">
    <VerticalRibbon max-width="1200px" centered>
      <PageHeader :class="$style.PageHeader">
        <template v-slot:nav>
          <router-link to="/hot" :selected="$route.path.slice(1) == 'hot'"
            >Hot</router-link
          >
          <router-link to="/new" :selected="$route.path.slice(1) == 'new'"
            >New</router-link
          >
        </template>

        <template v-slot:buttons>
          <router-link to="/submit">Post a new topic</router-link>
        </template>
      </PageHeader>

      <Banner
        >Let's
        <a href="https://www.mozilla.org/en-US/firefox/unfck/" target="blank"
          >#unfck</a
        >
        the internet, together!
        <router-link to="/submit">Tell us how</router-link>.</Banner
      >

      <div :class="$style.Content">
        <template v-if="loading_ && !this.posts_.length">
          <div :class="$style.LoadingIndicator">
            {{ loadingText_ }}
            <ElementIcon name="loading" />
          </div>
        </template>

        <CollapsedPost
          :class="$style.Post"
          v-for="post in posts_"
          :key="post.id"
          :post="post"
        />

        <div
          v-observe-visibility="onInfiniteLoaderVisibility_"
          v-if="posts_.length && nextCursor_"
        >
          <div :class="$style.LoadingIndicator">
            Loading more posts
            <ElementIcon name="loading" />
          </div>
        </div>
      </div>
    </VerticalRibbon>
  </div>
</template>

<script>
import Banner from '@/src/web/components/layout/Banner';
import CollapsedPost from '@/src/web/components/layout/CollapsedPost';
import ElementIcon from '@/vendor/element-ui/Icon';
import PageHeader from '@/src/web/components/layout/PageHeader';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    Banner,
    CollapsedPost,
    ElementIcon,
    PageHeader,
    VerticalRibbon,
  },

  data() {
    return {
      loading_: false,
      loadingText_: '',
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
        this.loadingText_ = {
          new: 'Fetching the lastest posts',
          hot: 'Fetching the most popular posts',
        }[index];
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

.PageHeader {
  background: #FFFFFF;
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
