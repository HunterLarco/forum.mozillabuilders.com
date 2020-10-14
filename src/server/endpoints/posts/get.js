import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as PostTable from '@/src/server/firestore/Post';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({
  post: ApiPostSchema.required(),
});

async function handler(environment, request) {
  const { post } = await PostTable.get(environment, null, request.id);

  return {
    post: ApiPostSchema.fromFirestorePost(post),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
