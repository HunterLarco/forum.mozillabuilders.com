<template>
  <div :class="$style.Host" v-if="enabled_">
    <ElementPopover trigger="click" placement="bottom">
      <div :class="$style.Label" slot="reference">
        <slot name="label">
          <div :class="$style.DefaultLabel">Moderation Options</div>
        </slot>
      </div>

      <slot></slot>
    </ElementPopover>
  </div>
</template>

<script>
import ElementPopover from '@/vendor/element-ui/Popover';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: {
    ElementPopover,
  },

  props: {
    type: {
      type: String,
      required: true,
    },
  },

  computed: {
    enabled_() {
      const account = CurrentUserStore.state.account;
      return account && account.roles.some((role) => role.type == this.type);
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  display: inline-block;
}

.Label {
  color: #E91E63;
  cursor: pointer;
  white-space: nowrap;
}

.DefaultLabel {
  @include fonts-moderation-label;
}
</style>
