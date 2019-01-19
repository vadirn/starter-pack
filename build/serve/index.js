const http = require('http');
const app = require('./app');
const compression = require('compression');
const { promisify } = require('util');
const compressionHandler = promisify(compression());

const PORT = process.env.PORT || 5001;

const server = http.createServer(async (req, res) => {
  await compressionHandler(req, res);
  return app(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});

process.on('exit', () => {
  console.log('Shutting down server');
  server.close();
});

process.on('SIGINT', () => {
  console.log('SIGINT detected');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM detcted');
  process.exit(0);
});
