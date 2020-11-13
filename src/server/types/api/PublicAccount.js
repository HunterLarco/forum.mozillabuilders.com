import Joi from 'joi';

import * as accountHelpers from '@/src/server/helpers/data/Account';

const Schema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),

  moderation: Joi.object({
    shadowBan: Joi.object({
      dateBanned: Joi.date().required(),
    }),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromArena = (arena, id) => {
  const account = arena.accounts[id];
  if (!account) {
    throw new Error(`Account ${id} not found in arena`);
  } else if (!account.flushed) {
    throw new Error(`Account ${id} not flushed in arena`);
  }

  let moderation;
  if (
    arena.actor &&
    accountHelpers.hasRole(arena.actor.account, 'globalModerator')
  ) {
    moderation = {};
    if (account.firestore.shadowBan) {
      moderation.shadowBan = {
        dateBanned: account.firestore.shadowBan.dateBanned,
      };
    }
  }

  return {
    id: account.id,
    username: account.firestore.username,

    moderation,

    dateCreated: account.firestore.dateCreated,
  };
};

export default Schema;
