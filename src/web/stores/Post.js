import Vue from 'vue';

import * as commentHelpers from '@/src/web/helpers/data/Comment';
import apiFetch from '@/src/web/helpers/net/apiFetch';
import createStore from '@/src/web/helpers/store/createStore';

import PublicUserStore from '@/src/web/stores/PublicUser';

export default createStore('PostStore', {
  state: {
    posts: {},
  },

  actions: {
    async getPost({ state, commit }, id) {
      const { post } = await apiFetch('aurora/posts/get', { id });
      commit('setPost', post);
      return state.posts[id];
    },

    async createPost({ commit }, request) {
      const { post } = await apiFetch('aurora/posts/create', request);
      commit('setPost', post);
      return post;
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

    async createComment({ commit }, { postId, commentId, content }) {
      const { comment } = await apiFetch('aurora/comments/create', {
        postId: commentId ? undefined : postId,
        commentId,
        content,
      });
      commit('prependComment', { postId, commentId, comment });
      return comment.id;
    },

    async likeComment({ commit }, { postId, commentId }) {
      commit('likeComment', { postId, commentId });

      try {
        await apiFetch('aurora/comments/like', { id: commentId });
      } catch (error) {
        commit('unlikeComment', { postId, commentId });
        throw error;
      }
    },

    async unlikeComment({ commit }, { postId, commentId }) {
      commit('unlikeComment', { postId, commentId });

      try {
        await apiFetch('aurora/comments/unlike', { id: commentId });
      } catch (error) {
        commit('likeComment', { postId, commentId });
        throw error;
      }
    },
  },

  mutations: {
    setPost(state, post) {
      Vue.set(state.posts, post.id, post);

      PublicUserStore.commit('setAccount', post.author);
      if (post.comments) {
        for (const comment of commentHelpers.iterate(post.comments)) {
          PublicUserStore.commit('setAccount', comment.author);
        }
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

    prependComment(state, { postId, commentId, comment }) {
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      post.stats.comments += 1;
      if (!commentId) {
        post.comments.unshift(comment);
      } else {
        commentHelpers.find(post, commentId).children.unshift(comment);
      }
    },

    likeComment(state, { postId, commentId }) {
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      const comment = commentHelpers.find(post, commentId);
      if (!comment) {
        return;
      }

      comment.stats.likes += 1;
      if (comment.personalization) {
        comment.personalization.liked = true;
      }
    },

    unlikeComment(state, { postId, commentId }) {
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      const comment = commentHelpers.find(post, commentId);
      if (!comment) {
        return;
      }

      comment.stats.likes -= 1;
      if (comment.personalization) {
        comment.personalization.liked = false;
      }
    },

    reset(state) {
      Vue.set(state, 'posts', {});
    },
  },
});
