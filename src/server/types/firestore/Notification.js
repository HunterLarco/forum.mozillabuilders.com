import Joi from 'joi';

const CommentNotification = Joi.object({
  author: Joi.string().required(),
  comment: Joi.string().required(),

  parent: Joi.object({
    post: Joi.string(),
    comment: Joi.string(),
  })
    .xor('post', 'comment')
    .required(),
});

export default Joi.object({
  recipient: Joi.string().required(),

  details: Joi.object({
    comment: CommentNotification,
  })
    .xor('comment')
    .required(),

  read: Joi.boolean().required(),
  dateCreated: Joi.date().required(),
});
