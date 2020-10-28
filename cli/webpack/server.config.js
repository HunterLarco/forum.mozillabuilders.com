const { merge } = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const BaseConfig = require('./base.config.js');
const workspace = require('../util/workspace');

module.exports = (env, flags) =>
  merge(BaseConfig(env, flags), {
    devtool: 'source-map',

    entry: {
      server: workspace.resolve('src/server/server.js'),
    },

    output: {
      path: workspace.resolve(`build/${env}/server`),
    },

    module: {
      rules: [
        {
          test: /\.mjml$/,
          loader: 'webpack-mjml-loader',
          options: {
            minify: true,
          },
        },
        {
          test: /\.txt$/,
          loader: 'raw-loader',
          options: {
            esModule: true,
          },
        },
      ],
    },

    target: 'node',
    externals: [
      nodeExternals({
        modulesDir: workspace.resolve('node_modules'),
      }),
    ],

    optimization: {
      // There's no need to minimize our backend since we're not trying to
      // optimize for bandwidth. In fact, not minimizing makes GCP cloud
      // debugging tools operate a little more smoothly.
      minimize: false,
    },

    plugins: [
      new GeneratePackageJsonPlugin(
        {
          name: 'mozilla-builders-forum-server',
          scripts: {
            start: 'node server.bundle.js',
          },
          engines: {
            node: '14.1.0',
          },
        },
        workspace.resolve('package.json')
      ),
      new CopyWebpackPlugin({
        patterns: [
          { from: workspace.resolve('src/server/app.yaml') },
          { from: workspace.resolve('src/server/cron.yaml') },
        ],
      }),
    ],
  });
