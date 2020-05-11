const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { BUILD_CONFIG, resolve, watch } = require('./env');
const { infoFmt, errorFmt, warningFmt } = require('./utils');
const { watchRoutes } = require('./watch-routes');
const { createCss } = require('./create-css');
const webpackConfig = require('../../webpack.config');

console.log(infoFmt(`Clearing ${chalk.bold('__app__')}`));
fs.emptyDirSync(resolve('__app__'));

console.log(infoFmt(`Watching routes directory ${chalk.bold('src/routes')}`));
watchRoutes(
  watch,
  resolve('src', 'node_modules', '@app'),
  resolve('src', 'routes')
);
createCss(resolve('src', 'node_modules', '@app'));

const compiler = webpack(webpackConfig);
const webpackCallback = (err, stats) => {
  if (err) {
    console.log(errorFmt(err.stack || err));
    if (err.details) {
      console.log(errorFmt(err.details));
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(errorFmt(info.errors));
  }

  if (stats.hasWarnings()) {
    console.log(warningFmt(info.warnings));
  }

  if (!stats.hasErrors()) {
    console.log(`> compiled in ${chalk.bold(info.time)} ms`);
  }
};

if (watch) {
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);
  server.listen(BUILD_CONFIG.PORT, 'localhost', err => {
    if (err) {
      console.log(errorFmt(err.stack || err));
      if (err.details) {
        console.log(errorFmt(err.details));
      }
    }
    console.log(
      infoFmt(
        `WebpackDevServer is listening at localhost:${chalk.bold(
          BUILD_CONFIG.PORT
        )}`
      )
    );
  });
} else {
  compiler.run(webpackCallback);
}
