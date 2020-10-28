import * as AccountTable from '@/src/server/firestore/Account';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';

export default async function getCurrentUser(environment, headers, options) {
  const { required = false, header = 'x-mozilla-builders-auth' } =
    options || {};

  const authTokenId = headers[header];

  if (!authTokenId && required) {
    return Promise.reject({
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: 'User auth required',
    });
  } else if (!authTokenId) {
    return { id: null, account: null };
  }

  const { token } = await AuthTokenTable.get(environment, authTokenId);

  if (!token && required) {
    return Promise.reject({
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: 'User auth required',
    });
  } else if (!token) {
    return { id: null, account: null };
  }

  if (!token.scopes.accountAuth) {
    return Promise.reject({
      httpErrorCode: 401,
      name: 'InvalidUserAuthToken',
      message: 'Auth token does not contain account auth scope',
    });
  }

  const { account } = await AccountTable.get(
    environment,
    null,
    token.scopes.accountAuth.accountId
  );

  if (!account) {
    return Promise.reject({
      httpErrorCode: 401,
      name: 'AccountNotFound',
      message: 'Account does not exist',
    });
  }

  return { id: token.scopes.accountAuth.accountId, account };
}
