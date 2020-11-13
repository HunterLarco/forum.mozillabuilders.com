<template>
  <ElementButton
    :loading="loading_"
    @click="shadowBanComment_"
    :type="buttonType_"
    >{{ buttonText_ }}</ElementButton
  >
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';

import PostStore from '@/src/web/stores/Post';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: { ElementButton },

  props: {
    commentId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading_: false,
    };
  },

  computed: {
    banned_() {
      const comment = PostStore.getters.comment(this.commentId);
      return comment && comment.moderation.shadowBan;
    },

    buttonText_() {
      return this.banned_ ? 'Un-Shadow Ban Comment' : 'Shadow Ban Comment';
    },

    buttonType_() {
      return this.banned_ ? 'success' : 'danger';
    },
  },

  methods: {
    shadowBanComment_() {
      if (this.loading_) {
        return;
      }

      this.loading_ = true;
      PostStore.dispatch(
        this.banned_ ? 'unbanComment' : 'banComment',
        this.commentId
      ).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
