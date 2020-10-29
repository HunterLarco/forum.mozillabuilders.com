import * as dateFns from 'date-fns';
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

  title: Joi.string(),
  content: Joi.object({
    text: AttributedText,
    link: Joi.string(),
  }).xor('link', 'text'),

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
  const author =
    options && options.author
      ? options.author
      : (await AccountTable.get(environment, null, post.author)).account;

  const apiPost = {
    id,

    author: PublicAccount.fromFirestoreAccount(post.author, author),

    title: post.title,
    content: {},

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

  if (post.content.link) {
    apiPost.content.link = post.content.link;
  } else if (post.content.text) {
    apiPost.content.text = AttributedText.fromText(post.content.text);
  } else {
    throw new Error(
      `Unknown post content format ${JSON.stringify(post.content)}`
    );
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
