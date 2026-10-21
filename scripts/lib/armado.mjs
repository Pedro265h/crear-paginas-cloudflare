// Del plan al sitio: la página, la de gracias, privacidad, términos, las letras que usa y sus fotos, listos para
// Cloudflare (modo «publicado») o para verlos en la compu (modo «vista»: lo que falta se ve marcado y el formulario no
// envía nada). Lo usan armar.mjs, vista.mjs y publicar.mjs.
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { FUENTES, motor, escribir } from './comun.mjs';
import { EXT_IMAGEN, EXT_VIDEO, resolutorFotos, copiarVideo } from './imagenes.mjs';

const { normalizarPlan } = await motor('catalogo.js');
const { renderPagina } = await motor('render.js');
const { renderLegal } = await motor('legales.js');
const { completarWhatsappPlan, paisDePagina } = await motor('telefono.js');

const MARCA_SALIDA = '.crear-paginas';
const FOTO_LOCAL = /^(\.\/)?fotos[\\/][^\s"'<>]+$/i;
const VIDEO_FALSO = 'https://video-local.invalid/';

// Copia profunda del plan con los atajos de la persona traducidos a lo que entiende el motor:
//   "fotos/retrato.jpg"  → { ref: "retrato.jpg" }   (una foto de la carpeta fotos/)
//   "fotos/demo.mp4"     → un video propio (se sirve desde el sitio)
export function traducirAtajos(valor, videos = new Map()) {
  if (typeof valor === 'string') {
    const s = valor.trim();
    if (FOTO_LOCAL.test(s) && EXT_IMAGEN.test(s)) return { ref: basename(s.replace(/\\/g, '/')) };
    if (FOTO_LOCAL.test(s) && EXT_VIDEO.test(s)) {
      const nombre = basename(s.replace(/\\/g, '/'));
      videos.set(nombre, s);
      return VIDEO_FALSO + encodeURIComponent(nombre);
    }
    return valor;
  }
  if (Array.isArray(valor)) return valor.map((v) => traducirAtajos(v, videos));
  if (valor && typeof valor === 'object') return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, traducirAtajos(v, videos)]));
  return valor;
}

// El plan listo para el motor (normalizado) + los videos propios que pidió.
export function prepararPlan(crudo, marca = {}) {
  const videos = new Map();
  let plan = traducirAtajos(crudo && typeof crudo === 'object' ? crudo : {}, videos);
  // El WhatsApp sin código de país se completa con el país de la marca (o del evento).
  plan = completarWhatsappPlan(plan, paisDePagina(plan, marca));
  return { plan: normalizarPlan(plan, plan.tipo), videos };
}

// Los datos de la marca que usan las legales (marca.json): nombre, país, razón social, documento y correo.
export function marcaLegal(marca = {}, plan = {}) {
  return {
    nombre: marca.nombre || plan.marca?.nombre || '',
    pais: marca.pais || '',
    legal: { razon_social: marca.legal?.razon_social || '', documento: marca.legal?.documento || '' },
    contacto: { correo: marca.contacto?.correo || '', whatsapp: marca.contacto?.whatsapp || '' },
  };
}

// Borra la carpeta de salida solo si es nuestra (la armamos antes) o está vacía: nunca una carpeta de la persona.
function limpiarSalida(salida) {
  if (!existsSync(salida)) return mkdirSync(salida, { recursive: true });
  const contenido = readdirSync(salida);
  if (contenido.length && !contenido.includes(MARCA_SALIDA)) {
    throw new Error(`La carpeta ${salida} ya tiene archivos que no armé yo. Elige otra carpeta de salida.`);
  }
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });
}

// Recarga sola de la vista previa (solo en modo vista, con vista.mjs): pregunta cada segundo si se volvió a armar.
const RECARGA =
  '<script>(function(){var v=null;function mirar(){fetch("/__version",{cache:"no-store"}).then(function(r){return r.text()})' +
  '.then(function(t){if(v===null)v=t;else if(t!==v)location.reload()}).catch(function(){})}setInterval(mirar,1000);mirar()})();</script>';

const CABECERAS = `/_f/*
  Cache-Control: public, max-age=604800
  X-Content-Type-Options: nosniff
/img/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
/media/*
  Cache-Control: public, max-age=31536000, immutable
  X-Content-Type-Options: nosniff
`;

// opciones:
//   crudo        el plan tal como está en plan.json
//   marca        marca.json
//   salida       carpeta donde se arma (sitio/ o .vista/)
//   modo         'publicado' | 'vista'
//   dirFotos     carpeta de las fotos (fotos/ del proyecto, o ejemplos/fotos)
//   paginaId     el nombre de la página (va con cada registro)
//   urlBase      la dirección pública (https://…) para la imagen al compartir en redes; '' = sin ella
//   recarga      true: la vista se recarga sola cuando se vuelve a armar
// → { plan, archivos: [{ nombre, bytes }], fotos: [{ ref, peso }], avisos: [] }
export function armarSitio({ crudo, marca = {}, salida, modo = 'publicado', dirFotos, paginaId = 'pagina', urlBase = '', recarga = false }) {
  const { plan, videos } = prepararPlan(crudo, marca);
  limpiarSalida(salida);
  const avisos = [];
  const usadas = new Map();
  const imagen = resolutorFotos(dirFotos, salida, usadas);

  // La imagen para compartir en redes: la foto de la portada, en su tamaño más grande.
  let ogImagen = '';
  const hero = plan.secciones.find((s) => s.tipo === 'hero' && !s.oculta);
  const refHero = hero?.campos?.imagen?.ref;
  if (urlBase && refHero && imagen(refHero)) {
    const copias = usadas.get(refHero).copias;
    ogImagen = urlBase.replace(/\/+$/, '') + copias[copias.length - 1].src;
  }
  // Ícono de la pestaña: fotos/favicon.png (o .svg, .ico) si la persona lo puso.
  let favicon = '';
  for (const ext of ['svg', 'png', 'ico']) {
    const ruta = dirFotos && join(dirFotos, 'favicon.' + ext);
    if (ruta && existsSync(ruta)) {
      copyFileSync(ruta, join(salida, 'favicon.' + ext));
      favicon = '/favicon.' + ext;
      break;
    }
  }

  const base = { modo, imagen, rutaLetras: '/_f/', paginaId, rutaGracias: '/gracias', favicon };
  let principal = renderPagina(plan, { ...base, pagina: 'principal', ogImagen });
  let gracias = renderPagina(plan, { ...base, pagina: 'gracias' });
  const legal = marcaLegal(marca, plan);
  const privacidad = renderLegal(plan, legal, 'privacidad', { modo, rutaLetras: '/_f/' });
  const terminos = renderLegal(plan, legal, 'terminos', { modo, rutaLetras: '/_f/' });

  // Videos propios: se copian y el link de mentira se cambia por el del sitio (con su portada si hay).
  for (const [nombre, original] of videos) {
    const falso = VIDEO_FALSO + encodeURIComponent(nombre);
    const v = copiarVideo(dirFotos, nombre, salida);
    if (!v) {
      avisos.push(`No encuentro el video ${original} en la carpeta de fotos.`);
      continue;
    }
    if (v.peso > 25 * 1024 * 1024) avisos.push(`El video ${nombre} pesa más de 25 MB: Cloudflare no lo acepta. Súbelo a YouTube, Vimeo o tu reproductor (VTurb, Panda) y pon ese link.`);
    const cambiar = (html) =>
      html
        .split(`<video src="${falso}"`).join(`<video src="${v.src}"${v.portada ? ` poster="${v.portada}"` : ''}`)
        .split(falso).join(v.src);
    principal = cambiar(principal);
    gracias = cambiar(gracias);
  }

  if (modo === 'vista' && recarga) {
    const meter = (h) => h.replace(/<\/body>(?![\s\S]*<\/body>)/, RECARGA + '</body>');
    principal = meter(principal);
    gracias = meter(gracias);
  }

  const paginas = { 'index.html': principal, 'gracias.html': gracias, 'privacidad.html': privacidad, 'terminos.html': terminos };
  for (const [nombre, html] of Object.entries(paginas)) writeFileSync(join(salida, nombre), html);

  // Solo las letras que usa esta página.
  const letras = new Set();
  for (const html of Object.values(paginas)) for (const m of html.matchAll(/\/_f\/([a-z0-9-]+\.woff2)/g)) letras.add(m[1]);
  mkdirSync(join(salida, '_f'), { recursive: true });
  for (const l of letras) {
    const origen = join(FUENTES, l);
    if (existsSync(origen)) copyFileSync(origen, join(salida, '_f', l));
    else avisos.push(`Falta la letra ${l} en el motor.`);
  }

  writeFileSync(join(salida, '_headers'), CABECERAS);
  writeFileSync(join(salida, '.assetsignore'), MARCA_SALIDA + '\n');
  writeFileSync(join(salida, MARCA_SALIDA), `Armado por la skill crear-paginas el ${new Date().toISOString()} (modo ${modo}).\n`);
  if (modo === 'vista') writeFileSync(join(salida, '__version'), String(Date.now()));

  // Fotos pesadas: frenan la página en el celular.
  const fotos = [];
  for (const [ref, u] of usadas) {
    const peso = u.copias.reduce((s, c) => Math.max(s, c.peso), 0);
    fotos.push({ ref, peso });
    if (u.copias.length === 1 && peso > 600 * 1024) {
      avisos.push(`La foto ${ref} pesa ${(peso / 1024 / 1024).toFixed(1)} MB: la página va a cargar lenta en el celular. Optimízala con: node scripts/fotos.mjs`);
    }
  }

  const archivos = [];
  const recorrer = (dir, prefijo = '') => {
    for (const f of readdirSync(dir)) {
      const ruta = join(dir, f);
      if (statSync(ruta).isDirectory()) recorrer(ruta, prefijo + f + '/');
      else if (f !== MARCA_SALIDA) archivos.push({ nombre: prefijo + f, bytes: statSync(ruta).size });
    }
  };
  recorrer(salida);
  return { plan, archivos, fotos, avisos };
}

// Para guardar un plan de ejemplo ya preparado en un archivo (lo usa la prueba).
export const guardarPlan = (ruta, plan) => escribir(ruta, JSON.stringify(plan, null, 2) + '\n');
