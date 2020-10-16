import * as dateFns from 'date-fns';
import Joi from 'joi';

import PostSchema from '@/src/server/types/firestore/Post';

import * as CounterTable from '@/src/server/firestore/Counter';

import * as cursorHelpers from '@/src/server/helpers/firestore/cursor';
import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, post) {
  const { value, error } = PostSchema.validate(post);
  if (error) {
    console.error(`InvalidPostSchema: ${error.message}`, post);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidPostSchema',
      message: 'Invalid post schema.',
    });
  }

  const reference = environment.firestore.collection('Post').doc();

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, post };
}

export async function exists(environment, transaction, id) {
  const reference = environment.firestore.collection('Post').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  return document.exists;
}

export async function get(environment, transaction, id) {
  const reference = environment.firestore.collection('Post').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id, post: null };
  }

  const post = documentToJson(document);
  return { id, post };
}

export async function queryByAge(environment, options) {
  const limit = options && options.limit ? options.limit : 20;
  const cursor = options && options.cursor ? options.cursor : null;

  const {
    documents,
    cursor: documentsCursor,
  } = await cursorHelpers.executeQuery({
    query: environment.firestore
      .collection('Post')
      .orderBy('dateCreated', 'desc')
      .limit(limit),
    cursor,
    createCursor: (post) => [post.dateCreated],
  });

  return {
    posts: documents,
    cursor: documentsCursor,
  };
}

export async function queryByHotness(environment, options) {
  const limit = options && options.limit ? options.limit : 20;
  const cursor = options && options.cursor ? options.cursor : null;

  const {
    documents,
    cursor: documentsCursor,
  } = await cursorHelpers.executeQuery({
    query: environment.firestore
      .collection('Post')
      .orderBy('stats.hotness', 'desc')
      .orderBy('dateCreated', 'desc')
      .limit(limit),
    cursor,
    createCursor: (post) => [post.stats.hotness, post.dateCreated],
  });

  return {
    posts: documents,
    cursor: documentsCursor,
  };
}

export async function updateHotRank(environment) {
  let cursor = new Date();
  const cutoff = dateFns.subDays(new Date(), 7);

  while (cursor > cutoff) {
    const snapshot = await environment.firestore
      .collection('Post')
      .orderBy('dateCreated', 'desc')
      .startAt(cursor)
      .limit(25)
      .get();

    if (snapshot.empty) {
      return;
    }

    const statuses = await Promise.allSettled(
      snapshot.docs.map(async (document) => {
        const post = documentToJson(document);
        const likes = await CounterTable.get(
          environment,
          null,
          CounterTable.COUNTERS.likes(document.id)
        );

        // Hacker News ranking algorithm: https://bit.ly/3lRZceO
        const hotness =
          likes /
          Math.pow((new Date() - post.dateCreated) / (60 * 60 * 1000), 1.8);

        await environment.firestore
          .collection('Post')
          .doc(document.id)
          .update({
            // We add one because authors like their own posts by default.
            'stats.likes': likes + 1,
            'stats.hotness': parseFloat(hotness.toPrecision(16)),
          });
      })
    );

    for (const { status, reason } of statuses) {
      if (status == 'rejected') {
        console.error(new Error(reason));
      }
    }

    const oldestPost = documentToJson(snapshot.docs[snapshot.docs.length - 1]);
    cursor = dateFns.subMilliseconds(oldestPost.dateCreated, 1);
  }
}
