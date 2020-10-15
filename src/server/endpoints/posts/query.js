import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as LikeTable from '@/src/server/firestore/Like';
import * as PostTable from '@/src/server/firestore/Post';

const RequestSchema = Joi.object({
  index: Joi.string().valid('new').required(),
  cursor: Joi.string().allow(null),
});

const ResponseSchema = Joi.object({
  posts: Joi.array().items(ApiPostSchema).required(),
  cursor: Joi.object({
    current: Joi.string().allow(null),
    next: Joi.string().allow(null),
  }),
});

async function personalizeResults(environment, posts, accountId, account) {
  if (!account) {
    return;
  }

  await Promise.all(
    posts.map(async (post) => {
      post.personalization = {
        liked: await LikeTable.exists(environment, null, accountId, post.id),
      };
    })
  );
}

async function handler(environment, request, headers) {
  const { posts, cursor } = await PostTable.queryByAge(environment, {
    cursor: request.cursor,
  });

  const apiPosts = posts.map(({ id, post }) =>
    ApiPostSchema.fromFirestorePost(id, post)
  );

  const { id: accountId, account } = await getCurrentUser(environment, headers);

  await personalizeResults(environment, apiPosts, accountId, account);

  return {
    posts: apiPosts,
    cursor: {
      current: cursor.current || request.cursor || null,
      next: cursor.next,
    },
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
