const variables = require('./rules/variables');
const boxSizingRules = require('./rules/box-sizing');
const displayRules = require('./rules/display');
const floatRules = require('./rules/float');
const overflowRules = require('./rules/overflow');

module.exports = function render(opts = {}) {
  const fonts = Object.assign(
    {
      body:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      heading:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono:
        'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    },
    opts.fonts
  );

  const {
    fontSizes = [14, 16, 24, 32, 40],
    sizes = [0, 1, 2, 8, 16, 24, 32, 40, 48],
    colors = {
      neutral: ['hsl(0, 0%, 100%)', 'hsl(0, 0%, 40%)', 'hsl(0, 0%, 6%)'],
    },
  } = opts;

  const config = {
    fonts,
    sizes,
    fontSizes,
    colors,
  };

  return [
    variables(config),
    boxSizingRules(),
    displayRules(),
    floatRules(),
    overflowRules(),
  ].join('\n\n');
};
