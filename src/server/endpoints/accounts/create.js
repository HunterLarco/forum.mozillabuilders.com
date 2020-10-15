import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

const RequestSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request) {
  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
