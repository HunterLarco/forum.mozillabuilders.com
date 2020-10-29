import * as dateFns from 'date-fns';
import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import Comment from '@/src/server/types/api/Comment';
import PublicAccount from '@/src/server/types/api/PublicAccount';

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),

  title: Joi.string(),
  content: Joi.object({
    text: AttributedText,
    link: Joi.string(),
  }).xor('link', 'text'),

  comments: Joi.array().items(Comment),

  stats: Joi.object({
    likes: Joi.number().min(1).required(),
    comments: Joi.number().min(0).required(),
  }).required(),

  personalization: Joi.object({
    liked: Joi.boolean().required(),
    postedByYou: Joi.boolean().required(),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromArena = (arena, id) => {
  const post = arena.posts[id];
  if (!post) {
    throw new Error(`Post ${id} not found in arena`);
  } else if (!post.flushed) {
    throw new Error(`Post ${id} not flushed in arena`);
  }

  const content = {};
  if (post.firestore.content.link) {
    content.link = post.firestore.content.link;
  } else if (post.firestore.content.text) {
    content.text = AttributedText.fromText(post.firestore.content.text);
  } else {
    throw new Error(
      `Unknown post content format ${JSON.stringify(post.firestore.content)}`
    );
  }

  const comments = post.firestore.comments
    .filter((comment) => !arena.comments[comment.id].hidden)
    .map((comment) => Comment.fromArena(arena, comment.id));
  reorderComments(comments);

  return {
    id: post.id,

    author: PublicAccount.fromArena(arena, post.author.id),

    title: post.firestore.title,
    content,

    comments,

    stats: {
      likes: post.likes,
      comments: post.comments,
    },

    personalization: {
      liked: post.liked,
      postedByYou: !!arena.actor && post.author.id == arena.actor.id,
    },

    dateCreated: post.firestore.dateCreated,
  };
};

function reorderComments(comments) {
  comments.sort((a, b) =>
    dateFns.compareDesc(new Date(a.dateCreated), new Date(b.dateCreated))
  );
  comments.sort((a, b) => b.stats.likes - a.stats.likes);
  for (const comment of comments) {
    reorderComments(comment.children);
  }
}

export default Schema;
