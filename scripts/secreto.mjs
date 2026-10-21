#!/usr/bin/env node
// Guarda un valor secreto en tu página publicada en Cloudflare (nunca en el código ni en plan.json).
//
//   node scripts/secreto.mjs WEBHOOK_URL --valor https://...       a dónde reenviar cada registro (GoHighLevel, Zapier, Make)
//   node scripts/secreto.mjs WEBHOOK_URL --portapapeles            lo mismo, tomando el link que copiaste
//   node scripts/secreto.mjs META_CAPI_TOKEN --portapapeles         token de la API de conversiones de Meta (cópialo y corre esto)
//   node scripts/secreto.mjs META_CAPI_TOKEN                        te lo pide oculto (córrelo tú en tu terminal)
//   node scripts/secreto.mjs WEBHOOK_URL --borrar                   lo quita
//   node scripts/secreto.mjs --lista                                cuáles hay (sin mostrar su valor)
//
// Al guardar el webhook manda un registro de ejemplo a ese link (así GoHighLevel, Zapier o Make ven los campos).
// La página tiene que estar publicada antes (node scripts/publicar.mjs).
import { spawnSync } from 'node:child_process';
import { argumentos, carpetaProyecto, leerProyecto, guardarEstado, fallar, ok, aviso, linea } from './lib/comun.mjs';
import { wrangler, explicarError } from './lib/cloudflare.mjs';

const args = argumentos();
const NOMBRES = { WEBHOOK_URL: 'el webhook', META_CAPI_TOKEN: 'el token de la API de conversiones de Meta' };
const nombre = String(args._[0] || '').toUpperCase();
const dir = carpetaProyecto({ ...args, _: [] });
const { estado } = leerProyecto(dir);
if (!estado.url && !estado.publicado) fallar('Primero publica la página (node scripts/publicar.mjs): el secreto se guarda en la página publicada.');

function fallaCF(que, r) {
  const e = explicarError(r.todo);
  fallar(`${que} ${e.que}`, `${e.hacer}\n${r.todo.trim().split('\n').slice(-6).join('\n')}`);
}

if (args.lista) {
  const r = wrangler(['secret', 'list'], { cwd: dir });
  if (!r.ok) fallaCF('No pude ver los secretos.', r);
  const hay = Object.keys(NOMBRES).filter((n) => r.salida.includes(`"${n}"`));
  linea(hay.length ? 'Guardados: ' + hay.map((n) => `${n} (${NOMBRES[n]})`).join(' · ') : 'No hay secretos guardados.');
  process.exit(0);
}

if (!Object.hasOwn(NOMBRES, nombre)) fallar('¿Qué secreto guardo?', 'Opciones: WEBHOOK_URL (tu webhook) o META_CAPI_TOKEN (API de conversiones de Meta).');

if (args.borrar) {
  const r = wrangler(['secret', 'delete', nombre], { cwd: dir });
  if (!r.ok && !/not found|does not exist/i.test(r.todo)) fallaCF(`No pude quitar ${NOMBRES[nombre]}.`, r);
  guardarEstado(dir, nombre === 'WEBHOOK_URL' ? { webhook: false } : { capi: false });
  ok(`Listo: quité ${NOMBRES[nombre]}.`);
  process.exit(0);
}

function portapapeles() {
  const usar = (cmd, a = []) => spawnSync(cmd, a, { encoding: 'utf8' });
  let r;
  if (process.platform === 'darwin') r = usar('pbpaste');
  else if (process.platform === 'win32') r = usar('powershell', ['-NoProfile', '-Command', 'Get-Clipboard']);
  else {
    r = usar('wl-paste', ['--no-newline']);
    if (r.status !== 0) r = usar('xclip', ['-o', '-selection', 'clipboard']);
  }
  if (!r || r.status !== 0) fallar('No pude leer lo que copiaste.');
  return String(r.stdout || '').trim();
}

function pedirOculto(pregunta) {
  return new Promise((resolver) => {
    const stdin = process.stdin;
    process.stdout.write(pregunta);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let v = '';
    const leer = (t) => {
      for (const c of t.replace(/\x1b\[20[01]~/g, '')) {
        if (c === '\r' || c === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', leer);
          process.stdout.write('\n');
          return resolver(v.trim());
        }
        if (c === '\u0003') process.exit(130);
        if (c === '\u007f' || c === '\b') v = v.slice(0, -1);
        else if (c >= ' ') v += c;
      }
    };
    stdin.on('data', leer);
  });
}

let valor = '';
if (typeof args.valor === 'string') valor = args.valor.trim();
else if (args.portapapeles) valor = portapapeles();
else if (process.stdin.isTTY) valor = await pedirOculto(`Pega ${NOMBRES[nombre]} (no se va a ver) y presiona Enter: `);
else fallar(`Dame ${NOMBRES[nombre]}.`, nombre === 'WEBHOOK_URL' ? 'Con --valor <link> o copiándolo y usando --portapapeles.' : 'Cópialo y usa --portapapeles, o corre este script tú en tu terminal.');

if (nombre === 'WEBHOOK_URL' && !/^https:\/\/\S+$/.test(valor)) fallar('Ese link no sirve: tiene que empezar con https:// y no llevar espacios.');
if (nombre === 'META_CAPI_TOKEN' && (!/^[A-Za-z0-9_-]{60,}$/.test(valor))) fallar('Eso no parece un token de Meta (es una sola palabra larga que empieza con EAA…).');

const r = wrangler(['secret', 'put', nombre], { cwd: dir, entrada: valor + '\n' });
if (args.portapapeles) {
  if (process.platform === 'darwin') spawnSync('pbcopy', [], { input: '' });
  else if (process.platform === 'win32') spawnSync('powershell', ['-NoProfile', '-Command', 'Set-Clipboard -Value " "']);
}
if (!r.ok) fallaCF(`No pude guardar ${NOMBRES[nombre]}.`, r);
ok(`Guardé ${NOMBRES[nombre]} en tu página (en Cloudflare, como secreto).`);

if (nombre === 'WEBHOOK_URL') {
  guardarEstado(dir, { webhook: true });
  // Un registro de ejemplo, con los mismos campos que mandará la página.
  try {
    const p = await fetch(valor, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ utm_source: 'prueba', nombre: 'Registro de ejemplo (puedes borrarlo)', correo: 'ejemplo@ejemplo.com', whatsapp: '+573000000000', pagina: estado.titulo || estado.nombre, url: estado.url || '', fecha: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    });
    if (p.ok) ok('Mandé un registro de ejemplo a tu webhook: búscalo en GoHighLevel, Zapier o Make para elegir los campos.');
    else aviso(`Tu webhook respondió ${p.status} al registro de ejemplo. Revisa que el link esté completo y activo.`);
  } catch (e) {
    aviso('No pude mandar el registro de ejemplo a tu webhook (' + (e.cause?.code || e.message) + ').');
  }
  linea('Desde ahora, cada registro nuevo llega también ahí (nombre, correo, whatsapp, pagina, url, fecha y las utm).');
} else {
  guardarEstado(dir, { capi: true });
  linea('Desde ahora, cada registro también le avisa a Meta por la API de conversiones (sin duplicar el del píxel).');
  if (!estado.pixel) aviso('Para que funcione, la página necesita tu píxel: pon su id en plan.json (pixel.meta) y vuelve a publicar.');
}
