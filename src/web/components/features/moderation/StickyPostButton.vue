<template>
  <ElementButton :loading="loading_" type="info" @click="stickify_">{{
    buttonText_
  }}</ElementButton>
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
    buttonText_() {
      const post = PostStore.state.posts[this.postId];
      return post.pinned ? 'Un-pin Post' : 'Pin Post';
    },
  },

  methods: {
    stickify_() {
      const post = PostStore.state.posts[this.postId];

      this.loading_ = true;
      PostStore.dispatch(
        post.pinned ? 'unpinPost' : 'pinPost',
        this.postId
      ).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
