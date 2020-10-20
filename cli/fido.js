#!/usr/bin/env node

const minimist = require('minimist');

const argparse = require('./util/argparse.js');
const logging = require('./util/logging.js');

const COMMANDS = {
  'run-local': () => require('./commands/run-local.js'),
  lint: () => require('./commands/lint.js'),
  'server:build': () => require('./commands/server:build.js'),
  'server:deploy': () => require('./commands/server:deploy.js'),
  'web:build': () => require('./commands/web:build.js'),
  'web:deploy': () => require('./commands/web:deploy.js'),
  'secrets:create': () => require('./commands/secrets:create.js'),
  'secrets:delete': () => require('./commands/secrets:delete.js'),
  'secrets:list': () => require('./commands/secrets:list.js'),
};

function main(positionalArgs, keywordArgs) {
  if (positionalArgs[0] == 'help') {
    positionalArgs = positionalArgs.slice(1);
    keywordArgs['help'] = true;
  }

  if (positionalArgs.length == 0 || !(positionalArgs[0] in COMMANDS)) {
    console.log();
    console.log('Usage: fido <command>');
    console.log();
    console.log('where <command> is one of:');
    console.log('    ' + Object.keys(COMMANDS).join(', '));
    process.exit(1);
  }

  const commandName = positionalArgs[0];
  const command = COMMANDS[commandName]();

  if (keywordArgs['help'] || positionalArgs[1] == 'help') {
    console.log();
    console.log(`Usage: fido ${commandName}`);
    console.log();
    argparse.printHelp(command.arguments || {});
    process.exit(1);
  }

  command
    .run(positionalArgs.slice(1), keywordArgs)
    .then((message) => {
      if (message) {
        logging.success(message);
      } else {
        logging.warning('Command exited successfully without any output');
      }
    })
    .catch((error) => {
      logging.failure(error);
      process.exit(1);
    });
}

(() => {
  const args = minimist(process.argv.slice(2));
  const positionalArgs = args._;
  delete args._;

  try {
    main(positionalArgs, args);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
