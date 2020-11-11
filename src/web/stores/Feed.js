import Vue from 'vue';

import * as commentHelpers from '@/src/web/helpers/data/Comment';
import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import PostStore from '@/src/web/stores/Post';

export default createStore('FeedStore', {
  state: {
    feeds: {
      new: {
        ids: [],
        cursor: {
          first: null,
          last: null,
          next: null,
        },
      },

      hot: {
        ids: [],
        cursor: {
          first: null,
          last: null,
          next: null,
        },
      },
    },
  },

  actions: {
    async loadNextPage({ state, commit }, feedName) {
      const feed = state.feeds[feedName];

      if (feed.cursor.first && !feed.cursor.next) {
        return;
      }

      const { posts, cursor } = await apiFetch('aurora/posts/query', {
        index: feedName,
        cursor: feed.cursor.next,
      });

      commit('extendFeed', { feedName, posts, cursor });
    },
  },

  mutations: {
    extendFeed(state, { feedName, posts, cursor }) {
      const feed = state.feeds[feedName];

      for (const post of posts) {
        PostStore.commit('setPost', post);
        feed.ids.push(post.id);
      }

      if (!feed.cursor.first) {
        feed.cursor.first = cursor.current;
      }
      feed.cursor.last = cursor.current;
      feed.cursor.next = cursor.next || null;
    },

    prependPost(state, postId) {
      if (state.feeds.new.ids.length) {
        state.feeds.new.ids.unshift(postId);
      }
    },

    reset(state) {
      Vue.set(state.feeds.hot, 'ids', []);
      Vue.set(state.feeds.hot.cursor, 'first', null);
      Vue.set(state.feeds.hot.cursor, 'last', null);
      Vue.set(state.feeds.hot.cursor, 'next', null);
      Vue.set(state.feeds.new, 'ids', []);
      Vue.set(state.feeds.new.cursor, 'first', null);
      Vue.set(state.feeds.new.cursor, 'last', null);
      Vue.set(state.feeds.new.cursor, 'next', null);
    },
  },
});
