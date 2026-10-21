// Colores propios: cada persona personaliza su página a su gusto. Puro: corre en el navegador y en Node. Cómo se usan:
// reference/colores-y-cambios.md de la skill.
//
// En el tema de una página hay dos juegos de colores:
//   tema.colores  los de la MARCA: cada plantilla los adapta a su diseño (NÁCAR los lleva a marfil, PENUMBRA a la noche…)
//   tema.propios  los que la PERSONA eligió para esta página (en el chat o en Tema): { fondo?, texto?, primario?, acento? }.
//                 Se respetan tal cual en las 5 plantillas; cada una conserva su identidad (efectos, escena, letras,
//                 formas) adaptada a ese fondo. Lo que falta lo sigue decidiendo la plantilla.
// Y en una sección, seccion.estilo = { fondo?, texto?, titulo?, primario?, acento? }: los colores solo de esa sección (van
// como variables CSS en su <section>, así que valen en la vista previa, en la página publicada y con Deshacer).
//
// Siempre legible: un texto que no llega a contraste AA (4,5:1) se ajusta en el MISMO tono (solo cambia la luz); si para
// leerse tiene que cambiar mucho, se usa el más cercano que se lee y notasColores() lo cuenta en una línea. El botón va
// del color pedido, con su texto (blanco o casi negro) siempre legible encima.
import { hexValido, hex, rgb, contraste, mezclar, mejorExtremo, asegurar, derivarColores } from '../tema.js';
import { aHsl, deHsl } from './color.js';

export const CLAVES_COLOR = ['fondo', 'texto', 'primario', 'acento'];
export const CLAVES_ESTILO = ['fondo', 'texto', 'titulo', 'primario', 'acento'];

// { clave: '#rrggbb' } con solo los colores válidos de `claves`; null si no hay ninguno.
export function leerColores(o, claves = CLAVES_COLOR) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const fuera = {};
  for (const k of claves) if (hexValido(o[k])) fuera[k] = hex(rgb(o[k]));
  return Object.keys(fuera).length ? fuera : null;
}

// ¿La página tiene algo propio (colores de la página o estilo en alguna sección)? Con algo propio el motor agrega el CSS
// que hace falta para respetarlo (cssPersonal); sin nada, la página se pinta byte a byte como antes.
export function tienePropios(plan) {
  if (leerColores(plan?.tema?.propios)) return true;
  const hay = (l) => Array.isArray(l) && l.some((s) => s && leerColores(s.estilo, CLAVES_ESTILO));
  return hay(plan?.secciones) || hay(plan?.gracias?.secciones);
}

// ¿Es claro? (el texto que más se lee encima es el negro)
export const esClaro = (fondo) => mejorExtremo(fondo) === '#000000';

// El color `c` moviendo solo su luz (mismo tono y saturación) hasta contrastar `minimo` contra todos los `fondos`: la
// luz más cercana a la de `c` que llega. Si ninguna llega, la que más se acerca (o blanco o negro, si contrastan más).
export function legible(c, fondos, minimo = 4.5) {
  const lista = (Array.isArray(fondos) ? fondos : [fondos]).filter(hexValido);
  const peor = (x) => Math.min(...lista.map((f) => contraste(x, f)));
  if (!lista.length || peor(c) >= minimo) return c;
  const [t, s, l] = aHsl(c);
  let mejor = c;
  for (let k = 1; k <= 100; k++) {
    for (const x of [deHsl(t, s, l - k * 0.01), deHsl(t, s, l + k * 0.01)]) {
      const p = peor(x);
      if (p >= minimo) return x;
      if (p > peor(mejor)) mejor = x;
    }
  }
  for (const x of ['#000000', '#ffffff']) if (peor(x) > peor(mejor)) mejor = x;
  return mejor;
}

// ¿El color pintado se aleja tanto del pedido que hay que contarlo? (un dorado que pasa a mostaza oscura no: es el mismo
// tono un poco más hondo; un blanco que pasa a negro, sí)
export const cambioNotable = (pedido, pintado) => contraste(pedido, pintado) >= 2.2;

// Texto encima de un color: blanco o casi negro (el que más contraste; si ninguno llega a 4,5, negro).
export function sobreDe(c, oscuro = '#0a0a0a') {
  const b = contraste(c, '#ffffff');
  const n = contraste(c, oscuro);
  if (b >= n) return b >= 4.5 || contraste(c, '#000000') < b ? '#ffffff' : '#000000';
  return n >= 4.5 ? oscuro : '#000000';
}

// Una superficie (tarjeta, vidrio) sobre `fondo`: `fondo` mezclado con `hacia` en `k`. Si así el texto ya no se lee (un
// fondo de tono medio, como un rojo o un gris, deja poco margen), va para el otro lado: tarjetas un poco más hondas bajo un
// texto blanco, o más claras bajo uno negro.
export function superficie(fondo, hacia, k, texto) {
  const s = mezclar(fondo, hacia, k);
  if (!texto || contraste(texto, s) >= 4.6) return s;
  const otro = mezclar(fondo, contraste(texto, '#000000') > contraste(texto, '#ffffff') ? '#000000' : '#ffffff', k);
  return contraste(texto, otro) > contraste(texto, s) ? otro : s;
}

// ---------- la Clásica con colores propios ----------

// Los tokens de la Clásica con los colores de la persona: el fondo, los botones y los resaltados tal cual (el texto y los
// resaltados con AA en su mismo tono). Lo que no eligió sale de la marca, como siempre.
export function coloresClasica(colores = {}, modo, propios = {}) {
  const base = derivarColores({ ...(colores || {}), ...propios }, modo);
  const { fondo } = base;
  const oscuro = !esClaro(fondo);
  const lado = oscuro ? '#ffffff' : '#000000';
  // Sin texto propio sobre un fondo propio, el texto de la marca va casi negro o casi blanco (como la plantilla).
  let texto = propios.texto ? legible(propios.texto, [fondo], 4.5) : asegurar(base.texto, fondo, propios.fondo ? 12 : 7, lado);
  const sup = superficie(fondo, texto, oscuro ? 0.045 : 0.035, texto);
  const sup2 = superficie(fondo, texto, oscuro ? 0.085 : 0.065, texto);
  const debajo = [fondo, sup, sup2];
  texto = legible(texto, debajo, 4.5);
  const primario = propios.primario || base.primario;
  const primarioSuave = mezclar(fondo, primario, oscuro ? 0.16 : 0.1);
  return {
    ...base,
    sup,
    sup2,
    linea: mezclar(fondo, texto, oscuro ? 0.13 : 0.12),
    texto,
    suave: legible(mezclar(texto, fondo, 0.3), debajo, 4.6),
    tenue: legible(mezclar(texto, fondo, 0.48), debajo, 4.5),
    primario,
    sobrePrimario: sobreDe(primario),
    primarioSuave,
    acento: legible(propios.acento || base.acento, [...debajo, primarioSuave], 4.5),
    error: legible(oscuro ? '#ff6b6b' : '#d92d20', [sup2, fondo], 4.5),
    oscuro,
  };
}

// ---------- estilos por sección ----------

// Qué tokens cambian con cada color de la sección (sin fondo propio, solo esos: "el botón rojo" no toca los brillos ni
// el texto). Con fondo propio cambia todo lo que dependa de él.
// (PRISMA: el botón es un degradado con sus puntas pri-a y pri-c, y los resaltados otro, hl-a → hl-c, con su versión
// para las secciones claras y las tarjetas oscuras.)
const GRUPOS = {
  primario: ['primario', 'sobrePrimario', 'primarioSuave', 'pri-txt', 'pri-tinta', 'pri-2', 'sobre-pri-suave', 'pri-a', 'pri-c'],
  acento: ['acento', 'hl-a', 'hl-c', 'alt-hl-a', 'alt-hl-c', 'osc-hl', 'osc-acento'],
  texto: ['texto', 'suave', 'tenue'],
};
const VARIABLE = { fondo: 'fondo', sup: 'sup', sup2: 'sup2', linea: 'linea', texto: 'texto', suave: 'suave', tenue: 'tenue', error: 'error', primario: 'pri', sobrePrimario: 'sobre-pri', primarioSuave: 'pri-suave', acento: 'acento' };

// Los tokens de una sección con estilo. `t` = el tema de la página (resolverTemaPagina) y `colores(propios)` la función
// que da los tokens de su plantilla con esos colores propios. → { estilo: 'texto del atributo style', clases } o null.
export function estiloDeSeccion(t, estilo, colores) {
  const e = leerColores(estilo, CLAVES_ESTILO);
  if (!e) return null;
  const pagina = t.colores;
  const vars = {};
  const clases = ['ew-est'];
  const { titulo, ...resto } = e;
  let fondoSeccion = pagina.fondo;
  if (Object.keys(resto).length) {
    const c = colores({ ...(t.propios || {}), ...resto });
    const todos = { ...c, ...(c.extra || {}) };
    const deLaPagina = { ...pagina, ...(pagina.extra || {}) };
    const claves = resto.fondo
      ? Object.keys(todos).filter((k) => k !== 'extra' && k !== 'oscuro')
      : [...new Set(Object.keys(resto).flatMap((k) => GRUPOS[k] || []))];
    for (const k of claves) {
      const v = todos[k];
      if (typeof v !== 'string' || !hexValido(v)) continue;
      if (v === deLaPagina[k] && !k.startsWith('pri-')) continue;
      vars[VARIABLE[k] || k] = v;
    }
    if (resto.fondo) {
      clases.push('ew-est-f');
      if (c.oscuro !== pagina.oscuro) vars['color-scheme'] = c.oscuro ? 'dark' : 'light';
    }
    fondoSeccion = c.fondo;
  }
  if (titulo) {
    clases.push('ew-est-t');
    vars.titulo = legible(titulo, [fondoSeccion], 4.5);
  }
  // Una sección con su propio fondo o su propio color de botón no lleva la escena WebGL (su respaldo en CSS ya toma estos
  // colores): la escena pinta con los de la página.
  if (resto.fondo || resto.primario || resto.acento) clases.push('ew-est-x');
  const texto = Object.entries(vars).map(([k, v]) => (k === 'color-scheme' ? `color-scheme:${v}` : `--${k}:${v}`)).join(';');
  return { estilo: texto, clases: clases.join(' ') };
}

// CSS que se agrega cuando la página tiene algo propio (va después del de la plantilla). Las secciones con estilo pintan
// su fondo y su texto con sus variables; el título, del color pedido (sus resaltados conservan el suyo: en VOLTAJE van
// sobre la franja del primario).
export const CSS_ESTILOS =
  '.ew-est{color:var(--texto)}.ew-est-f{background-color:var(--fondo)!important}' +
  '.ew-est-t :is(.h1,.h2){color:var(--titulo)!important;-webkit-text-fill-color:var(--titulo)}' +
  '.ew-est-t :is(.h1,.h2) .hl{-webkit-text-fill-color:currentColor}';

// Recorre las reglas más internas del CSS compacto (selector{declaraciones}, también dentro de @media y @keyframes) y
// cambia sus declaraciones con fn(selector, declaraciones).
export function porRegla(css, fn) {
  return css.replace(/([^{}]*)\{([^{}]*)\}/g, (todo, sel, decl) => sel + '{' + fn(sel, decl) + '}');
}

// ---------- lo que se cuenta en el chat ----------

const NOMBRE_CLAVE = { fondo: 'el fondo', texto: 'el texto', titulo: 'el título', primario: 'el botón', acento: 'los resaltados' };

// Lo que hubo que ajustar para que se lea, en una línea (o ''): compara lo pedido con lo que se pinta.
//   pedidos: { clave: '#hex' } · pintados: { clave: '#hex' }
export function notasColores(pedidos = {}, pintados = {}) {
  const cambiados = Object.keys(pedidos).filter((k) => k !== 'fondo' && k !== 'primario' && pintados[k] && hexValido(pedidos[k]) && cambioNotable(pedidos[k], pintados[k]));
  if (!cambiados.length) return '';
  const quien = cambiados.map((k) => NOMBRE_CLAVE[k] || k);
  const lista = quien.length === 1 ? quien[0] : quien.slice(0, -1).join(', ') + ' y ' + quien[quien.length - 1];
  return `Ojo: ${lista} no se leía${quien.length > 1 ? 'n' : ''} con esos colores, así que ${quien.length > 1 ? 'los dejé' : 'lo dejé'} en el tono más parecido que sí se lee.`;
}
