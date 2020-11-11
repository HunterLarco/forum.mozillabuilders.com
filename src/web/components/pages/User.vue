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

      <div :class="$style.Shadow">
        <PageRibbon>
          <HorizontalLayout vertical-center>
            <template v-slot:left>
              <Avatar :size="100" />
            </template>

            <div v-if="account_">
              <div :class="$style.Username">@{{ username_ }}</div>
              <div :class="$style.Age">Joined {{ age_ }}</div>
            </div>
          </HorizontalLayout>
        </PageRibbon>

        <IndeterminateProgressBar v-if="loading_" />
      </div>

      <PageRibbon>
        <CollapsedPost v-for="post in posts_" :key="post.id" :post="post" />
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import friendlyTime from 'friendly-time';

import Avatar from '@/src/web/components/layout/Avatar';
import CollapsedPost from '@/src/web/components/features/CollapsedPost';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import FeedStore from '@/src/web/stores/Feed';
import PostStore from '@/src/web/stores/Post';
import PublicUserStore from '@/src/web/stores/PublicUser';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    Avatar,
    CollapsedPost,
    HorizontalLayout,
    IndeterminateProgressBar,
    PageFooter,
    PageHeader,
    PageRibbon,
  },

  data() {
    return {
      loading_: false,
      account_: null,
    };
  },

  computed: {
    username_() {
      return this.account_ ? this.account_.username : null;
    },

    age_() {
      return this.account_
        ? friendlyTime(new Date(this.account_.dateCreated))
        : null;
    },

    posts_() {
      if (!this.account_) {
        return [];
      }

      return FeedStore.getters.posts({
        index: 'new',
        filters: {
          author: this.account_.id,
        },
      });
    },
  },

  watch: {
    '$router.params.id': {
      immediate: true,
      handler() {
        this.loading_ = true;
        this.load_().then(() => {
          this.loading_ = false;
        });
      },
    },
  },

  methods: {
    async load_() {
      const id = this.$route.params.id;

      if (PublicUserStore.state.accounts[id]) {
        this.account_ = PublicUserStore.state.accounts[id];
      }

      this.account_ = await PublicUserStore.dispatch('getAccount', id);

      const query = {
        index: 'new',
        filters: {
          author: this.account_.id,
        },
      };

      if (!FeedStore.getters.posts(query).length) {
        await FeedStore.dispatch('loadNextPage', query);
      }
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/layout';

.Host {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;
}

.Shadow {
  box-shadow: 0 10px 20px rgba(#000, 0.1);
}

.Username {
  @include fonts-body;

  font-weight: 700;
}

.Age {
  @include fonts-body;
}
</style>
