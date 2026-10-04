/**
 * Local preview: builds the site, serves dist/ and rebuilds when src/ or
 * public/ change. Reload the browser after a rebuild.
 *
 *   npm run dev            build, serve and watch
 *   npm run preview        build and serve once
 */
import { createReadStream, watch } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT) || 4321;
const shouldWatch = !process.argv.includes('--no-watch');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

await build();

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let file = path.join(dist, decodeURIComponent(url.pathname));
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));

if (shouldWatch) {
  let timer;
  let running = false;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (running) return rebuild();
      running = true;
      try {
        await build();
      } catch (err) {
        console.error(err.message ?? err);
      }
      running = false;
    }, 80);
  };
  for (const dir of ['src', 'public']) watch(path.join(root, dir), { recursive: true }, rebuild);
  console.log('Watching src/ and public/ for changes.');
}
