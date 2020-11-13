<template>
  <ElementButton
    :loading="loading_"
    @click="shadowBanPost_"
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
    postId: {
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
      const post = PostStore.state.posts[this.postId];
      return post && post.moderation.shadowBan;
    },

    buttonText_() {
      return this.banned_ ? 'Un-Shadow Ban Post' : 'Shadow Ban Post';
    },

    buttonType_() {
      return this.banned_ ? 'success' : 'danger';
    },
  },

  methods: {
    shadowBanPost_() {
      if (this.loading_) {
        return;
      }

      this.loading_ = true;
      apiFetch(this.banned_ ? 'aurora/posts/unban' : 'aurora/posts/ban', {
        id: this.postId,
      }).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
