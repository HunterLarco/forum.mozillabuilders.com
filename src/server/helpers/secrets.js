import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const PARENT = 'projects/mozilla-builders-forum';
const secretService = new SecretManagerServiceClient();

function fullyQualifiedName(shortName) {
  return `${PARENT}/secrets/${shortName}`;
}

export async function get(name) {
  const [version] = await secretService.accessSecretVersion({
    name: `${fullyQualifiedName(name)}/versions/latest`,
  });

  return version.payload.data.toString();
}

export async function getAll(names) {
  if (Array.isArray(names)) {
    return Object.fromEntries(
      await Promise.all(names.map(async (name) => [name, await get(name)]))
    );
  } else {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(names).map(async ([alias, name]) => [
          alias,
          await get(name),
        ])
      )
    );
  }
}
