import Joi from 'joi';

export default Joi.object({
  type: Joi.string().valid('normalizedEmail', 'username').required(),
  identity: Joi.string().required(),
  accountId: Joi.string().required(),
  dateCreated: Joi.date().required(),
});
