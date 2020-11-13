<template>
  <ElementButton :loading="loading_" @click="shadowBanAccount_"
    >Shadow Ban Account</ElementButton
  >
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';

import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  components: { ElementButton },

  props: {
    accountId: {
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
    shadowBanAccount_() {
      if (this.loading_) {
        return;
      }

      this.loading_ = true;
      apiFetch('aurora/accounts/ban', { id: this.accountId }).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
