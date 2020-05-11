const path = require('path');
const { writeIfChanged } = require('./utils');
const css = require('../css');

exports.createCss = destDir => {
  writeIfChanged(path.join(destDir, 'utils.css'), css());
};
