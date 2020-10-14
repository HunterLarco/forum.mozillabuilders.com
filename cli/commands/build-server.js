const { spawn } = require('child_process');
const path = require('path');
const webpack = require('webpack');

const argparse = require('../util/argparse.js');
const logging = require('../util/logging.js');
const webpackHelpers = require('../util/webpack.js');

function spawnServer(compiler) {
  return spawn('node', [path.join(compiler.outputPath, 'server.bundle.js')], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
}

async function waitForExit(subprocess) {
  return new Promise((resolve, reject) => {
    subprocess.once('exit', (code) => {
      resolve({
        cause: subprocess.killed ? 'internal' : 'external',
        code: code,
      });
    });
  });
}

module.exports = {
  arguments: {
    env: {
      type: String,
      values: ['local', 'production'],
      default: 'local',
    },

    port: {
      type: Number,
      default: 3000,
    },

    'local-firestore': {
      type: String,
      default: 'localhost:9000',
    },

    watch: {
      type: Boolean,
      default: false,
    },

    run: {
      type: Boolean,
      default: false,
    },

    strict: {
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

    const configTemplate = require('../webpack/server.config.js');
    const config = configTemplate(args.env, {
      port: args.port,
      localFirestore: args['local-firestore'],
    });

    const compiler = webpack(config);
    if (args.strict) {
      webpackHelpers.promoteWarningsToErrors(compiler);
    }

    if (args.watch) {
      if (args.run) {
        let server;
        compiler.hooks.done.tap('fido', (stats) => {
          // Is the build failed, but we're still watching, don't restart the server.
          // Wait for a passing build.
          if (!webpackHelpers.buildOk(stats)) return;

          if (server) {
            logging.retrying('[server] Restarting the server');
            server.kill();
          }

          server = spawnServer(compiler);
          waitForExit(server).then(({ cause }) => {
            if (cause == 'external') {
              logging.failure('[server] Died');
              server = null;
            }
          });
        });
      }

      return webpackHelpers.watch(compiler, {
        namespace: 'server',
        verbose: args.verbose,
      });
    } else {
      const buildSummary = await webpackHelpers.run(compiler, {
        namespace: 'server',
        verbose: args.verbose,
      });

      if (args.run) {
        logging.success(buildSummary);
        await waitForExit(spawnServer(compiler)).then(({ cause }) => {
          throw '[server] Died';
        });
      } else {
        return buildSummary;
      }
    }
  },
};
