const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Note extra div around ${content}, that's because dangerouslySetInnerHTML is going to be used
// to prevent flash of no content
function html(
  content = '',
  stats = {
    publicPath: '/assets/',
    assets: { 'bundle.css': 'bundle.css', 'vendor.js': 'vendor.js', 'main.js': 'main.js' },
  }
) {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Page Title</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${stats.publicPath}${stats.assets['bundle.css']}">
</head>

<body>

  <div id="mount-point"><div>${content}</div></div>

  <script async src="${stats.publicPath}${stats.assets['vendor.js']}"></script>
  <script async src="${stats.publicPath}${stats.assets['main.js']}"></script>
</body>

</html>
`;
}

module.exports = function render({ App, controllers, router, focusObserver, services }) {
  for (const pageName of Object.keys(controllers)) {
    const importController = controllers[pageName];
    importController()
      .then(({ default: Controller }) => {
        readFile(path.join(distDir, 'assets', 'stats.json'), 'utf-8')
          .then(_stats => {
            const stats = JSON.parse(_stats);
            const controller = new Controller();
            return html(
              renderToStaticMarkup(
                React.createElement(App, { controller, controllers, services, plugins: { router, focusObserver } })
              ),
              stats
            );
          })
          .then(txt => {
            return writeFile(path.join(distDir, 'pages', `${pageName.toLowerCase()}.html`), txt, 'utf-8');
          })
          .then(() => {
            console.log(`${path.join(distDir, 'pages', `${pageName.toLowerCase()}.html`)} ready`);
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  }
};
