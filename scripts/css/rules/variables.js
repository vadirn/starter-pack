const css_var = (name, value) => `--${name}: ${value};`;

module.exports = (opts = {}) => {
  const { fonts, colors, sizes, fontSizes } = opts;
  const vars = [];
  for (const ff of Object.keys(fonts)) {
    vars.push(css_var(`ff-${ff}`, fonts[ff]));
  }
  for (const colorGroup of Object.keys(colors)) {
    for (let i = 0; i < colors[colorGroup].length; i += 1) {
      vars.push(css_var(`color-${colorGroup}-${i}`, colors[colorGroup][i]));
    }
  }
  for (let i = 0; i < sizes.length; i += 1) {
    vars.push(css_var(`size-${i}`, `${sizes[i] / 16}rem`));
    sizes[i] !== 0 && vars.push(css_var(`-size-${i}`, `-${sizes[i] / 16}rem`));
  }
  for (let i = 0; i < fontSizes.length; i += 1) {
    vars.push(css_var(`font-size-${i}`, `${fontSizes[i] / 16}rem`));
  }
  return `:root {\n  ${vars.join('\n  ')}\n}`;
};
