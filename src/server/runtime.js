// Provides source map support for stack traces in node via the V8 stack trace
// API.
//
// https://www.npmjs.com/package/source-map-support
require('source-map-support').install();

// Cloud Debugger allows us to inspect live production environments with minimal
// overhead.
//
// https://cloud.google.com/debugger/docs/setup/nodejs
if (process.fido.env != 'local') {
  require('@google-cloud/debug-agent').start({
    allowExpressions: true,
    serviceContext: {
      enableCanary: true,
    },
  });
}
