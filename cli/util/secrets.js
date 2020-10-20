const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const PARENT = 'projects/moz-unfck-forum';
const secretService = new SecretManagerServiceClient();

function fullyQualifiedName(shortName) {
  return `${PARENT}/secrets/${shortName}`;
}

async function create(name) {
  await secretService.createSecret({
    parent: PARENT,
    secret: {
      name,
      replication: {
        automatic: {},
      },
    },
    secretId: name,
  });
}

async function addVersion(name, value) {
  await secretService.addSecretVersion({
    parent: fullyQualifiedName(name),
    payload: {
      data: Buffer.from(value.toString(), 'utf8'),
    },
  });
}

async function remove(name) {
  await secretService.deleteSecret({
    name: fullyQualifiedName(name),
  });
}

async function list() {
  const [secrets] = await secretService.listSecrets({
    parent: PARENT,
  });

  return secrets.map((secret) => secret.name.split('/').slice(-1)[0]);
}

async function get(name) {
  const [version] = await secretService.accessSecretVersion({
    name: `${fullyQualifiedName(name)}/versions/latest`,
  });

  return version.payload.data.toString();
}

module.exports = {
  create,
  addVersion,
  remove,
  list,
  get,
};
