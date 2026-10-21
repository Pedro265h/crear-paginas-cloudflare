// Ayudas que comparten todas las secciones. Puro: sin DOM.
//
// ctx (lo arma render.js):
//   modo      'publicado' | 'vista' | 'edicion'
//   plan      el plan completo (§5 del diseño)
//   sid       id de la sección que se está pintando
//   img(v,o)  pinta una imagen (o '' si no hay)
//   cta       { href, attrs } de la acción principal de la página

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function pendiente(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v) && 'porCompletar' in v;
}

export function vacio(v) {
  if (v == null || pendiente(v)) return true;
  if (typeof v === 'string') return !v.trim();
  if (Array.isArray(v)) return v.every(vacio);
  if (typeof v === 'object') return Object.values(v).every(vacio);
  return false;
}

// ¿Se ve algo de este valor? En publicado lo pendiente no se ve; en vista y edición sí (como aviso).
export function visible(ctx, v) {
  if (pendiente(v)) return ctx.modo !== 'publicado';
  return !vacio(v);
}

function atributoEdicion(ctx, ruta) {
  return ctx.modo === 'edicion' ? ` data-e="${esc(ctx.sid + ':' + ruta)}"` : '';
}

// Aviso de "por completar" (solo vista/edición).
export function aviso(ctx, v, ruta) {
  if (ctx.modo === 'publicado') return '';
  const que = (pendiente(v) && v.porCompletar) || 'Completa este campo';
  return `<span class="pc"${atributoEdicion(ctx, ruta)} data-pc>${esc('Por completar: ' + que)}</span>`;
}

// Énfasis dentro de un texto: **así** va en negrita (el color del texto fuerte) y *así*
// resaltado (como la frase resaltada de los títulos). Sin espacio pegado a los asteriscos de adentro y en una sola línea:
// un asterisco suelto («Cupos limitados*») o «2 * 3» quedan tal cual. En edición cada pieza recuerda su marca (data-md):
// motor/cliente/edicion.js la vuelve a escribir al guardar lo que cambió la persona.
export const NEGRITA = /\*\*(?=[^\s*])([^*\n]*?[^\s*])\*\*/g;
export const RESALTADO_EN_TEXTO = /(^|[^*\p{L}\p{N}])\*(?=[^\s*])([^*\n]*?[^\s*]|[^\s*])\*(?![*\p{L}\p{N}])/gu;
function enfasis(html, ed) {
  if (!html.includes('*')) return html;
  const md = (m) => (ed ? ` data-md="${m}"` : '');
  return html
    .replace(NEGRITA, (x, t) => `<strong${md('**')}>${t}</strong>`)
    .replace(RESALTADO_EN_TEXTO, (x, antes, t) => `${antes}<em class="hl"${md('*')}>${t}</em>`);
}
// Un texto sin sus marcas de énfasis (para atributos, títulos de pestaña y para contar).
export function sinEnfasis(v) {
  return typeof v === 'string' && v.includes('*') ? v.replace(NEGRITA, '$1').replace(RESALTADO_EN_TEXTO, '$1$2') : v;
}

// Texto con saltos de línea (\n) convertidos en <br> y su énfasis (**negrita**, *resaltado*). ed: en edición.
function multilinea(s, ed = false) {
  return enfasis(esc(s), ed).replace(/\n/g, '<br>');
}

// "[[POR COMPLETAR: …]]" dentro de un texto: en publicado se quita; en vista y edición se ve como aviso.
export const MARCA_EN_TEXTO = /\[\[\s*POR COMPLETAR\s*:?\s*([^\]]*?)\s*\]\]/gi;

// HTML ya escapado (de esc, multilinea o resaltar) → el texto que escribió la persona.
function desescapar(html) {
  return html.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

// Recibe HTML ya escapado: la marca que encuentra ya viene escapada, así que el atributo se arma con su texto real
// (escapado una sola vez) para que edicion.js devuelva lo mismo que escribió la persona.
function conMarcas(ctx, html) {
  return html
    .replace(MARCA_EN_TEXTO, (marca, que) => {
      if (ctx.modo === 'publicado') return '';
      // En edición el aviso no se edita y recuerda su marca: edicion.js la vuelve a poner al guardar el texto.
      const extra = ctx.modo === 'edicion' ? ` contenteditable="false" data-marca="${esc(desescapar(marca))}"` : '';
      return `<span class="pc"${extra}>Por completar: ${que || 'un dato'}</span>`;
    })
    .replace(/\s{2,}/g, ' ');
}

// Texto sin sus marcas (para atributos, <title> y para saber si algo queda vacío en publicado).
export function sinMarcas(v) {
  return typeof v === 'string' ? sinEnfasis(v.replace(MARCA_EN_TEXTO, '')).replace(/\s{2,}/g, ' ').trim() : '';
}

// Texto corto de una línea que no pasa por t() (botones, nota del formulario, títulos sueltos): escapado y con sus
// marcas como aviso en vista y edición; en publicado las marcas se quitan.
export function plano(ctx, v) {
  return conMarcas(ctx, multilinea(typeof v === 'string' ? v : '', ctx.modo === 'edicion')).trim();
}

// Cuántas cosas quedan por completar en un plan (objetos { porCompletar } y marcas dentro de textos).
export function contarPendientes(plan) {
  let n = 0;
  const ver = (v) => {
    if (pendiente(v)) n++;
    else if (typeof v === 'string') n += (v.match(MARCA_EN_TEXTO) || []).length;
    else if (Array.isArray(v)) v.forEach(ver);
    else if (v && typeof v === 'object') Object.values(v).forEach(ver);
  };
  for (const s of [...(plan?.secciones || []), ...(plan?.gracias?.secciones || [])]) if (!s.oculta) ver(s.campos);
  return n;
}

// Envuelve en <em class="hl"> la frase resaltada (sin importar mayúsculas ni tildes).
function sinTildes(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function resaltar(texto, frase, ed = false) {
  const base = String(texto ?? '');
  if (!frase || typeof frase !== 'string' || !frase.trim()) return multilinea(base, ed);
  const i = sinTildes(base).indexOf(sinTildes(frase.trim()));
  if (i < 0) return multilinea(base, ed);
  const fin = i + frase.trim().length;
  return multilinea(base.slice(0, i), ed) + '<em class="hl">' + multilinea(base.slice(i, fin), ed) + '</em>' + multilinea(base.slice(fin), ed);
}

// Un texto editable. t(ctx, 'titulo', s.campos.titulo, { tag: 'h2', clase: 'h2', resaltado })
export function t(ctx, ruta, v, o = {}) {
  const tag = o.tag || 'p';
  const clase = o.clase ? ` class="${o.clase}"` : '';
  if (pendiente(v) || vacio(v)) {
    if (!pendiente(v) && !o.siempre) return '';
    return ctx.modo === 'publicado' ? '' : `<${tag}${clase}>${aviso(ctx, v, ruta)}</${tag}>`;
  }
  const ed = ctx.modo === 'edicion';
  let html = conMarcas(ctx, o.resaltado ? resaltar(v, o.resaltado, ed) : multilinea(v, ed));
  if (!html.trim()) return '';
  // Con énfasis adentro, el texto va en un solo <span>: si el elemento es flex (un rótulo con su punto, la barra de
  // arriba), el texto y la negrita no se separan como si fueran dos piezas (ni se pierde el espacio entre ellos).
  if (v.includes('*') && enfasis(esc(v), false) !== esc(v)) html = `<span class="ew-tx">${html}</span>`;
  // Títulos largos bajan un tamaño para no ocupar media pantalla.
  let claseFinal = clase;
  if (o.clase && /\bh1\b/.test(o.clase) && v.length > 60) claseFinal = ` class="${o.clase} h1-l"`;
  else if (o.clase && /\bh2\b/.test(o.clase) && v.length > 70) claseFinal = ` class="${o.clase} h2-l"`;
  return `<${tag}${claseFinal}${atributoEdicion(ctx, ruta)}>${html}</${tag}>`;
}

// Si todos los campos de un ítem están "por completar", devuelve el texto de lo que falta (para pintar un solo aviso).
export function soloPendiente(it) {
  if (pendiente(it)) return it.porCompletar || 'Completa este ítem';
  if (!it || typeof it !== 'object') return null;
  const vals = Object.values(it);
  if (!vals.length || !vals.every((v) => pendiente(v) || vacio(v)) || !vals.some(pendiente)) return null;
  return vals.find(pendiente).porCompletar || 'Completa este ítem';
}

// ¿Tiene contenido que se publica? (vacío, por completar o hecho solo de marcas no cuenta).
export function lleno(v) {
  if (typeof v === 'string') return !!sinMarcas(v);
  return !vacio(v);
}

// ¿Se muestra este ítem de una lista? En publicado no van los que están vacíos, los que solo tienen campos por
// completar ni los que no tienen su dato principal (`esencial`: el campo o los campos sin los que el ítem no se
// entiende, ej. el número de una cifra o la respuesta de una pregunta).
function mostrarItem(ctx, it, esencial) {
  if (it == null) return false;
  if (ctx.modo !== 'publicado') return true;
  if (pendiente(it)) return false;
  if (typeof it === 'object') {
    if (esencial) return [].concat(esencial).every((k) => lleno(it[k]));
    return Object.values(it).some(lleno);
  }
  return lleno(it);
}

// Recorre una lista de ítems y pinta los que se ven. fn(item, i, n) devuelve HTML: i es la posición en el plan (para
// las rutas de data-e) y n la posición entre los que se ven (para numerar sin saltos).
export function lista(ctx, items, fn, esencial) {
  if (!Array.isArray(items)) return '';
  let n = 0;
  return items.map((it, i) => (mostrarItem(ctx, it, esencial) ? fn(it, i, n++) : '')).join('');
}

export function hayItems(ctx, items, esencial) {
  return Array.isArray(items) && items.some((it) => mostrarItem(ctx, it, esencial));
}

// El botón principal. Siempre hace la acción de la página (formulario, pago, WhatsApp o agenda).
export function boton(ctx, ruta, texto, o = {}) {
  const porDefecto = sinMarcas(ctx.plan.conversion?.boton) ? ctx.plan.conversion.boton : 'Quiero empezar';
  // En publicado un texto hecho solo de marcas queda vacío: entonces va el de la página.
  const etiqueta = vacio(texto) || (ctx.modo === 'publicado' && !sinMarcas(texto)) ? porDefecto : texto;
  const clase = 'btn' + (o.clase ? ' ' + o.clase : '');
  const flecha = o.sinFlecha ? '' : '<span class="btn-f" aria-hidden="true">→</span>';
  return `<a class="${clase}" href="${esc(ctx.cta.href)}"${ctx.cta.attrs}><span${atributoEdicion(ctx, ruta)}>${plano(ctx, etiqueta)}</span>${flecha}</a>`;
}

// Primer link http(s) que aparezca en un texto (links de grupo, de mapa…). '' si no hay.
export function urlDe(v) {
  if (typeof v !== 'string') return '';
  const m = /https?:\/\/[^\s<>"'`]+/i.exec(v);
  return m ? m[0] : '';
}

// Microcopy debajo del botón ("Gratis · 100% online · Cupos limitados").
export function nota(ctx, ruta, v) {
  return t(ctx, ruta, v, { tag: 'p', clase: 'nota' });
}

export function antetitulo(ctx, ruta, v) {
  return t(ctx, ruta, v, { tag: 'p', clase: 'ey' });
}

// Cabecera estándar de sección: antetítulo + título (con resaltado) + subtítulo.
export function cabecera(ctx, c, o = {}) {
  const tag = o.tag || 'h2';
  const partes =
    antetitulo(ctx, 'antetitulo', c.antetitulo) +
    t(ctx, 'titulo', c.titulo, { tag, clase: o.claseTitulo || 'h2', resaltado: c.resaltado }) +
    t(ctx, 'subtitulo', c.subtitulo, { tag: 'p', clase: 'lead' });
  if (!partes) return '';
  return `<header class="cab${o.centrada === false ? '' : ' cab-c'}">${partes}</header>`;
}

// Íconos de trazo (24×24) para listas y tarjetas. Nunca emojis.
const ICONOS = {
  check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  rayo: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z"/>',
  estrella: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z"/>',
  escudo: '<path d="M12 3l7 3v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V6l7-3z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  lugar: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  regalo: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5S13.5 4 16 4.5 17 8.5 12 8.5z"/>',
  play: '<path d="M8 5.5v13l11-6.5-11-6.5z"/>',
  whatsapp: '<path d="M4 20l1.3-4.1A8 8 0 1112 20a8 8 0 01-3.9-1L4 20z"/><path d="M9 9.2c.2 2.6 2.6 5 5.4 5.6l1.1-1.2-1.6-1-1 .6c-.8-.4-1.6-1.2-2-2l.6-1-1-1.6L9 9.2z"/>',
  persona: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6"/>',
  grafica: '<path d="M4 20V4M4 20h16M8 16l3.5-4 3 2.5L20 8"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  // los de «Beneficios con íconos» (7-oct): rayo, gráfica, corazón, brújula, estrella y escudo, en ese orden
  corazon: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z"/>',
  brujula: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>',
  sube: '<path d="M4 16l5-5 4 4 7-7M15 8h5v5"/>',
};

export function icono(nombre, clase = 'ic') {
  return `<svg class="${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre] || ICONOS.check}</svg>`;
}

// ¿Existe esta zona horaria? (la regex de normalizarPlan deja pasar nombres que Intl no conoce, ej. America/Medellin)
export function zonaValida(zona) {
  if (typeof zona !== 'string' || !zona) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zona });
    return true;
  } catch {
    return false;
  }
}

export const ZONA_POR_DEFECTO = 'America/Bogota';
const zonaSegura = (zona) => (zonaValida(zona) ? zona : ZONA_POR_DEFECTO);

// Fecha del evento en su zona → instante UTC (ms). "2026-10-18T19:00" + "America/Bogota".
// El desfase de la zona se mide en el instante real (dos pasadas), no en la hora leída como UTC: si entre los dos cae
// un cambio de horario, una sola pasada queda corrida una hora.
export function instanteEvento(fecha, zona) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(fecha || '');
  if (!m) return null;
  const [, a, mes, d, h, mi] = m.map(Number);
  const supuesto = Date.UTC(a, mes - 1, d, h, mi);
  if (Number.isNaN(supuesto)) return null;
  const formato = new Intl.DateTimeFormat('en-US', {
    timeZone: zonaSegura(zona), hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
  // Hora de la zona en el instante ms, leída como UTC.
  const comoZona = (ms) => {
    const p = Object.fromEntries(formato.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  };
  const t1 = supuesto - (comoZona(supuesto) - supuesto);
  const t2 = supuesto - (comoZona(t1) - t1);
  if (comoZona(t2) === supuesto) return t2;
  if (comoZona(t1) === supuesto) return t1;
  // Hora que no existe (el reloj se adelanta): va la de después del cambio, como hacen los calendarios.
  return Math.max(t1, t2);
}

export const NOMBRES_ZONA = {
  'America/Bogota': 'hora de Colombia', 'America/Mexico_City': 'hora de Ciudad de México', 'America/Lima': 'hora de Perú',
  'America/Santiago': 'hora de Chile', 'America/Argentina/Buenos_Aires': 'hora de Argentina', 'America/Caracas': 'hora de Venezuela',
  'America/Guayaquil': 'hora de Ecuador', 'Europe/Madrid': 'hora de España', 'America/New_York': 'hora de Nueva York',
  'America/Panama': 'hora de Panamá', 'America/Guatemala': 'hora de Guatemala', 'America/Santo_Domingo': 'hora de República Dominicana',
};

// "Sábado 18 de octubre · 7:00 p. m. (hora de Colombia)"
export function fechaLegible(fecha, zona) {
  const ms = instanteEvento(fecha, zona);
  if (ms == null) return { dia: '', hora: '', zona: '' };
  const z = zonaSegura(zona);
  const dia = new Intl.DateTimeFormat('es', { timeZone: z, weekday: 'long', day: 'numeric', month: 'long' }).format(ms);
  const hora = new Intl.DateTimeFormat('es', { timeZone: z, hour: 'numeric', minute: '2-digit' }).format(ms);
  const nombre = Object.hasOwn(NOMBRES_ZONA, z) ? NOMBRES_ZONA[z] : z.split('/').pop().replace(/_/g, ' ');
  return { dia: dia.charAt(0).toUpperCase() + dia.slice(1), hora, zona: nombre, iana: z };
}
