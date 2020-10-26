import Joi from 'joi';
import { Firestore } from '@google-cloud/firestore';

export const COUNTERS = {
  likes: (id) => ({
    namespace: 'Likes',
    id,
    shards: 5,
  }),

  commentLikes: (id) => ({
    namespace: 'Likes:Comments',
    id,
    shards: 1,
  }),
};

export async function increment(environment, transaction, counter, amount = 1) {
  const shard = Math.floor(Math.random() * counter.shards);
  const reference = environment.firestore
    .collection('ShardedCounters')
    .doc(`${counter.namespace}:${counter.id}`)
    .collection('Shards')
    .doc(shard.toString());

  if (transaction) {
    await transaction.set(
      reference,
      { count: Firestore.FieldValue.increment(amount) },
      { merge: true }
    );
  } else {
    await reference.set(
      { count: Firestore.FieldValue.increment(amount) },
      { merge: true }
    );
  }
}

export async function decrement(environment, transaction, counter, amount = 1) {
  return await increment(environment, transaction, counter, -amount);
}

export async function get(environment, transaction, counter) {
  const querySnapshot = await environment.firestore
    .collection('ShardedCounters')
    .doc(`${counter.namespace}:${counter.id}`)
    .collection('Shards')
    .get();

  let count = 0;
  for (const document of querySnapshot.docs) {
    count += document.get('count');
  }
  return count;
}
