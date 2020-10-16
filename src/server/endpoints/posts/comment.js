import Joi from 'joi';
import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';
import * as commentHelpers from '@/src/server/helpers/data/Comment';

const RequestSchema = Joi.object({
  parent: Joi.object({
    post: Joi.string().required(),
    comment: Joi.string().allow(null),
  }).required(),

  content: Joi.object({
    text: Joi.string().required(),
  }),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers);

  await environment.firestore.runTransaction(async (transaction) => {
    const { post } = await PostTable.get(
      environment,
      transaction,
      request.parent.post
    );

    if (!post) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'ParentNotFound',
        message: `Post ${request.parent.post} does not exist.`,
      });
    }

    if (!request.parent.comment) {
      post.comments.push(
        commentHelpers.create(request.content.text, accountId)
      );
    } else {
      const parentComment = commentHelpers.findComment(
        post,
        request.parent.comment
      );
      if (!parentComment) {
        return Promise.reject({
          httpErrorCode: 404,
          name: 'ParentNotFound',
          message: `Comment ${request.parent.post}/${request.parent.comment} does not exist.`,
        });
      }
      parentComment.children.push(
        commentHelpers.create(request.content.text, accountId)
      );
      console.log(parentComment.children);
    }

    await PostTable.replace(
      environment,
      transaction,
      request.parent.post,
      post
    );
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
