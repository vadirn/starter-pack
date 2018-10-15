const path = require('path');
const webpack = require('webpack');
const ExtractCSSPlugin = require('./ExtractCSSPlugin');
const ExtractStatsPlugin = require('./ExtractStatsPlugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { version } = require('../../package.json');
const babelConfig = require('../../babel.config');

function optimizationConfig(options = {}) {
  const { isServer = false } = options;

  if (isServer) {
    return {
      concatenateModules: true,
      minimize: false,
    };
  }
  return {
    moduleIds: 'natural', // this helps with css order
    splitChunks: {
      cacheGroups: {
        // put all node modules into vendor chunk
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/,
          enforce: true,
        },
      },
    },
  };
}

function outputConfig(options = {}) {
  const { isServer = false, distDir, filename } = options;

  if (isServer) {
    return {
      path: path.resolve(distDir, 'node'),
      filename: `${filename}.js`,
      publicPath: '/assets/',
      libraryTarget: 'commonjs2',
    };
  }
  return {
    path: path.resolve(distDir, 'assets'),
    filename: `${filename}.js`,
    publicPath: '/assets/',
  };
}

module.exports = function getConfig(options = {}) {
  const { isServer = false, watch = false, production = false } = options;

  let mode = 'development';
  if (production) {
    mode = 'production';
  }

  let target = 'web';
  if (isServer) {
    target = 'node';
  }

  let filename = '[name]';
  if (mode === 'production' && isServer === false) {
    filename = '[name].[chunkhash]';
  }

  const rootDir = path.resolve(__dirname, '..', '..');
  const distDir = path.resolve(rootDir, 'dist');

  const config = {
    mode,
    target,
    entry: {
      main: path.resolve(rootDir, 'src', 'main.js'),
    },
    output: outputConfig({ isServer, distDir, filename }),
    optimization: optimizationConfig({ isServer }),
    watch,
    watchOptions: {
      aggregateTimeout: 300,
    },
    resolve: {
      modules: [path.resolve(rootDir, 'node_modules'), path.resolve(rootDir, 'external_modules')],
      alias: {
        assets: path.resolve(rootDir, 'src', 'assets'),
        components: path.resolve(rootDir, 'src', 'ui', 'components'),
        views: path.resolve(rootDir, 'src', 'ui', 'views'),
        controllers: path.resolve(rootDir, 'src', 'controllers'),
        services: path.resolve(rootDir, 'src', 'services'),
        utils: path.resolve(rootDir, 'src', 'utils'),
        playground: path.resolve(rootDir, 'src', 'playground'),
        main: path.resolve(rootDir, 'src', 'main'),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [path.resolve(rootDir, 'src'), path.resolve(rootDir, 'external_modules')],
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: babelConfig(undefined, isServer),
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('./extractCSSLoader'),
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[hash:8]__[local]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-smart-import')({
                    addDependencyTo: webpack,
                    root: path.resolve(rootDir),
                    path: [path.resolve(rootDir, 'node_modules'), path.resolve(rootDir, 'src')],
                  }),
                ],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
        },
        USE_LOG: JSON.stringify(true),
        APP_VERSION: JSON.stringify(version),
        IS_SERVER: JSON.stringify(isServer),
        IS_BROWSER: JSON.stringify(!isServer),
      }),
      new ExtractCSSPlugin({
        filename: `${filename}.css`,
        isServer,
      }),
      new ExtractStatsPlugin(),
      new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
    ],
  };
  return config;
};
