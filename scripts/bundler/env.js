/* eslint-disable no-ternary */
const chalk = require('chalk');
const { makeResolve, infoFmt } = require('./utils');

// project root
exports.resolve = makeResolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const watch = args.includes('--watch') || args.includes('-w');

const PORT = Number(process.env.PORT) || 8080;
const mode = process.env.NODE_ENV || 'development';

const BUILD_CONFIG = {
  PORT,
};

exports.BUILD_CONFIG = BUILD_CONFIG;
exports.APP_CONFIG = {};
exports.watch = watch;
exports.mode = mode;

/**
 * Logs given property
 * @param name {string}
 * @param value {*}
 * @param offset {number=} indent
 */
function logProperty(name, value, offset = 0) {
  const stringOffset = ' '.repeat(offset);
  console.log(`${stringOffset}${name}=${chalk.bold(value)}`);
}

// log BUILD_CONFIG
console.log(infoFmt('\nBuild config:'));
for (const key of Object.keys(BUILD_CONFIG).sort((a, b) =>
  a.localeCompare(b)
)) {
  if (key !== 'flags') {
    logProperty(key, BUILD_CONFIG[key], 2);
  }
}
// console.log(infoFmt('Build flags:'));
// for (const key of Object.keys(BUILD_CONFIG.flags).sort((a, b) =>
//   a.localeCompare(b)
// )) {
//   logProperty(key, BUILD_CONFIG.flags[key], 2);
// }
