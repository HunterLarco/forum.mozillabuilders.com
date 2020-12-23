import Joi from 'joi';

import ApiGroupSchema from '@/src/server/types/api/Group';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as GroupTable from '@/src/server/firestore/Group';
import * as groupHelpers from '@/src/server/helpers/data/Group';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  title: Joi.string().required(),
  path: Joi.string().required(),
});

const ResponseSchema = Joi.object({
  group: ApiGroupSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  const { id, group } = await GroupTable.create(
    environment,
    null,
    groupHelpers.create(request.title, request.content, actorId)
  );

  const arena = new Arena(environment);
  arena.setActor(actorId, actor);
  arena.addGroup(id, group);
  await arena.flush();

  return {
    group: await ApiGroupSchema.fromArena(arena, id),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
