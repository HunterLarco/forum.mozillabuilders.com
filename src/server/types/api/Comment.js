import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import PublicAccount from '@/src/server/types/api/PublicAccount';

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),
  content: Joi.object({
    text: AttributedText.required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  stats: Joi.object({
    likes: Joi.number().min(1).required(),
  }).required(),

  personalization: Joi.object({
    liked: Joi.boolean().required(),
    postedByYou: Joi.boolean().required(),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromArena = (arena, id) => {
  const comment = arena.comments[id];
  if (!comment) {
    throw new Error(`Comment ${id} not found in arena`);
  } else if (!comment.flushed) {
    throw new Error(`Comment ${id} not flushed in arena`);
  }

  return {
    id: comment.id,

    author: PublicAccount.fromArena(arena, comment.author.id),

    content: {
      text: AttributedText.fromText(comment.firestore.content.text),
    },

    children: comment.firestore.children
      .filter((comment) => !arena.comments[comment.id].hidden)
      .map((comment) => Schema.fromArena(arena, comment.id)),

    stats: {
      likes: comment.likes,
    },

    personalization: {
      liked: comment.liked,
      postedByYou: comment.author.id == arena.actor.id,
    },

    dateCreated: comment.firestore.dateCreated,
  };
};

export default Schema;
