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

        <template v-slot:icons>
          <router-link to="/account">
            <Avatar />
          </router-link>
        </template>
      </PageHeader>

      <div :class="$style.Shadow">
        <PageRibbon>
          <HorizontalLayout vertical-center>
            <template v-slot:left>
              <Avatar :size="100" />
            </template>

            <div>
              <div :class="$style.Username">@{{ username_ }}</div>
              <div :class="$style.Age">Joined {{ age_ }}</div>
            </div>
          </HorizontalLayout>
        </PageRibbon>
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
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    Avatar,
    CollapsedPost,
    HorizontalLayout,
    PageFooter,
    PageHeader,
    PageRibbon,
  },

  computed: {
    username_() {
      const { account } = CurrentUserStore.state;
      return account ? account.username : null;
    },

    age_() {
      const { account } = CurrentUserStore.state;
      return account ? friendlyTime(new Date(account.dateCreated)) : null;
    },
  },

  asyncComputed: {
    async posts_() {
      const { account } = CurrentUserStore.state;

      if (!account) {
        return [];
      }

      const { posts } = await apiFetch('aurora/posts/query', {
        index: 'new',
        filters: {
          author: account.id,
        },
      });

      return posts;
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
