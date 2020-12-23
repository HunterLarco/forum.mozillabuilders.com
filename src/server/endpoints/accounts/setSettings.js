import Joi from 'joi';

import ApiPrivateAccountSchema from '@/src/server/types/api/PrivateAccount';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as AccountTable from '@/src/server/firestore/Account';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  notifications: Joi.object({
    email: Joi.object({
      digests: Joi.boolean(),
      comments: Joi.boolean(),
    }),
  }),
});

const ResponseSchema = Joi.object({
  account: ApiPrivateAccountSchema.required(),
});

function setEmailNotifications(account, request) {
  const emailSettings = request.notifications.email;

  if (!account.notificationSettings) {
    account.notificationSettings = {
      email: {
        digests: true,
        comments: true,
      },
    };
  }

  if (emailSettings.digests !== undefined) {
    account.notificationSettings.email.digests = emailSettings.digests;
  }

  if (emailSettings.comments !== undefined) {
    account.notificationSettings.email.comments = emailSettings.comments;
  }
}

async function handler(environment, request, headers) {
  const { actorId, actor } = await environment.firestore.runTransaction(
    async (transaction) => {
      const { id: actorId, account: actor } = await getCurrentUser(
        environment,
        headers,
        { required: true, transaction }
      );

      if (request.notifications && request.notifications.email) {
        setEmailNotifications(actor, request);
      }

      await AccountTable.replace(environment, transaction, actorId, actor);

      return { actorId, actor };
    }
  );

  const arena = new Arena(environment);
  arena.setActor(actorId, actor);
  await arena.flush();

  return {
    account: ApiPrivateAccountSchema.fromArena(arena, actorId),
  };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
