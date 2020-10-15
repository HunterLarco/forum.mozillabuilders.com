import Joi from 'joi';

export default Joi.object({
  postId: Joi.string().required(),
  accountId: Joi.string().required(),
  dateCreated: Joi.date().required(),
});
