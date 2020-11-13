import Joi from 'joi';

import Comment from '@/src/server/types/firestore/Comment';

export default Joi.object({
  author: Joi.string().required(),

  title: Joi.string().required(),
  content: Joi.object({
    text: Joi.string(),
    link: Joi.string(),
  }).xor('link', 'text'),

  comments: Joi.array().items(Comment).required(),

  shadowBan: Joi.object({
    dateBanned: Joi.date().required(),
  }),

  stats: Joi.object({
    likes: Joi.number().min(1).default(1),
    hotness: Joi.number().min(0).default(0),
  }).required(),

  dateCreated: Joi.date().required(),
});
