import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';
import * as PostTable from '@/src/server/firestore/Post';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  const { id: accountId, account } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  const { post } = await PostTable.get(environment, null, request.id);

  if (!post) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${request.id} not found`,
    });
  }

  if (post.author == accountId) {
    return Promise.reject({
      httpErrorCode: 412,
      name: 'InvaludLike',
      message: 'You cannot like your own post',
    });
  }

  await environment.firestore.runTransaction(async (transaction) => {
    await LikeTable.create(environment, transaction, {
      postId: request.id,
      accountId,
      dateCreated: new Date(),
    });

    await CounterTable.increment(
      environment,
      transaction,
      CounterTable.COUNTERS.likes(request.id)
    );
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
