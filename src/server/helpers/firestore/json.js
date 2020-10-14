import firestore from '@google-cloud/firestore';
import traverse from 'traverse';

export function documentToJson(document) {
  return traverse(document.data()).map((value) => {
    if (value instanceof firestore.Timestamp) {
      return value.toDate();
    }

    return value;
  });
}
