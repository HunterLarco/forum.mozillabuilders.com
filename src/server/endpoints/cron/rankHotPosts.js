import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as PostTable from '@/src/server/firestore/Post';

const RequestSchema = Joi.object({});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  await PostTable.updateHotRank(environment);

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
