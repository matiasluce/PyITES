/**
 * PyITES · tools/serve
 * Servidor estático mínimo para desarrollo.
 *
 * Los módulos ES no se pueden cargar abriendo el archivo con doble clic
 * (el navegador bloquea por CORS), así que hace falta servir por HTTP:
 *
 *   npm run dev
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || 'localhost';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

/** Convierte una URL en una ruta dentro de ROOT, bloqueando el path traversal. */
const safeResolve = urlPath => {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null; // URL mal formada, por ejemplo "/%"
  }

  const target = resolve(join(ROOT, normalize(decoded)));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;
  return target;
};

const send = (response, status, body, type = 'text/plain; charset=utf-8') => {
  response.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  response.end(body);
};

const server = createServer(async (request, response) => {
  let path = safeResolve(request.url || '/');
  if (!path) return send(response, 403, '403 · Acceso denegado');

  try {
    const info = await stat(path).catch(() => null);

    if (info?.isDirectory()) {
      const indexPath = join(path, 'index.html');
      const indexInfo = await stat(indexPath).catch(() => null);
      if (!indexInfo) throw new Error('no index.html');
      path = indexPath;
    } else if (!info) {
      return send(response, 404, `404 · No encontrado: ${request.url}`);
    }

    const body = await readFile(path);
    send(response, 200, body, MIME_TYPES[extname(path).toLowerCase()] || 'application/octet-stream');
  } catch (error) {
    send(response, 500, `500 · ${error.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  PyITES · servidor de desarrollo');
  console.log(`  →  http://${HOST}:${PORT}`);
  console.log('');
  console.log('  Ctrl+C para detenerlo.');
  console.log('');
});
