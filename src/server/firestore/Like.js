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

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, like };
}

export async function exists(environment, transaction, accountId, postId) {
  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${postId}:${accountId}`));
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  return document.exists;
}

export async function get(environment, transaction, accountId, postId) {
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

export async function remove(environment, transaction, accountId, postId) {
  const reference = environment.firestore
    .collection('Like')
    .doc(md5(`${postId}:${accountId}`));

  if (transaction) {
    await transaction.delete(reference);
  } else {
    await reference.delete();
  }
}
