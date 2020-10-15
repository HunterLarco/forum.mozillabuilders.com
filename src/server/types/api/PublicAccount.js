import Joi from 'joi';

const Schema = Joi.object({
  id: Joi.string().required(),

  username: Joi.string().required(),

  dateCreated: Joi.date().required(),
});

Schema.fromFirestoreAccount = (id, account) => ({
  id,

  username: account.username,

  dateCreated: account.dateCreated,
});

export default Schema;
