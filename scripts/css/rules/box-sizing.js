const { rule } = require('../helpers');

module.exports = () =>
  [
    rule('html', { 'box-sizing': 'border-box' }),
    rule('*, *:before, *:after', { 'box-sizing': 'inherit' }),
  ].join('\n');
