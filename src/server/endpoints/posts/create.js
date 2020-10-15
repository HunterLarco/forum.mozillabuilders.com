import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as LikeTable from '@/src/server/firestore/Like';
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

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers, {
    required: true,
  });

  const post = {
    author: accountId,
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

  const postId = await environment.firestore.runTransaction(
    async (transaction) => {
      const { id } = await PostTable.create(environment, transaction, post);

      // Users always like their own posts by default.
      await LikeTable.create(environment, transaction, {
        postId: id,
        accountId,
        dateCreated: new Date(),
      });

      return id;
    }
  );

  return { id: postId };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
