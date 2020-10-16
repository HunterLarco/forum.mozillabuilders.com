<template>
  <div :class="$style.Host">
    <div :class="$style.Meta">Posted {{ age_ }}</div>
    <div :class="$style.Content">{{ comment.content.text }}</div>
    <div :class="$style.ReplyLink" @click="reply_">Reply</div>
  </div>
</template>

<script>
import friendlyTime from 'friendly-time';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },

    comment: {
      type: Object,
      required: true,
    },
  },

  computed: {
    age_() {
      return friendlyTime(new Date(this.comment.dateCreated));
    },
  },

  methods: {
    reply_() {
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to reply.' },
        });
      }
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
}

.Meta {
  @include fonts-collapsed-post-metadata;

  color: #828282;
}

.Content {
  @include fonts-collapsed-post-title;

  padding: 8px 0;
}

.ReplyLink {
  @include fonts-collapsed-post-metadata;

  color: #828282;
  cursor: pointer;
  display: inline-block;
  text-decoration: underline;
}
</style>
