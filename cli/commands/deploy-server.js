const appengine = require('../util/appengine.js');
const argparse = require('../util/argparse.js');
const buildServer = require('./build-server.js');
const confirm = require('../util/confirm.js');
const logging = require('../util/logging.js');
const workspace = require('../util/workspace.js');

module.exports = {
  arguments: {
    dry: {
      type: Boolean,
      default: false,
    },

    verbose: {
      type: Boolean,
      default: false,
    },
  },

  async run(_, args) {
    args = argparse.parse(this.arguments, args);

    if (!(await confirm.cleanSource({ base: 'master' }))) {
      throw 'Deploy cancelled';
    }

    logging.success(
      await buildServer.run([], {
        env: 'production',
        strict: true,
        verbose: args.verbose,
      })
    );

    if (!(await confirm.resource('production/server'))) {
      throw 'Deploy cancelled';
    }

    if (args.dry) {
      throw 'As per --dry, skipping actual deploy';
    }

    return appengine.deployDirectory({
      project: 'moz-unfck-forum',
      directory: workspace.resolve('build/production/server'),
    });
  },
};
