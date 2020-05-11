const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const previousContents = new Map();

exports.writeIfChanged = (file, code) => {
  if (code !== previousContents.get(file)) {
    previousContents.set(file, code);
    fs.outputFileSync(file, code);
    exports.fudgeMtime(file);
  }
};

exports.fudgeMtime = file => {
  // need to fudge the mtime so that webpack doesn't go doolally
  const { atime, mtime } = fs.statSync(file);
  fs.utimesSync(
    file,
    new Date(atime.getTime() - 999999),
    new Date(mtime.getTime() - 999999)
  );
};

/**
 * Returns a function that will return resolved path relative to a given fixed path
 * @param outer
 * @return {function(...[string]): string}
 */
exports.makeResolve = (...outer) => (...inner) =>
  path.resolve(...outer, ...inner);

exports.errorFmt = chalk.bold.red;
exports.warningFmt = chalk.keyword('orange');
exports.infoFmt = chalk.green;

exports.booleanLike = val =>
  !(val === undefined || val === null || val === 'false' || val === false);

/**
 * Selects what value to use depending on provided build type
 * @param buildType {string}
 * @param selectFrom {object}
 * @param overwriteValue {*}
 * @returns {*}
 */
exports.selectValue = (buildType, selectFrom, overwriteValue) => {
  if (overwriteValue !== undefined) {
    return overwriteValue;
  }
  if (selectFrom[buildType] !== undefined) {
    return selectFrom[buildType];
  }
  throw new Error(`No value defined for provided build type: "${buildType}"`);
};
