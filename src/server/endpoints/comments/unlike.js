import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';
import * as PostTable from '@/src/server/firestore/Post';
import * as commentHelpers from '@/src/server/helpers/data/Comment';

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

  const postId = commentHelpers.postId(request.id);
  const { post } = await PostTable.get(environment, null, postId);

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

  if (comment.author == accountId) {
    return Promise.reject({
      httpErrorCode: 400,
      name: 'InvalidUnlike',
      message: 'You cannot unlike your own comment',
    });
  }

  await environment.firestore.runTransaction(async (transaction) => {
    if (
      !(await LikeTable.exists(environment, transaction, {
        commentId: request.id,
        accountId,
      }))
    ) {
      return Promise.reject({
        httpErrorCode: 412,
        name: 'InvalidUnlike',
        message: "You cannot unlike a comment you haven't already liked",
      });
    }

    await LikeTable.remove(environment, transaction, {
      commentId: request.id,
      accountId,
    });

    await CounterTable.decrement(
      environment,
      transaction,
      CounterTable.COUNTERS.commentLikes(request.id)
    );
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
