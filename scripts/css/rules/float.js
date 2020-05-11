const { rule } = require('../helpers');

module.exports = () =>
  [
    rule('.float-left', { float: 'left' }),
    rule('.float-right', { float: 'right' }),
    rule('.float-none', { float: 'none' }),
    rule('.clearfix:after', { content: '""', display: 'table', clear: 'both' }),
  ].join('\n');
