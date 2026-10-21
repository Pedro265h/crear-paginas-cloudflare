#!/usr/bin/env node
// Arma la página: del plan (plan.json) al sitio listo para Cloudflare (sitio/: index.html, gracias.html,
// privacidad.html, terminos.html, las letras en _f/ y las fotos en img/).
//
//   node scripts/armar.mjs [carpeta]                   modo publicado → sitio/ (lo que se sube)
//   node scripts/armar.mjs [carpeta] --vista           modo vista → .vista/ (lo que falta se ve marcado)
//   node scripts/armar.mjs --ejemplo despierta-hoy [--plantilla nacar] --salida <carpeta> [--vista]
//
// Sin carpeta, usa la carpeta donde estás. No sube nada a internet (eso es publicar.mjs).
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { argumentos, carpetaProyecto, leerProyecto, guardarEstado, fallar, ok, aviso, linea, EJEMPLOS, motor } from './lib/comun.mjs';
import { armarSitio } from './lib/armado.mjs';
import { pendientesDe } from './lib/pendientes.mjs';

const args = argumentos();
const modo = args.vista ? 'vista' : 'publicado';
const kb = (n) => (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';

export function resumen(r, salida) {
  const total = r.archivos.reduce((s, a) => s + a.bytes, 0);
  const html = r.archivos.filter((a) => a.nombre.endsWith('.html'));
  ok(`Página armada en ${salida} (${modo === 'vista' ? 'vista previa' : 'lista para publicar'})`);
  linea(html.map((a) => `${a.nombre} ${kb(a.bytes)}`).join(' · '));
  linea(`${r.archivos.filter((a) => a.nombre.startsWith('_f/')).length} letras · ${r.archivos.filter((a) => a.nombre.startsWith('img/')).length} fotos · ${r.archivos.filter((a) => a.nombre.startsWith('media/')).length} videos · total ${kb(total)}`);
  for (const a of r.avisos) aviso(a);
}

async function main() {
  if (args.ejemplo) {
    const { planEjemplo, marcaEjemplo, FOTOS_EJEMPLOS } = await import(pathToFileURL(join(EJEMPLOS, 'ejemplos.mjs')).href);
    if (!args.salida) fallar('Dime dónde armar el ejemplo: --salida <carpeta>.');
    const salida = resolve(String(args.salida));
    let crudo;
    try {
      crudo = planEjemplo(String(args.ejemplo), { plantilla: args.plantilla ? String(args.plantilla) : undefined });
    } catch (e) {
      fallar(e.message);
    }
    const r = armarSitio({ crudo, marca: marcaEjemplo(String(args.ejemplo)), salida, modo, dirFotos: FOTOS_EJEMPLOS, paginaId: 'ejemplo-' + args.ejemplo });
    resumen(r, salida);
    return;
  }

  const dir = carpetaProyecto(args);
  const { plan: crudo, marca, estado } = leerProyecto(dir);
  const salida = args.salida ? resolve(String(args.salida)) : join(dir, modo === 'vista' ? '.vista' : 'sitio');
  const urlBase = estado.dominios?.[0] ? `https://${estado.dominios[0]}` : estado.url || '';
  let r;
  try {
    r = armarSitio({ crudo, marca, salida, modo, dirFotos: join(dir, 'fotos'), paginaId: estado.nombre || 'pagina', urlBase, recarga: !!args.recarga });
  } catch (e) {
    fallar('No pude armar la página.', e.message);
  }
  const { faltan } = pendientesDe(crudo, marca, { dirFotos: join(dir, 'fotos') });
  const { PLANTILLAS } = await motor('plantillas/index.js');
  guardarEstado(dir, {
    armado: new Date().toISOString(),
    pendientes: faltan.length,
    titulo: r.plan.seo?.titulo || r.plan.marca?.nombre || estado.titulo,
    tipo: r.plan.tipo,
    plantilla: PLANTILLAS[r.plan.tema.plantilla]?.nombre || r.plan.tema.plantilla,
  });
  resumen(r, salida);
  if (faltan.length) aviso(`Quedan ${faltan.length} cosas por completar${modo === 'vista' ? ' (en la vista se ven marcadas)' : ': en la página publicada no se verían'}. Míralas con: node scripts/revisar.mjs`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
