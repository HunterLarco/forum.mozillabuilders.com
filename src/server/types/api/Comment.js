import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as accountHelpers from '@/src/server/helpers/data/Account';

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

  moderation: Joi.object({
    shadowBan: Joi.object({
      dateBanned: Joi.date().required(),
    }),
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

  let moderation;
  if (
    arena.actor &&
    accountHelpers.hasRole(arena.actor.account, 'globalModerator')
  ) {
    moderation = {};
    if (comment.firestore.shadowBan) {
      moderation.shadowBan = {
        dateBanned: comment.firestore.shadowBan.dateBanned,
      };
    }
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
      postedByYou: !!arena.actor && comment.author.id == arena.actor.id,
    },

    moderation,

    dateCreated: comment.firestore.dateCreated,
  };
};

export default Schema;
