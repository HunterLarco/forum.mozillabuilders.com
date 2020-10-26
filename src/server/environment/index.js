import { createFirestoreClient } from '@/src/server/environment/firestore';
import { createSparkpostClient } from '@/src/server/environment/sparkpost';

const SERVICES = {
  firestore: createFirestoreClient,
  sparkpost: createSparkpostClient,
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
