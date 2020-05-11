const { rule } = require('../helpers');

module.exports = () =>
  [
    rule('.object-contain', { 'object-fit': 'contain' }),
    rule('.object-cover', { 'object-fit': 'cover' }),
    rule('.object-fill', { 'object-fit': 'fill' }),
    rule('.object-none', { 'object-fit': 'none' }),
    rule('.object-scale-down', { 'object-fit': 'scale-down' }),
  ].join('\n');
