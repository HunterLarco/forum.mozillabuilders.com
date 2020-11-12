import Joi from 'joi';

import ApiNotificationSchema from '@/src/server/types/api/Notification';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as NotificationTable from '@/src/server/firestore/Notification';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  cursor: Joi.string().allow(null),
});

const ResponseSchema = Joi.object({
  notifications: Joi.array().items(ApiNotificationSchema).required(),
  cursor: Joi.object({
    current: Joi.string().allow(null),
    next: Joi.string().allow(null),
  }),
});

const PAGE_SIZE = 20;

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: true }
  );

  const { notifications, cursor } = await NotificationTable.queryByRecipient(
    environment,
    actorId,
    {
      limit: PAGE_SIZE + 1,
      cursor: request.cursor,
    }
  );

  const hasNextPage = notifications.length == PAGE_SIZE;
  const renderedNotifications = hasNextPage
    ? notifications.slice(0, -1)
    : notifications;

  const arena = new Arena(environment);
  for (const notification of renderedNotifications) {
    arena.addNotification(notification.id, notification.document);
  }
  await arena.flush();

  return {
    notifications: Object.values(arena.notifications).map((notification) =>
      ApiNotificationSchema.fromArena(arena, notification.id)
    ),

    cursor: {
      current: cursor.current || request.cursor || null,
      next: hasNextPage ? notifications[PAGE_SIZE].cursor.current : null,
    },
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
