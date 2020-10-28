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

      <PageRibbon> </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import Avatar from '@/src/web/components/layout/Avatar';
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

export default {
  components: {
    Avatar,
    PageFooter,
    PageHeader,
    PageRibbon,
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/layout';

.Host {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
