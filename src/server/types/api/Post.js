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

const Schema = Joi.object({
  id: Joi.string().required(),
  content: Content.required(),
  dateCreated: Joi.date().required(),
});

Schema.fromFirestorePost = (id, post) => ({
  id,
  content: post.content,
  dateCreated: post.dateCreated,
});

export default Schema;
