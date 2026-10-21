// Plantillas modernas del motor: cómo se VE una página (letras, tonos, CSS de cada sección, movimiento y escena WebGL)
// sin cambiar QUÉ dice. Puro: corre en el navegador (estudio) y en el Worker (al publicar). El plan elige una con
// `plan.tema.plantilla`; 'clasica' (o un plan viejo sin el campo) es el diseño de siempre y se pinta byte a byte igual.
//
// ── Contrato de una plantilla ─────────────────────────────────────────────────────────────────────────────────────────
// Agregar una plantilla = 3 archivos + una línea aquí, sin tocar render.js:
//   motor/plantillas/<id>.js        la ficha y su lógica (export default, campos de abajo)
//   motor/plantillas/<id>.css.js    su CSS por sección (lo importa <id>.js)
//   motor/cliente/escena-<id>.js    su escena WebGL (opcional; se compila (esbuild) en ESCENAS[<id>])
// y registrarla en PLANTILLAS (abajo) con `lista: true` cuando esté terminada (con `lista: false` se ve "Próximamente" en
// el estudio, la IA no la elige y normalizarPlan la cambia por 'clasica').
//
//   id, nombre                 'nacar', 'Nácar'
//   descripcion                una línea para la persona (español neutro, tuteo)
//   mejorPara                  tipos de página donde mejor va (registro, vsl, ventas, local)
//   cuando                     una línea para la IA: con qué público y marca elegirla
//   modo                       'claro' | 'oscuro': el que pinta la plantilla (los colores de la marca se adaptan a él)
//   letras                     { titulos, texto, acento, rotulos? }: ids de LETRAS (letras.js). `acento` es la letra
//                              de los resaltados (.hl); `rotulos` (opcional) una tercera letra para etiquetas (--f-rot), que
//                              se queda aunque la persona elija una pareja en Tema (ganan sus letras de títulos y texto).
//   lista                      true cuando se puede elegir
//   colores(base, tema)        de los colores de la marca (base = derivarColores de tema.js) a los tokens de la página:
//                              { fondo, sup, sup2, linea, texto, suave, tenue, error, primario, sobrePrimario,
//                                primarioSuave, acento, oscuro, extra: { 'nombre-token': '#hex' } }. Todo texto con
//                              contraste AA medido.
//   css                        { base, secciones: { <tipo>: { base, <variante>: '' } }, fin }: CSS ya compacto. Va DESPUÉS
//                              del CSS clásico (lo pisa): una sección sin CSS propio se ve clásica con los tokens de la
//                              plantilla. Reglas: nada oculto sin JS (lo que se mueve va bajo `.ew-mv`, que pone el JS de
//                              movimiento solo cuando corre); nada que desborde a lo ancho; en edición no hay `.ew-mv`
//                              (todo queda quieto, visible y clicable).
//   cssLegal                   (opcional) CSS extra para privacidad y términos
//   movimiento                 (opcional) qué hace el JS compartido (motor/cliente/movimiento.js) en esta plantilla:
//                              { revelar, pila, ruedas, reloj, progreso, carrusel, telon, barra, anclas } (ver allí)
//   escena                     (opcional) id de la escena WebGL: motor/cliente/escena-<id>.js registra
//                              window.__ewEscena(api); el JS de movimiento la arranca después de la primera pintura, en
//                              tiempo libre, y nunca con movimiento reducido, ahorro de datos o 2G.
//   precarga(plan, t)          (opcional) archivos de letras extra para precargar (los de títulos y texto ya van)
//   propios(base, tema, P)     los tokens con los colores propios de la persona (P = { fondo?, texto?, primario?,
//                              acento? }, de tema.propios o de seccion.estilo): los pedidos tal cual (el texto y los
//                              resaltados con AA en su mismo tono) y la identidad de la plantilla adaptada a ese fondo
//                              (claro u oscuro). Ver propios.js.
//   cssPropios(css)            (opcional) el CSS de la plantilla cuando la página tiene algo propio: lo que era un color
//                              fijo pasa a variables (vidrio, sombras, el primario como texto). Sin nada propio no corre.
//
// Letras: al elegir una plantilla el plan queda con `tema.letras = ''` (las de la plantilla). Si después la persona elige
// una pareja en Tema, ganan las suyas (títulos y texto; los resaltados usan su letra de títulos). Estilo y bordes los
// define la plantilla (no se aplican). El modo lo define la plantilla; el del plan se guarda para volver a 'clasica'.
import { LETRAS } from '../letras.js';
import { PAREJAS, resolverTema, cssTema, esperaLetra } from '../tema.js';
import { leerColores, coloresClasica, CSS_ESTILOS } from './propios.js';
import nacar from './nacar.js';
import penumbra from './penumbra.js';
import voltaje from './voltaje.js';
import prisma from './prisma.js';

const propia = (o, k) => typeof k === 'string' && !!o && Object.hasOwn(o, k);

export const PLANTILLAS = {
  clasica: {
    id: 'clasica',
    nombre: 'Clásica',
    descripcion: 'La de siempre: sobria, rápida y a tu gusto con estilos, bordes y modo claro u oscuro.',
    mejorPara: ['registro', 'vsl', 'ventas', 'local'],
    cuando: 'Comodín seguro: marcas que ya tienen una identidad fuerte (paleta y letras propias) o que piden algo sobrio y directo, y cualquier VSL donde lo único que importa es el video.',
    modo: null,
    letras: null,
    lista: true,
  },
  nacar,
  penumbra,
  voltaje,
  prisma,
};

export const ID_PLANTILLAS = Object.keys(PLANTILLAS);

// Las que se pueden elegir hoy (la IA solo elige entre estas).
export const plantillasListas = () => ID_PLANTILLAS.filter((id) => PLANTILLAS[id].lista);

// Id válido para guardar en el plan: una plantilla que existe y está lista; si no, 'clasica'.
export function plantillaValida(id) {
  return propia(PLANTILLAS, id) && PLANTILLAS[id].lista ? id : 'clasica';
}

// La plantilla moderna de un tema (o null si es la clásica, no existe o todavía no está lista).
export function plantillaDe(tema) {
  const id = tema && typeof tema === 'object' ? tema.plantilla : null;
  if (!propia(PLANTILLAS, id) || id === 'clasica') return null;
  const p = PLANTILLAS[id];
  return p.lista && p.css && typeof p.colores === 'function' ? p : null;
}

// Tema listo para pintar con su plantilla: como resolverTema(), con los tokens y las letras de la plantilla.
// t.plantilla = la plantilla (o null) · t.acento = la letra de los resaltados · t.rotulos = la de las etiquetas (o null).
// t.propios = los colores propios de la página (o null) · t.coloresCon(P) = los tokens con esos colores propios (los usan
// las secciones con estilo).
export function resolverTemaPagina(tema = {}) {
  const t = resolverTema(tema);
  const p = plantillaDe(tema);
  const propios = leerColores(tema?.propios);
  if (!p) {
    const coloresCon = (P) => coloresClasica(tema?.colores, tema?.modo, P || {});
    return propios ? { ...t, colores: coloresCon(propios), propios, coloresCon } : { ...t, propios: null, coloresCon };
  }
  const elegida = propia(PAREJAS, tema.letras) ? PAREJAS[tema.letras] : null;
  const titulos = LETRAS[elegida ? elegida.titulos : p.letras.titulos];
  const texto = LETRAS[elegida ? elegida.texto : p.letras.texto];
  const acento = elegida ? titulos : LETRAS[p.letras.acento] || titulos;
  const rotulos = (p.letras.rotulos && LETRAS[p.letras.rotulos]) || null;
  const pareja = elegida || { nombre: p.nombre, titulos: p.letras.titulos, texto: p.letras.texto, estilo: t.estilo };
  const coloresCon = (P) => (typeof p.propios === 'function' ? p.propios(t.colores, tema, P || {}) : p.colores(t.colores, tema));
  const colores = propios ? coloresCon(propios) : p.colores(t.colores, tema);
  return { ...t, colores, pareja, titulos, texto, acento, ...(rotulos ? { rotulos } : {}), plantilla: p, letrasPropias: !elegida, propios, coloresCon };
}

// Variables CSS (:root) y caras de letra de una página. Con la clásica es exactamente cssTema().
export function cssTemaPagina(t, rutaLetras = '/_f/') {
  if (!t.plantilla) return cssTema(t, rutaLetras);
  const c = t.colores;
  const caras = [];
  const vistas = new Set();
  for (const l of [t.titulos, t.texto, t.acento, t.rotulos]) {
    if (!l || vistas.has(l.archivo)) continue;
    vistas.add(l.archivo);
    caras.push(`@font-face{font-family:"${l.familia}";src:url(${rutaLetras}${l.archivo}) format("woff2");font-weight:${l.pesos};font-style:${l.estilo || 'normal'};font-display:${esperaLetra(l, t)}}${l.respaldo}`);
  }
  const extra = Object.entries(c.extra || {}).map(([k, v]) => `--${k}:${v};`).join('');
  const acento = t.acento || t.titulos;
  return (
    caras.join('') +
    `:root{--fondo:${c.fondo};--sup:${c.sup};--sup2:${c.sup2};--linea:${c.linea};--texto:${c.texto};--suave:${c.suave};` +
    `--tenue:${c.tenue};--error:${c.error};--pri:${c.primario};--sobre-pri:${c.sobrePrimario};--pri-suave:${c.primarioSuave};--acento:${c.acento};` +
    `--f-tit:${t.titulos.pila};--f-txt:${t.texto.pila};--f-acento:${acento.pila};--estilo-acento:${acento.estilo || 'normal'};` +
    `--r:${t.radio[0]}px;--r-g:${t.radio[1]}px;${t.rotulos ? `--f-rot:${t.rotulos.pila};` : ''}${extra}color-scheme:${c.oscuro ? 'dark' : 'light'}}`
  );
}

// CSS de la plantilla para las secciones usadas (`tipos`: ['hero', 'hero.evento', …]) o para todas (edición). Con
// `personal` (la página tiene colores propios o estilos por sección) pasa por cssPropios de la plantilla.
export function cssPlantilla(p, tipos = [], todas = false, personal = false) {
  const css = p.css || {};
  const secciones = css.secciones || {};
  let fuera = CSS_COMUN + (css.base || '');
  const usados = todas ? Object.keys(secciones) : [...new Set(tipos.filter((x) => !/[.+]/.test(x)))];
  for (const tipo of usados) {
    if (!propia(secciones, tipo)) continue;
    const d = secciones[tipo];
    fuera += d.base || '';
    // '+algo': una pieza que solo va si la página la usa (también en edición; ver cssSecciones en render.js).
    for (const v of Object.keys(d)) if (v !== 'base' && (v.startsWith('+') ? tipos.includes(tipo + v) : todas || tipos.includes(tipo + '.' + v))) fuera += d[v];
  }
  fuera += css.fin || '';
  if (personal && typeof p.cssPropios === 'function') fuera = p.cssPropios(fuera);
  // Pase lo que pase con el CSS de la plantilla, el botón retrasado de una VSL no se ve antes de tiempo.
  return fuera + '[data-retraso]:not(.ok){display:none!important}';
}

// Lo que se agrega al final del CSS de una página con algo propio (las secciones con estilo), con cualquier plantilla.
export const cssPersonal = () => CSS_ESTILOS;

// Archivos de letras a precargar: títulos y texto, más lo que pida la plantilla.
export function precargaPagina(plan, t) {
  const base = [t.titulos.archivo, t.texto.archivo];
  if (t.plantilla && typeof t.plantilla.precarga === 'function') base.push(...t.plantilla.precarga(plan, t));
  return [...new Set(base.filter(Boolean))];
}

// Lo que el JS de movimiento necesita saber de la plantilla (va en window.__EW.mv). null = sin movimiento.
export function movimientoDe(p) {
  if (!p || !p.movimiento) return null;
  return { ...p.movimiento, escena: p.escena || '' };
}

// Piezas que agrega el JS de movimiento (motor/cliente/movimiento.js), iguales en todas las plantillas. Todo lo que
// oculta o mueve va bajo .ew-mv (lo pone ese JS al correr): sin JS, con el JS roto o en edición, nada queda escondido.
// Cada plantilla las viste a su gusto.
const CSS_COMUN =
  '.ew-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}' +
  '.ew-mv .ew-rv{opacity:0;transform:translateY(26px);transition:opacity 1s var(--ease,ease),transform 1s var(--ease,ease);transition-delay:calc(var(--d,0)*90ms)}' +
  '.ew-mv .ew-rv.ew-visto{opacity:1;transform:none}' +
  '.ew-odo{display:inline-flex;align-items:baseline;white-space:nowrap}.ew-dg{display:inline-block;height:1em;overflow:hidden;line-height:1;vertical-align:baseline}' +
  '.ew-tira{display:flex;flex-direction:column;transform:translateY(calc(var(--v,0)*-1em));transition:transform 1.1s var(--ease,ease);transition-delay:calc(var(--k,0)*70ms)}' +
  '.ew-tira b{display:block;height:1em;font-weight:inherit;text-align:center}' +
  '.ew-barra{position:fixed;z-index:60;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateY(160%);transition:transform .6s var(--ease,ease);display:none}' +
  '.ew-barra .btn{width:100%}.ew-barra:not(.ew-on){visibility:hidden;transition:transform .6s var(--ease,ease),visibility 0s .6s}' +
  '.ew-barra.ew-on{transform:none}@media(max-width:899px){.ew-mv .ew-barra{display:block}}' +
  '.ew-car{display:flex;align-items:center;gap:12px}.ew-car-b{width:46px;height:46px;border-radius:50%;cursor:pointer;display:grid;place-items:center;font:inherit;color:inherit}' +
  '.ew-car-b:disabled{opacity:.35;cursor:default}' +
  '@media print{.ew-mv .ew-rv{opacity:1!important;transform:none!important}.ew-barra{display:none!important}}' +
  '@media(prefers-reduced-motion:reduce){.ew-mv .ew-rv{opacity:1;transform:none}.ew-tira{transition:none}}';
