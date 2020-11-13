<template>
  <ElementButton :loading="loading_" @click="shadowBanPost_"
    >Shadow Ban Post</ElementButton
  >
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';

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

  methods: {
    shadowBanPost_() {
      if (this.loading_) {
        return;
      }

      this.loading_ = true;
      apiFetch('aurora/posts/ban', { id: this.postId }).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
