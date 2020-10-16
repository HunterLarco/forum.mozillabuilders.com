<template>
  <div :class="$style.Host">
    <div :class="$style.Meta">Posted {{ age_ }}</div>
    <div :class="$style.Content">{{ comment.content.text }}</div>

    <template v-if="!showReplyForm_">
      <div :class="$style.ReplyLink" @click="reply_">Reply</div>
    </template>

    <template v-if="showReplyForm_">
      <div :class="$style.ReplyForm">
        <ElementInput
          :class="$style.ReplyTextarea"
          placeholder="Your comment..."
          type="textarea"
          v-model="form_.reply"
          :autosize="{ minRows: 2 }"
        />
        <div :class="$style.ReplyButtons">
          <ElementButton>Add comment</ElementButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import friendlyTime from 'friendly-time';

import ElementButton from '@/vendor/element-ui/Button';
import ElementInput from '@/vendor/element-ui/Input';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  components: { ElementButton, ElementInput },

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
      form_: {
        reply: '',
      },
    };
  },

  computed: {
    age_() {
      return friendlyTime(new Date(this.comment.dateCreated));
    },
  },

  methods: {
    reply_() {
      if (!CurrentUserStore.state.authToken) {
        this.$router.push({
          path: '/signup',
          query: { info: 'You must be logged in to reply.' },
        });
      } else {
        this.showReplyForm_ = true;
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

.Content {
  @include fonts-collapsed-post-title;

  padding: 8px 0;
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

.ReplyTextarea {
  max-width: 700px;

  & > textarea {
    font-family: Arial;
    font-size: 14px;
    line-height: 30px;
  }
}

.ReplyButtons {
  padding-top: 8px;
}
</style>
