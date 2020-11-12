<template>
  <a :class="$style.Host" :href="url_">
    <div :class="$style.Title">
      <a :class="$style.Clickable" :href="`/user/${details_.author.id}`">{{
        details_.author.username
      }}</a>
      replied to your
      <a :class="$style.Clickable" :href="details_.parent.url">{{
        details_.parent.type
      }}</a>
    </div>
    <div :class="$style.Age">{{ age_ }}</div>
  </a>
</template>

<script>
import friendlyTime from 'friendly-time';

import * as commentHelpers from '@/src/web/helpers/data/Comment';

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  computed: {
    details_() {
      if (this.notification.details.comment) {
        const comment = this.notification.details.comment;
        return {
          author: {
            id: comment.author.id,
            username: comment.author.username,
          },

          parent: {
            type: comment.parent.post ? 'post' : 'comment',
            url: comment.parent.post
              ? `/post/${comment.parent.post.id}`
              : `/comment/${comment.parent.comment.id}`,
          },
        };
      }

      return null;
    },

    url_() {
      if (this.notification.details.comment) {
        const comment = this.notification.details.comment;
        return `/comment/${comment.comment.id}`;
      }

      return null;
    },

    age_() {
      return friendlyTime(new Date(this.notification.dateCreated));
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
