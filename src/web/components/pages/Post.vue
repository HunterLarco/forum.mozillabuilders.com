<template>
  <div :class="$style.Host">
    <VerticalRibbon max-width="1200px" centered>
      <PageHeader :class="$style.PageHeader">
        <template v-slot:nav>
          <router-link to="/hot">Hot</router-link>
          <router-link to="/new">New</router-link>
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

      <CollapsedPost
        :class="$style.Post"
        :post="post_"
        v-if="post_"
        :show-comments="false"
        :link-to-post="false"
      />
    </VerticalRibbon>
  </div>
</template>

<script>
import Banner from '@/src/web/components/layout/Banner';
import CollapsedPost from '@/src/web/components/layout/CollapsedPost';
import PageHeader from '@/src/web/components/layout/PageHeader';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: {
    Banner,
    CollapsedPost,
    PageHeader,
    VerticalRibbon,
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

.Host {
  @include layout-fill;

  background: #F0F0F0;
  overflow-x: hidden;
  overflow-y: scroll;
}

.PageHeader {
  background: #FFF;
}

.Post {
  background: #FFF;
  margin: 30px;
}
</style>
