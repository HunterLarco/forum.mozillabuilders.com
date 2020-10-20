import { createFirestoreClient } from '@/src/server/environment/firestore';
import { createSendgridClient } from '@/src/server/environment/sendgrid';
import { createSparkpostClient } from '@/src/server/environment/sparkpost';

const SERVICES = {
  firestore: createFirestoreClient,
  sendgrid: createSendgridClient,
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
