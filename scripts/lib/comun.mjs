// Lo que comparten todos los scripts: rutas de la skill, argumentos, mensajes y el proyecto del alumno (plan.json,
// marca.json, estado.json, ESTADO.md y wrangler.jsonc). Solo Node, sin dependencias.
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const MOTOR = join(SKILL, 'motor');
export const FUENTES = join(MOTOR, 'fuentes');
export const PLANTILLA_SITIO = join(SKILL, 'plantilla-sitio');
export const EJEMPLOS = join(SKILL, 'ejemplos');

// Importa un archivo del motor (funciona igual en Windows: import() necesita una URL file://).
export const motor = (archivo) => import(pathToFileURL(join(MOTOR, archivo)).href);

// ---------- argumentos ----------

// node script.mjs [carpeta] --clave valor --bandera → { _: ['carpeta'], clave: 'valor', bandera: true }
export function argumentos(lista = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < lista.length; i++) {
    const x = lista[i];
    if (x.startsWith('--')) {
      const [k, v] = x.slice(2).split('=');
      if (v !== undefined) a[k] = v;
      else if (lista[i + 1] !== undefined && !lista[i + 1].startsWith('--')) a[k] = lista[++i];
      else a[k] = true;
    } else a._.push(x);
  }
  return a;
}

// ---------- mensajes (español simple; sin jerga) ----------

// El comando completo de un script, con rutas absolutas (sirve desde cualquier carpeta): lo que se le muestra a Claude.
export const comando = (script, dir, extra = '') => `node "${join(SKILL, 'scripts', script)}"${dir ? ` --proyecto "${dir}"` : ''}${extra ? ' ' + extra : ''}`;
// «1 cosa» / «3 cosas»
export const cosas = (n) => (n === 1 ? '1 cosa' : `${n} cosas`);

export const ok = (t) => console.log('  ✓ ' + t);
export const aviso = (t) => console.log('  ! ' + t);
export const paso = (t) => console.log('\n→ ' + t);
export const linea = (t = '') => console.log(t ? '  ' + t : '');

// Termina con un mensaje claro (para la persona y para Claude) y el código de salida.
export function fallar(mensaje, detalle = '', codigo = 1) {
  console.error('\n  ✗ ' + mensaje);
  if (detalle) console.error('    ' + String(detalle).trim().split('\n').slice(-12).join('\n    '));
  process.exit(codigo);
}

// ---------- archivos ----------

export function leerJSON(ruta, porDefecto = undefined) {
  if (!existsSync(ruta)) {
    if (porDefecto !== undefined) return porDefecto;
    throw new Error(`No encuentro ${ruta}`);
  }
  const texto = readFileSync(ruta, 'utf8').replace(/^﻿/, '');
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`${ruta} no es un JSON válido: ${e.message}`);
  }
}

// Escribe de una sola vez (temporal + renombrar): nadie lee medio archivo.
export function escribir(ruta, texto) {
  mkdirSync(dirname(ruta), { recursive: true });
  const tmp = `${ruta}.${process.pid}.tmp`;
  writeFileSync(tmp, texto);
  renameSync(tmp, ruta);
}

export const escribirJSON = (ruta, datos) => escribir(ruta, JSON.stringify(datos, null, 2) + '\n');

// ---------- el proyecto del alumno ----------
//
// mi-pagina/
//   plan.json        la página (lo que entiende el motor). Claude lo edita.
//   marca.json       nombre, país, datos legales y de contacto (van en privacidad y términos).
//   fotos/           las fotos de la persona (en el plan: "fotos/mi-foto.jpg").
//   sitio/           lo que se publica (lo arma armar.mjs; no se edita a mano).
//   src/index.js · schema.sql · wrangler.jsonc   el sitio en Cloudflare (de plantilla-sitio/).
//   estado.json · ESTADO.md   en qué va todo (para retomar en otra sesión).

export function carpetaProyecto(args) {
  const dir = resolve(args.proyecto || args._[0] || process.cwd());
  return dir;
}

export function exigirProyecto(dir) {
  if (!existsSync(join(dir, 'plan.json'))) {
    fallar(`No encuentro plan.json en ${dir}.`, `Pásale la carpeta de la página: --proyecto "<carpeta>". Para empezar una nueva: ${comando('nuevo.mjs', '', '--nombre "<Marca>" --tipo <tipo>')}`);
  }
}

export function leerProyecto(dir) {
  exigirProyecto(dir);
  const plan = leerJSON(join(dir, 'plan.json'));
  const marca = leerJSON(join(dir, 'marca.json'), {});
  const estado = leerJSON(join(dir, 'estado.json'), {});
  return { dir, plan, marca, estado };
}

// Junta cambios en estado.json y reescribe ESTADO.md.
export function guardarEstado(dir, cambios = {}) {
  const ruta = join(dir, 'estado.json');
  const actual = leerJSON(ruta, {});
  const nuevo = { ...actual, ...cambios, actualizado: new Date().toISOString() };
  escribirJSON(ruta, nuevo);
  escribir(join(dir, 'ESTADO.md'), estadoLegible(nuevo));
  return nuevo;
}

const fecha = (iso) => (iso ? new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

function estadoLegible(e) {
  const dominios = (e.dominios || []).map((d) => `https://${d}`).join(' · ');
  return `# Estado de tu página

> Este archivo lo escriben los scripts de la skill **crear-paginas**. Para seguir en otra sesión, abre Claude Code en
> esta carpeta y dile: «continuar mi página».

| | |
|---|---|
| Página | ${e.titulo || e.nombre || '—'} |
| Tipo | ${e.tipo || '—'} |
| Plantilla | ${e.plantilla || '—'} |
| Paso actual | ${e.fase || '—'} |
| Nombre en Cloudflare | ${e.nombre || '—'} |
| Base de registros | ${e.base?.nombre || '—'} |
| Dirección gratis | ${e.url || 'todavía no se publica'} |
| Tu dominio | ${dominios || '—'} |
| Última vez armada | ${fecha(e.armado)} |
| Última publicación | ${fecha(e.publicado)} |
| Cosas por completar | ${e.pendientes ?? '—'} |
| Webhook | ${e.webhook ? 'configurado' : 'no'} |
| Píxel de Meta | ${e.pixel || 'no'} |

## Qué sigue

${e.siguiente || 'Pídele a Claude que revise la página: «revisa qué le falta a mi página».'}

## Comandos (los corre Claude por ti)

- Ver la página en tu compu: \`node "${SKILL}/scripts/vista.mjs"\`
- Revisar qué falta: \`node "${SKILL}/scripts/revisar.mjs"\`
- Publicar: \`node "${SKILL}/scripts/publicar.mjs"\`
- Bajar tus registros a Excel: \`node "${SKILL}/scripts/registros.mjs"\`
`;
}

// Nombre válido para Cloudflare: minúsculas, números y guiones (máx. 50, para que quepa «-registros»).
export function nombreCloudflare(texto) {
  const s = String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/, '');
  return /^[a-z]/.test(s) ? s : s ? 'pagina-' + s : 'mi-pagina';
}

export const BASE_ID_LOCAL = '00000000-0000-0000-0000-000000000000';

// wrangler.jsonc a partir de la plantilla y del estado (nombre, base, zona, píxel y dominios).
export function escribirWrangler(dir, estado, plan = {}) {
  let t = readFileSync(join(PLANTILLA_SITIO, 'wrangler.jsonc'), 'utf8');
  const dominios = Array.isArray(estado.dominios) ? estado.dominios : [];
  const rutas = dominios.length
    ? ',\n  "routes": [\n' + dominios.map((d) => `    { "pattern": ${JSON.stringify(d)}, "custom_domain": true }`).join(',\n') + '\n  ]'
    : '';
  const pixel = String(plan?.pixel?.meta || '').replace(/\D/g, '');
  t = t
    .replace('__NOMBRE__', estado.nombre)
    .replace('__BASE__', estado.base?.nombre || estado.nombre + '-registros')
    .replace('__BASE_ID__', estado.base?.id || BASE_ID_LOCAL)
    .replace('__ZONA__', estado.zona || 'America/Bogota')
    .replace('__PIXEL__', pixel)
    .replace('__LIMITE__', String(Math.max(1, Number.parseInt(estado.limite_registros, 10) || 5)))
    .replace('__RUTAS__', rutas);
  escribir(join(dir, 'wrangler.jsonc'), t);
}

// Abre una dirección o un archivo en el navegador de la persona (Mac, Windows o Linux).
export async function abrir(destino) {
  const { spawn } = await import('node:child_process');
  const [cmd, args] =
    process.platform === 'darwin' ? ['open', [destino]] : process.platform === 'win32' ? ['explorer', [destino]] : ['xdg-open', [destino]];
  try {
    const p = spawn(cmd, args, { stdio: 'ignore', detached: true });
    p.on('error', () => {});
    p.unref();
    return true;
  } catch {
    return false;
  }
}

// ---------- zona horaria de la página (los días de las estadísticas son los de la persona, no los de Londres) ----------

const ZONAS_PAIS = [
  ['republica dominicana', 'America/Santo_Domingo'], ['puerto rico', 'America/Puerto_Rico'], ['costa rica', 'America/Costa_Rica'],
  ['el salvador', 'America/El_Salvador'], ['estados unidos', 'America/New_York'], ['colombia', 'America/Bogota'],
  ['mexico', 'America/Mexico_City'], ['espana', 'Europe/Madrid'], ['peru', 'America/Lima'], ['chile', 'America/Santiago'],
  ['argentina', 'America/Argentina/Buenos_Aires'], ['ecuador', 'America/Guayaquil'], ['venezuela', 'America/Caracas'],
  ['uruguay', 'America/Montevideo'], ['paraguay', 'America/Asuncion'], ['bolivia', 'America/La_Paz'], ['panama', 'America/Panama'],
  ['guatemala', 'America/Guatemala'], ['honduras', 'America/Tegucigalpa'], ['nicaragua', 'America/Managua'], ['brasil', 'America/Sao_Paulo'],
];

function zonaValida(z) {
  if (typeof z !== 'string' || !z || z.length > 60) return false;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: z });
    return true;
  } catch {
    return false;
  }
}

// La del evento si la página tiene fecha; si no, la del país de la marca; si no, Bogotá.
export function zonaDe(plan = {}, marca = {}) {
  const ev = plan?.evento || {};
  if (ev.fecha && zonaValida(ev.zona)) return ev.zona;
  const pais = String(marca?.pais || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const porPais = pais && ZONAS_PAIS.find(([k]) => pais.includes(k));
  if (porPais) return porPais[1];
  return zonaValida(ev.zona) ? ev.zona : 'America/Bogota';
}
