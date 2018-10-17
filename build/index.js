const webpack = require('webpack');
const getConfig = require('./webpack/config.js');
const parseArgs = require('minimist');
const path = require('path');
const render = require('./render.js');
const fs = require('fs-extra');

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    w: 'watch',
    s: 'server',
    p: 'production',
  },
  boolean: ['w', 's', 'p'],
});

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Copy serve configs
const serveConfigPath = path.join(rootDir, 'serve_configs', 'now.json');
fs.copyFile(serveConfigPath, path.join(distDir, 'now.json'), err => {
  if (err) throw err;
});

const isServer = argv.server;
if (isServer) {
  // clear the node directory
  fs.emptyDir(path.resolve(distDir, 'node'))
    .then(() => {
      return fs.ensureFile(path.resolve(distDir, 'node', '.keep'));
    })
    .then(() => {
      webpack(getConfig({ isServer, watch: argv.watch, production: argv.production }), (err, _stats) => {
        if (err) {
          console.log(err);
          process.exit(0);
        } else if (_stats.hasErrors()) {
          const jsonStats = _stats.toJson('errors-only');
          for (const _err of jsonStats.errors) {
            console.log(_err);
          }
          process.exit(0);
        }
        const stats = _stats.toJson({ assets: true });
        try {
          render(require(path.join(stats.outputPath, stats.assetsByChunkName.main)));
        } catch (err) {
          console.log(err);
          process.exit(0);
        }
      });
    })
    .catch(err => {
      console.log(err);
      process.exit(0);
    });
} else {
  // clear the assets directory
  fs.emptyDir(path.resolve(distDir, 'assets'))
    .then(() => {
      return fs.ensureFile(path.resolve(distDir, 'assets', '.keep'));
    })
    .then(() => {
      webpack(getConfig({ isServer, watch: argv.watch, production: argv.production }), (err, stats) => {
        if (err) {
          console.log(err);
          process.exit(0);
        } else if (!argv.watch && stats.hasErrors()) {
          process.exit(0);
        }
      });
    })
    .catch(err => {
      console.log(err);
      process.exit(0);
    });
}
