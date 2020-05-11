const attr = (name, value) => `${name}: ${value};`;

exports.rule = (className, attributes) => {
  return `${className} {\n  ${Object.keys(attributes)
    .map(key => attr(key, attributes[key]))
    .join('\n  ')}\n}`;
};
