import Cookie from 'js-cookie';
import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import FeedStore from '@/src/web/stores/Feed';
import NotificationStore from '@/src/web/stores/Notification';
import PostStore from '@/src/web/stores/Post';
import PublicUserStore from '@/src/web/stores/PublicUser';

export default createStore('CurrentUserStore', {
  state: {
    authToken: Cookie.get('x-mozilla-builders-auth'),
    loadingAccount: null,
    account: null,
  },

  actions: {
    async loginWithToken({ commit }, loginToken) {
      const {
        token: authToken,
        account,
      } = await apiFetch('aurora/accounts/login', { token: loginToken });
      commit('setAuthToken', authToken);
      commit('setAccount', account);
    },

    async loginWithCode({ commit }, { email, password }) {
      const { token: authToken, account } = await apiFetch(
        'aurora/accounts/login',
        {
          compositeKey: {
            email,
            password,
          },
        }
      );
      commit('setAuthToken', authToken);
      commit('setAccount', account);
    },

    async getAccount({ commit }) {
      const { account } = await apiFetch('aurora/accounts/getMe');
      commit('setAccount', account);
    },

    async setSettings({ commit }, request) {
      const { account } = await apiFetch(
        'aurora/accounts/setSettings',
        request
      );
      commit('setAccount', account);
    },

    logout({ commit }) {
      commit('setAuthToken', null);
      commit('setAccount', null);
    },
  },

  mutations: {
    setAuthToken(state, token) {
      if (token) {
        Cookie.set('x-mozilla-builders-auth', token, { expires: 365 });
        Vue.set(state, 'authToken', token);
      } else {
        Cookie.remove('x-mozilla-builders-auth');
        Vue.set(state, 'authToken', null);
      }

      // Whenever we change the current user, all personalized must be reset.
      FeedStore.commit('reset');
      NotificationStore.commit('reset');
      PostStore.commit('reset');
      PublicUserStore.commit('reset');

      if (token) {
        // If we are logging in a new user, reload notifications.
        NotificationStore.dispatch('loadNextPage');
      }
    },

    setAccount(state, account) {
      Vue.set(state, 'account', account);
    },
  },
});
