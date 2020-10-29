import * as AccountTable from '@/src/server/firestore/Account';

export default async function flushAccount(arena, account) {
  if (account.flushed) {
    return false;
  }

  await flushAccount_Firestore(arena, account);

  account.flushed = true;
  return true;
}

async function flushAccount_Firestore(arena, account) {
  if (account.firestore) {
    return;
  }

  account.firestore = (
    await AccountTable.get(arena.environment, null, account.id)
  ).account;
}
