import Joi from 'joi';
import normalizeEmail from 'normalize-email';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as AccountIdentityTable from '@/src/server/firestore/AccountIdentity';
import * as AccountTable from '@/src/server/firestore/Account';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';
import FirestoreEmailSchema from '@/src/server/types/firestore/Email';

const RequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const ResponseSchema = Joi.object({
  token: Joi.string().required(),
});

async function signup(environment, { email, username }) {
  if (
    await AccountIdentityTable.exists(
      environment,
      null,
      'normalizedEmail',
      email.normalized
    )
  ) {
    return Promise.reject({
      httpErrorCode: 412,
      name: 'AccountAlreadyExists',
      message: `Account already exists for email ${email.raw}`,
    });
  } else if (
    await AccountIdentityTable.exists(environment, null, 'username', username)
  ) {
    return Promise.reject({
      httpErrorCode: 412,
      name: 'AccountAlreadyExists',
      message: `Account already exists for username ${username}`,
    });
  }

  const accountId = await environment.firestore.runTransaction(
    async (transaction) => {
      const { id } = await AccountTable.create(environment, transaction, {
        email,
        username,
        dateCreated: new Date(),
      });

      await AccountIdentityTable.create(environment, transaction, {
        type: 'normalizedEmail',
        identity: email.normalized,
        accountId: id,
        dateCreated: new Date(),
      });

      await AccountIdentityTable.create(environment, transaction, {
        type: 'username',
        identity: username,
        accountId: id,
        dateCreated: new Date(),
      });

      return id;
    }
  );

  return await createAuthToken(environment, accountId);
}

async function login(environment, accountId) {
  const { account } = await AccountTable.get(environment, null, accountId);

  if (!account) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'AccountNotFound',
      message: `Account ${accountId} not found`,
    });
  }

  return await createAuthToken(environment, accountId);
}

async function createAuthToken(environment, accountId) {
  const { id } = await AuthTokenTable.create(environment, {
    dateCreated: new Date(),
    scopes: {
      accountAuth: {
        accountId,
      },
    },
  });

  return id;
}

async function handler(environment, request) {
  const { id: tokenId, token } = await AuthTokenTable.get(environment, {
    email: normalizeEmail(request.email),
    password: request.password,
  });

  if (!token) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'InvalidToken',
      message: 'Incorrect login credentials',
    });
  }

  if (token.scopes.signup) {
    const loginToken = await signup(environment, {
      email: token.scopes.signup.email,
      username: token.scopes.signup.username,
    });
    await AuthTokenTable.remove(environment, tokenId);
    return { token: loginToken };
  } else if (token.scopes.login) {
    const loginToken = await login(environment, token.scopes.login.accountId);
    await AuthTokenTable.remove(environment, tokenId);
    return { token: loginToken };
  }

  return Promise.reject({
    httpErrorCode: 412,
    name: 'InvalidAuthScope',
    message: `Token ${request.token} is not authorized for login`,
  });
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
