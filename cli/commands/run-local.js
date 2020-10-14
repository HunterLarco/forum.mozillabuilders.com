const argparse = require('../util/argparse.js');
const buildServer = require('./build-server.js');
const buildWeb = require('./build-web.js');
const logging = require('../util/logging.js');

module.exports = {
  arguments: {
    'server-port': {
      type: Number,
      default: 3000,
    },

    'web-port': {
      type: Number,
      default: 8080,
    },

    'firestore-port': {
      type: Number,
      default: 9000,
    },

    firestore: {
      type: Boolean,
      default: true,
    },

    verbose: {
      type: Boolean,
      default: false,
    },
  },

  async run(_, args) {
    args = argparse.parse(this.arguments, args);

    buildServer.run([], {
      env: 'local',
      verbose: args.verbose,
      port: args['server-port'],
      'local-firestore': `localhost:${args['firestore-port']}`,
      watch: true,
      run: true,
    });

    buildWeb.run([], {
      env: 'local',
      verbose: args.verbose,
      'dev-server-port': args['web-port'],
      'local-api-server': `http://localhost:${args['server-port']}`,
      run: true,
    });

    return new Promise(() => {});
  },
};
