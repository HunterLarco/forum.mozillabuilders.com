import Cookie from 'js-cookie';
import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

export default createStore('CurrentUserStore', {
  state: {
    authToken: Cookie.get('x-unfck-auth'),
  },

  actions: {
    async login({ commit }, loginToken) {
      const { token: authToken } = await apiFetch('aurora/accounts/login', {
        token: loginToken,
      });
      commit('setAuthToken', authToken);
    },
  },

  mutations: {
    setAuthToken(state, token) {
      if (token) {
        Cookie.set('x-unfck-auth', token, { expires: 365 });
        Vue.set(state, 'authToken', token);
      } else {
        Cookie.remove('x-unfck-auth');
        Vue.set(state, 'authToken', null);
      }
    },
  },
});
