import Joi from 'joi';

import NotificationSchema from '@/src/server/types/firestore/Notification';

import * as cursorHelpers from '@/src/server/helpers/firestore/cursor';
import { documentToJson } from '@/src/server/helpers/firestore/json';

export async function create(environment, transaction, notification) {
  const { value, error } = NotificationSchema.validate(notification);
  if (error) {
    console.error(`InvalidNotificationSchema: ${error.message}`, notification);
    return Promise.reject({
      httpErrorCode: 500,
      name: 'InvalidNotificationSchema',
      message: 'Invalid notification schema.',
    });
  }

  const reference = environment.firestore.collection('Notification').doc();

  if (transaction) {
    await transaction.create(reference, value);
  } else {
    await reference.create(value);
  }

  return { id: reference.id, notification };
}

export async function get(environment, transaction, id) {
  const reference = environment.firestore.collection('Notifictaion').doc(id);
  const document = transaction
    ? await transaction.get(reference)
    : await reference.get();

  if (!document.exists) {
    return { id, notification: null };
  }

  const notification = documentToJson(document);
  return { id, notification };
}

export async function queryByRecipient(environment, accountId, options) {
  const limit = options && options.limit ? options.limit : 20;
  const cursor = options && options.cursor ? options.cursor : null;

  const query = environment.firestore
    .collection('Notification')
    .where('recipient', '==', accountId)
    .orderBy('dateCreated', 'desc')
    .limit(limit);

  const {
    documents,
    cursor: documentsCursor,
  } = await cursorHelpers.executeQuery({
    query,
    cursor,
    createCursor: (notification) => [notification.dateCreated],
  });

  return {
    notifications: documents,
    cursor: documentsCursor,
  };
}
