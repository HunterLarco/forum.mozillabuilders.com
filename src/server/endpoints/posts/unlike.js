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
  const { post } = await PostTable.get(environment, null, request.id);

  if (!post) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${request.id} not found`,
    });
  }

  const { id: accountId, account } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  if (post.author == accountId) {
    return Promise.reject({
      httpErrorCode: 400,
      name: 'InvalidUnlike',
      message: 'You cannot unlike your own post',
    });
  }

  await environment.firestore.runTransaction(async (transaction) => {
    await LikeTable.remove(environment, transaction, accountId, request.id);
    await CounterTable.decrement(
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
