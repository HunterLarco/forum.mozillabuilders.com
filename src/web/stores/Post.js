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

    async banPost({ commit }, id) {
      await apiFetch('aurora/posts/ban', { id });
      commit('banPost', id);
    },

    async unbanPost({ commit }, id) {
      await apiFetch('aurora/posts/unban', { id });
      commit('unbanPost', id);
    },

    async pinPost({ commit }, id) {
      await apiFetch('aurora/posts/pin', { id });
      commit('pinPost', id);
    },

    async unpinPost({ commit }, id) {
      await apiFetch('aurora/posts/unpin', { id });
      commit('unpinPost', id);
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

    async banComment({ commit }, id) {
      await apiFetch('aurora/comments/ban', { id });
      commit('banComment', id);
    },

    async unbanComment({ commit }, id) {
      await apiFetch('aurora/comments/unban', { id });
      commit('unbanComment', id);
    },
  },

  getters: {
    comment(state) {
      return (commentId) => {
        const postId = commentHelpers.postId(commentId);
        const post = state.posts[postId];

        if (!post) {
          return null;
        }

        return commentHelpers.find(post, commentId);
      };
    },
  },

  mutations: {
    setPost(state, post) {
      Vue.set(state.posts, post.id, post);

      PublicUserStore.commit('setAccount', post.author);
      post.authorId = post.author.id;
      delete post.author;

      if (post.comments) {
        for (const comment of commentHelpers.iterate(post.comments)) {
          PublicUserStore.commit('setAccount', comment.author);
          comment.authorId = comment.author.id;
          delete comment.author;
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

    banPost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      Vue.set(post.moderation, 'shadowBan', {
        dateBanned: new Date(),
      });
    },

    unbanPost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      Vue.delete(post.moderation, 'shadowBan');
    },

    pinPost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      post.pinned = true;
    },

    unpinPost(state, id) {
      const post = state.posts[id];
      if (!post) {
        return;
      }

      post.pinned = false;
    },

    prependComment(state, { postId, commentId, comment }) {
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      comment.authorId = comment.author.id;
      delete comment.author;

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

    banComment(state, id) {
      const postId = commentHelpers.postId(id);
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      const comment = commentHelpers.find(post, id);
      if (!comment) {
        return;
      }

      Vue.set(comment.moderation, 'shadowBan', {
        dateBanned: new Date(),
      });
    },

    unbanComment(state, id) {
      const postId = commentHelpers.postId(id);
      const post = state.posts[postId];
      if (!post) {
        return;
      }

      const comment = commentHelpers.find(post, id);
      if (!comment) {
        return;
      }

      Vue.delete(comment.moderation, 'shadowBan');
    },

    reset(state) {
      Vue.set(state, 'posts', {});
    },
  },
});
