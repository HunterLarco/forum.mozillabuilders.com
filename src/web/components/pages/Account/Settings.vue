<template>
  <div :class="$style.Host">
    <div style="min-height: 80%;">
      <PageHeader />

      <PageRibbon>
        <div :class="$style.Form" v-if="account_">
          <div :class="$style.Title">Account Settings</div>

          <ElementInput
            :value="account_.username"
            disabled
            :class="$style.Input"
          >
            <template v-slot:prepend>Screen Name</template>
          </ElementInput>

          <ElementInput :value="account_.email" disabled :class="$style.Input">
            <template v-slot:prepend>Email</template>
          </ElementInput>

          <div :class="$style.Title">Notification Settings</div>

          <ElementForm>
            <ElementFormItem
              label="Email me weekly summaries"
              :class="$style.FormItem"
            >
              <ElementSwitch v-model="form_.data.digests" />
            </ElementFormItem>

            <ElementFormItem
              label="Email me when someone comments on my post"
              :class="$style.FormItem"
            >
              <ElementSwitch v-model="form_.data.comments" />
            </ElementFormItem>

            <ElementButton :class="$style.SubmitButton" disabled
              >Save Changes</ElementButton
            >
          </ElementForm>
        </div>
      </PageRibbon>
    </div>

    <PageFooter />
  </div>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ElementForm from '@/vendor/element-ui/Form';
import ElementFormItem from '@/vendor/element-ui/FormItem';
import ElementInput from '@/vendor/element-ui/Input';
import ElementSwitch from '@/vendor/element-ui/Switch';

import PageFooter from '@/src/web/components/layout/PageFooter';
import PageHeader from '@/src/web/components/layout/PageHeader';
import PageRibbon from '@/src/web/components/layout/PageRibbon';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: {
    ElementButton,
    ElementForm,
    ElementFormItem,
    ElementInput,
    ElementSwitch,
    PageFooter,
    PageHeader,
    PageRibbon,
  },

  data() {
    return {
      form_: {
        data: {
          digests: false,
          comments: false,
        },
      },
    };
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
  margin: 30px;
}

.FormItem {
  margin: 0;
}

.Title {
  @include fonts-body;

  font-weight: 700;
  margin: 30px 0 10px 0;
}

.Input {
  margin: 5px 0;
}

.SubmitButton {
  margin-top: 20px;
}
</style>
