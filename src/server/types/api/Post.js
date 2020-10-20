import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import Comment from '@/src/server/types/api/Comment';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as AccountTable from '@/src/server/firestore/Account';
import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

const Content = Joi.alternatives().conditional('.type', {
  switch: [
    {
      is: 'question',
      then: Joi.object({
        type: 'question',
        question: Joi.string().required(),
        details: AttributedText.required(),
      }),
    },
    {
      is: 'url',
      then: Joi.object({
        type: 'url',
        summary: Joi.string().required(),
        url: Joi.string().uri().required(),
      }),
    },
    {
      is: 'opinion',
      then: Joi.object({
        type: 'opinion',
        summary: Joi.string().required(),
        details: AttributedText.required(),
      }),
    },
  ],
});

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),
  content: Content.required(),
  comments: Joi.array().items(Comment).required(),

  stats: Joi.object({
    likes: Joi.number().min(1).required(),
    comments: Joi.number().min(0).required(),
  }).required(),

  personalization: Joi.object({
    liked: Joi.boolean().required(),
    postedByYou: Joi.boolean().required(),
  }),

  dateCreated: Joi.date().required(),
});

Schema.fromFirestorePost = async (environment, id, post, options) => {
  const { accountId = null } = options || {};

  let personalization;
  if (accountId) {
    personalization = {
      liked:
        post.author == accountId
          ? true
          : await LikeTable.exists(environment, null, accountId, id),
      postedByYou: post.author == accountId,
    };
  }

  const { account: author } = await AccountTable.get(
    environment,
    null,
    post.author
  );

  let content = {};
  if (post.content.type == 'question') {
    content.type = 'question';
    content.question = post.content.question;
    content.details = AttributedText.fromText(post.content.details);
  } else if (post.content.type == 'url') {
    content.type = 'url';
    content.summary = post.content.summary;
    content.url = post.content.url;
  } else if (post.content.type == 'opinion') {
    content.type = 'opinion';
    content.summary = post.content.summary;
    content.details = AttributedText.fromText(post.content.details);
  } else {
    throw new Error(`Unknown post content type ${post.content.type}`);
  }

  return {
    id,

    author: PublicAccount.fromFirestoreAccount(post.author, author),
    content,
    comments: await Promise.all(
      post.comments.map((comment) =>
        Comment.fromFirestoreComment(environment, comment, { accountId })
      )
    ),

    stats: {
      // We add one because each user always likes their own posts by default.
      likes:
        1 +
        (await CounterTable.get(
          environment,
          null,
          CounterTable.COUNTERS.likes(id)
        )),
      comments: commentHelpers.count(post.comments),
    },

    personalization: personalization,

    dateCreated: post.dateCreated,
  };
};

export default Schema;
