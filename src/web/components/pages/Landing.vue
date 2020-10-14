<template>
  <div :class="$style.Host">
    <VerticalRibbon max-width="1200px" centered>
      <PageHeader :class="$style.PageHeader">
        <template v-slot:nav>
          <router-link to="/top">Top</router-link>
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

      <div :class="$style.Content">
        <template v-if="loading_">
          <div :class="$style.LoadingIndicator">
            {{ loadingText_ }}
            <ElementIcon name="loading" />
          </div>
        </template>
      </div>
    </VerticalRibbon>
  </div>
</template>

<script>
import Banner from '@/src/web/components/layout/Banner';
import ElementIcon from '@/vendor/element-ui/Icon';
import PageHeader from '@/src/web/components/layout/PageHeader';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: { Banner, ElementIcon, PageHeader, VerticalRibbon },

  data() {
    return {
      loading_: false,
      loadingText_: '',
      error_: null,
    };
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        const index = this.$route.path.slice(1);

        this.loading_ = true;
        this.loadingText_ = {
          new: 'Fetching the lastest posts',
          top: 'Fetching the most popular posts',
        }[index];
        apiFetch('aurora/posts/query', { index })
          .then(({ posts }) => {
            this.error_ = null;
            this.loading_ = false;
          })
          .catch((error) => {
            this.error_ = error.message;
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
  background: #FFFFFF;
}

.Content {
  background: #FFF;
  padding: 30px;
}

.LoadingIndicator {
  @include fonts-body;

  text-align: center;

  & > * {
    vertical-align: middle;
  }
}
</style>
