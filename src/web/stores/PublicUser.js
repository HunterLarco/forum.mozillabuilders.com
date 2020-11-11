import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

export default createStore('PublicUserStore', {
  state: {
    accounts: {},
  },

  actions: {
    async getAccount({ state, commit }, id) {
      const { account } = await apiFetch('aurora/accounts/get', { id });
      commit('setAccount', account);
      return state.accounts[id];
    },
  },

  mutations: {
    setAccount(state, account) {
      Vue.set(state.accounts, account.id, account);
    },

    reset(state) {
      Vue.set(state, 'accounts', {});
    },
  },
});
