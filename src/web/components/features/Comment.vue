<template>
  <HorizontalLayout :class="$style.Host">
    <template v-slot:left>
      <LikeButton
        :class="$style.LikeButton"
        :count="comment.stats.likes"
        :liked="comment.personalization ? comment.personalization.liked : false"
        @click.native="like_"
      />
    </template>

    <div :class="$style.Meta">
      <router-link
        :to="`/user/${comment.authorId}`"
        :class="$style.Clickable"
        >{{ author_ }}</router-link
      >
      posted {{ age_ }}

      <CommentModerationPopover type="globalModerator" :comment="comment">
        <span slot="label">
          &middot;
          <u :class="$style.Clickable">Moderation Options</u>
        </span>
      </CommentModerationPopover>
    </div>
    <AttributedText
      :class="$style.Content"
      :text="comment.content.text.text"
      :entities="comment.content.text.entities"
    />

    <template v-if="!showReplyForm_">
      <div :class="$style.ReplyLink" @click="openReplyForm_">Reply</div>
    </template>

    <template v-if="showReplyForm_">
      <ReplyForm
        :class="$style.ReplyForm"
        :post="post"
        :comment="comment"
        ref="replyForm"
        @submit="closeReplyForm_"
      />
    </template>
  </HorizontalLayout>
</template>

<script>
import friendlyTime from 'friendly-time';

import AttributedText from '@/src/web/components/layout/AttributedText';
import CommentModerationPopover from '@/src/web/components/features/CommentModerationPopover';
import ElementButton from '@/vendor/element-ui/Button';
import ElementInput from '@/vendor/element-ui/Input';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import LikeButton from '@/src/web/components/layout/LikeButton';
import ReplyForm from '@/src/web/components/features/ReplyForm';

import CurrentUserStore from '@/src/web/stores/CurrentUser';
import PostStore from '@/src/web/stores/Post';
import PublicUserStore from '@/src/web/stores/PublicUser';

export default {
  components: {
    AttributedText,
    CommentModerationPopover,
    ElementButton,
    ElementInput,
    HorizontalLayout,
    LikeButton,
    ReplyForm,
  },

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

  data() {
    return {
      showReplyForm_: false,
      likeLoading_: false,
    };
  },

  computed: {
    author_() {
      if (
        this.comment.personalization &&
        this.comment.personalization.postedByYou
      ) {
        return 'you';
      }

      const author = PublicUserStore.state.accounts[this.comment.authorId];
      return author.username;
    },

    age_() {
      return friendlyTime(new Date(this.comment.dateCreated));
    },
  },

  methods: {
    openReplyForm_() {
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to reply.' },
        });
      } else {
        this.showReplyForm_ = true;
        this.$nextTick(() => {
          this.$refs.replyForm.focus();
        });
      }
    },

    closeReplyForm_() {
      this.showReplyForm_ = false;
    },

    like_() {
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to like comments.' },
        });
      }

      if (this.likeLoading_) {
        return;
      }

      this.likeLoading_ = true;
      if (this.comment.personalization.liked) {
        PostStore.dispatch('unlikeComment', {
          postId: this.post.id,
          commentId: this.comment.id,
        }).finally(() => {
          this.likeLoading_ = false;
        });
      } else {
        PostStore.dispatch('likeComment', {
          postId: this.post.id,
          commentId: this.comment.id,
        }).finally(() => {
          this.likeLoading_ = false;
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

  & > a {
    color: inherit;
  }
}

.Clickable {
  &:hover {
    background: darken(#FFF, 7%);
  }
}

.Content {
  @include fonts-collapsed-post-title;

  padding: 8px 0;
  white-space: pre-line;
}

.LikeButton {
  margin-right: 10px;
}

.ReplyLink {
  @include fonts-collapsed-post-metadata;

  color: #828282;
  cursor: pointer;
  display: inline-block;
  text-decoration: underline;
}

.ReplyForm {
  margin-left: 30px;
}
</style>
