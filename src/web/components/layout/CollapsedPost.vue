<template>
  <HorizontalLayout :class="$style.Host" vertical-center>
    <template v-slot:left>
      <div :class="$style.Likes">1</div>
    </template>

    <div>
      <router-link :to="`/posts/${post.id}`" :class="$style.Title">{{
        title_
      }}</router-link>

      <div :class="$style.Metadata">
        posted Anonymously {{ age_ }} |
        <router-link :to="`/posts/${post.id}`">0 comments</router-link>
      </div>
    </div>

    <template v-slot:right>
      <a
        :class="$style.LinkIcon"
        :href="post.content.url"
        target="blank"
        v-if="post.content.type == 'url'"
      >
        <ElementIcon name="link" />
      </a>
    </template>
  </HorizontalLayout>
</template>

<script>
import friendlyTime from 'friendly-time';

import ElementIcon from '@/vendor/element-ui/Icon';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';

export default {
  components: { ElementIcon, HorizontalLayout },

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

    age_() {
      return friendlyTime(new Date(this.post.dateCreated));
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';

.Host {
  padding: 20px 30px 20px 0;
}

.Likes {
  @include fonts-collapsed-post-likes;

  color: #E91E63;
  min-width: 40px;
  padding: 0 20px;
  text-align: center;
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

.LinkIcon {
  @include fonts-collapsed-post-likes;

  color: #828282;
}
</style>
