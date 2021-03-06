import { Firestore } from '@google-cloud/firestore';

export async function createFirestoreClient() {
  const settings = {
    projectId: 'mozilla-builders-forum',
  };

  if (process.fido.env == 'local') {
    settings.host = process.fido.flags.localFirestore;
    settings.ssl = false;
  }

  return new Firestore(settings);
}
