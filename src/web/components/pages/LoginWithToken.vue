<template>
  <div />
</template>

<script>
import CurrentUserStore from '@/src/web/stores/CurrentUser';

export default {
  mounted() {
    CurrentUserStore.dispatch('loginWithToken', this.$route.params.token)
      .then(() => {
        this.$router.push('/');
      })
      .catch((error) => {
        switch (error.name) {
          case 'AccountAlreadyExists':
          case 'AccountNotFound':
            this.$router.push({
              path: '/signup',
              query: { error: error.message },
            });
            break;
          case 'InvalidToken':
            this.$router.push({
              path: '/login',
              query: { error: 'Login link expired' },
            });
            break;
          default:
            this.$router.push({
              path: '/login',
              query: { error: error.message },
            });
        }
      });
  },
};
</script>
