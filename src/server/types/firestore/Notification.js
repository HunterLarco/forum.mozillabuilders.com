import Joi from 'joi';

const Reply = Joi.object({
  author: Joi.string().required(),

  content: Joi.object({
    comment: Joi.string().required(),
  }).required(),

  target: Joi.object({
    post: Joi.string(),
    comment: Joi.string(),
  })
    .xor('post', 'comment')
    .required(),
});

export default Joi.object({
  recipient: Joi.string().required(),

  type: Joi.string().required(),
  details: Joi.when('type', {
    is: 'reply',
    then: Reply.required(),
  }),

  read: Joi.boolean().required(),
  dateCreated: Joi.date().required(),
});
