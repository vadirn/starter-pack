const vm = require('vm');
const path = require('path');
const loaderUtils = require('loader-utils');

const rndPlaceholder = '__EXTRACT_LOADER_PLACEHOLDER__' + rndNumber() + rndNumber();

function rndNumber() {
  return Math.random()
    .toString()
    .slice(2);
}

function extractCSSLoader(content) {
  const callback = this.async();
  const publicPath = getPublicPath({}, this);
  const dependencies = [];
  const name = '[name].[hash].[ext]';
  const outputPath = loaderUtils.interpolateName(this, name, {
    context: this.rootContext,
    content,
  });
  const script = new vm.Script(content, {
    filename: this.resourcePath,
    displayErrors: true,
  });
  const sandbox = {
    require: resourcePath => {
      const absPath = path.resolve(path.dirname(this.resourcePath), resourcePath).split('?')[0];

      // If the required file is a css-loader helper, we just require it with node's require.
      // If the required file should be processed by a loader we do not touch it (even if it is a .js file).
      if (/^[^!]*node_modules[/\\]css-loader[/\\].*\.js$/i.test(absPath)) {
        // Mark the file as dependency so webpack's watcher is working for the css-loader helper.
        // Other dependencies are automatically added by loadModule() below
        this.addDependency(absPath);

        return require(absPath); // eslint-disable-line import/no-dynamic-require
      }

      dependencies.push(resourcePath);

      return rndPlaceholder;
    },
    module: {},
    exports: {},
  };
  this.cacheable();

  sandbox.module.exports = sandbox.exports;
  script.runInNewContext(sandbox);
  Promise.all(dependencies.map(loadModule, this))
    .then(sources =>
      sources.map(
        // runModule may throw an error, so it's important that our promise is rejected in this case
        (src, i) => runModule(src, dependencies[i], publicPath)
      )
    )
    .then(results => {
      const content = sandbox.module.exports.toString().replace(new RegExp(rndPlaceholder, 'g'), () => results.shift());
      this.emitFile(outputPath, content);
      return `module.exports = ${JSON.stringify(sandbox.module.exports.locals)};`;
    })
    .then(content => callback(null, content))
    .catch(callback);
}

function runModule(src, filename, publicPath = '') {
  const script = new vm.Script(src, {
    filename,
    displayErrors: true,
  });
  const sandbox = {
    module: {},
    __webpack_public_path__: publicPath, // eslint-disable-line camelcase
  };

  script.runInNewContext(sandbox);

  return sandbox.module.exports.toString();
}

function loadModule(request) {
  return new Promise((resolve, reject) => {
    // LoaderContext.loadModule automatically calls LoaderContext.addDependency for all requested modules
    this.loadModule(request, (err, src) => {
      if (err) {
        reject(err);
      } else {
        resolve(src);
      }
    });
  });
}

function getPublicPath(options, context) {
  const property = 'publicPath';

  if (property in options) {
    return options[property];
  }

  if (context.options && context.options.output && property in context.options.output) {
    return context.options.output[property];
  }

  if (context._compilation && context._compilation.outputOptions && property in context._compilation.outputOptions) {
    return context._compilation.outputOptions[property];
  }

  return '';
}

module.exports = extractCSSLoader;
