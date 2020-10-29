import * as CounterTable from '@/src/server/firestore/Counter';
import * as LikeTable from '@/src/server/firestore/Like';

export default async function flushComment(arena, comment) {
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
