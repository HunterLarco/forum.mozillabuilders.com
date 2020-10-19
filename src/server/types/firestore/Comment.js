import Joi from 'joi';

export default Joi.object({
  id: Joi.string().required(),

  author: Joi.string().required(),

  content: Joi.object({
    text: Joi.string().required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  dateCreated: Joi.date().required(),
});
