import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as AccountTable from '@/src/server/firestore/Account';

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),
  content: Joi.object({
    text: AttributedText.required(),
  }).required(),

  children: Joi.array().items(Joi.link('...')).required(),

  personalization: Joi.object({
    postedByYou: Joi.boolean().required(),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromFirestoreComment = async (environment, comment, options) => {
  const { accountId = null } = options || {};

  let personalization;
  if (accountId) {
    personalization = {
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

    personalization,

    dateCreated: comment.dateCreated,
  };
};

export default Schema;
