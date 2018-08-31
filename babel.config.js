module.exports = function babelConfig(api, useCommonjs = false) {
  if (api) {
    api.cache(true);
  }

  let modules = false;
  if (useCommonjs) {
    modules = 'commonjs';
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          debug: false,
          targets: {
            browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
          },
          modules,
          loose: true,
        },
      ],
      '@babel/preset-react',
    ],
    env: {
      test: {
        presets: [['@babel/preset-env'], '@babel/preset-react'],
      },
    },
    plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-syntax-dynamic-import'],
  };
};
