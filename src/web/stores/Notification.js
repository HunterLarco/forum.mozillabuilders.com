import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import PostStore from '@/src/web/stores/Post';

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

    read({ state, commit }, id) {
      commit('read', id);
      apiFetch('aurora/notifications/read', { id }).catch(() => {
        commit('unread', id);
      });
    },
  },

  mutations: {
    extendFeed(state, { notifications, cursor }) {
      for (const notification of notifications) {
        state.notifications.push(notification);
        if (notification.details.comment) {
          PostStore.commit('setPost', notification.details.comment.parent.post);
        }
      }

      if (!state.cursor.first) {
        state.cursor.first = cursor.current;
      }
      state.cursor.last = cursor.current;
      state.cursor.next = cursor.next || null;
    },

    read(state, id) {
      for (const notification of state.notifications) {
        if (notification.id == id) {
          notification.read = true;
          return;
        }
      }
    },

    unread(state, id) {
      for (const notification of state.notifications) {
        if (notification.id == id) {
          notification.read = false;
          return;
        }
      }
    },
  },
});
