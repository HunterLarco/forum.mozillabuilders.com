<template>
  <div :class="$style.Host">
    <a
      :href="this.post.content.url"
      :class="$style.Title"
      v-if="this.post.content.type == 'url'"
      >{{ title_ }}</a
    >
    <router-link :to="`/posts/${post.id}`" :class="$style.Title" v-else>{{
      title_
    }}</router-link>

    <div :class="$style.Metadata">
      posted Anonymously {{ age_ }} |
      <router-link :to="`/posts/${post.id}`">0 comments</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title_() {
      if (!this.post) {
        return null;
      }

      if (this.post.content.type == 'question') {
        return this.post.content.question;
      } else if (this.post.content.type == 'url') {
        return this.post.content.summary;
      } else if (this.post.content.type == 'opinion') {
        return this.post.content.summary;
      }

      throw new Error(`Unknown post type: ${this.post.content.type}`);
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  padding: 20px 30px;
}

.Title {
  @include fonts-collapsed-post-title;

  color: inherit;
  display: block;
  text-decoration: none;
}

.Metadata {
  @include fonts-collapsed-post-metadata;

  color: #828282;

  & > a {
    color: inherit;
  }
}
</style>
