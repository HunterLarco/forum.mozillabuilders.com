<template>
  <HorizontalLayout :class="$style.Host" vertical-center>
    <template v-slot:left>
      <div :class="$style.Likes" @click="like_" :liked="alreadyLiked_">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          :class="$style.LikeIcon"
        >
          <path d="M0 15.878 l12-11.878 12 11.878-4 4.122-8-8-8 8-4-4.122z" />
        </svg>
        <label>{{ likes_ }}</label>
      </div>
    </template>

    <div>
      <router-link
        :to="`/post/${post.id}`"
        :class="[$style.Title, $style.Clickable]"
        >{{ title_ }}</router-link
      >
      <div :class="$style.Metadata">
        {{ author_ }} posted {{ age_ }} |
        <router-link :to="`/post/${post.id}`" :class="$style.Clickable"
          >{{ comments_ }}&nbsp;comments</router-link
        >
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
        return 'you';
      }

      return this.post.author.username;
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
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to like posts.' },
        });
      }

      if (this.alreadyLiked_) {
        apiFetch('aurora/posts/unlike', { id: this.post.id }).then(() => {
          this.post.personalization.liked = false;
          this.post.stats.likes -= 1;
        });
      } else {
        apiFetch('aurora/posts/like', { id: this.post.id }).then(() => {
          this.post.personalization.liked = true;
          this.post.stats.likes += 1;
        });
      }
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

  color: #BBB;
  cursor: pointer;
  min-width: 42px;
  padding: 0 4px;
  text-align: center;
  user-select: none;

  &[liked] {
    color: #E91E63;

    .LikeIcon path {
      fill: #E91E63;
    }
  }

  & > * {
    cursor: inherit;
  }
}

.LikeIcon {
  display: block;
  margin: 0 auto;
  width: 14px;

  path {
    fill: #BBB;
  }
}

.Title {
  @include fonts-collapsed-post-title;

  color: inherit;
  display: inline-block;
  text-decoration: none;
}

.Clickable {
  &:hover {
    background: darken(#FFF, 7%);
  }
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
