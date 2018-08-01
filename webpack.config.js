const path = require('path');
const webpack = require('webpack');
const ExtractCSSPlugin = require('./webpack/ExtractCSSPlugin');
const ExtractStatsPlugin = require('./webpack/ExtractStatsPlugin');
const getLocalIdent = require('css-loader/lib/getLocalIdent');

const mode = process.env.WEBPACK_MODE || 'development';
let filename = '[name]';
if (mode === 'production') {
  filename = '[name].[chunkhash]';
}

module.exports = {
  mode,
  entry: {
    main: path.resolve(__dirname, 'src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build/assets'),
    filename: `${filename}.js`,
    publicPath: '/assets/',
  },
  optimization: {
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
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'external_modules')],
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/ui/components'),
      views: path.resolve(__dirname, 'src/ui/views'),
      controllers: path.resolve(__dirname, 'src/controllers'),
      services: path.resolve(__dirname, 'src/services'),
      utils: path.resolve(__dirname, 'src/utils'),
      playground: path.resolve(__dirname, 'src/playground'),
      'with-consumer': path.resolve(__dirname, 'src/main'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'external_modules')],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('./webpack/extractCSSLoader'),
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[hash:8]__[local]',
              getLocalIdent: (context, localIdentName, localName, options) => {
                let name = getLocalIdent(context, localIdentName, localName, options);
                // Make sure classname doesn't start with underscore
                // if it starts with underscore, than it was padded
                if (name.startsWith('_')) {
                  name = 'a' + name.slice(2);
                }
                return name;
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-smart-import')({
                  addDependencyTo: webpack,
                  root: path.resolve(__dirname),
                  path: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
                }),
                require('postcss-custom-media')({}),
                require('postcss-custom-properties')({ preserve: false }),
                require('postcss-calc')({}),
                require('postcss-color-function')({}),
                require('postcss-discard-comments')({}),
                require('postcss-remove-root')({}),
                require('autoprefixer')({
                  browsers: ['last 2 versions'],
                }),
                require('postcss-clean')({}),
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
    }),
    new ExtractCSSPlugin({
      filename: `${filename}.css`,
    }),
    new ExtractStatsPlugin(),
  ],
};
