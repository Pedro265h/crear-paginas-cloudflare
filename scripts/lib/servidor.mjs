// Servidor local de la vista previa: sirve una carpeta armada (.vista/ o la galería de plantillas) en
// http://127.0.0.1:<puerto>. Lo arranca vista.mjs en segundo plano y se apaga solo después de 3 horas sin visitas.
//   node scripts/lib/servidor.mjs <carpeta> <puerto>
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const raiz = resolve(process.argv[2] || '.');
const puerto = Number(process.argv[3] || 4321);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.mov': 'video/quicktime', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
};
const LIMPIAS = { '/': '/index.html', '/gracias': '/gracias.html', '/privacidad': '/privacidad.html', '/terminos': '/terminos.html' };
const ESPERA_MS = 3 * 60 * 60 * 1000;
let reloj = setTimeout(() => process.exit(0), ESPERA_MS);

createServer((req, res) => {
  clearTimeout(reloj);
  reloj = setTimeout(() => process.exit(0), ESPERA_MS);
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    ruta = '/';
  }
  if (ruta === '/__raiz') return enviar(res, 200, 'text/plain; charset=utf-8', raiz);
  if (ruta === '/__version') {
    const v = join(raiz, '__version');
    return enviar(res, 200, 'text/plain; charset=utf-8', existsSync(v) ? readFileSync(v) : '0');
  }
  if (Object.hasOwn(LIMPIAS, ruta)) ruta = LIMPIAS[ruta];
  else if (!extname(ruta) && existsSync(join(raiz, ruta + '.html'))) ruta += '.html';
  const archivo = resolve(raiz, '.' + ruta);
  // Nada fuera de la carpeta servida.
  if (archivo !== raiz && !archivo.startsWith(raiz + sep)) return enviar(res, 403, 'text/plain; charset=utf-8', 'No');
  if (!existsSync(archivo) || !statSync(archivo).isFile()) {
    return enviar(res, 404, 'text/html; charset=utf-8', '<!doctype html><meta charset="utf-8"><title>No encontrada</title><p style="font:16px system-ui;padding:24px">No encontramos esta página. <a href="/">Volver</a></p>');
  }
  if (req.method === 'POST') return enviar(res, 204, 'text/plain', '');
  enviar(res, 200, TIPOS[extname(archivo).toLowerCase()] || 'application/octet-stream', readFileSync(archivo));
}).listen(puerto, '127.0.0.1');

function enviar(res, estado, tipo, cuerpo) {
  res.writeHead(estado, { 'content-type': tipo, 'cache-control': 'no-store', 'x-crear-paginas': '1' });
  res.end(cuerpo);
}
