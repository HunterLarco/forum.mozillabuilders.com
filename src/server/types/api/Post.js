import Joi from 'joi';

import AttributedText from '@/src/server/types/api/AttributedText';
import Comment from '@/src/server/types/api/Comment';
import PublicAccount from '@/src/server/types/api/PublicAccount';

import * as AccountTable from '@/src/server/firestore/Account';
import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

const Schema = Joi.object({
  id: Joi.string().required(),

  author: PublicAccount.required(),

  title: Joi.string().required(),
  content: Joi.object({
    text: AttributedText,
    link: Joi.string(),
  })
    .xor('text', 'link')
    .required(),

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
  const {
    // Current user account ID used for personalization.
    accountId = null,
  } = options || {};

  const { account: author } = await AccountTable.get(
    environment,
    null,
    post.author
  );

  const apiPost = {
    id,

    author: PublicAccount.fromFirestoreAccount(post.author, author),

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

    dateCreated: post.dateCreated,
  };

  if (accountId) {
    apiPost.personalization = {
      liked:
        post.author == accountId
          ? true
          : await LikeTable.exists(environment, null, accountId, id),
      postedByYou: post.author == accountId,
    };
  }

  if (post.content.type == 'question') {
    apiPost.title = post.content.question;
    apiPost.content = { text: AttributedText.fromText(post.content.details) };
  } else if (post.content.type == 'url') {
    apiPost.title = post.content.summary;
    apiPost.content = { link: post.content.url };
  } else if (post.content.type == 'opinion') {
    apiPost.title = post.content.summary;
    apiPost.content = { text: AttributedText.fromText(post.content.details) };
  } else if (post.content.text) {
    apiPost.title = post.title;
    apiPost.content = { text: AttributedText.fromText(post.content.text) };
  } else if (post.content.link) {
    apiPost.title = post.title;
    apiPost.content = { link: post.content.link };
  } else {
    throw new Error(
      `Unknown post content type ${JSON.stringify(post.content)}`
    );
  }

  return apiPost;
};

export default Schema;
