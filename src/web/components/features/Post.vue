<template>
  <HorizontalLayout :class="$style.Host">
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
      <div :class="$style.Title" v-if="post">{{ post.title }}</div>

      <div :class="$style.Body">
        <AttributedText
          v-if="post.content.text"
          :text="post.content.text.text"
          :entities="post.content.text.entities"
        />
        <a :href="post.content.link" target="blank" v-if="post.content.link">{{
          post.content.link
        }}</a>
      </div>

      <div :class="$style.Metadata">Posted {{ author_ }} {{ age_ }}</div>
    </div>
  </HorizontalLayout>
</template>

<script>
import friendlyTime from 'friendly-time';

import AttributedText from '@/src/web/components/layout/AttributedText';
import ElementIcon from '@/vendor/element-ui/Icon';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';

import apiFetch from '@/src/web/helpers/net/apiFetch';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: { AttributedText, ElementIcon, HorizontalLayout },

  props: {
    post: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      likeLoading_: false,
    };
  },

  computed: {
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

      if (this.likeLoading_) {
        return;
      }

      this.likeLoading_ = true;
      if (this.alreadyLiked_) {
        this.post.personalization.liked = false;
        this.post.stats.likes -= 1;
        apiFetch('aurora/posts/unlike', { id: this.post.id })
          .catch(() => {
            this.post.personalization.liked = true;
            this.post.stats.likes += 1;
          })
          .finally(() => {
            this.likeLoading_ = false;
          });
      } else {
        this.post.personalization.liked = true;
        this.post.stats.likes += 1;
        apiFetch('aurora/posts/like', { id: this.post.id })
          .catch(() => {
            this.post.personalization.liked = false;
            this.post.stats.likes -= 1;
          })
          .finally(() => {
            this.likeLoading_ = false;
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
  @include fonts-post-likes;

  color: #BBB;
  cursor: pointer;
  margin-top: 6px;
  min-width: 62px;
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
  @include fonts-post-title;

  color: inherit;
  display: block;
  text-decoration: none;
}

.Body {
  @include fonts-body;

  margin-top: 4px;
  white-space: pre-line;

  & a {
    color: inherit;
  }
}

.Metadata {
  @include fonts-post-metadata;

  color: #828282;
  margin-top: 8px;

  & a {
    color: inherit;
  }
}

.LinkIcon {
  @include fonts-post-likes;

  color: #828282;
}
</style>
