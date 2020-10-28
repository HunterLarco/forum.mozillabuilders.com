<template>
  <div :class="$style.Host">
    <ElementInput
      :class="$style.Textarea"
      placeholder="Your comment..."
      type="textarea"
      ref="textarea"
      :disabled="loading_"
      v-model="content_"
      :autosize="{ minRows: 2 }"
    />
    <div :class="$style.Buttons">
      <ElementButton @click="submit_" :loading="loading_" :disabled="!content_"
        >Add comment</ElementButton
      >
    </div>
  </div>
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';
import ElementInput from '@/vendor/element-ui/Input';

import FeedStore from '@/src/web/stores/Feed';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: { ElementButton, ElementInput },

  props: {
    post: {
      type: Object,
      required: true,
    },

    comment: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      content_: '',
      loading_: false,
    };
  },

  methods: {
    focus() {
      this.$refs.textarea.focus();
    },

    submit_() {
      this.loading_ = true;
      FeedStore.dispatch('comment', {
        postId: this.post.id,
        commentId: this.comment ? this.comment.id : undefined,
        content: {
          text: this.content_,
        },
      }).then(() => {
        this.content_ = '';
        this.loading_ = false;
        this.$emit('submit');
      });
    },
  },
};
</script>

<style module lang="sass">
.Host {
}

.Textarea {
  box-shadow: none;
  max-width: 700px;

  & > textarea {
    font-family: Arial;
    font-size: 14px;
    line-height: 30px;
  }
}

.Buttons {
  padding-top: 8px;
}
</style>
