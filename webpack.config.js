const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
const babel = require('@babel/core');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  resolve,
  BUILD_CONFIG,
  APP_CONFIG,
  mode,
} = require('./scripts/bundler/env');

let filename = '[name]';
if (mode === 'production') {
  filename = '[name].[chunkhash]';
}

const alias = {
  svelte: resolve('node_modules', 'svelte'),
  session: resolve('src', 'session'),
  ui: resolve('src', 'ui'),
  assets: resolve('src', 'assets'),
  routes: resolve('src', 'routes'),
};
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html'];
const mainFields = ['svelte', 'module', 'browser', 'main'];

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => {
      return [
        require('postcss-import'),
        require('postcss-url')({
          url: 'copy',
          basePath: alias.assets,
          assetsPath: 'assets',
        }),
        require('postcss-nested'),
        require('postcss-preset-env')(),
      ].filter(Boolean);
    },
  },
};

module.exports = {
  devtool: mode === 'development' ? 'cheap-source-map' : false,
  mode,
  entry: {
    main: resolve('src', 'main.js'),
  },
  output: {
    path: resolve('__app__', 'assets'),
    filename: `${filename}.js`,
    publicPath: '/assets/',
  },
  resolve: {
    alias,
    extensions,
    mainFields,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
        session: {
          test: /src\/session/,
          chunks: 'all',
          name: 'session',
          enforce: true,
        },
        moduleStyles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            dev: mode,
            emitCss: true,
            preprocess: {
              script: ({ content }) =>
                babel.transformAsync(content, {
                  plugins: [
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                  ],
                }),
            },
          },
        },
      },
      {
        test: /\.m?js$/,
        include: filepath => {
          // include src/** and node_modules/svelte/**
          // exclude everything else
          const svelte = resolve('node_modules', 'svelte');
          const src = resolve('src');

          const testNested = (parent, child) => {
            const relative = path.relative(parent, child);
            return (
              relative &&
              !relative.startsWith('..') &&
              !path.isAbsolute(relative)
            );
          };

          return testNested(src, filepath) || testNested(svelte, filepath);
        },
        use: 'babel-loader',
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[hash:base64:6]_[local]',
              },
            },
          },
          postCSSLoader,
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', postCSSLoader],
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      DEV_MODE: JSON.stringify(mode === 'development'),
      APP_CONFIG: JSON.stringify(APP_CONFIG),
    }),
    new MiniCssExtractPlugin({
      filename: `${filename}.css`,
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/icons',
        to: 'icons',
      },
    ]),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHardDiskPlugin(),
  ].filter(Boolean),

  devServer: {
    publicPath: '/assets/',
    contentBase: resolve('__app__'),
    historyApiFallback: {
      index: 'index.html',
    },
    hot: true,
    stats: 'minimal',
    compress: true,
    port: BUILD_CONFIG.PORT,

    proxy: {},
  },
};
