<template>
  <div :class="$style.Host">
    <ElementPopover placement="bottom" trigger="click" v-model="open_">
      <ElementBadge
        :max="10"
        :value="unread_.length"
        :hidden="unread_.length == 0"
        slot="reference"
      >
        <ElementIcon
          :class="$style.BellIcon"
          :name="open_ ? 'message-solid' : 'bell'"
          style="font-size: 24px;"
        />
      </ElementBadge>

      <div :class="$style.Notifications">
        <div :class="$style.Title">Notifications</div>

        <template v-for="notification in notifications_">
          <Notification
            :class="$style.Notification"
            :notification="notification"
          />
        </template>

        <div
          :class="$style.LoadMoreButton"
          @click="loadNextPage_"
          v-if="hasMoreNotifications_"
        >
          Load More
        </div>

        <div v-if="!loading_ && !notifications_.length" :class="$style.Empty">
          You have no notifications
        </div>

        <IndeterminateProgressBar v-if="loading_" />
      </div>
    </ElementPopover>
  </div>
</template>

<script>
import ElementBadge from '@/vendor/element-ui/Badge';
import ElementIcon from '@/vendor/element-ui/Icon';
import ElementPopover from '@/vendor/element-ui/Popover';
import IndeterminateProgressBar from '@/src/web/components/layout/IndeterminateProgressBar';
import Notification from '@/src/web/components/features/Notification';

import NotificationStore from '@/src/web/stores/Notification';

export default {
  components: {
    ElementBadge,
    ElementIcon,
    ElementPopover,
    IndeterminateProgressBar,
    Notification,
  },

  data() {
    return {
      open_: false,
    };
  },

  computed: {
    loading_() {
      return NotificationStore.state.loadingNextPage;
    },

    notifications_() {
      return NotificationStore.state.notifications;
    },

    hasMoreNotifications_() {
      return NotificationStore.getters.hasNextPage;
    },

    unread_() {
      return this.notifications_.filter((notification) => !notification.read);
    },
  },

  methods: {
    loadNextPage_() {
      NotificationStore.dispatch('loadNextPage');
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  display: inline-block;
}

.BellIcon {
  cursor: pointer;
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

.LoadMoreButton {
  @include fonts-nav-button;

  color: #848484;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  text-decoration: underline;

  &:hover {
    color: #000;
  }
}

.Empty {
  @include fonts-caption;

  margin: 20px;
  text-align: center;
}
</style>
