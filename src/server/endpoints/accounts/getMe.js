import Joi from 'joi';

import ApiPrivateAccountSchema from '@/src/server/types/api/PrivateAccount';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({});

const ResponseSchema = Joi.object({
  account: ApiPrivateAccountSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  const arena = new Arena(environment);
  arena.setActor(actorId, actor);
  await arena.flush();

  return {
    account: ApiPrivateAccountSchema.fromArena(arena, actorId),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
