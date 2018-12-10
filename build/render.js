const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const fs = require('fs-extra');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pagesDir = path.resolve(distDir, 'pages');

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

async function writePage(options = {}) {
  const { stats = {}, content = '', filename = 'index.html' } = options;
  const text = html(content, stats);
  await fs.writeFile(path.join(distDir, 'pages', filename), text, 'utf-8');
  console.log(`${path.join(distDir, 'pages', filename)} ready`);
}

async function render(options = {}) {
  const { controllers = {}, App } = options;
  try {
    await fs.emptyDir(pagesDir);
    await fs.ensureFile(path.resolve(pagesDir, '.keep'));
    const rawStats = await fs.readFile(path.join(distDir, 'assets', 'stats.json'), 'utf-8');
    const stats = JSON.parse(rawStats);
    for (const controllerName of Object.keys(controllers)) {
      // const module = await controllers[controllerName]();
      // const Controller = module.default;
      // const controller = new Controller();
      // const text = html(
      //   renderToStaticMarkup(
      //     React.createElement(App, { initialController: controller }, React.createElement(controller.View))
      //   ),
      //   stats
      // );
      const content = '';
      await writePage({ stats, content, filename: `${controllerName.toLowerCase()}.html` });
    }
    await writePage({ stats, content: '' });
  } catch (err) {
    throw err;
  }
}

module.exports = render;
