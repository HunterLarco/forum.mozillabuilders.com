import Joi from 'joi';

import Email from '@/src/server/types/firestore/Email';

export default Joi.object({
  dateCreated: Joi.date().required(),

  expiration: Joi.date(),

  scopes: Joi.object({
    signup: Joi.object({
      email: Email.required(),
      username: Joi.string().required(),
    }),

    login: Joi.object({
      accountId: Joi.string().required(),
    }),

    accountAuth: Joi.object({
      accountId: Joi.string().required(),
    }),
  }).required(),
});
