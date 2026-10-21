#!/usr/bin/env node
// Guarda tu token de API de Cloudflare sin que se vea en ningún lado (ni en el chat ni en la pantalla).
// Queda en ~/.config/crear-paginas/cloudflare.json (permisos 600: solo tu usuario lo puede leer), fuera de la carpeta de
// tu página, y los scripts se lo pasan a la herramienta de Cloudflare como CLOUDFLARE_API_TOKEN.
//
//   node scripts/token.mjs                  te lo pide oculto (córrelo TÚ en tu terminal: lo que pegas no se ve)
//   node scripts/token.mjs --portapapeles   lo toma de lo que copiaste (botón «Copiar» de Cloudflare) y vacía el portapapeles
//   node scripts/token.mjs --estado         dice si hay uno guardado y si sirve (sin mostrarlo)
//   node scripts/token.mjs --cuenta <id>    elige la cuenta de Cloudflare (si tu usuario tiene varias)
//   node scripts/token.mjs --borrar         lo borra de tu compu
import { spawnSync } from 'node:child_process';
import { argumentos, fallar, ok, aviso, linea } from './lib/comun.mjs';
import { api, guardarCredenciales, leerCredenciales, borrarCredenciales, RUTA_CREDENCIALES } from './lib/cloudflare.mjs';

const args = argumentos();

function pedirOculto(pregunta) {
  return new Promise((resolver) => {
    const stdin = process.stdin;
    process.stdout.write(pregunta);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let valor = '';
    const terminar = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.off('data', leer);
      process.stdout.write('\n');
      resolver(valor);
    };
    function leer(trozo) {
      // Al pegar, algunas terminales envuelven el texto en marcas (\x1b[200~ … \x1b[201~): se quitan.
      for (const c of trozo.replace(/\x1b\[20[01]~/g, '')) {
        if (c === '\r' || c === '\n') return terminar();
        if (c === '\u0003') {
          process.stdout.write('\n');
          process.exit(130);
        }
        if (c === '\u007f' || c === '\b') valor = valor.slice(0, -1);
        else if (c >= ' ') valor += c;
      }
    }
    stdin.on('data', leer);
  });
}

function portapapeles() {
  const usar = (cmd, a = []) => spawnSync(cmd, a, { encoding: 'utf8', shell: false });
  let r;
  if (process.platform === 'darwin') r = usar('pbpaste');
  else if (process.platform === 'win32') r = usar('powershell', ['-NoProfile', '-Command', 'Get-Clipboard']);
  else {
    r = usar('wl-paste', ['--no-newline']);
    if (r.status !== 0) r = usar('xclip', ['-o', '-selection', 'clipboard']);
    if (r.status !== 0) r = usar('xsel', ['--clipboard', '--output']);
  }
  if (!r || r.status !== 0) fallar('No pude leer lo que copiaste.', 'Corre el script tú en tu terminal (sin --portapapeles) y pega el token cuando te lo pida.');
  return String(r.stdout || '');
}

function vaciarPortapapeles() {
  if (process.platform === 'darwin') spawnSync('pbcopy', [], { input: '' });
  else if (process.platform === 'win32') spawnSync('powershell', ['-NoProfile', '-Command', 'Set-Clipboard -Value " "']);
  else {
    const r = spawnSync('wl-copy', ['--clear']);
    if (r.status !== 0) spawnSync('xclip', ['-selection', 'clipboard'], { input: '' });
  }
}

// Revisa el token con Cloudflare y busca sus cuentas. → { valido, cuentas: [{ id, nombre }], motivo }
async function revisar(token) {
  const v = await api('/user/tokens/verify', { token });
  const cuentas = await api('/accounts?per_page=50', { token });
  const lista = cuentas.ok && Array.isArray(cuentas.datos) ? cuentas.datos.map((c) => ({ id: c.id, nombre: c.name })) : [];
  // Los tokens de cuenta (no de usuario) se revisan en su cuenta.
  let valido = v.ok && v.datos?.status === 'active';
  if (!valido && lista.length) {
    const vc = await api(`/accounts/${lista[0].id}/tokens/verify`, { token });
    valido = vc.ok && vc.datos?.status === 'active';
  }
  return { valido, cuentas: lista, motivo: [...(v.errores || []), ...(cuentas.errores || [])].join(' · ') };
}

if (args.borrar) {
  borrarCredenciales();
  ok('Listo: borré el token de tu compu. Si ya no lo vas a usar, bórralo también en Cloudflare (Mi perfil › Tokens de API).');
  process.exit(0);
}

if (args.cuenta) {
  const c = leerCredenciales();
  if (!c) fallar('Primero guarda tu token (node scripts/token.mjs).');
  if (!/^[0-9a-f]{32}$/.test(String(args.cuenta))) fallar('Ese id de cuenta no parece válido: son 32 letras y números (sale en `npx wrangler whoami`).');
  const r = await revisar(c.token);
  const cuenta = r.cuentas.find((x) => x.id === args.cuenta) || { id: args.cuenta, nombre: '' };
  guardarCredenciales({ ...c, cuenta });
  ok(`Listo: voy a publicar en la cuenta ${cuenta.nombre || cuenta.id}.`);
  process.exit(0);
}

if (args.estado) {
  const c = leerCredenciales();
  if (!c) {
    linea('No hay token guardado en esta compu.');
    process.exit(2);
  }
  const r = await revisar(c.token);
  if (r.valido) ok(`Hay un token guardado y funciona${c.cuenta?.nombre ? ' (cuenta: ' + c.cuenta.nombre + ')' : ''}.`);
  else aviso(`Hay un token guardado pero Cloudflare no lo acepta${r.motivo ? ' (' + r.motivo + ')' : ''}. Crea uno nuevo (walkthroughs/03-token-api.md).`);
  process.exit(r.valido ? 0 : 1);
}

let token;
if (args.portapapeles) token = portapapeles();
else if (process.stdin.isTTY) token = await pedirOculto('Pega tu token de Cloudflare (no se va a ver mientras lo pegas) y presiona Enter: ');
else fallar('Aquí no te puedo pedir el token oculto.', 'Opciones: 1) cópialo con el botón «Copiar» de Cloudflare y corre este script con --portapapeles; 2) corre este script tú en tu terminal.');

token = String(token || '').trim().replace(/^Bearer\s+/i, '');
if (!token) fallar('No llegó ningún token.', args.portapapeles ? 'Copia el token con el botón «Copiar» de Cloudflare y vuelve a intentar.' : '');
if (/\s/.test(token) || token.length < 30 || token.length > 200) {
  if (args.portapapeles) vaciarPortapapeles();
  fallar('Lo que copiaste no parece un token de Cloudflare.', 'El token es una sola palabra larga de letras y números (unos 40). Cópialo otra vez con el botón «Copiar» y vuelve a intentar. (Si copiaste la «Global API Key», esa no: hace falta un token.)');
}

const r = await revisar(token);
if (args.portapapeles) vaciarPortapapeles();
if (!r.valido) fallar('Cloudflare no aceptó ese token.', `${r.motivo || ''}\nRevisa que lo copiaste completo o crea uno nuevo (walkthroughs/03-token-api.md).`);

const datos = { token, guardado: new Date().toISOString() };
if (r.cuentas.length === 1) datos.cuenta = r.cuentas[0];
const anterior = leerCredenciales();
if (!datos.cuenta && anterior?.cuenta && r.cuentas.some((c) => c.id === anterior.cuenta.id)) datos.cuenta = anterior.cuenta;
guardarCredenciales(datos);

ok(`Token guardado y funcionando. Está en ${RUTA_CREDENCIALES} (solo tu usuario lo puede leer).`);
if (args.portapapeles) ok('Vacié tu portapapeles para que no quede copiado.');
if (datos.cuenta) ok(`Cuenta de Cloudflare: ${datos.cuenta.nombre || datos.cuenta.id}`);
else if (r.cuentas.length > 1) {
  aviso('Tu usuario tiene varias cuentas de Cloudflare. Dime en cuál publicar:');
  for (const c of r.cuentas) linea(`  · ${c.nombre} → node scripts/token.mjs --cuenta ${c.id}`);
} else aviso('No pude ver tus cuentas con este token: revisa que tenga el permiso «Configuración de la cuenta: Leer» (Account Settings: Read).');
