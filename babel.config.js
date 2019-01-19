module.exports = function babelConfig(api) {
  if (api) {
    api.cache(true);
  }

  let modules = 'false';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          debug: false,
          targets: {
            browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'],
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
