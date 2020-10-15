<template>
  <div />
</template>

<script>
import apiFetch from '@/src/web/helpers/net/apiFetch';

export default {
  mounted() {
    apiFetch('aurora/accounts/login', { token: this.$route.params.token })
      .then(({ token }) => {
        console.log(100, token);
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
