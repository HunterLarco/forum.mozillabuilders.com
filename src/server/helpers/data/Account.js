export function assertPermissions(account, type) {
  if (
    !account.permissions ||
    !account.permissions.some((permission) => permission.type == type)
  ) {
    throw {
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: `Account has not been granted ${type} permissions`,
    };
  }
}
