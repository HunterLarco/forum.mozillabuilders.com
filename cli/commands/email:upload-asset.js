const crypto = require('crypto');
const fs = require('promise-fs');
const isImage = require('is-image');
const path = require('path');

const argparse = require('../util/argparse.js');
const cloudStorage = require('../util/cloudStorage.js');

function validateImageExtensions(absolutePath) {
  const acceptedExtensions = new Set(['png', 'jpg', 'jpeg', 'gif']);
  const extension = path.extname(absolutePath).substring(1).toLowerCase();
  if (isImage(absolutePath) && !acceptedExtensions.has(extension)) {
    // Many image types will not be rendered by most email clients so we instead
    // only accept a small list of known image types.
    throw `Image files must be one of: ${[...acceptedExtensions].join(', ')}.`;
  }
}

module.exports = {
  arguments: {
    verbose: {
      type: Boolean,
      default: false,
    },
  },

  async run(positionalArgs, args) {
    args = argparse.parse(this.arguments, args);

    const [file] = positionalArgs;

    if (!file) {
      throw 'Missing name from invocation `email:upload-asset <file>`';
    }

    const absolutePath = path.resolve(process.cwd(), file);

    validateImageExtensions(absolutePath);

    const checksum = crypto
      .createHash('md5')
      .update(await fs.readFile(absolutePath), 'utf8')
      .digest('hex');
    const destination = checksum + path.extname(absolutePath);
    await cloudStorage.uploadFileToBucket(
      path.resolve(process.cwd(), file),
      'moz-unfck-forum-email-assets',
      { destination, verbose: args.verbose }
    );

    console.log(
      `Serving URL: https://storage.googleapis.com/moz-unfck-forum-email-assets/${destination}`
    );

    return 'Asset uploaded.';
  },
};
