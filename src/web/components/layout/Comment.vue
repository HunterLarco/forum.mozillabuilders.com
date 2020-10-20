<template>
  <div :class="$style.Host">
    <div :class="$style.Meta">Posted {{ author_ }} {{ age_ }}</div>
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
  </div>
</template>

<script>
import friendlyTime from 'friendly-time';

import AttributedText from '@/src/web/components/layout/AttributedText';
import ElementButton from '@/vendor/element-ui/Button';
import ElementInput from '@/vendor/element-ui/Input';
import ReplyForm from '@/src/web/components/layout/ReplyForm';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: { AttributedText, ReplyForm, ElementButton, ElementInput },

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

.Content {
  @include fonts-collapsed-post-title;

  padding: 8px 0;
  white-space: pre-line;
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
