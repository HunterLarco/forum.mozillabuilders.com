import * as AccountTable from '@/src/server/firestore/Account';

export async function populateAccountMap(environment, accountMap, ids) {
  await Promise.all(
    ids
      .filter((id) => !accountMap[id])
      .map(async (id) => {
        const { account } = await AccountTable.get(environment, null, id);
        accountMap[id] = account;
      })
  );
}
