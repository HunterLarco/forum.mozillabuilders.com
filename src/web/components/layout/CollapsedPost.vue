<template>
  <HorizontalLayout :class="$style.Host" vertical-center>
    <template v-slot:left>
      <div :class="$style.Likes" @click="like_">
        <ElementIcon :class="$style.LikeIcon" name="caret-top" />
        {{ 1 }}
      </div>
    </template>

    <div>
      <router-link
        :to="`/posts/${post.id}`"
        :class="$style.Title"
        v-if="linkToPost"
        >{{ title_ }}</router-link
      >
      <div :class="$style.Title" v-else>{{ title_ }}</div>

      <div :class="$style.Metadata">
        posted Anonymously {{ age_ }}
        <span v-if="showComments"
          >| <router-link :to="`/posts/${post.id}`">0 comments</router-link>
        </span>
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

    linkToPost: {
      type: Boolean,
      default: true,
    },

    showComments: {
      type: Boolean,
      default: true,
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

  methods: {
    like_() {
      this.$router.push('/login');
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
  cursor: pointer;
  min-width: 46px;
  padding: 0 24px 0 20px;
  text-align: center;

  &:hover .LikeIcon {
    color: #E91E63;
  }
}

.LikeIcon {
  color: lighten(#E91E63, 30%);
  font-size: 14px;
  position: relative;
  top: -3px;
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

  & a {
    color: inherit;
  }
}

.LinkIcon {
  @include fonts-collapsed-post-likes;

  color: #828282;
}
</style>
