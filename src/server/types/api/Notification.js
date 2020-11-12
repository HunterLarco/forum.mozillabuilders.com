import Joi from 'joi';

import Comment from '@/src/server/types/api/Comment';
import Post from '@/src/server/types/api/Post';
import PublicAccount from '@/src/server/types/api/PublicAccount';

const CommentNotification = Joi.object({
  author: PublicAccount.required(),
  comment: Comment.required(),

  parent: Joi.object({
    post: Post,
    comment: Comment,
  })
    .xor('post', 'comment')
    .required(),
});

const Schema = Joi.object({
  details: Joi.object({
    comment: CommentNotification,
  })
    .xor('comment')
    .required(),

  dateCreated: Joi.date().required(),
});

Schema.fromArena = (arena, id) => {
  const notification = arena.notifications[id];
  if (!notification) {
    throw new Error(`Notification ${id} not found in arena`);
  } else if (!notification.flushed) {
    throw new Error(`Notification ${id} not flushed in arena`);
  }

  const details = {};
  const firestoreDetails = notification.firestore.details;

  if (firestoreDetails.comment) {
    const parent = {};
    if (firestoreDetails.comment.parent.post) {
      parent.post = Post.fromArena(arena, firestoreDetails.comment.parent.post);
    } else {
      parent.comment = Comment.fromArena(
        arena,
        firestoreDetails.comment.parent.comment
      );
    }

    details.comment = {
      author: PublicAccount.fromArena(arena, firestoreDetails.comment.author),
      comment: Comment.fromArena(arena, firestoreDetails.comment.comment),
      parent,
    };
  }

  return {
    details,
    dateCreated: notification.firestore.dateCreated,
  };
};

export default Schema;
