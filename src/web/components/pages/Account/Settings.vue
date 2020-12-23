<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader />

      <PageRibbon>
        <div :class="$style.Form" v-if="account_">
          <div :class="$style.Title">Account Settings</div>

          <ElementInput :value="account_.username" disabled>
            <template v-slot:prepend>Screen Name</template>
          </ElementInput>

          <ElementInput :value="account_.email" disabled>
            <template v-slot:prepend>Email</template>
          </ElementInput>
        </div>
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import ElementInput from '@/vendor/element-ui/Input';

import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: {
    ElementInput,
    PageFooter,
    PageHeader,
    PageRibbon,
  },

  computed: {
    account_() {
      return CurrentUserStore.state.account;
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

.Form {
  padding: 30px;
}

.Title {
  @include fonts-body;

  font-weight: 700;
}
</style>
