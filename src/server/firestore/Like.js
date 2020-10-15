import md5 from 'md5';

import LikeSchema from '@/src/server/types/firestore/Like';

import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, like) {
  const { value, error } = LikeSchema.validate(like);
  if (error) {
    console.error(`InvalidLikeSchema: ${error.message}`, like);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidLikeSchema',
      message: 'Invalid like schema.',
    });
  }

  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${like.postId}:${like.accountId}`));

  // Unlike other tables, we use set instead of create. It's not consequential
  // to try and create a like twice since the key is always tied to a post +
  // account.
  if (transaction) {
    await transaction.set(reference, value);
  } else {
    await reference.set(value);
  }

  return { id: reference.id, like };
}

export async function exists(environment, transaction, postId, accountId) {
  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${postId}:${accountId}`));
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  return document.exists;
}

export async function get(environment, transaction, postId, accountId) {
  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${postId}:${accountId}`));
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id: reference.id, like: null };
  }

  const like = documentToJson(document);
  return { id: reference.id, like };
}

export async function remove(environment, transaction, postId, accountId) {
  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${postId}:${accountId}`));

  if (transaction) {
    await transaction.delete(reference);
  } else {
    await reference.delete();
  }
}
