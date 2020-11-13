export function assertPermissions(account, type) {
  if (!hasPermission(account, type)) {
    throw {
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: `Account has not been granted ${type} permissions`,
    };
  }
}

export function hasPermission(account, type) {
  return (
    account.permissions &&
    account.permissions.some((permission) => permission.type == type)
  );
}
