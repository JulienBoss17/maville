const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function resolvePath(urlPath) {
  const cleanPath = urlPath.split('?')[0];
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const fullPath = path.join(PUBLIC_DIR, requested);

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return fullPath;
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url || '/');

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Access denied');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Page not found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    const isHtml = ext === '.html';
    const cacheControl = isHtml ? 'no-cache' : 'public, max-age=86400';

    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': cacheControl
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`);
});
