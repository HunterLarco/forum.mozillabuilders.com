import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

export default async function flushPost(arena, post) {
  if (post.flushed) {
    return false;
  }

  await Promise.all([
    flushPost_Likes(arena, post),
    flushPost_Liked(arena, post),
  ]);

  flushPost_Comments(arena, post);
  flushPost_Hidden(arena, post);

  post.flushed = true;
  return true;
}

async function flushPost_Likes(arena, post) {
  // We add one because each user always likes their own posts by default.
  post.likes =
    1 +
    (await CounterTable.get(
      arena.environment,
      null,
      CounterTable.COUNTERS.likes(post.id)
    ));
}

async function flushPost_Liked(arena, post) {
  if (!arena.actor) {
    post.liked = false;
    return;
  }

  if (arena.actor.id == post.author.id) {
    post.liked = true;
    return;
  }

  post.liked = await LikeTable.exists(arena.environment, null, {
    postId: post.id,
    accountId: arena.actor.id,
  });
}

function flushPost_Hidden(arena, post) {
  const banned = !!post.author.firestore.shadowBan;
  post.hidden = banned && (!arena.actor || post.author.id != arena.actor.id);
}

function flushPost_Comments(arena, post) {
  const comments = Array.from(commentHelpers.iterate(post.firestore.comments));
  post.comments = comments.filter(
    (comment) => !arena.comments[comment.id].hidden
  ).length;
}
