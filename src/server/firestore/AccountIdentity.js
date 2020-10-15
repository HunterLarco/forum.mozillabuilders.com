import md5 from 'md5';

import * as AccountTable from '@/src/server/firestore/Account';

import AccountIdentitySchema from '@/src/server/types/firestore/AccountIdentity';

import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, accountIdentity) {
  const { value, error } = AccountIdentitySchema.validate(accountIdentity);
  if (error) {
    console.error(
      `InvalidAccountIdentitySchema: ${error.message}`,
      accountIdentity
    );
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidAccountIdentitySchema',
      message: 'Invalid account identity schema.',
    });
  }

  const reference = environment.firestore
    .collection('AccountIdentity')
    .doc(md5(`${accountIdentity.type}:${accountIdentity.identity}`));

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, accountIdentity };
}

export async function exists(environment, transaction, type, key) {
  const reference = environment.firestore
    .collection('AccountIdentity')
    .doc(md5(`${type}:${key}`));
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  return document.exists;
}

export async function remove(environment, transaction, type, key) {
  const reference = environment.firestore
    .collection('AccountIdentity')
    .doc(md5(`${type}:${key}`));

  if (transaction) {
    await transaction.delete(reference);
  } else {
    await reference.delete();
  }
}

export async function get(environment, transaction, type, key) {
  const reference = environment.firestore
    .collection('AccountIdentity')
    .doc(md5(`${type}:${key}`));
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id: reference.id, accountIdentity: null };
  }

  const accountIdentity = documentToJson(document);
  return { id: reference.id, accountIdentity };
}

export async function getAccount(environment, transaction, type, key) {
  const { id, accountIdentity } = await get(
    environment,
    transaction,
    type,
    key
  );

  if (!accountIdentity) {
    return { id, accountIdentity: null };
  }

  return await AccountTable.get(
    environment,
    transaction,
    accountIdentity.accountId
  );
}
