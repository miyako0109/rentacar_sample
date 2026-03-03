/**
 * Basic認証付きローカルサーバー
 * 使い方: node server.js
 * ブラウザで http://localhost:3000/ を開く
 *
 * ユーザー名・パスワードは下の BASIC_USER / BASIC_PASS を変更してください。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// ★ ここを変更してください
const BASIC_USER = 'admin';
const BASIC_PASS = 'password';

const PORT = 3000;
const ROOT = path.join(__dirname);

function parseAuthHeader(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  try {
    const base64 = header.slice(6);
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const [user, ...passParts] = decoded.split(':');
    return { user, pass: passParts.join(':') };
  } catch (e) {
    return null;
  }
}

function send401(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="認証が必要です"',
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end('<h1>401 Unauthorized</h1><p>認証に失敗しました。</p>');
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const auth = parseAuthHeader(req.headers.authorization);
  if (!auth || auth.user !== BASIC_USER || auth.pass !== BASIC_PASS) {
    return send401(res);
  }

  const urlPath = (req.url || '/').split('?')[0];
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  filePath = path.normalize(filePath);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Basic認証付きサーバー: http://localhost:${PORT}/`);
  console.log(`ユーザー: ${BASIC_USER} / パスワード: ${BASIC_PASS}`);
});
