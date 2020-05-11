const { rule } = require('../helpers');

module.exports = () =>
  [
    rule('.block', { display: 'block' }),
    rule('.inline-block', { display: 'inline-block' }),
    rule('.inline', { display: 'inline' }),
    rule('.flex', { display: 'flex' }),
    rule('.none', { display: 'none' }),
  ].join('\n');
