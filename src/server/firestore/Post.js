import Joi from 'joi';

import PostSchema from '@/src/server/types/firestore/Post';

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

  let query = environment.firestore
    .collection('Post')
    .orderBy('dateCreated', 'desc')
    .limit(limit);
  if (cursor) {
    query = query.startAt(new Date(parseInt(cursor, 16)));
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    return {
      posts: [],
      cursor: {
        current: null,
        next: null,
      },
    };
  }

  const posts = snapshot.docs.map((document) => {
    const post = documentToJson(document);
    return {
      id: document.id,
      post,
      cursor: {
        current: BigInt(post.dateCreated).toString(16),
        next: (BigInt(post.dateCreated) - 1n).toString(16),
      },
    };
  });

  return {
    posts,
    cursor: {
      current: posts[0].cursor.current,
      next: posts[posts.length - 1].cursor.next,
    },
  };
}
