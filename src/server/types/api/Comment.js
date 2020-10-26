import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as AccountTable from '@/src/server/firestore/Account';
import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),
  content: Joi.object({
    text: AttributedText.required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  stats: Joi.object({
    likes: Joi.number().min(1).required(),
  }).required(),

  personalization: Joi.object({
    liked: Joi.boolean().required(),
    postedByYou: Joi.boolean().required(),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromFirestoreComment = async (environment, comment, options) => {
  const { accountId = null } = options || {};

  let personalization;
  if (accountId) {
    personalization = {
      liked:
        comment.author == accountId
          ? true
          : await LikeTable.exists(environment, null, {
              commentId: comment.id,
              accountId,
            }),
      postedByYou: comment.author == accountId,
    };
  }

  const { account: author } = await AccountTable.get(
    environment,
    null,
    comment.author
  );

  return {
    id: comment.id,

    author: PublicAccount.fromFirestoreAccount(comment.author, author),
    content: {
      text: AttributedText.fromText(comment.content.text),
    },

    children: await Promise.all(
      comment.children.map((comment) =>
        Schema.fromFirestoreComment(environment, comment, options)
      )
    ),

    stats: {
      // We add one because each user always likes their own posts by default.
      likes:
        1 +
        (await CounterTable.get(
          environment,
          null,
          CounterTable.COUNTERS.commentLikes(comment.id)
        )),
    },

    personalization,

    dateCreated: comment.dateCreated,
  };
};

export default Schema;
