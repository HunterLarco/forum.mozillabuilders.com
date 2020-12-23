import Joi from 'joi';

import Email from '@/src/server/types/firestore/Email';

export default Joi.object({
  email: Email.required(),
  username: Joi.string().required(),

  roles: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
    })
  ),

  notificationSettings: Joi.object({
    email: Joi.object({
      digests: Joi.boolean().required(),
      comments: Joi.boolean().required(),
    }).required(),
  }),

  shadowBan: Joi.object({
    dateBanned: Joi.date().required(),
  }),

  dateCreated: Joi.date().required(),
});
