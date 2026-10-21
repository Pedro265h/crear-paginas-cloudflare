#!/usr/bin/env node
// Revisa la compu: Node, la herramienta de Cloudflare (Wrangler) y la conexión con tu cuenta. Dice qué falta.
//
//   node scripts/preparar.mjs            revisa todo (la primera vez descarga Wrangler: 1 o 2 minutos)
//   node scripts/preparar.mjs --rapido   sin preguntarle a Cloudflare por la sesión
//   node scripts/preparar.mjs --json     el resultado en JSON (para Claude)
import { spawnSync } from 'node:child_process';
import { platform, release } from 'node:os';
import { argumentos, comando } from './lib/comun.mjs';
import { wrangler, quienSoy, leerCredenciales, RUTA_CREDENCIALES, WRANGLER } from './lib/cloudflare.mjs';

const args = argumentos();
const r = { sistema: '', node: '', npm: '', wrangler: '', sesion: null, faltan: [] };

r.sistema = { darwin: 'Mac', win32: 'Windows', linux: 'Linux' }[platform()] || platform();
r.version_sistema = release();
r.node = process.versions.node;
const mayor = Number(r.node.split('.')[0]);
if (mayor < 20) r.faltan.push({ que: 'node', texto: `Tienes Node ${r.node} y hace falta 20 o más nuevo. Instala la versión LTS (walkthroughs/01-instalar.md).` });

const npm = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version'], { encoding: 'utf8', shell: process.platform === 'win32' });
r.npm = (npm.stdout || '').trim();
if (!r.npm) r.faltan.push({ que: 'npm', texto: 'No encuentro npm (viene con Node). Reinstala Node LTS (walkthroughs/01-instalar.md).' });

if (r.npm) {
  const w = wrangler(['--version'], { tiempo: 5 * 60 * 1000 });
  r.wrangler = (w.salida.match(/\d+\.\d+\.\d+/) || [''])[0];
  if (!r.wrangler) r.faltan.push({ que: 'wrangler', texto: `No pude descargar la herramienta de Cloudflare (${WRANGLER}). Revisa tu internet y vuelve a intentar (walkthroughs/04-cli-wrangler.md).`, detalle: w.todo.slice(-600) });
}

const cred = leerCredenciales();
r.token_guardado = !!cred?.token;
if (cred?.token) r.token_archivo = RUTA_CREDENCIALES;

if (r.wrangler && !args.rapido) {
  const s = quienSoy();
  r.sesion = s.conectado ? { conectado: true, forma: s.forma, correo: s.correo, cuentas: s.cuentas } : { conectado: false };
  if (!s.conectado) r.faltan.push({ que: 'sesion', texto: 'Tu compu todavía no está conectada a tu cuenta de Cloudflare (walkthroughs/02-cuenta-cloudflare.md y 03-token-api.md).' });
  else if (s.cuentas.length > 1 && !cred?.cuenta?.id && !process.env.CLOUDFLARE_ACCOUNT_ID) {
    r.faltan.push({ que: 'cuenta', texto: 'Tu usuario tiene varias cuentas de Cloudflare: hay que elegir en cuál publicar:\n' + s.cuentas.map((c) => `      ${c.nombre} → ${comando('token.mjs', '', '--cuenta ' + c.id)}`).join('\n') });
  }
}

if (args.json) {
  console.log(JSON.stringify(r, null, 2));
} else {
  console.log('\nTu compu:');
  console.log(`  ${r.node && mayor >= 20 ? '✓' : '✗'} Sistema: ${r.sistema} · Node ${r.node}${r.npm ? ' · npm ' + r.npm : ''}`);
  console.log(`  ${r.wrangler ? '✓' : '✗'} Herramienta de Cloudflare (Wrangler): ${r.wrangler || 'no disponible'}`);
  if (r.sesion) {
    if (r.sesion.conectado) {
      const cuentas = r.sesion.cuentas.map((c) => c.nombre).join(', ');
      console.log(`  ✓ Conectada a Cloudflare ${r.sesion.forma === 'token' ? 'con tu token' : 'con tu sesión'}${r.sesion.correo ? ' (' + r.sesion.correo + ')' : ''}${cuentas ? ' · cuenta: ' + cuentas : ''}`);
    } else console.log('  ✗ Conexión con Cloudflare: todavía no');
  }
  if (r.faltan.length) {
    console.log('\nLo que falta:');
    for (const f of r.faltan) console.log('  · ' + f.texto);
  } else console.log('\nTodo listo.');
}
process.exit(r.faltan.length ? 2 : 0);
