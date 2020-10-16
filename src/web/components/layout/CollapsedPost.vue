<template>
  <HorizontalLayout :class="$style.Host" vertical-center>
    <template v-slot:left>
      <div
        :class="$style.Likes"
        :style="alreadyLiked_ ? 'cursor: default' : ''"
        @click="like_"
      >
        <ElementIcon
          :class="$style.LikeIcon"
          name="caret-top"
          v-if="!alreadyLiked_"
        />
        {{ likes_ }}
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
        posted {{ author_ }} {{ age_ }}
        <span v-if="showComments"
          >|
          <router-link :to="`/posts/${post.id}`"
            >{{ comments_ }}&nbsp;comments</router-link
          >
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

import apiFetch from '@/src/web/helpers/net/apiFetch';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

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

    author_() {
      if (!this.post) {
        return null;
      }

      if (this.post.personalization && this.post.personalization.postedByYou) {
        return 'by you';
      }

      return `by ${this.post.author.username}`;
    },

    age_() {
      if (!this.post) {
        return null;
      }

      return friendlyTime(new Date(this.post.dateCreated));
    },

    likes_() {
      if (!this.post) {
        return null;
      }

      return this.post.stats.likes;
    },

    comments_() {
      if (!this.post) {
        return null;
      }

      return this.post.stats.comments;
    },

    alreadyLiked_() {
      if (!this.post || !this.post.personalization) {
        return null;
      }

      return this.post.personalization.liked;
    },
  },

  methods: {
    like_() {
      if (this.alreadyLiked_) {
        return;
      }

      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to like posts.' },
        });
      }

      apiFetch('aurora/posts/like', { id: this.post.id }).then(() => {
        this.post.personalization.liked = true;
        this.post.stats.likes += 1;
      });
    },
  },
};
</script>

<style module lang="sass">
@import '@/src/web/sass/fonts';
@import '@/src/web/sass/sizing';

.Host {
  padding: 20px 30px 20px 0;

  @include sizing-mobile {
    padding: 15px 25px 15px 0;
  }
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

  @include sizing-mobile {
    min-width: 40px;
    padding: 0 19px 0 15px;
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
