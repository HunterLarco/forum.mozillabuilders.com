const argparse = require('../util/argparse.js');
const confirm = require('../util/confirm.js');
const secrets = require('../util/secrets.js');

module.exports = {
  arguments: {},

  async run(positionalArgs, args) {
    args = argparse.parse(this.arguments, args);

    const [name] = positionalArgs;

    if (!name) {
      throw 'Missing name from invocation `secrets:delete <name>`';
    } else if (positionalArgs.length > 1) {
      throw (
        'Unexpected arguments besides name: ' +
        positionalArgs.slice(1).join(' ')
      );
    }

    if (!(await confirm.resource(name))) {
      throw 'Deletion cancelled';
    }

    await secrets.remove(name);
    return `Secret '${name}' deleted`;
  },
};
