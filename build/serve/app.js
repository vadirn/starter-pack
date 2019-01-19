const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { promisify } = require('util');
const parseRange = require('range-parser');
const contentDisposition = require('content-disposition');

const stat = promisify(fs.stat);

const ROOT_DIR = path.resolve(path.join('.', 'dist'));
const ASSETS_DIR = path.resolve(path.join(ROOT_DIR, 'assets'));
const PAGES_DIR = path.join(ROOT_DIR, 'pages');

function getFilePath(relativePath) {
  const type = mime.lookup(relativePath);
  if (relativePath === '/') {
    return path.join(PAGES_DIR, relativePath + 'home.html');
  }
  if (!type) {
    // look for relative .html file
    return path.join(PAGES_DIR, relativePath + '.html');
  }
  if (type === 'text/html') {
    // handle implicitly requested .html files
    return path.join(PAGES_DIR, relativePath);
  }
  if (relativePath.startsWith('/assets/')) {
    return path.join(ROOT_DIR, relativePath);
  }
  return path.join(ASSETS_DIR, relativePath);
}

module.exports = async function app(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // method not allowed
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.setHeader('Content-Length', 0);
    res.end();
  }

  const parsedUrl = url.parse(req.url);

  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = getFilePath(sanitizedPath);
  const indexPath = getFilePath('/index.html');

  let fileStats;
  let indexStats;
  try {
    indexStats = await stat(indexPath);
    fileStats = await stat(filePath);
  } catch (err) {
    if (filePath.endsWith('.html') && indexStats) {
      fileStats = indexStats;
      filePath = indexPath;
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', 0);
      res.end();
      return;
    }
  }

  if (!fileStats) {
    res.statusCode = 404;
    res.setHeader('Content-Length', 0);
    res.end();
    return;
  }

  // https://github.com/zeit/serve-handler/blob/master/src/index.js
  const streamOpts = {};
  if (req.headers.range && fileStats.size) {
    const range = parseRange(fileStats.size, req.headers.range);

    if (typeof range === 'object' && range.type === 'bytes') {
      const { start, end } = range[0];
      streamOpts.start = start;
      streamOpts.end = end;

      res.statusCode = 206;
    } else {
      res.statusCode = 416;
      res.setHeader('Content-Range', `bytes */${fileStats.size}`);
    }
  }

  const stream = fs.createReadStream(filePath, streamOpts);
  const headers = {};

  if (fileStats) {
    headers['Last-Modified'] = fileStats.mtime.toUTCString();
    headers['Content-Length'] = fileStats.size;
    // Default to "inline", which always tries to render in the browser,
    // if that's not working, it will save the file. But to be clear: This
    // only happens if it cannot find a appropiate value.
    headers['Content-Disposition'] = contentDisposition(filePath, {
      type: 'inline',
    });
    headers['Accept-Ranges'] = 'bytes';
    headers['Content-Type'] = mime.contentType(path.extname(filePath));
  }

  if (streamOpts.start !== undefined && streamOpts.end !== undefined) {
    headers['Content-Range'] = `bytes ${streamOpts.start}-${streamOpts.end}/${fileStats.size}`;
    headers['Content-Length'] = streamOpts.end - streamOpts.start + 1;
  }

  if (req.headers.range === null && headers.ETag && headers.ETag === req.headers['if-none-match']) {
    res.statusCode = 304;
    res.end();
    return;
  }

  res.writeHead(res.statusCode || 200, headers);
  stream.pipe(res);
};
