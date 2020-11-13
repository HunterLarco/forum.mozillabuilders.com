import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import * as accountHelpers from '@/src/server/helpers/data/Account';
import * as commentHelpers from '@/src/server/helpers/data/Comment';

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

  accountHelpers.assertRole(actor, 'globalModerator');

  await environment.firestore.runTransaction(async (transaction) => {
    const postId = commentHelpers.postId(request.id);
    const { post } = await PostTable.get(environment, transaction, postId);

    if (!post) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'PostNotFound',
        message: `Post ${postId} not found`,
      });
    }

    const comment = commentHelpers.find(post, request.id);

    if (!comment) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'CommentNotFound',
        message: `Comment ${request.id} not found`,
      });
    }

    delete comment.shadowBan;

    await PostTable.replace(environment, transaction, postId, post);
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
