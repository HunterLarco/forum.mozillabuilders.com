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

    async banAccount({ commit }, id) {
      await apiFetch('aurora/accounts/ban', { id });
      commit('banAccount', id);
    },

    async unbanAccount({ commit }, id) {
      await apiFetch('aurora/accounts/unban', { id });
      commit('unbanAccount', id);
    },
  },

  mutations: {
    setAccount(state, account) {
      Vue.set(state.accounts, account.id, account);
    },

    banAccount(state, id) {
      const account = state.accounts[id];
      if (!account) {
        return;
      }

      Vue.set(account.moderation, 'shadowBan', {
        dateBanned: new Date(),
      });
    },

    unbanAccount(state, id) {
      const account = state.accounts[id];
      if (!account) {
        return;
      }

      Vue.delete(account.moderation, 'shadowBan');
    },

    reset(state) {
      Vue.set(state, 'accounts', {});
    },
  },
});
