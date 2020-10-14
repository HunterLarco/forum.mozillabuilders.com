import { createFirestoreClient } from '@/src/server/environment/firestore';

const SERVICES = {
  firestore: createFirestoreClient,
};

export async function createEnvironment({ services }) {
  const environment = {};

  await Promise.all(
    services.map((service) =>
      SERVICES[service]().then((client) => {
        environment[service] = client;
      })
    )
  );

  return environment;
}
