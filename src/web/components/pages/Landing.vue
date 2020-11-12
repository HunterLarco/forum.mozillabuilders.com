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
          <ElementPopover placement="bottom" trigger="hover">
            <ElementBadge :value="33" :max="99" slot="reference">
              <ElementIcon name="message-solid" style="font-size: 24px;" />
            </ElementBadge>
          </ElementPopover>
        </template>
      </PageHeader>

      <PageRibbon>
        <PostFeed :class="$style.Posts" :index="$route.path.slice(1)" />
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import Avatar from '@/src/web/components/layout/Avatar';
import ElementBadge from '@/vendor/element-ui/Badge';
import ElementIcon from '@/vendor/element-ui/Icon';
import ElementPopover from '@/vendor/element-ui/Popover';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';
import PostFeed from '@/src/web/components/features/PostFeed';

import FeedStore from '@/src/web/stores/Feed';
import PostStore from '@/src/web/stores/Post';

export default {
  components: {
    Avatar,
    ElementBadge,
    ElementIcon,
    ElementPopover,
    PageFooter,
    PageHeader,
    PageRibbon,
    PostFeed,
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
