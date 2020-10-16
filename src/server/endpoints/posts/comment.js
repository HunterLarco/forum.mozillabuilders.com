import Joi from 'joi';

import ApiCommentSchema from '@/src/server/types/api/Comment';
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

const ResponseSchema = Joi.object({
  comment: ApiCommentSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers);

  const comment = await environment.firestore.runTransaction(
    async (transaction) => {
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

      const comment = commentHelpers.create(request.content.text, accountId);

      if (!request.parent.comment) {
        post.comments.push(comment);
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
        parentComment.children.push(comment);
      }

      commentHelpers.reorderComments(post.comments);

      await PostTable.replace(
        environment,
        transaction,
        request.parent.post,
        post
      );

      return comment;
    }
  );

  return {
    comment: ApiCommentSchema.fromFirestoreComment(comment),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
