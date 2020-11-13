import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';
import * as PostTable from '@/src/server/firestore/Post';

import * as accountHelpers from '@/src/server/helpers/data/Account';
import * as commentHelpers from '@/src/server/helpers/data/Comment';

export async function preparePost(arena, post) {
  if (post.prepared) {
    return false;
  }

  if (!post.firestore) {
    post.firestore = (
      await PostTable.get(arena.environment, null, post.id)
    ).post;
  }

  post.author = arena.addAccount(post.firestore.author);
  for (const comment of commentHelpers.iterate(post.firestore.comments)) {
    arena.addComment(comment.id, comment);
  }

  post.prepared = true;
  return true;
}

export async function flushPost(arena, post) {
  if (!post.prepared) {
    throw new Error('Post must be prepared before flushed');
  }

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
  const banned = post.firestore.shadowBan || post.author.firestore.shadowBan;
  const actorIsAuthor = arena.actor && post.author.id == arena.actor.id;
  const actorIsModerator =
    arena.actor &&
    accountHelpers.hasRole(arena.actor.account, 'globalModerator');
  post.hidden = banned && !actorIsAuthor && !actorIsModerator;
}

function flushPost_Comments(arena, post) {
  const comments = Array.from(commentHelpers.iterate(post.firestore.comments));
  post.comments = comments.filter(
    (comment) => !arena.comments[comment.id].hidden
  ).length;
}
