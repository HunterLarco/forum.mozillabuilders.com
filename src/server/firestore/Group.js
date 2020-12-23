import Joi from 'joi';

import GroupSchema from '@/src/server/types/firestore/Group';

import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, group) {
  const { value, error } = GroupSchema.validate(group);
  if (error) {
    console.error(`InvalidGroupSchema: ${error.message}`, group);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidGroupSchema',
      message: 'Invalid group schema.',
    });
  }

  const reference = environment.firestore.collection('Group').doc();

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, group };
}

export async function get(environment, transaction, id) {
  const reference = environment.firestore.collection('Group').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id, group: null };
  }

  const group = documentToJson(document);
  return { id, group };
}
