import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as NotificationTable from '@/src/server/firestore/Notification';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  await environment.firestore.runTransaction(async (transaction) => {
    const { notification } = await NotificationTable.get(
      environment,
      transaction,
      request.id
    );

    if (!notification) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'NotificationNotFound',
        message: `Notification ${request.id} not found`,
      });
    } else if (notification.recipient != actorId) {
      return Promise.reject({
        httpErrorCode: 401,
        name: 'Unauthorized',
        message: "You cannot read a notification you didn't recieve",
      });
    }

    if (notification.read) {
      return {};
    }

    notification.read = true;
    await NotificationTable.replace(
      environment,
      transaction,
      request.id,
      notification
    );
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
