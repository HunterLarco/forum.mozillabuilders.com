import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import PostStore from '@/src/web/stores/Post';

export default createStore('NotificationStore', {
  state: {
    notifications: [],

    loadingNextPage: false,

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
      } else if (state.loadingNextPage) {
        return;
      }

      commit('startLoading');
      const { notifications, cursor } = await apiFetch(
        'aurora/notifications/queryMine',
        {
          cursor: state.cursor.next,
        }
      );

      commit('extendFeed', { notifications, cursor });
      commit('endLoading');
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

    startLoading(state) {
      state.loadingNextPage = true;
    },

    endLoading(state) {
      state.loadingNextPage = false;
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

    reset(state) {
      state.notifications = [];
      state.cursor.first = null;
      state.cursor.last = null;
      state.cursor.next = null;
    },
  },
});
