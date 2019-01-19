const path = require('path');
const webpack = require('webpack');
const ExtractCSSPlugin = require('./ExtractCSSPlugin');
const ExtractStatsPlugin = require('./ExtractStatsPlugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { version } = require('../../package.json');
const babelConfig = require('../../babel.config');

function optimizationConfig(options = {}) {
  return {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
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

module.exports = function getConfig(options = {}) {
  const { watch = false, production = false } = options;

  let mode = 'development';
  let devtool = 'eval';
  if (production) {
    mode = 'production';
    devtool = 'none';
  }

  let target = 'web';

  let filename = '[name]';
  if (mode === 'production') {
    filename = '[name].[chunkhash]';
  }

  const rootDir = path.resolve(__dirname, '..', '..');
  const distDir = path.resolve(rootDir, 'dist');

  const config = {
    mode,
    target,
    devtool,
    entry: {
      main: path.resolve(rootDir, 'src', 'main.js'),
    },
    output: {
      path: path.resolve(distDir, 'assets'),
      filename: `${filename}.js`,
      publicPath: '/assets/',
    },
    optimization: optimizationConfig(),
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
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [path.resolve(rootDir, 'src'), path.resolve(rootDir, 'external_modules')],
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: babelConfig(undefined),
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('./extractCSSLoader'),
              options: {},
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
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  if (file.includes('favicon')) {
                    return '[name].[ext]';
                  }
                  return '[hash].[ext]';
                },
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
        IS_DEV: JSON.stringify(mode === 'development'),
        IS_PROD: JSON.stringify(mode === 'production'),
      }),
      mode === 'development' && new CaseSensitivePathPlugin(),
      new ExtractCSSPlugin({
        filename: `${filename}.css`,
      }),
      new ExtractStatsPlugin(),
      new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
    ].filter(Boolean),
  };
  return config;
};
