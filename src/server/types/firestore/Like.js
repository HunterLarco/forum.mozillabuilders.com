import Joi from 'joi';

export default Joi.object({
  postId: Joi.string(),
  commentId: Joi.string(),

  accountId: Joi.string().required(),
  dateCreated: Joi.date().required(),
}).xor('postId', 'commentId');
