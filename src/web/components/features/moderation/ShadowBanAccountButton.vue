<template>
  <ElementButton
    :loading="loading_"
    @click="shadowBanAccount_"
    :type="buttonType_"
    >{{ buttonText_ }}</ElementButton
  >
</template>

<script>
import ElementButton from '@/vendor/element-ui/Button';

import PublicUserStore from '@/src/web/stores/PublicUser';

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

  computed: {
    banned_() {
      const account = PublicUserStore.state.accounts[this.accountId];
      return account && account.moderation.shadowBan;
    },

    buttonText_() {
      return this.banned_ ? 'Un-Shadow Ban Account' : 'Shadow Ban Account';
    },

    buttonType_() {
      return this.banned_ ? 'success' : 'danger';
    },
  },

  methods: {
    shadowBanAccount_() {
      if (this.loading_) {
        return;
      }

      this.loading_ = true;
      apiFetch(this.banned_ ? 'aurora/accounts/unban' : 'aurora/accounts/ban', {
        id: this.accountId,
      }).then(() => {
        this.loading_ = false;
      });
    },
  },
};
</script>
