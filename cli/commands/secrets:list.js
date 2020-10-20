const argparse = require('../util/argparse.js');
const logging = require('../util/logging.js');
const secrets = require('../util/secrets.js');

module.exports = {
  arguments: {},

  async run(positionalArgs, args) {
    args = argparse.parse(this.arguments, args);

    const names = await secrets.list();
    if (!names.length) {
      return 'No secrets exist';
    }

    names.sort();
    for (const name of names) {
      console.log(`- ${name}`);
    }
    return 'Done';
  },
};
