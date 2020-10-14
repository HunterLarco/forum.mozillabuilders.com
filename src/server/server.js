import '@/src/server/runtime'; // must be the first import: do not move

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import rejectInsecureRequests from '@/src/server/middleware/rejectInsecureRequests';

import * as routes from '@/src/server/routes';
import { createEnvironment } from '@/src/server/environment';

async function main() {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(rejectInsecureRequests());

  const environment = await createEnvironment({
    services: ['firestore'],
  });

  routes.install(environment, app);

  // process.env.PORT is supplied by the GAE runtime.
  const port = process.env.PORT || process.fido.flags.port || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  console.error('Server experienced fatal startup error');
  process.exit(1);
});
