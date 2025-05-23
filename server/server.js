const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const distDir = path.join(__dirname, '..', 'web', 'web-build');

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const landingHtml = fs.readFileSync(
  path.join(__dirname, 'landing.html'),
  'utf8'
);

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(landingHtml);
    return;
  }

  if (req.url.startsWith('/app')) {
    const filePath = path.join(distDir, req.url.replace('/app', '') || '/index.html');
    const ext = path.extname(filePath);
    const contentType =
      ext === '.js'
        ? 'application/javascript'
        : ext === '.css'
        ? 'text/css'
        : 'text/html';
    serveFile(filePath, contentType, res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`Landing page server running on http://localhost:${port}`);
});
