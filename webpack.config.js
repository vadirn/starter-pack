const path = require('path');
const webpack = require('webpack');

const mode = process.env.WEBPACK_MODE || 'development';
const filename = mode === 'development' ? '[name]' : '[name].[chunkhash]';

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
    runtimeChunk: {
      name: 'runtime',
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
      main: path.resolve(__dirname, 'src/main'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'external_modules')],
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
    }),
  ],
};
