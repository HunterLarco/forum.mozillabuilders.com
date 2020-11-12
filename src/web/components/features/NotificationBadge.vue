<template>
  <div :class="$style.Host">
    <ElementPopover placement="bottom" trigger="hover">
      <ElementBadge
        :max="99"
        :value="notifications_.length"
        :hidden="notifications_.length == 0"
        slot="reference"
      >
        <ElementIcon name="message-solid" style="font-size: 24px;" />
      </ElementBadge>

      <div :class="$style.Notifications">
        <div :class="$style.Title">Notifications</div>
        <template v-for="notification in notifications_">
          <Notification
            :class="$style.Notification"
            :notification="notification"
          />
        </template>
      </div>
    </ElementPopover>
  </div>
</template>

<script>
import ElementBadge from '@/vendor/element-ui/Badge';
import ElementIcon from '@/vendor/element-ui/Icon';
import ElementPopover from '@/vendor/element-ui/Popover';
import Notification from '@/src/web/components/features/Notification';

import NotificationStore from '@/src/web/stores/Notification';

export default {
  components: {
    ElementBadge,
    ElementIcon,
    ElementPopover,
    Notification,
  },

  computed: {
    notifications_() {
      return NotificationStore.state.notifications;
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  display: inline-block;
}

.Notifications {
  min-width: 350px;
}

.Title {
  @include fonts-post-title;

  margin: 10px;
}

.Notification {
  & ~ .Notification {
    border-top: 1px solid #EEE;
  }
}
</style>
