import * as dateFns from 'date-fns';
import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as AccountIdentityTable from '@/src/server/firestore/AccountIdentity';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';
import FirestoreEmailSchema from '@/src/server/types/firestore/Email';

const RequestSchema = Joi.object({
  email: Joi.string().email().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request) {
  const email = FirestoreEmailSchema.fromText(request.email);

  const { accountIdentity } = await AccountIdentityTable.get(
    environment,
    null,
    'normalizedEmail',
    email.normalized
  );

  if (!accountIdentity) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'AccountNotFound',
      message: `No account found for email ${email.raw}`,
    });
  }

  const { id } = await AuthTokenTable.create(environment, null, {
    dateCreated: new Date(),
    expiration: dateFns.addDays(new Date(), 1),
    scopes: {
      login: {
        accountId: accountIdentity.accountId,
      },
    },
  });

  console.log(id);

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
