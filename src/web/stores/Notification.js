import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

export default createStore('NotificationStore', {
  state: {
    notifications: [],

    cursor: {
      first: null,
      last: null,
      next: null,
    },
  },

  actions: {
    async loadNextPage({ state, commit }) {
      if (state.cursor.first && !state.cursor.next) {
        return;
      }

      const { notifications, cursor } = await apiFetch(
        'aurora/notifications/queryMine',
        {
          cursor: state.cursor.next,
        }
      );

      commit('extendFeed', { notifications, cursor });
    },
  },

  mutations: {
    extendFeed(state, { notifications, cursor }) {
      for (const notification of notifications) {
        state.notifications.push(notification);
      }

      if (!state.cursor.first) {
        state.cursor.first = cursor.current;
      }
      state.cursor.last = cursor.current;
      state.cursor.next = cursor.next || null;
    },
  },
});
