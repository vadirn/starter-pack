const { RawSource, ConcatSource } = require('webpack-sources');
const crypto = require('crypto');
const plugin = 'ExtractCSSPlugin';

module.exports = class ExrtactCSSPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        filename: '[name].[chunkhash].css',
      },
      options
    );
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(plugin, compilation => {
      compilation.hooks.optimizeAssets.tapAsync(plugin, (assets, cb) => {
        const accum = new ConcatSource();
        Object.entries(assets).forEach(([filename, source]) => {
          if (filename.endsWith('.css')) {
            // const sourceWithHeader = new ReplaceSource(source.source, filename)
            const sourceWithHeader = new RawSource(`/** ${filename} **/\n${source.source()}\n`);
            accum.add(sourceWithHeader);
            delete assets[filename];
          }
        });
        const hash = crypto.createHash('md5');
        accum.updateHash(hash);
        const digest = hash.digest('hex');
        const accumFilename = this.options.filename.replace('[name]', 'bundle').replace('[chunkhash]', digest);
        assets[accumFilename] = accum;
        cb();
      });
    });
  }
};
