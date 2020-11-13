import Joi from 'joi';

import Email from '@/src/server/types/firestore/Email';

export default Joi.object({
  email: Email.required(),
  username: Joi.string().required(),

  permissions: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
    })
  ),

  shadowBan: Joi.object({
    dateBanned: Joi.date().required(),
  }),

  dateCreated: Joi.date().required(),
});
