import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';
import * as accountHelpers from '@/src/server/helpers/data/Account';

const RequestSchema = Joi.object({
  index: Joi.string().valid('new', 'hot').required(),
  cursor: Joi.string().allow(null),
});

const ResponseSchema = Joi.object({
  posts: Joi.array().items(ApiPostSchema).required(),
  cursor: Joi.object({
    current: Joi.string().allow(null),
    next: Joi.string().allow(null),
  }),
});

async function queryAndRemoveBannedUsers(
  environment,
  { index, cursor, limit, actor }
) {
  const queryMethod = {
    new: PostTable.queryByAge,
    hot: PostTable.queryByHotness,
  };

  const bannedPosts = [];
  const safePosts = [];
  const authors = {};

  let nextCursor = cursor;

  while (safePosts.length < limit) {
    const appliedLimit = limit - safePosts.length;

    const { posts } = await queryMethod[index](environment, {
      cursor: nextCursor,
      limit: appliedLimit,
    });

    if (!posts.length) {
      break;
    }

    nextCursor = posts[posts.length - 1].cursor.next;

    await accountHelpers.populateAccountMap(
      environment,
      authors,
      posts.map((post) => post.document.author)
    );

    for (const post of posts) {
      if (
        authors[post.document.author].shadowBan &&
        post.document.author != actor
      ) {
        bannedPosts.push(post);
      } else {
        safePosts.push(post);
      }
    }

    if (posts.length < appliedLimit) {
      break;
    }
  }

  return {
    posts: safePosts,
    authors,
    cursor: {
      current: safePosts.length ? safePosts[0].cursor.current : null,
      next: safePosts.length
        ? safePosts[safePosts.length - 1].cursor.next
        : null,
    },
  };
}

const PAGE_SIZE = 20;

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers);

  const { posts, authors, cursor } = await queryAndRemoveBannedUsers(
    environment,
    {
      index: request.index,
      cursor: request.cursor,
      limit: PAGE_SIZE + 1,
      actor: accountId,
    }
  );

  const hasNextPage = posts.length == PAGE_SIZE + 1;
  const renderedPosts = hasNextPage ? posts.slice(0, -1) : posts;

  return {
    posts: await Promise.all(
      renderedPosts.map(({ id, document }) =>
        ApiPostSchema.fromFirestorePost(environment, id, document, {
          accountId,
          author: authors[document.author],
        })
      )
    ),

    cursor: {
      current: cursor.current || request.cursor || null,
      next: hasNextPage ? posts[PAGE_SIZE].cursor.current : null,
    },
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
