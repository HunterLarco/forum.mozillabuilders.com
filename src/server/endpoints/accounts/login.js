import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

const RequestSchema = Joi.object({
  token: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request) {
  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
