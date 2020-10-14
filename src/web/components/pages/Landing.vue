<template>
  <div :class="$style.Host">
    <VerticalRibbon max-width="1200px" centered>
      <PageHeader>
        <template v-slot:nav>
          <router-link to="/top">Top</router-link>
          <router-link to="/new">New</router-link>
        </template>

        <template v-slot:buttons>
          <router-link to="/ask">Post a new topic</router-link>
        </template>
      </PageHeader>
    </VerticalRibbon>
  </div>
</template>

<script>
import PageHeader from '@/src/web/components/layout/PageHeader';
import VerticalRibbon from '@/src/web/components/layout/VerticalRibbon';

export default {
  components: { PageHeader, VerticalRibbon },
};
</script>

<style module lang="sass">
.Host {
}
</style>
