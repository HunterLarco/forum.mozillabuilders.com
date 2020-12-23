<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader />

      <PageRibbon> </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

export default {
  components: {
    PageFooter,
    PageHeader,
    PageRibbon,
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
</style>
