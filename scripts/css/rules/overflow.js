const { rule } = require('../helpers');

module.exports = () =>
  [
    rule('.overflow-auto', { overflow: 'auto' }),
    rule('.overflow-hidden', { overflow: 'hidden' }),
  ].join('\n');
