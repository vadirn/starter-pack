const path = require('path');

module.exports = class ExtractStatsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('ExtractStatsPlugin', function onDone(_stats) {
      const stats = _stats.toJson({
        assets: true,
        children: false,
        chunks: false,
        errorDetails: false,
        hash: false,
        modules: false,
        publicPath: true,
        source: false,
        timings: false,
      });
      const assets = stats.assets.reduce((accum, asset) => {
        const parts = asset.name.split('.');
        const extension = parts[parts.length - 1];
        const filename = parts[0];
        if (['js', 'css'].includes(extension)) {
          accum[`${filename}.${extension}`] = asset.name;
        }
        return accum;
      }, {});
      const publicPath = stats.publicPath;
      const outputPath = stats.outputPath;
      require('fs').writeFileSync(path.join(outputPath, 'stats.json'), JSON.stringify({ assets, publicPath }, null, 2));
    });
  }
};
