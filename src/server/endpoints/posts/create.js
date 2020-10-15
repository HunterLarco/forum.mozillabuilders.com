import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as PostTable from '@/src/server/firestore/Post';

const RequestSchema = Joi.alternatives().conditional('.type', {
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

const ResponseSchema = Joi.object({
  id: Joi.string().required(),
});

async function handler(environment, request) {
  const post = {
    content: {},
    stats: {
      likes: 1,
    },
    dateCreated: new Date(),
  };

  if (request.type == 'question') {
    post.content.type = 'question';
    post.content.question = request.question;
    post.content.details = request.details;
  } else if (request.type == 'url') {
    post.content.type = 'url';
    post.content.summary = request.summary;
    post.content.url = request.url;
  } else if (request.type == 'opinion') {
    post.content.type = 'opinion';
    post.content.summary = request.summary;
    post.content.details = request.details;
  }

  const { id } = await PostTable.create(environment, null, post);
  return { id };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
