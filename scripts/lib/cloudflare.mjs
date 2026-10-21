// Hablar con Cloudflare: la herramienta de Cloudflare (Wrangler, con npx), la sesión de la persona y su token de API.
//
// El token NUNCA se imprime ni se pasa por el chat: vive en ~/.config/crear-paginas/cloudflare.json (permisos 600, fuera
// de la carpeta de la página) y se le pasa a Wrangler como CLOUDFLARE_API_TOKEN solo al correrlo. Si la persona entró
// con `npx wrangler login` (un clic en el navegador), no hay token: Wrangler usa su propia sesión.
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const WRANGLER = 'wrangler@4';
export const CARPETA_CREDENCIALES = join(homedir(), '.config', 'crear-paginas');
export const RUTA_CREDENCIALES = join(CARPETA_CREDENCIALES, 'cloudflare.json');

// ---------- token ----------

export function leerCredenciales() {
  try {
    const d = JSON.parse(readFileSync(RUTA_CREDENCIALES, 'utf8'));
    // { token?, cuenta?: { id, nombre } }: puede haber solo la cuenta elegida (si entró con `wrangler login`).
    return d && typeof d === 'object' && (d.token || d.cuenta?.id) ? d : null;
  } catch {
    return null;
  }
}

export function guardarCredenciales(datos) {
  mkdirSync(CARPETA_CREDENCIALES, { recursive: true });
  try {
    chmodSync(CARPETA_CREDENCIALES, 0o700);
  } catch {
    /* Windows: no hay permisos al estilo Unix; la carpeta ya es solo de tu usuario */
  }
  writeFileSync(RUTA_CREDENCIALES, JSON.stringify(datos, null, 2), { mode: 0o600 });
  try {
    chmodSync(RUTA_CREDENCIALES, 0o600);
  } catch {
    /* Windows */
  }
}

export function borrarCredenciales() {
  if (existsSync(RUTA_CREDENCIALES)) rmSync(RUTA_CREDENCIALES);
}

// Las variables con que corre Wrangler: si hay token guardado (y la persona no tiene ya uno puesto), va como
// CLOUDFLARE_API_TOKEN (y la cuenta como CLOUDFLARE_ACCOUNT_ID). CI=1: Wrangler no se queda esperando una respuesta.
export function entorno(extra = {}) {
  const env = { ...process.env, CI: '1', WRANGLER_SEND_METRICS: 'false', ...extra };
  const c = leerCredenciales();
  if (c?.token && !process.env.CLOUDFLARE_API_TOKEN) env.CLOUDFLARE_API_TOKEN = c.token;
  if (c?.cuenta?.id && !process.env.CLOUDFLARE_ACCOUNT_ID) env.CLOUDFLARE_ACCOUNT_ID = c.cuenta.id;
  return env;
}

// Llama a la API de Cloudflare con el token guardado (o el que se le pase). → { ok, datos, errores }
export async function api(ruta, { token, metodo = 'GET', cuerpo } = {}) {
  const t = token || leerCredenciales()?.token;
  if (!t) return { ok: false, errores: ['No hay token guardado.'] };
  try {
    const r = await fetch('https://api.cloudflare.com/client/v4' + ruta, {
      method: metodo,
      headers: { authorization: 'Bearer ' + t, 'content-type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok && d.success !== false, datos: d.result, errores: (d.errors || []).map((e) => `${e.code}: ${e.message}`), estado: r.status };
  } catch (e) {
    return { ok: false, errores: [e.message] };
  }
}

// ---------- Wrangler ----------

const npx = () => (process.platform === 'win32' ? 'npx.cmd' : 'npx');

// Corre `npx --yes wrangler@4 <args>` en `cwd`. → { ok, codigo, salida, error, todo }
// mostrar: true deja ver lo que va diciendo Wrangler (deploy); entrada: texto para su stdin (un secreto).
export function wrangler(args, { cwd = process.cwd(), mostrar = false, entrada, extra = {}, tiempo = 10 * 60 * 1000 } = {}) {
  const r = spawnSync(npx(), ['--yes', WRANGLER, ...args], {
    cwd,
    env: entorno(extra),
    encoding: 'utf8',
    input: entrada,
    stdio: [entrada !== undefined ? 'pipe' : 'ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
    timeout: tiempo,
    maxBuffer: 64 * 1024 * 1024,
  });
  const salida = r.stdout || '';
  const error = r.stderr || (r.error ? r.error.message : '');
  if (mostrar) {
    if (salida.trim()) process.stdout.write(salida.replace(/^/gm, '    '));
    if (r.status !== 0 && error.trim()) process.stdout.write(error.replace(/^/gm, '    '));
  }
  return { ok: r.status === 0, codigo: r.status, salida, error, todo: salida + '\n' + error };
}

// ¿Con qué cuenta está conectada la compu? → { conectado, correo, cuentas: [{ nombre, id }], forma: 'token'|'sesion' }
export function quienSoy(cwd) {
  const r = wrangler(['whoami'], { cwd });
  const texto = r.todo;
  if (!r.ok || /not authenticated|You are not logged in|no está autenticado/i.test(texto)) return { conectado: false, detalle: texto };
  const correo = /associated with the email ([^\s!.]+@[^\s!]+?)[.!]?\s/i.exec(texto)?.[1] || '';
  const cuentas = [];
  for (const m of texto.matchAll(/│\s*([^│\n]+?)\s*│\s*([0-9a-f]{32})\s*│/g)) cuentas.push({ nombre: m[1].trim(), id: m[2] });
  return { conectado: true, correo, cuentas, forma: entorno().CLOUDFLARE_API_TOKEN ? 'token' : 'sesion', detalle: texto };
}

// Lo que dice Wrangler cuando algo falla → qué pasó y qué hacer, en palabras simples.
export function explicarError(texto) {
  const t = String(texto || '');
  const reglas = [
    [/not authenticated|not logged in|Authentication error \[code: 10000\]|Invalid access token|\b10001\b/i,
      'Tu compu no está conectada a Cloudflare o el token no sirve.', 'Conéctala otra vez: `npx wrangler login` (o guarda un token nuevo con scripts/token.mjs). Si usas token, revisa que tenga los permisos de walkthroughs/03-token-api.md.'],
    [/workers\.dev subdomain|register a workers\.dev subdomain|You need to register/i,
      'Tu cuenta de Cloudflare todavía no tiene su dirección gratis de workers.dev.', 'Abre https://dash.cloudflare.com → Workers y Pages (Compute › Workers) una vez: Cloudflare la crea al entrar. Después vuelve a publicar.'],
    [/More than one account available|multiple accounts/i,
      'Tu usuario tiene más de una cuenta de Cloudflare y no sé en cuál publicar.', 'Guarda la cuenta con: node scripts/token.mjs --cuenta <id> (los id salen en `npx wrangler whoami`).'],
    [/Hostname .* already has externally managed DNS records|already has (a|existing) (CNAME|DNS)|existing DNS record/i,
      'Ese dominio (o su www) ya tiene un registro DNS que apunta a otro lado.', 'En Cloudflare → tu dominio → DNS, borra el registro A, AAAA o CNAME de ese nombre (el que apunta a tu hosting viejo) y vuelve a publicar.'],
    [/Could not find zone|zone .* not found|not a zone|no zone/i,
      'Ese dominio no está en tu cuenta de Cloudflare.', 'Agrégalo primero (walkthroughs/05-dominio.md) y espera a que diga «Activo». Después vuelve a publicar.'],
    [/payment method|billing/i,
      'Cloudflare pide una forma de pago para activar este servicio (el plan gratis no cobra).', 'Agrégala en https://dash.cloudflare.com → Facturación. Puedes poner un tope de gasto.'],
    [/\b(10000|9109|10013|7003)\b|Unauthorized|forbidden|permission/i,
      'El token no tiene permiso para esto.', 'Crea uno nuevo con los permisos de walkthroughs/03-token-api.md (Workers, D1 y DNS de tu dominio) y guárdalo con scripts/token.mjs.'],
    [/ENOTFOUND|ECONNRESET|ETIMEDOUT|fetch failed|network/i,
      'No hay conexión con Cloudflare en este momento.', 'Revisa tu internet y vuelve a intentar.'],
    [/database .* (limit|quota)|maximum number of databases/i,
      'Llegaste al máximo de bases de datos del plan gratis.', 'Borra una base que no uses en https://dash.cloudflare.com → Almacenamiento y bases de datos › D1.'],
  ];
  for (const [patron, que, hacer] of reglas) if (patron.test(t)) return { que, hacer };
  return { que: 'Cloudflare respondió con un error.', hacer: 'Mira el detalle de abajo. Si no lo entiendes, pásaselo a Claude: walkthroughs/99-problemas.md tiene los más comunes.' };
}
