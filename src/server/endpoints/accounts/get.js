import Joi from 'joi';

import ApiPublicAccountSchema from '@/src/server/types/api/PublicAccount';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({
  account: ApiPublicAccountSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers
  );

  const arena = new Arena(environment);
  if (actor) {
    arena.setActor(actorId, actor);
  }
  arena.addAccount(request.id);
  await arena.flush();

  if (!arena.accounts[request.id].firestore) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'AccountNotFound',
      message: `Account ${request.id} not found`,
    });
  }

  return {
    account: ApiPublicAccountSchema.fromArena(arena, request.id),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
