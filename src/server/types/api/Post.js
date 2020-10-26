import * as dateFns from 'date-fns';
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
  comments: Joi.array().items(Comment),

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
  const { accountId = null, includeComments = false } = options || {};

  const { account: author } = await AccountTable.get(
    environment,
    null,
    post.author
  );

  const apiPost = {
    id,

    author: PublicAccount.fromFirestoreAccount(post.author, author),

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
          : await LikeTable.exists(environment, null, {
              postId: id,
              accountId,
            }),
      postedByYou: post.author == accountId,
    };
  }

  if (post.content.type == 'question') {
    apiPost.content = {
      type: 'question',
      question: post.content.question,
      details: AttributedText.fromText(post.content.details),
    };
  } else if (post.content.type == 'url') {
    apiPost.content = {
      type: 'url',
      summary: post.content.summary,
      url: post.content.url,
    };
  } else if (post.content.type == 'opinion') {
    apiPost.content = {
      type: 'opinion',
      summary: post.content.summary,
      details: AttributedText.fromText(post.content.details),
    };
  } else {
    throw new Error(`Unknown post content type ${post.content.type}`);
  }

  if (includeComments) {
    apiPost.comments = await Promise.all(
      post.comments.map((comment) =>
        Comment.fromFirestoreComment(environment, comment, { accountId })
      )
    );
    reorderComments(apiPost.comments);
  }

  return apiPost;
};

function reorderComments(comments) {
  comments.sort((a, b) =>
    dateFns.compareDesc(new Date(a.dateCreated), new Date(b.dateCreated))
  );
  comments.sort((a, b) => b.stats.likes - a.stats.likes);
  for (const comment of comments) {
    reorderComments(comment.children);
  }
}

export default Schema;
