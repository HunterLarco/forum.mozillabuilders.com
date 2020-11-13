import Joi from 'joi';

const Schema = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),

  permissions: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(),
      })
    )
    .required(),

  dateCreated: Joi.date().required(),
});

Schema.fromArena = (arena, id) => {
  const account = arena.accounts[id];
  if (!account) {
    throw new Error(`Account ${id} not found in arena`);
  } else if (!account.flushed) {
    throw new Error(`Account ${id} not flushed in arena`);
  }

  return {
    id: account.id,
    username: account.firestore.username,

    permissions: (account.firestore.permissions || []).map((permission) => ({
      type: permission.type,
    })),

    dateCreated: account.firestore.dateCreated,
  };
};

export default Schema;
