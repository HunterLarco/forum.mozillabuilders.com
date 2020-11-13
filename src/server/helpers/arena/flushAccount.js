import * as AccountTable from '@/src/server/firestore/Account';

export async function prepareAccount(arena, account) {
  if (account.prepared) {
    return false;
  }

  if (!account.firestore) {
    account.firestore = (
      await AccountTable.get(arena.environment, null, account.id)
    ).account;
  }

  account.prepared = true;
  return true;
}

export async function flushAccount(arena, account) {
  if (!account.prepared) {
    throw new Error('Account must be prepared before flushed');
  }

  if (account.flushed) {
    return false;
  }

  account.flushed = true;
  return true;
}
