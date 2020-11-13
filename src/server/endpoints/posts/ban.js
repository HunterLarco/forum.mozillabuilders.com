import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import * as accountHelpers from '@/src/server/helpers/data/Account';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  accountHelpers.assertPermissions(actor, 'globalModerator');

  await environment.firestore.runTransaction(async (transaction) => {
    const { post } = await PostTable.get(environment, transaction, request.id);

    if (!post) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'PostNotFound',
        message: `Post ${request.id} not found`,
      });
    }

    post.shadowBan = {
      dateBanned: new Date(),
    };

    await PostTable.replace(environment, transaction, request.id, post);
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
