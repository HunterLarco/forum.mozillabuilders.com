import Joi from 'joi';

const Content = Joi.alternatives().conditional('.type', {
  switch: [
    {
      is: 'question',
      then: Joi.object({
        type: 'question',
        question: Joi.string().required(),
        details: Joi.string().required(),
      }),
    },
    {
      is: 'url',
      then: Joi.object({
        type: 'url',
        summary: Joi.string().required(),
        url: Joi.string().uri().required(),
      }),
    },
    {
      is: 'opinion',
      then: Joi.object({
        type: 'opinion',
        summary: Joi.string().required(),
        details: Joi.string().required(),
      }),
    },
  ],
});

const Comment = Joi.object({
  id: Joi.string().required(),

  author: Joi.string().required(),

  content: Joi.object({
    text: Joi.string().required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  dateCreated: Joi.date().required(),
});

export default Joi.object({
  author: Joi.string().required(),

  content: Content.required(),
  comments: Joi.array().items(Comment).required(),

  stats: Joi.object({
    likes: Joi.number().min(1).default(1),
    hotness: Joi.number().min(0).default(0),
  }).required(),

  dateCreated: Joi.date().required(),
});
