const chalk = require('chalk');
const glob = require('fast-glob');
const pLimit = require('p-limit');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const logging = require('./logging.js');

const storageClient = new Storage();

const limitConcurrency = pLimit(10);

async function listBucket(bucket) {
  return storageClient
    .bucket(bucket)
    .getFiles()
    .then(([files]) => files.map((file) => file.name));
}

async function uploadFileToBucket(file, bucket, { destination, verbose }) {
  return storageClient
    .bucket(bucket)
    .upload(file, { destination })
    .then(() => {
      if (verbose) {
        console.log(chalk.gray(`Uploaded ${destination ? destination : file}`));
      }
    });
}

async function uploadDirectoryToBucket(directory, bucket, { verbose }) {
  const files = await glob(['**'], { cwd: directory });

  try {
    await Promise.all(
      files.map((file) =>
        limitConcurrency(async () =>
          uploadFileToBucket(path.join(directory, file), bucket, {
            destination: file,
            verbose,
          })
        )
      )
    );
  } catch (error) {
    logging.warning(
      `One or more uploads failed! ${bucket} is in an unknown state.`
    );
    throw error;
  }

  return files;
}

async function removeFileFromBucket(file, bucket, { verbose }) {
  return storageClient
    .bucket(bucket)
    .file(file)
    .delete()
    .then(() => {
      if (verbose) {
        console.log(chalk.gray(`Deleted ${file}`));
      }
    });
}

async function removeFilesFromBucket(files, bucket, { verbose }) {
  try {
    await Promise.all(
      files.map((file) =>
        limitConcurrency(async () =>
          removeFileFromBucket(file, bucket, { verbose })
        )
      )
    );
  } catch (error) {
    logging.warning(
      `One or more deletions failed! ${bucket} is in an unknown state.`
    );
    throw error;
  }
}

module.exports = {
  listBucket,
  uploadFileToBucket,
  uploadDirectoryToBucket,
  removeFileFromBucket,
  removeFilesFromBucket,
};
