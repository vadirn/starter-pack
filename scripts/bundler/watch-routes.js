const CheapWatch = require('cheap-watch');
const { createManifest } = require('./create-manifest');

let watcherInstance;

exports.watchRoutes = (watch, destDir, routesDir) => {
  if (watcherInstance) return;

  watcherInstance = new CheapWatch({
    dir: routesDir,
    debounce: 150,
  });
  const callback = () => {
    createManifest(destDir, routesDir);
  };
  watcherInstance.on('+', callback);
  watcherInstance.on('-', callback);
  if (watch) {
    watcherInstance.init();
  }
  callback();
};

exports.cancelWatchRoutes = () => {
  if (watcherInstance) {
    watcherInstance.close();
  }
};
