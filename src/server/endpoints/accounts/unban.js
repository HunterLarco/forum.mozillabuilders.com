import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as AccountTable from '@/src/server/firestore/Account';

import * as accountHelpers from '@/src/server/helpers/data/Account';

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

  accountHelpers.assertRole(actor, 'globalModerator');

  await environment.firestore.runTransaction(async (transaction) => {
    const { account } = await AccountTable.get(
      environment,
      transaction,
      request.id
    );

    if (!account) {
      return Promise.reject({
        httpErrorCode: 404,
        name: 'AccountNotFound',
        message: `Account ${request.id} not found`,
      });
    }

    delete account.shadowBan;

    await AccountTable.replace(environment, transaction, request.id, account);
  });

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
