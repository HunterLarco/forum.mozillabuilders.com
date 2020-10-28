import Vue from 'vue';

import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

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

    async likePost({ commit }, id) {
      commit('likePost', id);

      try {
        await apiFetch('aurora/posts/like', { id });
      } catch (error) {
        commit('unlikePost', id);
        throw error;
      }
    },

    async unlikePost({ commit }, id) {
      commit('unlikePost', id);

      try {
        await apiFetch('aurora/posts/unlike', { id });
      } catch (error) {
        commit('likePost', id);
        throw error;
      }
    },

    async refreshPost({ commit }, id) {
      const { post } = await apiFetch('aurora/posts/get', { id });
      commit('setPost', post);
    },
  },

  mutations: {
    extendFeed(state, { feedName, posts, cursor }) {
      const feed = state.feeds[feedName];

      for (const post of posts) {
        Vue.set(state.posts, post.id, post);
        feed.ids.push(post.id);
      }

      if (!feed.cursor.first) {
        feed.cursor.first = cursor.current;
      }
      feed.cursor.last = cursor.current;
      feed.cursor.next = cursor.next || null;
    },

    prependPost(state, { post }) {
      if (state.feeds.new.ids.length) {
        Vue.set(state.posts, post.id, post);
        state.feeds.new.ids.unshift(post.id);
      }
    },

    likePost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      post.stats.likes += 1;
      if (post.personalization) {
        post.personalization.liked = true;
      }
    },

    unlikePost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      post.stats.likes -= 1;
      if (post.personalization) {
        post.personalization.liked = false;
      }
    },

    setPost(state, post) {
      Vue.set(state.posts, post.id, post);
    },

    reset(state) {
      Vue.set(state, 'posts', {});
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
