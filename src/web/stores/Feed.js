import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

export default createStore('FeedStore', {
  state: {
    feeds: {
      new: {
        posts: [],
        cursor: {
          first: null,
          last: null,
          next: null,
        },
      },

      hot: {
        posts: [],
        cursor: {
          first: null,
          last: null,
          next: null,
        },
      },
    },

    posts: {},
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
        Vue.set(state.posts, post.id, post);
        feed.posts.push(post);
      }

      if (!feed.cursor.first) {
        Vue.set(feed.cursor, 'first', cursor.current);
      }
      Vue.set(feed.cursor, 'last', cursor.current);
      Vue.set(feed.cursor, 'next', cursor.next || null);
    },
  },
});
