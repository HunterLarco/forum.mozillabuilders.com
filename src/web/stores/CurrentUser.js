import Cookie from 'js-cookie';
import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import FeedStore from '@/src/web/stores/Feed';

export default createStore('CurrentUserStore', {
  state: {
    authToken: Cookie.get('x-mozilla-builders-auth'),
  },

  actions: {
    async loginWithToken({ commit }, loginToken) {
      const { token: authToken } = await apiFetch('aurora/accounts/login', {
        token: loginToken,
      });
      commit('setAuthToken', authToken);
    },

    async loginWithCode({ commit }, { email, password }) {
      const { token: authToken } = await apiFetch('aurora/accounts/login', {
        compositeKey: {
          email,
          password,
        },
      });
      commit('setAuthToken', authToken);
    },

    logout({ commit }) {
      commit('setAuthToken', null);
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

      // Whenever we change the current user, the feed (which is personalized)
      // must be reset.
      FeedStore.commit('reset');
    },
  },
});
