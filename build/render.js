const fs = require('fs-extra');
const jsdom = require('jsdom');
const path = require('path');
const { JSDOM } = jsdom;

const BASE_URL = 'http://localhost:5001';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pagesDir = path.resolve(distDir, 'pages');

// fetch a page
// wait for it to render
// write result as a file
async function prerenderPage(url, filename) {
  const dom = await JSDOM.fromURL(`${BASE_URL}/${url}`, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
  });
  dom.window.document.addEventListener('app:ready', async () => {
    const text = dom.serialize();
    const writeTo = path.resolve(pagesDir, path.normalize(filename));
    await fs.writeFile(writeTo, text, 'utf-8');
  });
}

prerenderPage('', 'home.html');
