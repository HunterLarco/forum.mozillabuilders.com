import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({
  post: ApiPostSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers
  );

  const { post } = await PostTable.get(environment, null, request.id);

  if (!post) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${request.id} not found`,
    });
  }

  const arena = new Arena(environment);
  if (actor) {
    arena.setActor(actorId, actor);
  }
  arena.addPost(request.id, post);
  await arena.flush();

  if (arena.posts[request.id].hidden) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${request.id} not found`,
    });
  }

  return {
    post: ApiPostSchema.fromArena(arena, request.id),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
