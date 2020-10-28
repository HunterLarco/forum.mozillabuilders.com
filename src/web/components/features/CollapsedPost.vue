<template>
  <HorizontalLayout :class="$style.Host" vertical-center>
    <template v-slot:left>
      <LikeButton
        :class="$style.LikeButton"
        :count="likes_"
        :liked="alreadyLiked_"
        @click.native="like_"
      />
    </template>

    <div>
      <router-link
        :to="`/post/${post.id}`"
        :class="[$style.Title, $style.Clickable]"
        >{{ title_ }}</router-link
      >
      <div :class="$style.Metadata">
        <template v-if="post && post.content.link">
          <a
            :href="post.content.link"
            target="blank"
            :class="[$style.Clickable, $style.UrlOutlink]"
            ><ElementIcon name="link" />{{ displayUrl_ }}</a
          >
          &middot;
        </template>
        {{ author_ }} posted {{ age_ }} &middot;
        <router-link :to="`/post/${post.id}`" :class="$style.Clickable"
          >{{ comments_ }}&nbsp;comments</router-link
        >
      </div>
    </div>
  </HorizontalLayout>
</template>

<script>
import friendlyTime from 'friendly-time';

import ElementIcon from '@/vendor/element-ui/Icon';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import LikeButton from '@/src/web/components/layout/LikeButton';

import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: { ElementIcon, HorizontalLayout, LikeButton },

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
    title_() {
      if (!this.post) {
        return null;
      }

      return this.post.title;
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
        return 1;
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

    displayUrl_() {
      if (!this.post || !this.post.content.link) {
        return null;
      }

      const url = new URL(this.post.content.link);
      return url.hostname;
    },
  },

  methods: {
    like_() {
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to like posts.' },
        });
        return;
      }

      if (this.likeLoading_) {
        return;
      }

      this.likeLoading_ = true;
      if (this.alreadyLiked_) {
        FeedStore.dispatch('unlikePost', this.post.id).finally(() => {
          this.likeLoading_ = false;
        });
      } else {
        FeedStore.dispatch('likePost', this.post.id).finally(() => {
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

.LikeButton {
  min-width: 50px;

  @include sizing-tablet {
    min-width: 42px;
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

.UrlOutlink {
  color: #4799eb !important;
  cursor: pointer;
  text-decoration: none;
}
</style>
