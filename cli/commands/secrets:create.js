const argparse = require('../util/argparse.js');
const secrets = require('../util/secrets.js');

module.exports = {
  arguments: {
    update: {
      type: Boolean,
      default: false,
    },
  },

  async run(positionalArgs, args) {
    args = argparse.parse(this.arguments, args);

    const [name, value] = positionalArgs;

    if (!name) {
      throw 'Missing name from invocation `secrets:create <name> <value>`';
    } else if (!value) {
      throw 'Missing value from invocation `secrets:create <name> <value>`';
    } else if (positionalArgs.length > 2) {
      throw (
        'Unexpected arguments besides name and value: ' +
        positionalArgs.slice(2).join(' ')
      );
    }

    if (!args.update) {
      await secrets.create(name);
    }

    await secrets.addVersion(name, value);
    return 'Secret created!';
  },
};
