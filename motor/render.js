// Plan → documento HTML completo. Puro: lo usan armar.mjs (al armar el sitio) y vista.mjs (la vista previa).
//
// renderPagina(plan, opciones)
//   modo        'publicado' | 'vista' | 'edicion'   (vista y edición no envían nada ni navegan)
//   pagina      'principal' | 'gracias'
//   imagen(ref) → { src, srcset, ancho, alto } para las fotos de la biblioteca ({ ref: id }); null si no existe
//   rutaLetras  dónde se sirven los .woff2 (por defecto /_f/)
//   paginaId    id de la página (va en el lead y en la visita)
//   rutaGracias a dónde va el formulario al enviarse (por defecto /gracias)
//   quieto      true: sin el JS de movimiento ni la escena de la plantilla (miniaturas del estudio)
//   scroll      (edición) dónde arranca la vista previa, en px
//
// Plantillas (plan.tema.plantilla, motor/plantillas/): la clásica se pinta igual que siempre, byte a byte. Una
// plantilla moderna no cambia el HTML de las secciones: pone sus tokens y letras, su CSS después del clásico, y en
// publicado y vista su JS de movimiento y su escena (en edición todo queda quieto, visible y clicable).
//
// Colores propios (motor/plantillas/propios.js): tema.propios cambia los tokens de :root; seccion.estilo va como
// variables CSS en el atributo style de su <section> (así se parcha en vivo con renderSeccion). Una página sin nada
// propio se pinta byte a byte como antes.
import { SECCIONES, propia } from './catalogo.js';
import { resolverTemaPagina, cssTemaPagina, cssPlantilla, cssPersonal, precargaPagina, movimientoDe } from './plantillas/index.js';
import { estiloDeSeccion, tienePropios } from './plantillas/propios.js';
import { esc, pendiente, vacio, icono, plano, sinMarcas } from './util.js';
import { formularioHTML, CSS_FORM } from './form.js';
import { linkWhatsapp } from './telefono.js';
import { nivelesDe } from './secciones/evento.js';
import { JS_PAGINA, JS_EDICION, JS_MOVIMIENTO, ESCENAS } from './cliente.generado.js';

const TAMANOS = {
  ancho: '(min-width:1120px) 1080px, 100vw',
  retrato: '(min-width:920px) 460px, 100vw',
  tarjeta: '(min-width:1080px) 340px, (min-width:760px) 45vw, 100vw',
  avatar: '48px',
  // el logo (en la portada en lugar del título, en el pie y en la barra de arriba)
  logo: '(min-width:620px) 560px, 86vw',
  // una tarjeta ancha con la foto de fondo (quienes guían en retrato, las experiencias)
  mitad: '(min-width:1080px) 540px, (min-width:760px) 48vw, 100vw',
};

const BASE =
  '*,*::before,*::after{box-sizing:border-box}' +
  'html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:16px}' +
  'body{margin:0;background:var(--fondo);color:var(--texto);font-family:var(--f-txt);font-size:1.0625rem;line-height:1.6;' +
  '-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}' +
  'img,svg,video,iframe{max-width:100%}img{height:auto}a{color:inherit}' +
  '.w{width:100%;max-width:1120px;margin-inline:auto;padding-inline:clamp(20px,4vw,32px)}' +
  '.sec{padding-block:clamp(64px,9vw,120px)}.b-sup{background:var(--sup)}.b-ninguna{padding:0}' +
  // Una palabra más ancha que la pantalla (títulos en mayúsculas, "Internacionalización") se parte en vez de cortarse.
  'h1,h2,h3,.h1,.h2,.h3{font-family:var(--f-tit);color:var(--texto);text-wrap:balance;overflow-wrap:break-word}' +
  '.h1{font-size:clamp(2.3rem,6vw,4.4rem);line-height:1.04;letter-spacing:-.025em;font-weight:750;margin:0}' +
  '.h2{font-size:clamp(1.85rem,4.2vw,3rem);line-height:1.08;letter-spacing:-.02em;font-weight:720;margin:0}' +
  '.h3{font-size:clamp(1.12rem,1.6vw,1.3rem);line-height:1.25;font-weight:700;margin:0;letter-spacing:-.01em}' +
  '.h1.h1-l{font-size:clamp(2rem,4.8vw,3.5rem)}.h2.h2-l{font-size:clamp(1.65rem,3.5vw,2.5rem)}' +
  '.hl{font-style:normal;color:var(--acento)}' +
  '.ey{margin:0 0 14px;font-size:.78rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acento);display:inline-flex;align-items:center;gap:10px}' +
  '.ey::before{content:"";width:18px;height:2px;background:currentColor;border-radius:2px}' +
  '.lead{color:var(--suave);font-size:1.12rem;line-height:1.6;max-width:62ch;margin:14px 0 0}' +
  '.cab{margin-bottom:clamp(36px,5vw,56px);max-width:760px}.cab-c{margin-inline:auto;text-align:center}.cab-c .lead{margin-inline:auto}' +
  '.btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:58px;padding:16px 30px;border-radius:var(--r);border:0;' +
  'background:var(--pri);color:var(--sobre-pri);font:inherit;font-weight:750;font-size:1.06rem;letter-spacing:.005em;text-decoration:none;cursor:pointer;' +
  'box-shadow:0 14px 34px -14px var(--pri);transition:transform .16s ease,box-shadow .16s ease,filter .16s}' +
  '.btn:hover{transform:translateY(-1px);filter:brightness(1.06);box-shadow:0 18px 40px -14px var(--pri)}.btn:active{transform:translateY(0)}' +
  '.btn:focus-visible{outline:3px solid var(--acento);outline-offset:3px}.btn-f{transition:transform .16s}.btn:hover .btn-f{transform:translateX(3px)}' +
  '.btn-g{min-height:62px;font-size:1.1rem}.btn-full{width:100%}' +
  '.btn-sec{background:transparent;color:var(--texto);border:1px solid var(--linea);box-shadow:none;min-height:48px;padding:12px 20px;font-size:.95rem}' +
  '.btn-sec:hover{border-color:var(--texto);box-shadow:none}.btn .ic{width:20px;height:20px}' +
  '.nota{margin:12px 0 0;font-size:.86rem;color:var(--tenue)}.sec-acc{margin-top:clamp(36px,5vw,52px);display:flex;justify-content:center}.sec-acc .acc{align-items:center;margin:0}.sec-acc .nota,.cta-in .nota,.ct .nota,.hero-c .nota,.hero-v .nota,.of-p .nota,.fo-t .nota{text-align:center}' +
  '.tj{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(20px,2.6vw,28px)}' +
  '.g3{display:grid;gap:16px}@media(min-width:720px){.g3{grid-template-columns:repeat(2,1fr)}}@media(min-width:1040px){.g3{grid-template-columns:repeat(3,1fr);gap:20px}}' +
  '.acor{display:grid;gap:10px}.acor details{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r);overflow:hidden}' +
  '.acor summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:18px 20px;font-weight:650}.acor summary::-webkit-details-marker{display:none}' +
  '.acor summary>span:not(.tm-n){flex:1}.acor-i{width:20px;height:20px;flex:none;color:var(--tenue);transition:transform .2s}.acor details[open] .acor-i{transform:rotate(45deg)}' +
  '.acor details>p{margin:0;padding:0 20px 20px;color:var(--suave)}' +
  '.vid{position:relative;aspect-ratio:16/9;border-radius:var(--r-g);overflow:hidden;background:#000;border:1px solid var(--linea);box-shadow:0 40px 90px -40px rgba(0,0,0,.7)}' +
  '.vid>iframe,.vid>video{position:absolute;inset:0;width:100%;height:100%;border:0}' +
  // Código de inserción: manda su propio alto (VTurb y Wistia reservan el 16:9 con relleno); un iframe suelto va a 16:9.
  '.vid-raw{aspect-ratio:auto;min-height:200px}.vid-raw>*{width:100%}.vid-raw iframe{border:0;max-width:100%}' +
  '.vid-raw>iframe{position:static;display:block;height:auto;aspect-ratio:16/9}' +
  '.vid-f{all:unset;position:absolute;inset:0;cursor:pointer;display:block}.vid-f img{width:100%;height:100%;object-fit:cover;display:block}' +
  '.vid-p{position:absolute;left:50%;top:50%;width:78px;height:78px;margin:-39px 0 0 -39px;border-radius:50%;background:var(--pri);color:var(--sobre-pri);display:grid;place-items:center;' +
  'box-shadow:0 0 0 12px rgba(0,0,0,.25);transition:transform .2s}.vid-f:hover .vid-p{transform:scale(1.07)}.vid-p .ic{width:30px;height:30px;fill:currentColor;margin-left:4px}' +
  '.vid-pc{display:grid;place-items:center;align-content:center;gap:10px;background:var(--sup2)}.vid-pc-ic{width:44px;height:44px;color:var(--tenue)}' +
  '[data-retraso]:not(.ok){display:none}' +
  // Piezas que pintan varias secciones (botón con nota, chips del evento, puntos): van en la base porque la página de
  // gracias o una página sin portada también las usan.
  '.acc{margin-top:30px;display:flex;flex-direction:column;align-items:flex-start}' +
  '.evento{list-style:none;padding:0;margin:20px 0 0;display:flex;flex-wrap:wrap;gap:8px}' +
  '.evento li{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid var(--linea);border-radius:999px;background:var(--sup);font-size:.9rem;line-height:1.3}' +
  '.evento small{color:var(--tenue);font-size:.82em}.evento .hl-local:not(:empty){display:block;color:var(--acento)}' +
  '.evento .ic{width:17px;height:17px;color:var(--acento);flex:none}' +
  '.hero-pts{list-style:none;padding:0;margin:22px 0 0;display:grid;gap:10px}' +
  '.hero-pts li{display:flex;gap:10px;align-items:flex-start;line-height:1.45}' +
  '.hero-pts .ic{color:var(--acento);flex:none;width:21px;height:21px;margin-top:2px}' +
  '.tag-ret{display:inline-block;margin-bottom:10px;font-size:.75rem;padding:4px 10px;border-radius:999px;border:1px dashed var(--tenue);color:var(--suave)}' +
  '@media(max-width:620px){.acc{align-items:stretch}.acc .btn{width:100%}.acc .nota{text-align:center}}' +
  '.modal{border:0;padding:0;background:transparent;width:min(460px,calc(100vw - 24px));max-height:calc(100dvh - 24px);color:var(--texto)}' +
  '.modal::backdrop{background:rgba(0,0,0,.66);backdrop-filter:blur(4px)}' +
  // Navegadores sin <dialog> (iPhone con iOS anterior a 15.4): oculto hasta abrirlo y, abierto, fijo en pantalla.
  'dialog:not([open]){display:none}.modal-fijo{position:fixed;top:12px;left:0;right:0;margin:0 auto;z-index:99;overflow:auto;box-shadow:0 0 0 100vmax rgba(0,0,0,.66)}' +
  '.modal-c{position:relative;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,4vw,32px);box-shadow:0 40px 120px -30px rgba(0,0,0,.8)}' +
  '.modal-t{margin:0 34px 18px 0;font-family:var(--f-tit);font-weight:750;font-size:1.35rem;line-height:1.15}' +
  '.modal-x{position:absolute;top:10px;right:10px;width:38px;height:38px;border-radius:50%;border:0;background:transparent;color:var(--suave);font-size:26px;line-height:1;cursor:pointer}' +
  '.modal-x:hover{background:var(--sup2);color:var(--texto)}' +
  '.pc{display:inline-block;margin:6px 0;padding:6px 12px;border:1px dashed var(--acento);border-radius:var(--r);background:var(--pri-suave);color:var(--texto);font:600 .82rem/1.4 var(--f-txt);letter-spacing:0;text-transform:none;max-width:100%;overflow-wrap:anywhere}' +
  '.pc-sec{text-align:center;margin:0}' +
  '.img-pc{display:grid;place-items:center;gap:8px;min-height:220px;width:100%;border:1px dashed var(--tenue);border-radius:var(--r-g);background:var(--sup2);color:var(--suave);font-size:.85rem;text-align:center;padding:16px;aspect-ratio:4/3}' +
  '.img-pc .ic{width:34px;height:34px}.img-pc-s{min-height:0;width:44px;height:44px;padding:0;aspect-ratio:1;border-radius:50%}.img-pc-s span{display:none}.img-pc-s .ic{width:20px;height:20px}' +
  '@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}';

// Ajustes por estilo (body[data-estilo]).
const ESTILO_CSS =
  '[data-estilo=impacto] .h1,[data-estilo=impacto] .h2{text-transform:uppercase;font-weight:800;letter-spacing:-.005em;line-height:.95}' +
  // El mínimo del título en mayúsculas sale del tema (--imp-h1): 2,6rem con letras estrechas y menos con las anchas,
  // que a ese tamaño no caben en un celular con palabras largas ("AUTOMATIZACIÓN").
  '[data-estilo=impacto] .h1{font-size:clamp(var(--imp-h1,2.6rem),8.4vw,5.8rem)}[data-estilo=impacto] .h2{font-size:clamp(2rem,5.4vw,3.6rem)}' +
  '[data-estilo=impacto] .h1.h1-l{font-size:clamp(var(--imp-h1l,2.2rem),6vw,4.3rem)}[data-estilo=impacto] .h2.h2-l{font-size:clamp(1.8rem,4.4vw,3rem)}' +
  '@media(max-width:620px){[data-estilo=impacto] .btn{font-size:.95rem;letter-spacing:.02em}}' +
  '[data-estilo=impacto] .btn{text-transform:uppercase;letter-spacing:.04em;font-size:1rem}' +
  '[data-estilo=editorial] .h1,[data-estilo=editorial] .h2{font-weight:560;letter-spacing:-.015em}[data-estilo=editorial] .hl{font-style:italic}' +
  '[data-estilo=editorial] .ey::before{width:28px;height:1px}[data-estilo=editorial] .s-hero::before{opacity:.5}' +
  '[data-estilo=editorial] .tj{background:transparent}' +
  '[data-estilo=limpio] .tj{border-color:transparent}[data-estilo=limpio] .h1{letter-spacing:-.035em}';

// Contornos del modo edición (solo dentro del estudio).
export const EDICION_CSS =
  '[data-s]{position:relative;cursor:pointer}[data-s]:hover{outline:2px dashed color-mix(in srgb,var(--acento) 70%,transparent);outline-offset:-2px}' +
  // La sección elegida: marco firme y su nombre arriba a la izquierda (#ew-etq, lo pone el JS de edición). El texto o la
  // foto elegida dentro de ella lleva su propio marco (.ew-campo). Letra del sistema: no se carga ninguna para esto.
  '[data-s].ew-sel{outline:3px solid var(--acento);outline-offset:-3px}' +
  '#ew-etq{position:absolute;z-index:60;top:10px;left:10px;padding:4px 11px 4px 9px;border-radius:999px;background:#0b0b0d;color:#f5f8fd;' +
  'font:600 12px/1.35 system-ui,-apple-system,sans-serif;letter-spacing:0;text-transform:none;pointer-events:none;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 6px 18px rgba(0,0,0,.35)}' +
  '#ew-etq::before{content:"";display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:50%;background:var(--acento);vertical-align:1px}' +
  '.ew-campo{outline:2px dashed var(--acento);outline-offset:3px;border-radius:4px}' +
  '[data-s].ew-oculta{opacity:.35}[data-s].ew-oculta::after{content:"Oculta";position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:999px;background:#000;color:#fff;font:600 12px/1.4 system-ui}' +
  '[data-e]{cursor:text;border-radius:4px;transition:box-shadow .12s}[data-e]:hover{box-shadow:0 0 0 2px color-mix(in srgb,var(--acento) 55%,transparent)}' +
  '[data-e][contenteditable]{outline:none;box-shadow:0 0 0 2px var(--acento);background:color-mix(in srgb,var(--acento) 10%,transparent);text-transform:none!important}' +
  '.ew-var{display:inline-block;padding:0 .4em;margin:0 .1em;border-radius:6px;background:var(--pri-suave);border:1px dashed var(--acento);color:var(--acento);font-size:.7em;vertical-align:middle;text-transform:none;letter-spacing:0}' +
  '[data-img],[data-vid]{cursor:pointer}[data-img]:hover,[data-vid]:hover{outline:3px solid var(--acento);outline-offset:-3px}';

// Lo que hace el botón principal según la acción de la página.
function calcularCta(plan) {
  const c = plan.conversion || {};
  if (c.accion === 'formulario') return { href: '#registro', attrs: ' data-abrir-form' };
  if (c.accion === 'whatsapp') {
    // Solo con el código de país: un número viejo sin código («3001234567») no arma un wa.me que no existe (el estudio lo
    // pide en «Te faltan…» y al publicar se completa con el país de la marca si se sabe).
    const href = linkWhatsapp(c.whatsapp, sinMarcas(c.mensaje));
    return { href: href || '#', attrs: ' data-whatsapp target="_blank" rel="noopener"' };
  }
  if (c.accion === 'agenda') return { href: c.url || '#', attrs: ' data-agenda target="_blank" rel="noopener"' };
  // Entradas por nivel (motor/secciones/evento.js): con dos o más, el botón principal lleva a elegir la entrada; con
  // una sola, a su link si la página no tiene uno.
  const niveles = nivelesDe(plan);
  if (niveles.length >= 2) return { href: '#entradas', attrs: '' };
  if (!c.url && niveles.length === 1 && niveles[0].link) return { href: niveles[0].link, attrs: ' data-checkout' };
  return { href: c.url || '#', attrs: ' data-checkout' };
}

function crearImagen(o) {
  return (v, ruta, op = {}) => {
    const edicion = o.modo === 'edicion' ? ` data-img="${esc(o.sid() + ':' + ruta)}"` : '';
    if (pendiente(v)) {
      if (o.modo === 'publicado') return '';
      return `<div class="img-pc${op.tam === 'avatar' ? ' img-pc-s' : ''}"${edicion}>${icono('persona')}<span>Por completar: ${esc(v.porCompletar || 'una foto')}</span></div>`;
    }
    if (vacio(v)) return '';
    let src, srcset = '', ancho = 1200, alto = 900;
    if (typeof v === 'string') src = v;
    else if (v && v.ref && o.imagen) {
      const r = o.imagen(v.ref);
      if (!r) return o.modo === 'publicado' ? '' : `<div class="img-pc"${edicion}>${icono('persona')}<span>Foto no encontrada</span></div>`;
      ({ src, srcset = '', ancho = 1200, alto = 900 } = r);
    } else return '';
    const carga = op.prioridad ? ' fetchpriority="high"' : ' loading="lazy"';
    const set = srcset ? ` srcset="${esc(srcset)}" sizes="${TAMANOS[op.tam] || TAMANOS.ancho}"` : '';
    return `<img src="${esc(src)}"${set} width="${ancho}" height="${alto}" alt="${esc(sinMarcas(op.alt || ''))}" decoding="async"${carga}${edicion}>`;
  };
}

// `tipos`: ['hero', 'hero.centrado', 'hero+logo', …]. Las piezas '+algo' del CSS de una sección (lo que se agregó
// después de la primera versión del motor: el logo de la portada, el rótulo de los beneficios…) van solo si
// alguna sección de la página las usa, también en edición: así una página que no las usa se pinta igual que antes.
function cssSecciones(tipos, todas) {
  const lista = todas ? Object.keys(SECCIONES) : [...new Set(tipos.filter((x) => !/[.+]/.test(x)))];
  let css = '';
  for (const tipo of lista) {
    if (!propia(SECCIONES, tipo)) continue;
    const d = SECCIONES[tipo];
    css += d.css.base || '';
    for (const v of Object.keys(d.variantes)) if (d.css[v] && (todas || tipos.includes(tipo + '.' + v))) css += d.css[v];
    for (const k of Object.keys(d.css)) if (k.startsWith('+') && tipos.includes(tipo + k)) css += d.css[k];
  }
  return css;
}

// Las piezas extra que usa cada sección visible ('hero+logo'…): las declara la sección con extras(s, plan).
function extrasDe(plan, visibles) {
  const fuera = [];
  for (const s of visibles) {
    const d = propia(SECCIONES, s?.tipo) ? SECCIONES[s.tipo] : null;
    if (d && typeof d.extras === 'function') for (const x of d.extras(s, plan) || []) fuera.push(s.tipo + x);
  }
  return fuera;
}

// Las de las dos páginas (el estudio recarga la vista previa cuando cambian: traen CSS que la página no tenía).
export const extrasPagina = (plan) => [...new Set(extrasDe(plan, [...(plan?.secciones || []), ...(plan?.gracias?.secciones || [])].filter((s) => s && !s.oculta)))].sort();

function pixelHead(id) {
  return (
    `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};` +
    `if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];` +
    `s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');</script>`
  );
}

// Una sola sección (el editor la reemplaza en vivo sin recargar la vista previa).
export function renderSeccion(plan, s, o = {}) {
  const ctx = contexto(plan, o);
  return pintarSeccion(ctx, s);
}

function contexto(plan, o, t = null) {
  let sid = '';
  let tema = t;
  const modo = o.modo || 'publicado';
  const ctx = {
    modo, plan, cta: calcularCta(plan), get sid() { return sid; }, set sid(v) { sid = v; },
    // El tema de la página (solo lo piden las secciones con estilo propio).
    get tema() { return tema || (tema = resolverTemaPagina(plan.tema)); },
  };
  ctx.img = crearImagen({ modo, imagen: o.imagen, sid: () => sid });
  return ctx;
}

// Id de la sección en la página. Las anclas fijas (#registro, #oferta) son de la primera sección visible de su tipo: si
// la persona duplica el formulario, el segundo no repite el id.
function anclaDe(ctx, s, d) {
  if (!d.ancla) return s.id;
  const todas = (ctx.plan.secciones || []).concat(ctx.plan.gracias?.secciones || []).filter((x) => x && x.tipo === s.tipo);
  const primera = todas.find((x) => !x.oculta) || todas[0];
  return !primera || primera.id === s.id ? d.ancla : s.id;
}

function pintarSeccion(ctx, s) {
  if (!s || !propia(SECCIONES, s.tipo)) return '';
  const d = SECCIONES[s.tipo];
  if (s.oculta && ctx.modo !== 'edicion') return '';
  ctx.sid = s.id;
  let interior = '';
  try {
    interior = d.render(s, ctx);
  } catch (e) {
    interior = ctx.modo === 'publicado' ? '' : `<div class="w"><p class="pc">Esta sección tiene un error: ${esc(e.message)}</p></div>`;
  }
  if (!interior) return ctx.modo === 'edicion' ? `<section class="sec s-${s.tipo} ew-vacia" data-s="${esc(s.id)}" hidden></section>` : '';
  const ancla = anclaDe(ctx, s, d);
  const est = s.estilo ? estiloDeSeccion(ctx.tema, s.estilo, ctx.tema.coloresCon) : null;
  const clases = `sec s-${s.tipo} v-${s.variante} b-${d.banda}${est ? ' ' + est.clases : ''}${ctx.modo === 'edicion' && s.oculta ? ' ew-oculta' : ''}`;
  const edicion = ctx.modo === 'edicion' ? ` data-s="${esc(s.id)}" data-tipo="${s.tipo}"` : '';
  const estilo = est && est.estilo ? ` style="${esc(est.estilo)}"` : '';
  return `<section id="${esc(ancla)}" class="${clases}"${estilo}${edicion}>${interior}</section>`;
}

// CSS completo de un plan (el editor lo vuelve a mandar cuando cambia el tema).
export function cssPagina(plan, o = {}) {
  const t = resolverTemaPagina(plan.tema);
  return cssTemaPagina(t, o.rutaLetras || '/_f/');
}

export function renderPagina(plan, o = {}) {
  const modo = o.modo || 'publicado';
  const pagina = o.pagina === 'gracias' ? 'gracias' : 'principal';
  const secciones = pagina === 'gracias' ? plan.gracias?.secciones || [] : plan.secciones || [];
  const t = resolverTemaPagina(plan.tema);
  const p = t.plantilla || null;
  const ctx = contexto(plan, { ...o, modo }, t);
  const personal = tienePropios(plan);
  const visibles = secciones.filter((s) => s && propia(SECCIONES, s.tipo) && (!s.oculta || modo === 'edicion'));
  const cuerpo = visibles.map((s) => pintarSeccion(ctx, s)).join('');

  const usaForm = plan.conversion?.accion === 'formulario' && pagina === 'principal';
  ctx.sid = 'modal';
  const modal = usaForm
    ? `<dialog class="modal" id="ew-modal" aria-label="Formulario de registro"><div class="modal-c"><button class="modal-x" type="button" data-cerrar aria-label="Cerrar">×</button>` +
      `<p class="modal-t">${sinMarcas(plan.conversion.boton) ? plano(ctx, plan.conversion.boton) : 'Reserva tu cupo'}</p>${formularioHTML(ctx, { id: 'fm' })}</div></dialog>`
    : '';

  const tipos = visibles.map((s) => s.tipo).concat(visibles.map((s) => s.tipo + '.' + s.variante), extrasDe(plan, visibles));
  // Con una plantilla moderna el estilo (impacto, editorial, limpio) lo pone la plantilla: su CSS va después del clásico.
  const css =
    `<style id="ew-tema">${cssTemaPagina(t, o.rutaLetras || '/_f/')}</style>` +
    `<style id="ew-base">${BASE}${p ? '' : ESTILO_CSS}${CSS_FORM}${cssSecciones(tipos, modo === 'edicion')}${p ? cssPlantilla(p, tipos, modo === 'edicion', personal) : ''}${personal ? cssPersonal() : ''}` +
    `${modo === 'edicion' ? EDICION_CSS : ''}</style>`;

  // Título y descripción van en <title> y en metas: sin marcas "[[POR COMPLETAR]]" (no hay dónde mostrar el aviso).
  const titulo = sinMarcas(plan.seo?.titulo) || sinMarcas(plan.marca?.nombre) || 'Página';
  const desc = sinMarcas(plan.seo?.descripcion);
  const rutaLetras = o.rutaLetras || '/_f/';
  const precarga = precargaPagina(plan, t)
    .map((a) => `<link rel="preload" href="${rutaLetras}${a}" as="font" type="font/woff2" crossorigin>`)
    .join('');
  const config = {
    modo,
    pagina: o.paginaId || '',
    gracias: o.rutaGracias || '/gracias',
    lead: o.rutaLead || '/api/lead',
    visita: o.rutaVisita || '/api/v',
    tipoPagina: pagina,
  };
  // Edición: dónde arranca la vista previa al recargarse (motor/cliente/edicion.js).
  if (modo === 'edicion' && o.scroll > 0) config.scroll = Math.round(o.scroll);
  // Movimiento de la plantilla: solo en publicado y vista (en edición y en miniaturas la página queda quieta).
  const mv = p && modo !== 'edicion' && !o.quieto ? movimientoDe(p) : null;
  if (mv) config.mv = mv;
  const head =
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">` +
    `<title>${esc(pagina === 'gracias' ? 'Gracias · ' + titulo : titulo)}</title>` +
    (desc ? `<meta name="description" content="${esc(desc)}">` : '') +
    `<meta property="og:title" content="${esc(titulo)}">` +
    (desc ? `<meta property="og:description" content="${esc(desc)}">` : '') +
    (o.ogImagen ? `<meta property="og:image" content="${esc(o.ogImagen)}">` : '') +
    `<meta property="og:type" content="website"><meta name="theme-color" content="${t.colores.fondo}">` +
    (modo !== 'publicado' || pagina === 'gracias' ? '<meta name="robots" content="noindex">' : '') +
    (o.favicon ? `<link rel="icon" href="${esc(o.favicon)}">` : '') +
    precarga +
    css +
    (modo === 'publicado' && plan.pixel?.meta ? pixelHead(plan.pixel.meta) : '');

  const escena = mv && mv.escena && propia(ESCENAS, mv.escena) ? ESCENAS[mv.escena] : '';
  const scripts =
    `<script>window.__EW=${JSON.stringify(config).replace(/</g, '\\u003c')};${JS_PAGINA}</script>` +
    (mv ? `<script>${escena}${JS_MOVIMIENTO}</script>` : '') +
    (modo === 'edicion' ? `<script>${JS_EDICION}</script>` : '');
  const plantilla = p ? ` data-plantilla="${p.id}"` : '';
  return `<!doctype html><html lang="es"><head>${head}</head><body data-estilo="${t.estilo}"${plantilla}>${cuerpo}${modal}${scripts}</body></html>`;
}
