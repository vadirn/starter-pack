const { RawSource, ConcatSource } = require('webpack-sources');
// const crypto = require('crypto');
const plugin = 'ExtractCSSPlugin';

module.exports = class ExrtactCSSPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(plugin, compilation => {
      let extractedChunks = '';
      compilation.hooks.optimizeAssets.tapAsync(plugin, (assets, cb) => {
        // console.log({ chunks, modules });
        // const newAssets =Object.entries(assets).reduce((accum, [filename, source]) => {
        //   console.log(filename);
        // }, {});
        const accum = new ConcatSource();
        Object.entries(assets).forEach(([filename, source]) => {
          if (filename.endsWith('.css')) {
            // const sourceWithHeader = new ReplaceSource(source.source, filename)
            const sourceWithHeader = new RawSource(`/** ${filename} **/\n${source.source()}\n`);
            accum.add(sourceWithHeader);
            delete assets[filename];
          }
        });
        // const hash = require('crypto').createHash('sha256');
        // accum.updateHash(hash);
        // const digest = hash.digest('hex');
        // console.log({ source: accum.source, name: `bundle.${digest}.css` });
        assets['bundle.css'] = accum;
        cb();
      });
    });
  }
};
