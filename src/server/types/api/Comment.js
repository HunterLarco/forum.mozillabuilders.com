import Joi from 'joi';

const Schema = Joi.object({
  id: Joi.string().required(),

  content: Joi.object({
    text: Joi.string().required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  dateCreated: Joi.date().required(),
});

Schema.fromFirestoreComment = (comment) => ({
  id: comment.id,

  content: { text: comment.content.text },

  children: comment.children.map((comment) =>
    Schema.fromFirestoreComment(comment)
  ),

  dateCreated: comment.dateCreated,
});

export default Schema;
