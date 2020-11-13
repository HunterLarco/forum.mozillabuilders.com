import Joi from 'joi';

import AccountSchema from '@/src/server/types/firestore/Account';

import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, account) {
  const { value, error } = AccountSchema.validate(account);
  if (error) {
    console.error(`InvalidAccountSchema: ${error.message}`, account);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidAccountSchema',
      message: 'Invalid account schema.',
    });
  }

  const reference = environment.firestore.collection('Account').doc();

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, account };
}

export async function get(environment, transaction, id) {
  const reference = environment.firestore.collection('Account').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id, account: null };
  }

  const account = documentToJson(document);
  return { id, account };
}

export async function replace(environment, transaction, accountId, account) {
  const { value, error } = AccountSchema.validate(account);
  if (error) {
    console.error(`InvalidAccountSchema: ${error.message}`, account);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidAccountSchema',
      message: 'Invalid account schema.',
    });
  }

  const reference = environment.firestore.collection('Account').doc(accountId);

  if (transaction) {
    await transaction.set(reference, value);
  } else {
    await reference.set(value);
  }

  return { id: reference.id, account };
}
