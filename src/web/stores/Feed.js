import Vue from 'vue';
import stableStringify from 'fast-json-stable-stringify';

import * as commentHelpers from '@/src/web/helpers/data/Comment';
import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import PostStore from '@/src/web/stores/Post';

export default createStore('FeedStore', {
  state: {
    feeds: {},
  },

  actions: {
    async loadNextPage({ state, commit }, { index, filters }) {
      const feedKey = stableStringify({ index, filters });
      const feed = state.feeds[feedKey];

      if (feed && feed.cursor.first && !feed.cursor.next) {
        return;
      }

      const { posts, cursor } = await apiFetch('aurora/posts/query', {
        index,
        cursor: feed && feed.cursor.next ? feed.cursor.next : null,
        filters,
      });

      commit('extendFeed', { feedKey, posts, cursor });
    },
  },

  getters: {
    posts(state) {
      return ({ index, filters }) => {
        const feedKey = stableStringify({ index, filters });
        const feed = state.feeds[feedKey];

        if (!feed) {
          return [];
        }

        return feed.ids.map((postId) => PostStore.state.posts[postId]);
      };
    },

    hasNextPage(state) {
      return ({ index, filters }) => {
        const feedKey = stableStringify({ index, filters });
        const feed = state.feeds[feedKey];
        return feed && !!feed.cursor.next;
      };
    },

    loaded(state) {
      return ({ index, filters }) => {
        const feedKey = stableStringify({ index, filters });
        const feed = state.feeds[feedKey];
        return !!feed;
      };
    },
  },

  mutations: {
    extendFeed(state, { feedKey, posts, cursor }) {
      if (!state.feeds[feedKey]) {
        Vue.set(state.feeds, feedKey, {
          ids: [],
          cursor: {
            first: null,
            last: null,
            next: null,
          },
        });
      }

      const feed = state.feeds[feedKey];

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

    prependPost(state, { feed, postId }) {
      const feedKey = stableStringify(feed);
      if (state.feeds[feedKey] && state.feeds[feedKey].ids.length) {
        state.feeds[feedKey].ids.unshift(postId);
      }
    },

    reset(state) {
      Vue.set(state, 'feeds', {});
    },
  },
});
