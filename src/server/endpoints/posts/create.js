import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';
import * as postHelpers from '@/src/server/helpers/data/Post';

const RequestSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.object({
    text: Joi.string(),
    link: Joi.string(),
  }).xor('link', 'text'),
});

const ResponseSchema = Joi.object({
  post: ApiPostSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers, {
    required: true,
  });

  const { id, post } = await PostTable.create(
    environment,
    null,
    postHelpers.create(request.title, request.content, accountId)
  );

  return {
    post: await ApiPostSchema.fromFirestorePost(environment, id, post, {
      accountId,
    }),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
