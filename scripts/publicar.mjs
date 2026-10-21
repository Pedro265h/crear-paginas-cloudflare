#!/usr/bin/env node
// Publica la página en TU cuenta de Cloudflare y comprueba que funciona de verdad.
//
//   node scripts/publicar.mjs [carpeta]                      publica (o vuelve a publicar) en tu dirección gratis workers.dev
//   node scripts/publicar.mjs --dominio midominio.com        además la conecta a tu dominio (y a www.midominio.com)
//   node scripts/publicar.mjs --dominio clase.midominio.com  un subdominio (solo ese)
//   --sin-www         con un dominio raíz, no conecta www
//   --prueba          revisa todo y dice qué haría, SIN conectarse a internet (no publica nada)
//   --verificar       no publica: solo vuelve a comprobar la página publicada (y el dominio)
//
// Pasos: revisa que no falte nada → arma sitio/ → crea la base de registros (D1) si no existe y le pone sus tablas →
// sube el sitio (wrangler deploy) → conecta el dominio → comprueba la página, gracias, las legales y un registro de
// prueba (que después borra).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { argumentos, carpetaProyecto, leerProyecto, guardarEstado, escribirWrangler, zonaDe, fallar, ok, aviso, paso, linea, BASE_ID_LOCAL, nombreCloudflare } from './lib/comun.mjs';
import { armarSitio } from './lib/armado.mjs';
import { pendientesDe } from './lib/pendientes.mjs';
import { wrangler, quienSoy, explicarError, leerCredenciales } from './lib/cloudflare.mjs';

const args = argumentos();
const dir = carpetaProyecto(args);
const { plan: crudo, marca, estado: estadoInicial } = leerProyecto(dir);
let estado = { ...estadoInicial };
if (!estado.nombre) estado.nombre = nombreCloudflare(marca.nombre || crudo?.marca?.nombre || 'mi-pagina');
if (!estado.base?.nombre) estado.base = { ...(estado.base || {}), nombre: estado.nombre + '-registros' };

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const SUFIJOS_DOBLES = /\.(com|net|org|edu|gob|gov|co|mx|ar|pe|cl|ec|ve|uy|py|bo|br|es)\.(co|mx|ar|pe|cl|ec|ve|uy|py|bo|br|es|uk)$/;

function limpiarHost(entrada) {
  const h = String(entrada || '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '').replace(/\.$/, '');
  if (!/^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(h)) fallar(`«${entrada}» no parece un dominio.`, 'Escríbelo así: midominio.com, www.midominio.com o clase.midominio.com');
  if (/(^|\.)(workers\.dev|pages\.dev|cloudflare\.com|localhost)$/.test(h)) fallar('Ese dominio no se puede usar: tiene que ser uno tuyo.');
  return h;
}
const esRaiz = (h) => h.split('.').length === (SUFIJOS_DOBLES.test(h) ? 3 : 2);

function fallaCloudflare(que, r) {
  const e = explicarError(r.todo);
  fallar(`${que} ${e.que}`, `Qué hacer: ${e.hacer}\n\nLo que dijo Cloudflare:\n${r.todo.trim().split('\n').filter((l) => l.trim()).slice(-10).join('\n')}`);
}

// ---------- 1. ¿Está completa? ----------
paso('Reviso que no le falte nada a la página');
const { faltan, avisos } = pendientesDe(crudo, marca, { dirFotos: join(dir, 'fotos') });
if (faltan.length && !args.verificar) {
  guardarEstado(dir, { pendientes: faltan.length, fase: 'Fase 3/4 · completar la página', siguiente: 'Completar lo que falta (node scripts/revisar.mjs) y publicar.' });
  console.log(`\n  ✗ No publico todavía: ${faltan.length === 1 ? 'le falta 1 cosa' : `le faltan ${faltan.length} cosas`} a la página.\n`);
  faltan.forEach((f, i) => console.log(`   ${String(i + 1).padStart(2)}. ${f.que}\n       (${f.donde})`));
  console.log('\n  Una página con huecos no se publica: complétalos (o quita lo que no quieras mostrar) y vuelve a publicar.');
  process.exit(3);
}
ok('La página está completa.');
for (const a of avisos) aviso(a);

// Dominios pedidos.
let dominios = Array.isArray(estado.dominios) ? [...estado.dominios] : [];
if (args.dominio) {
  const h = limpiarHost(args.dominio);
  dominios = [h];
  if (esRaiz(h) && !args['sin-www']) dominios.push('www.' + h);
  else if (h.startsWith('www.') && esRaiz(h.slice(4)) && !args['sin-www']) dominios.unshift(h.slice(4));
}
estado.dominios = dominios;
estado.zona = zonaDe(crudo, marca);

// ---------- modo prueba: nada de red ----------
if (args.prueba) {
  paso('Modo prueba: no me conecto a Cloudflare ni publico nada');
  const r = armarSitio({ crudo, marca, salida: join(dir, 'sitio'), modo: 'publicado', dirFotos: join(dir, 'fotos'), paginaId: estado.nombre, urlBase: dominios[0] ? `https://${dominios[0]}` : estado.url || '' });
  ok(`Armé sitio/ (${r.archivos.length} archivos).`);
  for (const a of r.avisos) aviso(a);
  linea('Esto es lo que haría al publicar de verdad:');
  linea(`  1. Conectarme a Cloudflare (${leerCredenciales()?.token ? 'con tu token guardado' : 'con tu sesión de `npx wrangler login`'}).`);
  linea(`  2. ${estado.base?.id && estado.base.id !== BASE_ID_LOCAL ? 'Usar tu base de registros ' + estado.base.nombre : 'Crear tu base de registros «' + estado.base.nombre + '» (D1)'} y ponerle sus tablas (schema.sql).`);
  linea(`  3. Subir la página «${estado.nombre}» (npx wrangler deploy).`);
  if (dominios.length) linea(`  4. Conectarla a ${dominios.join(' y ')}.`);
  linea(`  ${dominios.length ? 5 : 4}. Comprobar la página, gracias, privacidad, términos y un registro de prueba (que después borro).`);
  process.exit(0);
}

// ---------- 2. Conexión con Cloudflare ----------
paso('Reviso la conexión con tu cuenta de Cloudflare');
const yo = quienSoy(dir);
if (!yo.conectado) fallar('Tu compu no está conectada a Cloudflare.', 'Conéctala con `npx wrangler login` (un clic en el navegador) o guarda tu token con scripts/token.mjs. Guía: walkthroughs/02-cuenta-cloudflare.md y 03-token-api.md.');
if (yo.cuentas.length > 1 && !leerCredenciales()?.cuenta?.id && !process.env.CLOUDFLARE_ACCOUNT_ID) {
  fallar('Tu usuario tiene varias cuentas de Cloudflare y no sé en cuál publicar.', 'Elige una (sirve con token o con la sesión de `wrangler login`):\n' + yo.cuentas.map((c) => `${c.nombre}: node scripts/token.mjs --cuenta ${c.id}`).join('\n'));
}
ok(`Conectada${yo.correo ? ' como ' + yo.correo : ''}${yo.cuentas[0] ? ' · cuenta ' + yo.cuentas[0].nombre : ''}.`);

// ---------- 3. Base de registros (D1) ----------
if (!args.verificar) {
  paso('Preparo tu base de registros (Cloudflare D1)');
  const nombreBase = estado.base.nombre;
  const buscar = () => {
    const l = wrangler(['d1', 'list', '--json'], { cwd: dir });
    if (!l.ok) fallaCloudflare('No pude ver tus bases de datos.', l);
    try {
      const lista = JSON.parse(l.salida.slice(l.salida.indexOf('[')));
      return lista.find((b) => b.name === nombreBase) || null;
    } catch {
      return null;
    }
  };
  let base = estado.base?.id && estado.base.id !== BASE_ID_LOCAL ? { uuid: estado.base.id, name: nombreBase } : buscar();
  if (!base) {
    const c = wrangler(['d1', 'create', nombreBase], { cwd: dir });
    if (!c.ok && !/already exists/i.test(c.todo)) fallaCloudflare('No pude crear la base de registros.', c);
    base = buscar();
    if (!base) fallar('Creé la base de registros pero no la encuentro.', 'Vuelve a correr la publicación en un minuto.');
    ok(`Base de registros creada: ${nombreBase}`);
  } else ok(`Base de registros: ${nombreBase}`);
  estado.base = { nombre: nombreBase, id: base.uuid };
  escribirWrangler(dir, estado, crudo);
  guardarEstado(dir, { base: estado.base, nombre: estado.nombre, zona: estado.zona, dominios: estado.dominios });

  const s = wrangler(['d1', 'execute', nombreBase, '--remote', '--file', 'schema.sql'], { cwd: dir });
  if (!s.ok) fallaCloudflare('No pude preparar las tablas de la base.', s);
  ok('Tablas listas (registros y visitas).');
}

// ---------- 4. Armar y subir ----------
function armarYSubir(urlBase) {
  const r = armarSitio({ crudo, marca, salida: join(dir, 'sitio'), modo: 'publicado', dirFotos: join(dir, 'fotos'), paginaId: estado.nombre, urlBase });
  for (const a of r.avisos) aviso(a);
  escribirWrangler(dir, estado, crudo);
  const d = wrangler(['deploy'], { cwd: dir });
  if (!d.ok) fallaCloudflare('No pude subir la página.', d);
  return { r, salida: d.todo };
}

let url = estado.url || '';
if (!args.verificar) {
  paso(`Subo la página a Cloudflare${dominios.length ? ' y la conecto a ' + dominios.join(' y ') : ''}`);
  const urlBase = dominios[0] ? `https://${dominios[0]}` : url;
  let { r, salida } = armarYSubir(urlBase);
  const nueva = salida.match(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev/i)?.[0];
  if (nueva) url = nueva;
  // La imagen para compartir en redes necesita la dirección completa: si recién la supimos, se arma y sube otra vez.
  const conFoto = r.plan.secciones.some((s) => s.tipo === 'hero' && !s.oculta && s.campos?.imagen?.ref);
  if (!urlBase && url && conFoto) ({ r } = armarYSubir(url));
  ok(`Página subida${url ? ': ' + url : ''}.`);
  guardarEstado(dir, { url, publicado: new Date().toISOString(), pixel: r.plan.pixel?.meta || '', pendientes: 0 });
}
if (!url && !dominios.length) fallar('Subí la página pero Cloudflare no me dijo su dirección.', 'Mírala en https://dash.cloudflare.com → Workers y Pages, o corre: node scripts/publicar.mjs --verificar');

// ---------- 5. Comprobar en vivo ----------
paso('Compruebo que funciona de verdad');

async function pedir(u, opciones = {}) {
  try {
    const r = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(15000), ...opciones });
    return { estado: r.status, texto: await r.text().catch(() => '') };
  } catch (e) {
    return { estado: 0, texto: String(e.cause?.code || e.message) };
  }
}

// Intenta varias veces: una dirección nueva tarda unos segundos (workers.dev) o unos minutos (dominio y su certificado).
async function comprobar(origen, intentos) {
  const fallas = [];
  for (let i = 0; i < intentos; i++) {
    const r = await pedir(origen + '/');
    if (r.estado === 200 && /<title>/i.test(r.texto) && r.texto.includes('/_f/')) break;
    if (i === intentos - 1) return { ok: false, fallas: [`la página no responde (${r.estado || r.texto})`] };
    await esperar(Math.min(4000 + i * 2000, 15000));
  }
  for (const ruta of ['/gracias', '/privacidad', '/terminos']) {
    const r = await pedir(origen + ruta);
    if (r.estado !== 200) fallas.push(`${ruta} responde ${r.estado || r.texto}`);
  }
  const letra = (await pedir(origen + '/')).texto.match(/\/_f\/[a-z0-9-]+\.woff2/)?.[0];
  if (letra) {
    const r = await pedir(origen + letra);
    if (r.estado !== 200) fallas.push(`las letras no cargan (${r.estado})`);
  }
  return { ok: !fallas.length, fallas };
}

async function probarRegistro(origen) {
  const id = 'prueba-skill-' + Date.now().toString(36);
  const r = await pedir(origen + '/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pagina: estado.nombre, datos: { nombre: 'Prueba de la skill', correo: 'prueba@ejemplo.com', whatsapp: '+573000000000' }, utm: { utm_source: 'prueba' }, event_id: id, url: origen + '/' }),
  });
  let guardado = false;
  if (r.estado === 200) {
    const q = wrangler(['d1', 'execute', estado.base.nombre, '--remote', '--json', '--command', `SELECT COUNT(*) AS n FROM registros WHERE event_id = '${id}'`], { cwd: dir });
    guardado = q.ok && /"n":\s*1/.test(q.salida);
    wrangler(['d1', 'execute', estado.base.nombre, '--remote', '--command', `DELETE FROM registros WHERE event_id LIKE 'prueba-skill-%'`], { cwd: dir });
  }
  return { ok: r.estado === 200 && guardado, detalle: r.estado === 200 ? (guardado ? '' : 'el registro no quedó en la base') : `el formulario respondió ${r.estado || r.texto}: ${r.texto.slice(0, 160)}` };
}

const resultado = { url, dominios: {} };
if (url) {
  const c = await comprobar(url, 8);
  if (!c.ok) fallar(`La página se subió pero no responde bien en ${url}.`, c.fallas.join('\n') + '\nEspera un minuto y corre: node scripts/publicar.mjs --verificar');
  ok(`${url} responde: página, gracias, privacidad, términos y letras.`);
  const reg = await probarRegistro(url);
  if (!reg.ok) fallar('La página carga, pero el formulario no guardó el registro de prueba.', reg.detalle + '\nRevisa walkthroughs/99-problemas.md (base de registros).');
  ok('El formulario guarda en tu base (hice un registro de prueba y ya lo borré).');
}
for (const d of dominios) {
  const c = await comprobar('https://' + d, args.verificar ? 3 : 12);
  resultado.dominios[d] = c.ok ? 'activo' : 'pendiente';
  if (c.ok) ok(`https://${d} responde.`);
  else aviso(`https://${d} todavía no responde (${c.fallas[0]}). Cloudflare puede tardar unos minutos en crear el certificado. Vuelve a comprobar en 5 minutos con: node scripts/publicar.mjs --verificar`);
}
if (!url && dominios.length && Object.values(resultado.dominios).every((x) => x === 'activo')) {
  const reg = await probarRegistro('https://' + dominios[0]);
  if (reg.ok) ok('El formulario guarda en tu base (registro de prueba hecho y borrado).');
  else aviso('El formulario no guardó el registro de prueba: ' + reg.detalle);
}

const principal = dominios.find((d) => resultado.dominios[d] === 'activo');
guardarEstado(dir, {
  url,
  dominios,
  estado_dominios: resultado.dominios,
  fase: 'Fase 6 · página publicada',
  siguiente: principal || url
    ? `Tu página está en ${principal ? 'https://' + principal : url}. Puedes pedir cambios y volver a publicar, ver tus registros (registros.mjs) o conectar tu webhook (secreto.mjs).`
    : 'Comprobar el dominio en unos minutos: node scripts/publicar.mjs --verificar',
});

console.log('\n  Listo. Tu página está publicada:');
if (url) console.log(`    · ${url}`);
for (const d of dominios) console.log(`    · https://${d}${resultado.dominios[d] === 'activo' ? '' : '  (pendiente: el certificado se está creando)'}`);
if (existsSync(join(dir, 'wrangler.jsonc')) && /"META_PIXEL": "\d+"/.test(readFileSync(join(dir, 'wrangler.jsonc'), 'utf8'))) linea('Con el píxel de Meta puesto en la página.');
