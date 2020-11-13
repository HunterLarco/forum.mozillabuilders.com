<template>
  <router-link
    :class="$style.Host"
    :to="url_"
    v-observe-visibility="onVisibilityChange_"
  >
    <div :class="$style.Title">
      <template v-if="notification.type == 'reply'">
        <router-link
          :class="$style.Clickable"
          :to="`/user/${notification.details.author.id}`"
          >{{ notification.details.author.username }}</router-link
        >
        replied to your
        <template v-if="notification.details.target.post">
          <router-link
            :class="$style.Clickable"
            :to="`/post/${notification.details.target.post.id}`"
            >post</router-link
          >
        </template>
        <template v-if="notification.details.target.comment">
          <router-link
            :class="$style.Clickable"
            :to="`/comment/${notification.details.content.comment.id}`"
            >comment</router-link
          >
        </template>
      </template>
    </div>
    <div :class="$style.Age">{{ age_ }}</div>
  </router-link>
</template>

<script>
import friendlyTime from 'friendly-time';

import NotificationStore from '@/src/web/stores/Notification';

import * as commentHelpers from '@/src/web/helpers/data/Comment';

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  computed: {
    url_() {
      if (this.notification.type == 'reply') {
        const comment = this.notification.details.content.comment;
        return `/comment/${comment.id}`;
      }

      return null;
    },

    age_() {
      return friendlyTime(new Date(this.notification.dateCreated));
    },
  },

  methods: {
    onVisibilityChange_(visible) {
      if (visible && !this.notification.read) {
        console.log(this.notification);
        NotificationStore.dispatch('read', this.notification.id);
      }
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  @include fonts-body;

  color: inherit;
  display: block;
  padding: 10px;
  text-decoration: none;

  &:hover {
    background: rgba(#000, 0.07);
  }
}

.Title {
  @include fonts-notification-title;

  & a {
    color: inherit;
  }
}

.Age {
  @include fonts-notification-age;

  color: #828282;
}

.Clickable {
  &:hover {
    background: rgba(#000, 0.07);
  }
}
</style>
