const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function html(stats) {
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

  <div id="mount-point"></div>

  <script async src="${stats.publicPath}${stats.assets['vendor.js']}"></script>
  <script async src="${stats.publicPath}${stats.assets['main.js']}"></script>
</body>

</html>
`;
}

console.log('Rendering index.html...');

readFile(path.join(__dirname, '../build/assets/stats.json'), 'utf-8')
  .then(_stats => {
    const stats = JSON.parse(_stats);
    return html(stats);
  })
  .then(txt => {
    return writeFile(path.join(__dirname, '../build/pages/index.html'), txt, 'utf-8');
  })
  .then(() => {
    console.log('Done!');
  })
  .catch(err => {
    console.log(err);
  });
