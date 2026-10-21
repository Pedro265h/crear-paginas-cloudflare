// Catálogo de secciones, tipos de página con su receta, y normalización de planes (lo que venga de la IA o de una
// versión vieja queda válido para el motor y el estudio).
import { aviso_, hero } from './secciones/portada.js';
import { formulario, contador, cta } from './secciones/captura.js';
import { beneficios, problema, mecanismo, urgencia, comparacion, para_quien } from './secciones/contenido.js';
import { experto, testimonios, cifras } from './secciones/prueba.js';
import { temario, oferta, bonos, garantia, faq } from './secciones/oferta.js';
import { servicios, galeria, ubicacion } from './secciones/local.js';
import { gracias, video, pie } from './secciones/cierre.js';
import { niveles, equipo, logistica, dudas, idea, caminos } from './secciones/evento.js';
import { PAREJAS, ESTILOS, RADIOS, hexValido } from './tema.js';
import { CAMPOS_FORMULARIO, conContacto } from './form.js';
import { urlDe, zonaValida, ZONA_POR_DEFECTO } from './util.js';
import { limpiarVideo } from './video.js';
import { plantillaValida } from './plantillas/index.js';
import { leerColores, CLAVES_ESTILO } from './plantillas/propios.js';

export const SECCIONES = {
  aviso: aviso_, hero, formulario, contador, beneficios, problema, mecanismo, urgencia, comparacion, para_quien,
  experto, testimonios, cifras, temario, oferta, bonos, garantia, faq, servicios, galeria, ubicacion, video, cta,
  niveles, equipo, logistica, dudas, idea, caminos, gracias, pie,
};

export const TIPOS = {
  registro: {
    nombre: 'Registro a masterclass o evento',
    descripcion: 'Capta registros gratis para una clase en vivo, un taller o un evento presencial.',
    accion: 'formulario',
    receta: ['aviso', 'hero', 'beneficios', 'urgencia', 'comparacion', 'para_quien', 'experto', 'testimonios', 'formulario', 'faq', 'cta', 'pie'],
    variantes: { hero: 'evento', beneficios: 'numerada', cta: 'tarjeta' },
  },
  vsl: {
    nombre: 'VSL de venta',
    descripcion: 'Video de ventas arriba y el botón de compra que aparece en el minuto justo.',
    accion: 'checkout',
    receta: ['hero', 'beneficios', 'testimonios', 'oferta', 'garantia', 'faq', 'cta', 'pie'],
    variantes: { hero: 'video', beneficios: 'lista', cta: 'banda' },
  },
  ventas: {
    nombre: 'Página de ventas larga',
    descripcion: 'La oferta completa: problema, método, temario, bonos, precio y garantía.',
    accion: 'checkout',
    receta: ['aviso', 'hero', 'problema', 'mecanismo', 'beneficios', 'experto', 'testimonios', 'temario', 'bonos', 'oferta', 'garantia', 'faq', 'cta', 'pie'],
    variantes: { hero: 'dividido', beneficios: 'tarjetas', cta: 'tarjeta' },
  },
  local: {
    nombre: 'Negocio local o servicios',
    descripcion: 'Servicios, precios, fotos, ubicación y un botón directo a WhatsApp.',
    accion: 'whatsapp',
    receta: ['hero', 'servicios', 'cifras', 'mecanismo', 'testimonios', 'galeria', 'ubicacion', 'faq', 'cta', 'pie'],
    variantes: { hero: 'dividido', servicios: 'tarjetas', cta: 'banda' },
  },
  // Vender entradas para un evento presencial de un día (el recorrido de una página de evento premium): portada con foto,
  // cifras, el problema, la idea que lo explica, qué es y qué no, el día paso a paso, la transformación, los dos caminos,
  // para quién es, quienes guían, la primera edición, las entradas por nivel con sus cupos y la cuenta regresiva, las
  // dudas por WhatsApp, las experiencias exclusivas, la logística, las preguntas y el cierre. Con PRISMA por defecto.
  evento: {
    nombre: 'Vender entradas para un evento presencial',
    descripcion: 'Un evento presencial con fecha y lugar: entradas por nivel con su precio, sus cupos y su link de pago, quiénes guían y la logística del día.',
    accion: 'checkout',
    receta: ['aviso', 'hero', 'cifras', 'problema', 'idea', 'comparacion', 'mecanismo', 'beneficios', 'caminos', 'para_quien', 'equipo', 'urgencia', 'niveles', 'dudas', 'bonos', 'logistica', 'faq', 'cta', 'pie'],
    variantes: {
      hero: 'centrado', problema: 'lista', idea: 'lado', comparacion: 'tarjetas', mecanismo: 'pasos', beneficios: 'tarjetas',
      urgencia: 'frase', bonos: 'fotos', cta: 'tarjeta',
    },
    plantilla: 'prisma',
  },
};

export const RECETA_GRACIAS = ['gracias', 'pie'];
export const ACCIONES = {
  formulario: 'Abrir el formulario de registro',
  checkout: 'Ir al link de pago (Hotmart, Mercado Pago, Stripe…)',
  whatsapp: 'Abrir WhatsApp con un mensaje listo',
  agenda: 'Abrir la agenda (Calendly u otra)',
};

// Búsqueda en los catálogos sin heredar del prototipo ('toString', '__proto__'… no son tipos, letras ni variantes).
export function propia(obj, k) {
  return typeof k === 'string' && !!obj && Object.hasOwn(obj, k);
}

// Secciones que se pueden agregar a cada tipo de página (para el catálogo del editor y para la IA).
export function seccionesPara(tipo) {
  return Object.entries(SECCIONES)
    .filter(([, d]) => d.paraTipos.includes(tipo))
    .map(([id, d]) => ({ id, nombre: d.nombre, descripcion: d.descripcion, variantes: d.variantes }));
}

// ---------- normalización ----------

function cadena(v, max) {
  if (v == null) return '';
  if (typeof v === 'number' || typeof v === 'boolean') v = String(v);
  if (typeof v !== 'string') return '';
  const s = v.replace(/\r\n?/g, '\n').trim();
  // El recorte va antes del trim: si el corte cae después de un espacio, la segunda pasada daría otro resultado.
  return max ? s.slice(0, Math.max(max * 3, 60)).trim() : s;
}

// Campo de link (grupo, mapa): el primer link http(s) del texto. Si se pegó sin https:// y parece un dominio, se le
// agrega. Así un link pegado encima de un aviso o con texto alrededor igual sirve.
function link(v, max) {
  const s = cadena(v, max);
  const u = urlDe(s);
  if (u) return u;
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s) ? 'https://' + s : '';
}

const pendiente = (v) => !!v && typeof v === 'object' && !Array.isArray(v) && 'porCompletar' in v;

function pendienteDe(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'porCompletar' in v) return { porCompletar: cadena(v.porCompletar, 80) || 'Completa este campo' };
  return null;
}

function normalizarValor(def, v) {
  const p = pendienteDe(v);
  if (p) return p;
  if (def.video) return limpiarVideo(v);
  if (def.url) return link(v, def.max);
  if (def.t === 'texto' || def.t === 'largo') return cadena(v, def.max);
  if (def.t === 'imagen') {
    if (typeof v === 'string') return /^(https?:\/\/|\/|data:image\/)/.test(v.trim()) ? v.trim() : '';
    if (v && typeof v === 'object' && typeof v.ref === 'string') return { ref: v.ref.slice(0, 80) };
    return '';
  }
  if (def.t === 'lista') {
    const arr = Array.isArray(v) ? v : [];
    return arr.slice(0, def.max || 12).map((it) => {
      const pi = pendienteDe(it);
      const fuente = pi ? {} : it && typeof it === 'object' ? it : { [Object.keys(def.campos)[0]]: it };
      const fuera = {};
      for (const [k, d] of Object.entries(def.campos)) fuera[k] = pi ? { ...pi } : normalizarValor(d, fuente[k]);
      return fuera;
    });
  }
  return '';
}

export function normalizarCampos(tipo, campos) {
  if (!propia(SECCIONES, tipo)) return {};
  const def = SECCIONES[tipo];
  const fuente = campos && typeof campos === 'object' ? campos : {};
  const fuera = {};
  for (const [k, d] of Object.entries(def.campos)) fuera[k] = normalizarValor(d, fuente[k]);
  return fuera;
}

let contadorIds = 0;
export function nuevoId() {
  contadorIds = (contadorIds + 1) % 1e6;
  return 's' + Date.now().toString(36).slice(-5) + contadorIds.toString(36) + Math.random().toString(36).slice(2, 5);
}

function normalizarSecciones(lista, tipoPagina, usadas) {
  const fuera = [];
  for (const s of Array.isArray(lista) ? lista : []) {
    if (!s || !propia(SECCIONES, s.tipo)) continue;
    const def = SECCIONES[s.tipo];
    if (!def.paraTipos.includes(tipoPagina)) continue;
    let id = typeof s.id === 'string' && /^[\w-]{1,40}$/.test(s.id) ? s.id : nuevoId();
    while (usadas.has(id)) id = nuevoId();
    usadas.add(id);
    const seccion = {
      id,
      tipo: s.tipo,
      variante: propia(def.variantes, s.variante) ? s.variante : Object.keys(def.variantes)[0],
      campos: normalizarCampos(s.tipo, s.campos),
      oculta: s.oculta === true,
    };
    // Los colores propios de la sección (motor/plantillas/propios.js): solo si tiene alguno.
    const estilo = leerColores(s.estilo, CLAVES_ESTILO);
    if (estilo) seccion.estilo = estilo;
    fuera.push(seccion);
  }
  // Siempre hay pie, y va al final.
  const iPie = fuera.findIndex((s) => s.tipo === 'pie');
  if (iPie === -1) fuera.push({ id: nuevoId(), tipo: 'pie', variante: 'simple', campos: normalizarCampos('pie', {}), oculta: false });
  else if (iPie !== fuera.length - 1) fuera.push(...fuera.splice(iPie, 1));
  return fuera;
}

const ZONA = /^[A-Za-z_]+(\/[A-Za-z_]+){0,2}$/;

export function normalizarPlan(entrada, tipoPorDefecto = 'registro') {
  const p = entrada && typeof entrada === 'object' ? entrada : {};
  const tipo = propia(TIPOS, p.tipo) ? p.tipo : propia(TIPOS, tipoPorDefecto) ? tipoPorDefecto : 'registro';
  const tema = p.tema && typeof p.tema === 'object' ? p.tema : {};
  const colores = {};
  for (const k of ['fondo', 'texto', 'primario', 'acento']) if (hexValido(tema.colores?.[k])) colores[k] = tema.colores[k].trim();
  const conv = p.conversion && typeof p.conversion === 'object' ? p.conversion : {};
  const accion = propia(ACCIONES, conv.accion) ? conv.accion : TIPOS[tipo].accion;
  const campos = (Array.isArray(conv.campos) ? conv.campos : ['nombre', 'correo', 'whatsapp']).filter((c) => CAMPOS_FORMULARIO.includes(c));
  const ev = p.evento && typeof p.evento === 'object' ? p.evento : {};
  const zona = cadena(ev.zona);
  const usadas = new Set();
  // Plantilla: una que existe y está lista; si no (o en un plan viejo), la clásica. Con una plantilla moderna, letras ''
  // = las de la plantilla (ver motor/plantillas/index.js); con la clásica, una pareja siempre.
  const plantilla = plantillaValida(tema.plantilla);
  // El logo de la marca (una foto de la biblioteca): va en el pie y, con PRISMA, en la barra de arriba. Solo si hay.
  const logo = normalizarValor({ t: 'imagen' }, p.marca?.logo);
  return {
    v: 1,
    tipo,
    marca: { nombre: cadena(p.marca?.nombre, 60), ...(logo && !pendiente(logo) ? { logo } : {}) },
    seo: { titulo: cadena(p.seo?.titulo, 70), descripcion: cadena(p.seo?.descripcion, 160) },
    tema: {
      modo: tema.modo === 'claro' ? 'claro' : 'oscuro',
      colores,
      letras: propia(PAREJAS, tema.letras) ? tema.letras : plantilla === 'clasica' ? 'moderno' : '',
      radio: propia(RADIOS, tema.radio) ? tema.radio : 'suave',
      estilo: propia(ESTILOS, tema.estilo) ? tema.estilo : '',
      plantilla,
      // Los colores que eligió la persona para esta página (se respetan con cualquier plantilla): solo si hay alguno.
      ...(leerColores(tema.propios) ? { propios: leerColores(tema.propios) } : {}),
    },
    conversion: {
      accion,
      boton: cadena(conv.boton, 32),
      url: /^https?:\/\//.test(cadena(conv.url)) ? cadena(conv.url) : '',
      whatsapp: cadena(conv.whatsapp).replace(/[^\d+]/g, '').slice(0, 20),
      mensaje: cadena(conv.mensaje, 200),
      // Siempre hay al menos un dato de contacto (correo, WhatsApp o teléfono): sin eso el servidor rechaza el registro.
      campos: conContacto(campos.length ? [...new Set(campos)] : ['nombre', 'correo']),
      webhook: /^https:\/\//.test(cadena(conv.webhook)) ? cadena(conv.webhook) : '',
    },
    evento: {
      nombre: cadena(ev.nombre, 80),
      fecha: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(cadena(ev.fecha)) ? cadena(ev.fecha).slice(0, 16) : '',
      zona: ZONA.test(zona) && zonaValida(zona) ? zona : ZONA_POR_DEFECTO,
      duracionMin: Math.min(Math.max(parseInt(ev.duracionMin, 10) || 90, 15), 720),
      modalidad: ev.modalidad === 'presencial' ? 'presencial' : 'online',
      lugar: cadena(ev.lugar, 120),
    },
    // Link (hasta 4.000) o código de inserción saneado (hasta 8.000, nunca se corta).
    video: { url: limpiarVideo(p.video?.url), ctaSegundos: Math.min(Math.max(parseInt(p.video?.ctaSegundos, 10) || 0, 0), 7200) },
    pixel: { meta: cadena(p.pixel?.meta).replace(/\D/g, '').slice(0, 20) },
    estrategia: { avatar: cadena(p.estrategia?.avatar, 300), promesa: cadena(p.estrategia?.promesa, 300), angulo: cadena(p.estrategia?.angulo, 300) },
    secciones: normalizarSecciones(p.secciones, tipo, usadas),
    gracias: { secciones: normalizarSecciones(p.gracias?.secciones?.length ? p.gracias.secciones : RECETA_GRACIAS.map((t) => ({ tipo: t })), 'gracias', usadas) },
  };
}

// Plan vacío con la receta del tipo (lo que se ve antes de que la IA escriba, o si la IA falla).
export function planBase(tipo, marca = {}) {
  const def = TIPOS[tipo] || TIPOS.registro;
  return normalizarPlan(
    {
      tipo,
      marca: { nombre: marca.nombre },
      // El tipo puede traer su diseño por defecto (el evento, PRISMA): con sus letras.
      tema: { modo: marca.tema, colores: marca.colores, letras: def.plantilla ? '' : marca.letras, plantilla: def.plantilla },
      secciones: def.receta.map((t) => ({ tipo: t, variante: def.variantes[t] })),
    },
    tipo,
  );
}
