import Joi from 'joi';
import normalizeEmail from 'normalize-email';

import ApiPrivateAccountSchema from '@/src/server/types/api/PrivateAccount';
import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as AccountIdentityTable from '@/src/server/firestore/AccountIdentity';
import * as AccountTable from '@/src/server/firestore/Account';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';
import FirestoreEmailSchema from '@/src/server/types/firestore/Email';

import Arena from '@/src/server/helpers/arena/Arena';

const RequestSchema = Joi.object({
  token: Joi.string(),
  compositeKey: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}).xor('token', 'compositeKey');

const ResponseSchema = Joi.object({
  token: Joi.string().required(),
  account: ApiPrivateAccountSchema.required(),
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

  const { id: accountId, account } = await environment.firestore.runTransaction(
    async (transaction) => {
      const { id, account } = await AccountTable.create(
        environment,
        transaction,
        {
          email,
          username,
          dateCreated: new Date(),
        }
      );

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

      return { id, account };
    }
  );

  return {
    token: await createAuthToken(environment, accountId),
    accountId,
    account,
  };
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

  return {
    token: await createAuthToken(environment, accountId),
    accountId,
    account,
  };
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
  const { id: tokenId, token } = request.compositeKey
    ? await AuthTokenTable.get(environment, {
        email: normalizeEmail(request.compositeKey.email),
        password: request.compositeKey.password,
      })
    : await AuthTokenTable.get(environment, request.token);

  if (!token) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'InvalidToken',
      message: 'Incorrect login credentials',
    });
  }

  if (token.scopes.signup) {
    const { token: loginToken, accountId, account } = await signup(
      environment,
      {
        email: token.scopes.signup.email,
        username: token.scopes.signup.username,
      }
    );
    await AuthTokenTable.remove(environment, tokenId);

    const arena = new Arena(environment);
    arena.addAccount(accountId, account);
    await arena.flush();

    return {
      token: loginToken,
      account: ApiPrivateAccountSchema.fromArena(arena, accountId),
    };
  }

  if (token.scopes.login) {
    const { token: loginToken, accountId, account } = await login(
      environment,
      token.scopes.login.accountId
    );
    await AuthTokenTable.remove(environment, tokenId);

    const arena = new Arena(environment);
    arena.addAccount(accountId, account);
    await arena.flush();

    return {
      token: loginToken,
      account: ApiPrivateAccountSchema.fromArena(arena, accountId),
    };
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
