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

async function main() {
  const isServer = argv.server;
  try {
    if (isServer) {
      await fs.emptyDir(path.resolve(distDir, 'node'));
      await fs.ensureFile(path.resolve(distDir, 'node', '.keep'));
      webpack(getConfig({ isServer, watch: argv.watch, production: argv.production }), (err, _stats) => {
        if (err) {
          throw err;
        } else if (_stats.hasErrors()) {
          const jsonStats = _stats.toJson('errors-only');
          for (const _err of jsonStats.errors) {
            console.log(_err);
          }
          process.exit(0);
        }
        const stats = _stats.toJson({ assets: true });
        try {
          render(require(path.join(stats.outputPath, stats.assetsByChunkName.main)).default);
        } catch (err) {
          throw err;
        }
      });
    } else {
      await fs.emptyDir(path.resolve(distDir, 'assets'));
      await fs.ensureFile(path.resolve(distDir, 'assets', '.keep'));
      webpack(getConfig({ isServer, watch: argv.watch, production: argv.production }), (err, _stats) => {
        if (err) {
          throw err;
        } else if (_stats.hasErrors()) {
          const stats = _stats.toJson({ assets: true });
          for (const _err of stats.errors) {
            console.log(_err);
          }
          process.exit(0);
        }
      });
    }
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

main();
