import Joi from 'joi';

import ApiCommentSchema from '@/src/server/types/api/Comment';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';
import * as commentHelpers from '@/src/server/helpers/data/Comment';

const RequestSchema = Joi.object({
  postId: Joi.string(),
  commentId: Joi.string(),

  content: Joi.object({
    text: Joi.string().required(),
  }),
}).xor('postId', 'commentId');

const ResponseSchema = Joi.object({
  comment: ApiCommentSchema.required(),
});

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers);

  const postId = request.postId
    ? request.postId
    : commentHelpers.postId(request.commentId);
  const commentId = request.commentId ? request.commentId : null;

  const comment = await environment.firestore.runTransaction(
    async (transaction) => {
      const { post } = await PostTable.get(environment, transaction, postId);

      if (!post) {
        return Promise.reject({
          httpErrorCode: 404,
          name: 'ParentNotFound',
          message: `Post ${postId} does not exist.`,
        });
      }

      const comment = commentHelpers.create(
        postId,
        request.content.text,
        accountId
      );

      if (!commentId) {
        post.comments.push(comment);
      } else {
        const parentComment = commentHelpers.find(post, commentId);
        if (!parentComment) {
          return Promise.reject({
            httpErrorCode: 404,
            name: 'ParentNotFound',
            message: `Comment ${commentId} does not exist.`,
          });
        }
        parentComment.children.push(comment);
      }

      commentHelpers.reorder(post.comments);

      await PostTable.replace(environment, transaction, postId, post);

      return comment;
    }
  );

  return {
    comment: await ApiCommentSchema.fromFirestoreComment(environment, comment, {
      accountId,
    }),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
