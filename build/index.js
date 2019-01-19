const webpack = require('webpack');
const getConfig = require('./webpack/config.js');
const parseArgs = require('minimist');
const path = require('path');
const fs = require('fs-extra');
const once = require('lodash/once');
const template = require('./template');

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    w: 'watch',
    p: 'production',
  },
  boolean: ['w', 'p'],
});

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pagesDir = path.resolve(distDir, 'pages');

const createIndexFile = once(async () => {
  await fs.emptyDir(pagesDir);
  await fs.ensureFile(path.resolve(pagesDir, '.keep'));
  const rawStats = await fs.readFile(path.join(distDir, 'assets', 'stats.json'), 'utf-8');
  const stats = JSON.parse(rawStats);
  const text = template(stats);
  await fs.writeFile(path.join(pagesDir, 'index.html'), text, 'utf-8');
});

async function main() {
  try {
    await fs.emptyDir(path.resolve(distDir, 'assets'));
    await fs.ensureFile(path.resolve(distDir, 'assets', '.keep'));
    webpack(getConfig({ watch: argv.watch, production: argv.production }), (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats.hasErrors()) {
        // print out errors
        for (const err of stats.toJson().errors) {
          console.log(err);
        }
      }

      // create index.html once
      createIndexFile();
    });
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

main();
