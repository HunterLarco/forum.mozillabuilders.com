import Joi from 'joi';

import AuthTokenSchema from '@/src/server/types/firestore/AuthToken';

import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, token) {
  const { value, error } = AuthTokenSchema.validate(token);
  if (error) {
    console.error(`InvalidAuthTokenSchema: ${error.message}`, token);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidAuthTokenSchema',
      message: 'Invalid AuthToken schema.',
    });
  }

  const reference = environment.firestore.collection('AuthToken').doc();

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, token };
}

export async function get(environment, transaction, id) {
  const reference = environment.firestore.collection('AuthToken').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id, token: null };
  }

  const token = documentToJson(document);

  if (token.expiration < Date.now()) {
    return { id, token: null };
  }

  return { id, token };
}

export async function remove(environment, transaction, id) {
  const reference = environment.firestore.collection('AuthToken').doc(id);
  if (transaction) {
    await transaction.delete(reference);
  } else {
    await reference.delete();
  }
}
