import Joi from 'joi';

import Email from '@/src/server/types/firestore/Email';

export default Joi.object({
  email: Email.required(),
  username: Joi.string().required(),
  dateCreated: Joi.date().required(),
});
