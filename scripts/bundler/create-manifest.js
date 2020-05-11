// generates src/node_modules/@tw

const fs = require('fs');
const path = require('path');
const { writeIfChanged } = require('./utils');

// manifest data should contain array of the following format:
// [{ route: string, importPath: string }]
// sorting:
//   index, static, dynamic
function createManifestData(routesDir) {
  // walk "routes" folder, gather page components / directories data
  // sort them in correct order
  const walk = (dir, baseRoute = '/') =>
    fs
      .readdirSync(dir)
      .map(baseName => {
        const absolutePath = path.join(dir, baseName);
        const importPath = path.relative(routesDir, absolutePath);
        const isDir = fs.statSync(absolutePath).isDirectory();
        const name = path.parse(baseName).name;

        const isPage = !isDir;
        const isIndex = !isDir && name === 'index';
        const isDynamic = name.startsWith('[') && name.endsWith(']');
        const isStatic = !isDynamic;

        // skip components starting with underscore and dot
        if (baseName.startsWith('_') || baseName.startsWith('.')) {
          return;
        }

        let route;
        if (isIndex) {
          route = baseRoute;
        } else if (isStatic) {
          route = path.normalize(`${baseRoute}/${name}`);
        } else if (isDynamic) {
          route = path.normalize(`${baseRoute}/:${name.slice(1, -1)}`);
        }

        return {
          route,
          importPath: `${path.parse(routesDir).name}/${importPath}`,
          isPage,
          isIndex,
          isStatic,
          isDynamic,
          children: isDir && walk(absolutePath, route),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (
          (a.isIndex && b.isIndex) ||
          (a.isStatic && b.isStatic) ||
          (a.isDynamic && b.isDynamic)
        )
          return 0;
        if (a.isIndex || (a.isStatic && b.isDynamic)) return -1;
        return 1;
      });

  const flatten = rawMainfestData =>
    rawMainfestData
      .map(({ route, importPath, isPage, children }) => {
        if (isPage) {
          return {
            route,
            importPath,
          };
        } else {
          return flatten(children);
        }
      })
      .flat(Infinity);

  return flatten(walk(routesDir));
}

exports.createManifest = (manifestDestDir, routesDir) => {
  const manifestData = createManifestData(routesDir);

  const content = `// PLEASE DO NOT EDIT, file is generated\nexport const manifest = [\n  ${manifestData
    .map(
      ({ route, importPath }) =>
        `['${route}', () => import(/* webpackPrefetch: true */ '${importPath}')]`
    )
    .join(',\n  ')}\n];`;

  writeIfChanged(path.join(manifestDestDir, 'manifest.js'), content);
};
