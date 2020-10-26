import Joi from 'joi';

export default Joi.object({
  postId: Joi.string().required(),
  commentId: Joi.string().allow(null),
  accountId: Joi.string().required(),
  dateCreated: Joi.date().required(),
});
