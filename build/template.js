module.exports = stats => `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Primary Meta Tags -->
  <title>Title</title>
  <meta name="title">
  <meta name="description">

  <!-- Open Graph / Facebook -->
  <meta property="og:type">
  <meta property="og:url">
  <meta property="og:title">
  <meta property="og:description">
  <meta property="og:image">

  <!-- Twitter -->
  <meta property="twitter:card">
  <meta property="twitter:url">
  <meta property="twitter:title">
  <meta property="twitter:description">
  <meta property="twitter:image">
  
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/assets/favicon.svg" sizes="any" type="image/svg+xml">
  <link rel="stylesheet" href="${stats.publicPath}${stats.assets['bundle.css']}">
</head>

<body>

  <div id="mount-point"></div>

  <script async src="${stats.publicPath}${stats.assets['vendor.js']}"></script>
  <script async src="${stats.publicPath}${stats.assets['main.js']}"></script>
</body>

</html>`;
