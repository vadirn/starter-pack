const { RawSource, ConcatSource } = require('webpack-sources');
const crypto = require('crypto');
const postcss = require('postcss');
const postcssEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

const plugin = 'ExtractCSSPlugin';

module.exports = class ExrtactCSSPlugin {
  constructor(options = {}) {
    const {
      filename = '[name].[chunkhash].css',
      isServer = false,
      postcssEnv = {
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
        features: {
          'color-mod-function': { unresolved: 'warn' },
          'custom-media-queries': true,
        },
      },
    } = options;
    this.options = { filename, isServer, postcssEnv };
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(plugin, compilation => {
      compilation.hooks.optimizeAssets.tapAsync(plugin, (assets, cb) => {
        if (this.options.isServer) {
          Object.entries(assets).forEach(([filename]) => {
            if (filename.endsWith('.css')) {
              delete assets[filename];
            }
          });
          cb();
        } else {
          const accum = new ConcatSource();
          compilation.modules.forEach(module => {
            if (module.resource && module.resource.endsWith('.css')) {
              const filename = module.resource + '_';
              const sourceWithHeader = new RawSource(`\n/** ${module.resource} **/\n${assets[filename].source()}\n`);
              accum.add(sourceWithHeader);
              delete assets[filename];
            }
          });

          postcss([postcssEnv(this.options.postcssEnv), cssnano])
            .process(accum.source(), { from: undefined })
            .then(result => {
              const hash = crypto.createHash('md5');
              const compactSource = new RawSource(result.css);
              compactSource.updateHash(hash);
              const digest = hash.digest('hex');
              const filename = this.options.filename.replace('[name]', 'bundle').replace('[chunkhash]', digest);
              assets[filename] = compactSource;
              cb();
            })
            .catch(err => {
              console.log(err);
              process.exit(0);
            });
        }
      });
    });
  }
};
