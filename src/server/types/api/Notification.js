import Joi from 'joi';

import Comment from '@/src/server/types/api/Comment';
import Post from '@/src/server/types/api/Post';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

const Reply = Joi.object({
  author: PublicAccount.required(),

  content: Joi.object({
    comment: Comment.required(),
  }).required(),

  target: Joi.object({
    post: Post,
    comment: Comment,
  }).xor('post', 'comment'),
});

const Schema = Joi.object({
  id: Joi.string().required(),

  type: Joi.string().required(),
  details: Joi.when('type', {
    is: 'reply',
    then: Reply.required(),
  }),

  read: Joi.boolean().required(),
  dateCreated: Joi.date().required(),
});

function createReplyDetails(arena, notification) {
  const authorId = notification.firestore.details.author;
  const contentCommentId = notification.firestore.details.content.comment;
  const targetPostId = notification.firestore.details.target.post;
  const targetCommentId = notification.firestore.details.target.comment;

  return {
    author: PublicAccount.fromArena(arena, authorId),
    content: { comment: Comment.fromArena(arena, contentCommentId) },
    target: targetPostId
      ? { post: Post.fromArena(arena, targetPostId) }
      : { comment: Comment.fromArena(arena, targetCommentId) },
  };
}

Schema.fromArena = (arena, id) => {
  const notification = arena.notifications[id];
  if (!notification) {
    throw new Error(`Notification ${id} not found in arena`);
  } else if (!notification.flushed) {
    throw new Error(`Notification ${id} not flushed in arena`);
  }

  return {
    id,
    type: notification.firestore.type,
    details: createReplyDetails(arena, notification),
    read: notification.firestore.read,
    dateCreated: notification.firestore.dateCreated,
  };
};

export default Schema;
