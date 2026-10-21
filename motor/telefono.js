// El WhatsApp con su código de país: «300 123 4567» sin código armaría wa.me/3001234567, que no existe. Puro (sin red
// ni DOM): lo usan el motor (render.js y secciones/evento.js, para no publicar un link roto) y los scripts de la skill
// (armar.mjs completa el código con el país de la marca y revisar.mjs avisa si todavía falta).
//
// Las reglas:
//   · con «+» (o «00») adelante, el número ya trae su código: se respeta tal cual (7 a 15 dígitos);
//   · sin «+», si empieza con el código de un país y el resto tiene el largo de ese país, también lo trae
//     («573001234567»);
//   · si no, con el país (el de la marca, el de la zona horaria o el de la página) se le pone el código: sin el 0 de
//     adelante donde se marca («0414…» en Venezuela) y, en Argentina, con el 9 de los celulares;
//   · sin país, no se adivina: se pregunta (PAISES_CHIPS) y, mientras tanto, no se arma ningún link.

// iso · nombre · código · largos del número sin el código · troncal: el 0 que se marca adelante dentro del país ·
// movil: lo que WhatsApp pide entre el código y el número (Argentina) · zonas: las horarias de ese país.
export const PAISES_TEL = [
  { iso: 'CO', nombre: 'Colombia', codigo: '57', largos: [10], zonas: ['America/Bogota'] },
  { iso: 'MX', nombre: 'México', codigo: '52', largos: [10], alterno: '1', zonas: ['America/Mexico_City', 'America/Monterrey', 'America/Merida', 'America/Cancun', 'America/Chihuahua', 'America/Hermosillo', 'America/Mazatlan', 'America/Tijuana', 'America/Matamoros', 'America/Bahia_Banderas'] },
  { iso: 'PE', nombre: 'Perú', codigo: '51', largos: [9], zonas: ['America/Lima'] },
  { iso: 'EC', nombre: 'Ecuador', codigo: '593', largos: [9, 8], troncal: true, zonas: ['America/Guayaquil', 'Pacific/Galapagos'] },
  { iso: 'CL', nombre: 'Chile', codigo: '56', largos: [9], zonas: ['America/Santiago', 'America/Punta_Arenas'] },
  { iso: 'AR', nombre: 'Argentina', codigo: '54', largos: [10], troncal: true, movil: '9', zonas: ['America/Argentina/Buenos_Aires', 'America/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Cordoba', 'America/Argentina/Mendoza', 'America/Mendoza', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia'] },
  { iso: 'VE', nombre: 'Venezuela', codigo: '58', largos: [10], troncal: true, zonas: ['America/Caracas'] },
  { iso: 'BO', nombre: 'Bolivia', codigo: '591', largos: [8], zonas: ['America/La_Paz'] },
  { iso: 'PY', nombre: 'Paraguay', codigo: '595', largos: [9], troncal: true, zonas: ['America/Asuncion'] },
  { iso: 'UY', nombre: 'Uruguay', codigo: '598', largos: [8], troncal: true, zonas: ['America/Montevideo'] },
  { iso: 'PA', nombre: 'Panamá', codigo: '507', largos: [8, 7], zonas: ['America/Panama'] },
  { iso: 'CR', nombre: 'Costa Rica', codigo: '506', largos: [8], zonas: ['America/Costa_Rica'] },
  { iso: 'GT', nombre: 'Guatemala', codigo: '502', largos: [8], zonas: ['America/Guatemala'] },
  { iso: 'SV', nombre: 'El Salvador', codigo: '503', largos: [8], zonas: ['America/El_Salvador'] },
  { iso: 'HN', nombre: 'Honduras', codigo: '504', largos: [8], zonas: ['America/Tegucigalpa'] },
  { iso: 'NI', nombre: 'Nicaragua', codigo: '505', largos: [8], zonas: ['America/Managua'] },
  { iso: 'DO', nombre: 'República Dominicana', codigo: '1', largos: [10], zonas: ['America/Santo_Domingo'] },
  { iso: 'PR', nombre: 'Puerto Rico', codigo: '1', largos: [10], zonas: ['America/Puerto_Rico'] },
  { iso: 'CU', nombre: 'Cuba', codigo: '53', largos: [8], zonas: ['America/Havana'] },
  { iso: 'US', nombre: 'Estados Unidos', codigo: '1', largos: [10], zonas: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu', 'America/Detroit'] },
  { iso: 'ES', nombre: 'España', codigo: '34', largos: [9], zonas: ['Europe/Madrid', 'Atlantic/Canary', 'Africa/Ceuta'] },
  { iso: 'BR', nombre: 'Brasil', codigo: '55', largos: [11, 10], zonas: ['America/Sao_Paulo', 'America/Bahia', 'America/Fortaleza', 'America/Recife', 'America/Manaus', 'America/Belem'] },
];

// Los países que se ofrecen con un toque cuando no se sabe de dónde es el número (los de LATAM, primero los más comunes).
export const PAISES_CHIPS = ['CO', 'MX', 'PE', 'EC', 'CL', 'AR', 'VE', 'GT', 'DO', 'BO', 'CR', 'PA', 'PY', 'UY', 'SV', 'HN', 'NI', 'ES', 'US'];

const POR_ISO = Object.fromEntries(PAISES_TEL.map((p) => [p.iso, p]));
const sinTildes = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
// Otros nombres con que se nombra un país (lo que devuelve la IA en la marca o lo que escribe la persona).
const ALIAS = {
  CO: ['colombia', 'colombiana', 'colombiano'], MX: ['mexico', 'mexicana', 'mexicano', 'cdmx'], PE: ['peru', 'peruana', 'peruano'],
  EC: ['ecuador', 'ecuatoriana', 'ecuatoriano'], CL: ['chile', 'chilena', 'chileno'], AR: ['argentina', 'argentino'],
  VE: ['venezuela', 'venezolana', 'venezolano'], BO: ['bolivia', 'boliviana', 'boliviano'], PY: ['paraguay', 'paraguaya', 'paraguayo'],
  UY: ['uruguay', 'uruguaya', 'uruguayo'], PA: ['panama', 'panamena', 'panameno'], CR: ['costa rica', 'costarricense'],
  GT: ['guatemala', 'guatemalteca', 'guatemalteco'], SV: ['el salvador', 'salvadorena', 'salvadoreno'], HN: ['honduras', 'hondurena', 'hondureno'],
  NI: ['nicaragua', 'nicaraguense'], DO: ['republica dominicana', 'dominicana', 'dominicano', 'rep. dominicana', 'rd'], PR: ['puerto rico', 'puertorriquena', 'puertorriqueno'],
  CU: ['cuba', 'cubana', 'cubano'], US: ['estados unidos', 'usa', 'eeuu', 'ee. uu.', 'ee.uu.', 'united states', 'miami', 'florida'], ES: ['espana', 'espanola', 'espanol', 'spain'],
  BR: ['brasil', 'brazil', 'brasilena', 'brasileno'],
};

// 'CO' · 'Colombia' · 'colombia' · '+57' → el país (o null).
export function paisTel(x) {
  if (!x) return null;
  if (typeof x === 'object') return x.iso && POR_ISO[x.iso] ? POR_ISO[x.iso] : null;
  const t = String(x).trim();
  if (/^[A-Za-z]{2}$/.test(t) && POR_ISO[t.toUpperCase()]) return POR_ISO[t.toUpperCase()];
  const n = sinTildes(t);
  for (const p of PAISES_TEL) if (sinTildes(p.nombre) === n || (ALIAS[p.iso] || []).includes(n)) return p;
  return null;
}
export const nombrePaisTel = (iso) => POR_ISO[String(iso || '').toUpperCase()]?.nombre || '';

// El país que se nombra dentro de un texto («Colombia», «es de México», «Perú»). → iso o ''.
export function paisEnTexto(texto) {
  const t = ` ${sinTildes(texto).replace(/[^a-zñ. ]+/g, ' ')} `;
  // Los nombres largos primero («república dominicana» antes que «dominicana», «costa rica»…).
  const pares = PAISES_TEL.flatMap((p) => [sinTildes(p.nombre), ...(ALIAS[p.iso] || [])].map((a) => [a, p.iso])).sort((a, b) => b[0].length - a[0].length);
  for (const [a, iso] of pares) if (a.length > 2 && t.includes(` ${a} `)) return iso;
  return '';
}

// La zona horaria ('America/Bogota') → su país ('CO'), o ''. Miami y Nueva York cuentan como Estados Unidos.
export function paisDeZona(zona) {
  const z = String(zona || '');
  return PAISES_TEL.find((p) => p.zonas.includes(z))?.iso || '';
}

// El país para completar un número, en orden: el de la marca (su país, o el de su WhatsApp si ya trae código), el de la
// página (la zona de su evento, solo si tiene fecha: si no, es la de fábrica), el de la zona horaria de quien escribe y
// el de la cuenta (el que vio Cloudflare al crearla). → iso o ''.
export function paisSugerido({ marca = null, zonaPagina = '', zona = '', cuenta = '' } = {}) {
  const m = marca && typeof marca === 'object' ? marca : {};
  const deMarca = paisTel(m.pais)?.iso || paisEnTexto(m.pais) || leerWhatsapp(m.contacto?.whatsapp).pais;
  return deMarca || paisDeZona(zonaPagina) || paisDeZona(zona) || paisTel(cuenta)?.iso || '';
}

const digitos = (s) => String(s ?? '').replace(/\D/g, '');

// ¿Esos dígitos (sin +) empiezan con el código de un país y el resto tiene su largo? → el país o null.
function conCodigoDe(d, p) {
  if (!d.startsWith(p.codigo)) return false;
  const resto = d.slice(p.codigo.length);
  if (p.largos.includes(resto.length)) return true;
  // Argentina con el 9 de los celulares; México con el 1 de antes.
  const extra = p.movil || p.alterno;
  return !!extra && resto.startsWith(extra) && p.largos.includes(resto.length - extra.length);
}
// El +1 lo comparten Estados Unidos, República Dominicana y Puerto Rico: lo decide el código de área.
const AREAS_1 = { DO: ['809', '829', '849'], PR: ['787', '939'] };
function paisDeDigitos(d, preferido = null) {
  if (preferido && conCodigoDe(d, preferido)) return preferido;
  const p = PAISES_TEL.find((x) => conCodigoDe(d, x)) || null;
  if (p?.codigo !== '1') return p;
  const area = d.slice(1, 4);
  return POR_ISO[Object.keys(AREAS_1).find((k) => AREAS_1[k].includes(area)) || 'US'];
}

// El número sin el código, como se marca dentro del país → los dígitos que van después del código (o '' si no sirve).
function nacional(d, p) {
  let x = d;
  if (p.troncal && x.startsWith('0')) x = x.slice(1);
  if (p.largos.includes(x.length)) return (p.movil || '') + x;
  // Argentina: «011 15 2345 6789» → sin el 0 y sin el 15 de los celulares.
  if (p.iso === 'AR' && x.length === 12) {
    for (const i of [2, 3, 4]) if (x.slice(i, i + 2) === '15' && p.largos.includes(x.length - 2)) return p.movil + x.slice(0, i) + x.slice(i + 2);
  }
  return '';
}

// Lo que escribió la persona → { ok, numero: '+573001234567', digitos, pais, legible, agregado, falta }.
//   falta: '' · 'numero' (vacío) · 'digitos' (muy corto o muy largo) · 'pais' (sin código y sin país para completarlo)
//   agregado: true si el código lo puso esta función (para decirle «Así queda: +57 …»)
export function leerWhatsapp(texto, { pais = '' } = {}) {
  const crudo = String(texto ?? '').trim();
  const vacio = { ok: false, numero: '', digitos: '', pais: '', legible: '', agregado: false };
  if (!crudo) return { ...vacio, falta: 'numero' };
  let d = digitos(crudo);
  const conMas = /^\s*(\+|00)/.test(crudo);
  if (conMas && crudo.trim().startsWith('00')) d = d.slice(2);
  if (d.length < 7 || d.length > 15) return { ...vacio, digitos: d, falta: 'digitos' };
  const preferido = paisTel(pais);
  if (conMas) {
    const p = paisDeDigitos(d, preferido);
    return armar(d, p, false);
  }
  const yaTrae = paisDeDigitos(d, preferido);
  // Con el país de la marca, un número que ya tiene su largo nacional va con su código (aunque se parezca a otro).
  if (preferido) {
    if (yaTrae === preferido) return armar(d, preferido, false);
    const n = nacional(d, preferido);
    if (n) return armar(preferido.codigo + n, preferido, true);
  }
  if (yaTrae) return armar(d, yaTrae, false);
  return { ...vacio, digitos: d, falta: preferido ? 'digitos' : 'pais', pais: preferido?.iso || '' };
}
function armar(d, p, agregado) {
  return { ok: true, numero: '+' + d, digitos: d, pais: p?.iso || '', legible: legibleDe(d, p), agregado, falta: '' };
}

// '+573001234567' → '+57 300 123 4567' (por bloques, como se dicta).
function legibleDe(d, p) {
  const codigo = p ? p.codigo : '';
  let resto = codigo ? d.slice(codigo.length) : d;
  const partes = [];
  if (p?.movil && resto.startsWith(p.movil) && p.largos.includes(resto.length - p.movil.length)) {
    partes.push(p.movil);
    resto = resto.slice(p.movil.length);
  }
  // Las ciudades grandes de México y Buenos Aires se dictan con su código de 2 cifras («55 1234 5678», «11 2345 6789»).
  const dos = (p?.iso === 'MX' && /^(55|33|81)/.test(resto)) || (p?.iso === 'AR' && resto.startsWith('11'));
  const bloques = resto.length === 10 ? (dos ? [2, 4, 4] : [3, 3, 4]) : resto.length === 9 ? [3, 3, 3] : resto.length === 8 ? [4, 4] : resto.length === 11 ? [2, 5, 4] : resto.length === 7 ? [3, 4] : [];
  if (bloques.length) {
    let i = 0;
    for (const b of bloques) {
      partes.push(resto.slice(i, i + b));
      i += b;
    }
  } else partes.push(...(resto.match(/.{1,3}/g) || []));
  return `+${codigo ? codigo + ' ' : ''}${partes.join(' ')}`.trim();
}
export const telefonoLegible = (numero, opciones) => leerWhatsapp(numero, opciones).legible || String(numero || '');

// ¿Ese número (guardado) ya trae su código? '+…' siempre; sin '+', si empieza con un código y tiene el largo justo.
export function tieneCodigo(numero) {
  const s = String(numero ?? '').trim();
  if (!s) return false;
  const d = digitos(s);
  if (d.length < 7 || d.length > 15) return false;
  if (/^(\+|00)/.test(s)) return true;
  return !!paisDeDigitos(d);
}

// El número guardado → el link de WhatsApp ('' si no trae código: nunca un wa.me a un número que no existe).
export function linkWhatsapp(numero, mensaje = '') {
  if (!tieneCodigo(numero)) return '';
  let d = digitos(numero);
  if (String(numero).trim().startsWith('00')) d = d.slice(2);
  return `https://wa.me/${d}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
}

// Lo que se guarda: con el país, el número completo ('+573001234567'); sin país y sin código, lo que escribió (así no se
// pierde y se le pregunta el país a la persona). → { numero, ok, falta, pais }
export function normalizarWhatsapp(texto, opciones = {}) {
  const r = leerWhatsapp(texto, opciones);
  if (r.ok) return { numero: r.numero, ok: true, falta: '', pais: r.pais };
  const crudo = String(texto ?? '').replace(/[^\d+]/g, '').slice(0, 20);
  return { numero: crudo, ok: false, falta: r.falta, pais: r.pais };
}

// El plan de una página con el WhatsApp de su botón completo (si le falta el código y se sabe el país). Lo usa armar.mjs:
// así «3001234567» sale con wa.me/573001234567 si la marca es de Colombia.
// Sin país, el plan queda igual (el botón no arma link y revisar.mjs lo pide).
export function completarWhatsappPlan(plan, pais) {
  const n = plan?.conversion?.whatsapp;
  if (!n || tieneCodigo(n) || !pais) return plan;
  const r = leerWhatsapp(n, { pais });
  return r.ok ? { ...plan, conversion: { ...plan.conversion, whatsapp: r.numero } } : plan;
}
// El país de una página para su WhatsApp: el de su marca o el de su evento (si tiene fecha).
export const paisDePagina = (plan = {}, marca = {}) => paisSugerido({ marca, zonaPagina: plan?.evento?.fecha ? plan.evento.zona : '' });

// Los textos para la persona (sin jerga, tuteo).
export const TEXTOS_TELEFONO = {
  asiQueda: (legible) => `Así queda: ${legible}`,
  probar: 'Probar',
  faltaPais: '¿De qué país es este número? Así le pongo el código.',
  faltaCodigo: (iso) => (iso && POR_ISO[iso] ? `Falta el código de tu país. En ${POR_ISO[iso].nombre} empieza con +${POR_ISO[iso].codigo}.` : 'Falta el código de tu país, por ejemplo +57 en Colombia o +52 en México.'),
  revisar: (iso) => {
    const p = POR_ISO[iso];
    const n = p ? p.largos[0] : 0;
    return p ? `Revisa el número: en ${p.nombre} tiene ${n} dígitos sin el código. Si es de otro país, escríbelo con + y su código.` : 'Revisa el número: le faltan o le sobran dígitos.';
  },
  otroPais: 'Otro país: escríbelo con + y su código',
  pendiente: 'el código de país de tu WhatsApp',
};
