#!/usr/bin/env node
// Vista previa en tu compu (nada se publica): arma la página en modo vista y la abre en el navegador. Lo que falta se
// ve marcado «Por completar», el formulario no envía nada y la página se recarga sola cada vez que se vuelve a armar.
//
//   node scripts/vista.mjs [carpeta]                     tu página (la carpeta donde está plan.json)
//   node scripts/vista.mjs --plantillas [--tipo evento]  las 5 plantillas con la misma página de ejemplo, para elegir
//   node scripts/vista.mjs --ejemplo barberia [--plantilla nacar]   una página de ejemplo
//   node scripts/vista.mjs --parar                       apaga la vista previa
//   --sin-abrir   no abre el navegador (solo arma y dice la dirección)
import { spawn } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { argumentos, carpetaProyecto, leerProyecto, fallar, ok, aviso, linea, abrir, EJEMPLOS, SKILL, motor, comando, cosas } from './lib/comun.mjs';
import { armarSitio } from './lib/armado.mjs';
import { pendientesDe } from './lib/pendientes.mjs';

const args = argumentos();
const REGISTRO = join(tmpdir(), 'crear-paginas-vistas.json');
const leerRegistro = () => {
  try {
    return JSON.parse(readFileSync(REGISTRO, 'utf8'));
  } catch {
    return {};
  }
};

async function quienSirve(puerto) {
  try {
    const r = await fetch(`http://127.0.0.1:${puerto}/__raiz`, { signal: AbortSignal.timeout(800) });
    return r.headers.get('x-crear-paginas') ? await r.text() : 'otro';
  } catch {
    return null;
  }
}

// Deja un servidor sirviendo `raiz` (reusa el que ya había). → la dirección.
async function servir(raiz) {
  const registro = leerRegistro();
  const previo = registro[raiz];
  if (previo && (await quienSirve(previo.puerto)) === raiz) return `http://127.0.0.1:${previo.puerto}`;
  for (let puerto = 4321; puerto < 4361; puerto++) {
    const actual = await quienSirve(puerto);
    if (actual === raiz) return `http://127.0.0.1:${puerto}`;
    if (actual !== null) continue;
    const p = spawn(process.execPath, [join(SKILL, 'scripts', 'lib', 'servidor.mjs'), raiz, String(puerto)], { detached: true, stdio: 'ignore', windowsHide: true });
    p.unref();
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 100));
      if ((await quienSirve(puerto)) === raiz) {
        registro[raiz] = { puerto, pid: p.pid };
        writeFileSync(REGISTRO, JSON.stringify(registro, null, 2));
        return `http://127.0.0.1:${puerto}`;
      }
    }
  }
  fallar('No pude prender la vista previa.', `Apaga las otras vistas previas (${comando('vista.mjs', '', '--parar')}) y vuelve a intentar.`);
}

async function mostrar(url, que, recarga = true) {
  ok(`${que}: ${url}`);
  if (!args['sin-abrir']) {
    await abrir(url);
    linea('Se abrió en tu navegador. Si no la ves, copia esa dirección y pégala en el navegador.');
  }
  if (recarga) linea('Cada vez que la vuelva a armar, se actualiza sola.');
}

async function main() {
  if (args.parar) {
    const registro = leerRegistro();
    let n = 0;
    for (const v of Object.values(registro)) {
      try {
        process.kill(v.pid);
        n++;
      } catch {
        /* ya estaba apagada */
      }
    }
    rmSync(REGISTRO, { force: true });
    ok(n ? 'Vista previa apagada.' : 'No había ninguna vista previa prendida.');
    return;
  }

  const ej = await import(pathToFileURL(join(EJEMPLOS, 'ejemplos.mjs')).href);

  if (args.plantillas) {
    const { PLANTILLAS } = await motor('plantillas/index.js');
    const base = args.ejemplo ? ej.ejemplo(String(args.ejemplo)) : ej.ejemploDeTipo(String(args.tipo || 'registro'));
    if (!base) fallar(`No hay un ejemplo «${args.ejemplo}».`, 'Ejemplos: ' + ej.EJEMPLOS.map((e) => e.id).join(', '));
    const raiz = join(tmpdir(), 'crear-paginas-plantillas');
    rmSync(raiz, { recursive: true, force: true });
    mkdirSync(raiz, { recursive: true });
    const ids = ['clasica', 'nacar', 'penumbra', 'voltaje', 'prisma'];
    for (const id of ids) {
      const tmp = join(raiz, '_' + id);
      armarSitio({ crudo: ej.planEjemplo(base.id, { plantilla: id }), marca: ej.marcaEjemplo(base.id), salida: tmp, modo: 'vista', dirFotos: ej.FOTOS_EJEMPLOS, paginaId: 'ejemplo' });
      copyFileSync(join(tmp, 'index.html'), join(raiz, id + '.html'));
      for (const sub of ['_f', 'img', 'media']) if (existsSync(join(tmp, sub))) cpSync(join(tmp, sub), join(raiz, sub), { recursive: true });
      rmSync(tmp, { recursive: true, force: true });
    }
    writeFileSync(join(raiz, 'index.html'), galeria(ids.map((id) => PLANTILLAS[id]), base));
    writeFileSync(join(raiz, '__version'), String(Date.now()));
    const url = await servir(raiz);
    await mostrar(url, 'Las 5 plantillas con la misma página de ejemplo', false);
    return;
  }

  if (args.ejemplo) {
    const id = String(args.ejemplo);
    if (!ej.ejemplo(id)) fallar(`No hay un ejemplo «${id}».`, 'Ejemplos: ' + ej.EJEMPLOS.map((e) => e.id).join(', '));
    const raiz = join(tmpdir(), 'crear-paginas-ejemplo');
    armarSitio({ crudo: ej.planEjemplo(id, { plantilla: args.plantilla ? String(args.plantilla) : undefined }), marca: ej.marcaEjemplo(id), salida: raiz, modo: 'vista', dirFotos: ej.FOTOS_EJEMPLOS, paginaId: 'ejemplo', recarga: true });
    const url = await servir(raiz);
    await mostrar(url, `Ejemplo «${ej.ejemplo(id).negocio}»`);
    return;
  }

  const dir = carpetaProyecto(args);
  const { plan: crudo, marca, estado } = leerProyecto(dir);
  const salida = join(dir, '.vista');
  let r;
  try {
    r = armarSitio({ crudo, marca, salida, modo: 'vista', dirFotos: join(dir, 'fotos'), paginaId: estado.nombre || 'pagina', recarga: true });
  } catch (e) {
    fallar('No pude armar la vista previa.', e.message);
  }
  for (const a of r.avisos) aviso(a);
  const { faltan } = pendientesDe(crudo, marca, { dirFotos: join(dir, 'fotos') });
  const url = await servir(resolve(salida));
  await mostrar(url, 'Tu página (vista previa)');
  linea(`También: ${url}/gracias · ${url}/privacidad · ${url}/terminos`);
  if (faltan.length) aviso(`${faltan.length === 1 ? 'Queda' : 'Quedan'} ${cosas(faltan.length)} por completar (se ven marcadas en la página). Lista: ${comando('revisar.mjs', dir)}`);
}

const escHTML = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// La página que muestra las 5 plantillas lado a lado (cada una en su miniatura viva, con «Ver completa» y «En celular»).
function galeria(plantillas, base) {
  const tarjetas = plantillas
    .map(
      (p, i) => `<article class="t">
  <div class="mini"><iframe src="/${p.id}.html" title="${escHTML(p.nombre)}" loading="lazy" tabindex="-1" scrolling="no"></iframe></div>
  <div class="tx"><p class="n">${i + 1} · ${escHTML(p.nombre)}</p><p>${escHTML(p.descripcion)}</p>
  <p class="c"><b>Va muy bien en:</b> ${escHTML(p.cuando)}</p>
  <p class="b"><a href="/${p.id}.html" target="_blank" rel="noopener">Ver completa</a><button type="button" data-cel="/${p.id}.html">En celular</button></p></div>
</article>`,
    )
    .join('\n');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Elige el diseño de tu página</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0d0e11;color:#eceef2;font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
header{max-width:1240px;margin:0 auto;padding:40px 20px 8px}h1{font-size:clamp(1.6rem,3vw,2.3rem);margin:0 0 6px;letter-spacing:-.01em}
header p{margin:0;color:#a7adb8;max-width:70ch}
main{max-width:1240px;margin:0 auto;padding:24px 20px 60px;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(330px,1fr))}
.t{background:#16181d;border:1px solid #262a32;border-radius:18px;overflow:hidden;display:flex;flex-direction:column}
.mini{position:relative;aspect-ratio:16/10;overflow:hidden;background:#000}
.mini iframe{position:absolute;top:0;left:0;width:1440px;height:900px;border:0;transform-origin:0 0;pointer-events:none}
.tx{padding:16px 18px 18px;display:flex;flex-direction:column;gap:8px;flex:1}.tx p{margin:0;color:#c3c8d1;font-size:.94rem}
.n{color:#fff!important;font-weight:700;font-size:1.12rem!important}.c{color:#9aa1ad!important;font-size:.86rem!important}
.b{margin-top:auto!important;padding-top:6px;display:flex;gap:10px}.b a,.b button{font:inherit;font-size:.9rem;padding:9px 14px;border-radius:999px;border:1px solid #3a404b;background:#1e2128;color:#fff;text-decoration:none;cursor:pointer}
.b a{background:#fff;color:#111;border-color:#fff;font-weight:600}
</style></head><body>
<header><h1>Elige el diseño de tu página</h1><p>Es la misma página con las 5 plantillas. El contenido es de un negocio ficticio («${escHTML(base.negocio)}»): en la tuya van tu oferta, tus colores y tus fotos. Toca «Ver completa» para recorrerla.</p></header>
<main>
${tarjetas}
</main>
<script>
function ajustar(){document.querySelectorAll('.mini').forEach(function(m){m.querySelector('iframe').style.transform='scale('+(m.clientWidth/1440)+')'})}
addEventListener('resize',ajustar);ajustar();
document.querySelectorAll('[data-cel]').forEach(function(b){b.addEventListener('click',function(){window.open(b.getAttribute('data-cel'),'_blank','width=400,height=840')})});
</script></body></html>`;
}

await main();
