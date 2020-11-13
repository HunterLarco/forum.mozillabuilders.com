export function assertRole(account, type) {
  if (!hasRole(account, type)) {
    throw {
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: `Account has not been granted ${type} role`,
    };
  }
}

export function hasRole(account, type) {
  return account.roles && account.roles.some((role) => role.type == type);
}
