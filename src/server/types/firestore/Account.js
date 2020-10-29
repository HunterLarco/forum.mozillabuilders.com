import Joi from 'joi';

import Email from '@/src/server/types/firestore/Email';

export default Joi.object({
  email: Email.required(),
  username: Joi.string().required(),

  shadowBan: Joi.object({
    reason: Joi.string().required(),
    dateBanned: Joi.date().required(),
  }),

  dateCreated: Joi.date().required(),
});
