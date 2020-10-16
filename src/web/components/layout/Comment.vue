<template>
  <div :class="$style.Host">
    <div :class="$style.Meta">Posted {{ age_ }}</div>
    <div :class="$style.Content">{{ comment.content.text }}</div>
  </div>
</template>

<script>
import friendlyTime from 'friendly-time';

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
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
}

.Meta {
  @include fonts-collapsed-post-metadata;
}

.Content {
  @include fonts-collapsed-post-title;
}
</style>
