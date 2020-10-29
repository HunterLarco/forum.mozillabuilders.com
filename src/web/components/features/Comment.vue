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
      <ElementTooltip
        placement="right"
        v-if="comment.personalization.shadowBanned"
      >
        <div slot="content">Your content is not visible to other users.</div>
        <span :class="$style.Banned">Banned</span>
      </ElementTooltip>
      Posted {{ author_ }} {{ age_ }}
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
import ElementButton from '@/vendor/element-ui/Button';
import ElementInput from '@/vendor/element-ui/Input';
import ElementTooltip from '@/vendor/element-ui/Tooltip';
import HorizontalLayout from '@/src/web/components/layout/HorizontalLayout';
import LikeButton from '@/src/web/components/layout/LikeButton';
import ReplyForm from '@/src/web/components/features/ReplyForm';

import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';

export default {
  components: {
    AttributedText,
    ElementButton,
    ElementInput,
    ElementTooltip,
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
        return 'by you';
      }

      return `by ${this.comment.author.username}`;
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
        FeedStore.dispatch('unlikeComment', {
          postId: this.post.id,
          commentId: this.comment.id,
        }).finally(() => {
          this.likeLoading_ = false;
        });
      } else {
        FeedStore.dispatch('likeComment', {
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
}

.Banned {
  background: #F44336;
  border-radius: 5px;
  color: #FFF;
  display: inline-block;
  padding: 0 4px;
  user-select: none;
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
