import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';
import * as PostTable from '@/src/server/firestore/Post';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

export async function prepareComment(arena, comment) {
  if (comment.prepared) {
    return false;
  }

  if (!comment.firestore) {
    const postId = commentHelpers.postId(comment.id);
    if (arena.posts[postId] && arena.posts[postId].firestore) {
      const post = arena.posts[postId].firestore;
      comment.firestore = commentHelpers.find(post, comment.id);
    } else {
      const { post } = await PostTable.get(arena.environment, null, postId);
      comment.firestore = commentHelpers.find(post, comment.id);
      arena.addPost(postId, post);
    }
  }

  comment.author = arena.addAccount(comment.firestore.author);

  comment.prepared = true;
  return true;
}

export async function flushComment(arena, comment) {
  if (!comment.prepared) {
    throw new Error('Comment must be prepared before flushed');
  }

  if (comment.flushed) {
    return false;
  }

  await Promise.all([
    flushComment_Likes(arena, comment),
    flushComment_Liked(arena, comment),
  ]);

  flushComment_Hidden(arena, comment);

  comment.flushed = true;
  return true;
}

async function flushComment_Likes(arena, comment) {
  // We add one because each user always likes their own comments by default.
  comment.likes =
    1 +
    (await CounterTable.get(
      arena.environment,
      null,
      CounterTable.COUNTERS.commentLikes(comment.id)
    ));
}

async function flushComment_Liked(arena, comment) {
  if (!arena.actor) {
    comment.liked = false;
    return;
  }

  if (arena.actor.id == comment.author.id) {
    comment.liked = true;
    return;
  }

  comment.liked = await LikeTable.exists(arena.environment, null, {
    commentId: comment.id,
    accountId: arena.actor.id,
  });
}

function flushComment_Hidden(arena, comment) {
  const banned = !!comment.author.firestore.shadowBan;
  comment.hidden =
    banned && (!arena.actor || comment.author.id != arena.actor.id);
}
