import Joi from 'joi';

import ApiPostSchema from '@/src/server/types/api/Post';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import Arena from '@/src/server/helpers/arena/Arena';

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

async function queryAndRemoveBannedUsers(arena, { index, cursor, limit }) {
  const queryMethod = {
    new: PostTable.queryByAge,
    hot: PostTable.queryByHotness,
  };

  const cursors = {};
  let nextCursor = cursor;

  let safePosts = Object.values(arena.posts).filter((post) => !post.hidden);
  while (safePosts.length < limit) {
    const { posts } = await queryMethod[index](arena.environment, {
      cursor: nextCursor,
      limit: limit - safePosts.length,
    });

    if (!posts.length) {
      break;
    }

    nextCursor = posts[posts.length - 1].cursor.next;

    for (const post of posts) {
      cursors[post.id] = post.cursor;
      arena.addPost(post.id, post.document);
    }

    await arena.flush();

    const retrievedFullPage = posts.length == limit - safePosts.length;
    safePosts = Object.values(arena.posts).filter((post) => !post.hidden);
    if (!retrievedFullPage) {
      break;
    }
  }

  if (!safePosts.length) {
    return {
      cursor: {
        current: null,
        next: null,
      },
    };
  }

  return {
    cursor: {
      current: cursors[safePosts[0].id].current,
      next: cursors[safePosts[safePosts.length - 1].id].next,
    },
  };
}

const PAGE_SIZE = 20;

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers
  );

  const arena = new Arena(environment);
  if (actor) {
    arena.setActor(actorId, actor);
  }

  const { cursor } = await queryAndRemoveBannedUsers(arena, {
    index: request.index,
    cursor: request.cursor,
    limit: PAGE_SIZE + 1,
  });

  const posts = Object.values(arena.posts).filter((post) => !post.hidden);

  const hasNextPage = posts.length == PAGE_SIZE + 1;
  const renderedPosts = hasNextPage ? posts.slice(0, -1) : posts;

  return {
    posts: renderedPosts.map((post) => ApiPostSchema.fromArena(arena, post.id)),

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
