// Lo que le falta a una página antes de publicarla, dicho en palabras simples. Mismas reglas que el editor de páginas
// del motor: nada inventado, cada hueco queda «por completar» y la página no se publica con huecos.
//
// pendientesDe(crudo, marca, { dirFotos }) → { faltan: [{ donde, que }], avisos: [texto], plan }
//   faltan  bloquean publicar (publicar.mjs se niega mientras haya alguno)
//   avisos  conviene revisarlos, pero no bloquean
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { motor } from './comun.mjs';
import { buscarFoto } from './imagenes.mjs';
import { prepararPlan, marcaLegal } from './armado.mjs';

const { SECCIONES, TIPOS } = await motor('catalogo.js');
const { MARCA_EN_TEXTO, urlDe, instanteEvento } = await motor('util.js');
const { nivelesDe } = await motor('secciones/evento.js');
const { tieneCodigo } = await motor('telefono.js');
const { faltanDatosLegales } = await motor('legales.js');
const { fuenteVideo } = await motor('video.js');
const { renderSeccion } = await motor('render.js');

const esPendiente = (v) => !!v && typeof v === 'object' && !Array.isArray(v) && 'porCompletar' in v;
const esVacio = (v) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);

function itemPendiente(it) {
  if (esPendiente(it)) return true;
  if (!it || typeof it !== 'object') return false;
  const vals = Object.values(it);
  return vals.length > 0 && vals.some(esPendiente) && vals.every((v) => esPendiente(v) || esVacio(v));
}

function marcasEnTexto(v) {
  if (typeof v !== 'string' || !v.includes('[[')) return [];
  return [...v.matchAll(new RegExp(MARCA_EN_TEXTO.source, 'gi'))].map((m) => m[1] || 'un dato');
}

// Campos que solo dibujan algunas variantes (en las demás no se ven, así que no cuentan).
const SOLO_EN = { 'hero.imagen': ['dividido', 'centrado'], 'servicios.items.imagen': ['tarjetas'] };
function campoVisible(seccion, ruta) {
  const clave = `${seccion.tipo}.${String(ruta).split('.').filter((p) => !/^\d+$/.test(p)).join('.')}`;
  return !SOLO_EN[clave] || SOLO_EN[clave].includes(seccion.variante);
}

export function pendientesDe(crudo, marca = {}, { dirFotos } = {}) {
  const { plan, videos } = prepararPlan(crudo, marca);
  const faltan = [];
  const avisos = [];
  const agregar = (donde, que) => faltan.push({ donde, que });

  for (const pagina of ['principal', 'gracias']) {
    const lista = pagina === 'gracias' ? plan.gracias?.secciones || [] : plan.secciones || [];
    lista.forEach((s, n) => {
      const def = SECCIONES[s.tipo];
      if (s.oculta || !def) return;
      const lugar = `${pagina === 'gracias' ? 'Página de gracias › ' : ''}${def.nombre} (sección ${n + 1})`;
      const c = s.campos || {};
      const marcas = (v, etiqueta) => {
        for (const que of marcasEnTexto(v)) agregar(`${lugar} › ${etiqueta}`, que);
      };
      for (const [k, d] of Object.entries(def.campos)) {
        const v = c[k];
        if (d.t === 'lista') {
          (Array.isArray(v) ? v : []).forEach((it, i) => {
            const nombreItem = `${d.etiqueta} ${i + 1}`;
            if (esPendiente(it)) return void agregar(`${lugar} › ${nombreItem}`, it.porCompletar);
            if (!it || typeof it !== 'object') return;
            const pend = Object.keys(d.campos).filter((kk) => esPendiente(it[kk]) && campoVisible(s, `${k}.${i}.${kk}`));
            if (pend.length && itemPendiente(it)) agregar(`${lugar} › ${nombreItem}`, it[pend[0]].porCompletar);
            else for (const kk of pend) agregar(`${lugar} › ${nombreItem} › ${d.campos[kk].etiqueta}`, it[kk].porCompletar);
            for (const kk of Object.keys(d.campos)) marcas(it[kk], `${nombreItem} › ${d.campos[kk].etiqueta}`);
          });
        } else if (esPendiente(v)) {
          if (campoVisible(s, k)) agregar(`${lugar} › ${d.etiqueta}`, v.porCompletar);
        } else marcas(v, d.etiqueta);
      }
      // Lo que la página publicada no mostraría (una sección vacía o hecha solo de huecos).
      const sinItems = !Array.isArray(c.items) || !c.items.length;
      if (s.tipo === 'testimonios' && sinItems) agregar(lugar, 'testimonios reales de tus clientes (o quita esta sección)');
      else if (s.tipo === 'cifras' && sinItems) agregar(lugar, 'cifras reales (o quita esta sección)');
      else if (s.tipo === 'galeria' && sinItems) agregar(lugar, 'fotos de tu negocio (o quita esta sección)');
      else if (s.tipo === 'video' && esVacio(c.url)) agregar(lugar, 'el link de tu video');
      else if (s.tipo !== 'pie' && !faltan.some((f) => f.donde.startsWith(lugar)) && !renderSeccion(plan, s, { modo: 'publicado', imagen: (ref) => (buscarFoto(dirFotos, ref) ? { src: '/foto', ancho: 1, alto: 1 } : null) })) agregar(lugar, 'esta sección está vacía: llénala o quítala');
      if (s.tipo === 'hero' && esVacio(c.titulo) && esVacio(c.logo)) agregar(`${lugar} › Título principal`, 'el título de la portada (la promesa)');
      if (s.tipo === 'video' && typeof c.url === 'string' && c.url && !c.url.startsWith('<') && !fuenteVideo(c.url)) agregar(lugar, 'un link de video que sirva (YouTube, Vimeo, Loom, Streamable, Panda, Wistia, VTurb o un .mp4)');
      if (s.tipo === 'niveles' && plan.conversion?.accion === 'checkout' && !plan.conversion?.url && Array.isArray(c.niveles)) {
        c.niveles.forEach((nv, i) => {
          if (nv && typeof nv.nombre === 'string' && nv.nombre.trim() && !urlDe(nv.link)) agregar(`${lugar} › Niveles ${i + 1}`, `el link de pago de la entrada «${nv.nombre.trim()}»`);
        });
      }
      if (s.tipo === 'dudas') {
        const numero = (typeof c.whatsapp === 'string' && c.whatsapp.trim()) || plan.conversion?.whatsapp;
        if (!numero) agregar(lugar, 'tu número de WhatsApp para las dudas');
        else if (!tieneCodigo(numero)) agregar(lugar, 'el código de país de tu WhatsApp (por ejemplo +57 o +52)');
      }
      // Fotos que el plan nombra pero no están en la carpeta.
      const fotosDe = (v, etiqueta) => {
        if (v && typeof v === 'object' && typeof v.ref === 'string' && !buscarFoto(dirFotos, v.ref)) agregar(`${lugar} › ${etiqueta}`, `la foto «${v.ref}» (no está en la carpeta fotos/)`);
      };
      for (const [k, d] of Object.entries(def.campos)) {
        if (d.t === 'imagen' && campoVisible(s, k)) fotosDe(c[k], d.etiqueta);
        if (d.t === 'lista') (Array.isArray(c[k]) ? c[k] : []).forEach((it, i) => {
          for (const [kk, dd] of Object.entries(d.campos)) if (dd.t === 'imagen' && it && campoVisible(s, `${k}.${i}.${kk}`)) fotosDe(it[kk], `${d.etiqueta} ${i + 1} › ${dd.etiqueta}`);
        });
      }
    });
  }

  // Lo de toda la página: el botón, el evento y el video.
  const conv = plan.conversion || {};
  const principal = (plan.secciones || []).filter((s) => !s.oculta);
  const niveles = nivelesDe(plan);
  if (conv.accion === 'checkout' && !conv.url && (!niveles.length || niveles.some((n) => !n.link))) agregar('Botón principal', 'el link de pago (Hotmart, Mercado Pago, Stripe…)');
  if (conv.accion === 'agenda' && !conv.url) agregar('Botón principal', 'el link de tu agenda (Calendly u otra)');
  if (conv.accion === 'whatsapp' && !conv.whatsapp) agregar('Botón principal', 'tu número de WhatsApp');
  else if (conv.accion === 'whatsapp' && !tieneCodigo(conv.whatsapp)) agregar('Botón principal', 'el código de país de tu WhatsApp (por ejemplo +57 o +52), o el país en marca.json');
  if (principal.some((s) => s.tipo === 'hero' && s.variante === 'video') && !plan.video?.url) agregar('Portada', 'el link de tu video');
  if ((plan.tipo === 'registro' || plan.tipo === 'evento' || principal.some((s) => s.tipo === 'contador')) && !plan.evento?.fecha) agregar('Datos del evento', 'la fecha y la hora del evento');
  if (plan.tipo === 'evento' && plan.evento?.modalidad === 'presencial' && !plan.evento?.lugar) agregar('Datos del evento', 'el lugar del evento');
  for (const [nombre] of videos) if (!buscarVideo(dirFotos, nombre)) agregar('Video', `el video «${nombre}» (no está en la carpeta fotos/)`);
  if (plan.marca?.logo?.ref && !buscarFoto(dirFotos, plan.marca.logo.ref)) agregar('Marca', `el logo «${plan.marca.logo.ref}» (no está en la carpeta fotos/)`);
  if (!plan.marca?.nombre && !marca.nombre) agregar('Marca', 'el nombre de tu marca');

  // Los datos legales van en privacidad y términos (obligatorios si la página recoge datos).
  for (const que of faltanDatosLegales(marcaLegal(marca, plan))) agregar('Datos legales (marca.json)', que);

  // Marcadores de plantilla que quedaron sin reemplazar ({{fecha}}, {{dia}}…: los usan los ejemplos de la skill).
  const marcadores = new Set((JSON.stringify(crudo).match(/\{\{\s*[\w.-]+\s*\}\}/g) || []));
  for (const m of marcadores) agregar('Textos de la página', `cambiar «${m}» por el dato real (es un marcador de los ejemplos)`);

  // Avisos (no bloquean).
  if (!plan.seo?.titulo) avisos.push('La página no tiene título para Google y las redes (seo.titulo).');
  if (!plan.seo?.descripcion) avisos.push('La página no tiene descripción para Google y las redes (seo.descripcion).');
  if (plan.evento?.fecha) {
    const ms = instanteEvento(plan.evento.fecha, plan.evento.zona);
    if (ms && ms < Date.now()) avisos.push('La fecha del evento ya pasó: la cuenta regresiva no se va a ver.');
  }
  if (conv.url && !/^https:\/\//.test(conv.url)) avisos.push('El link del botón no empieza con https:// (algunos navegadores lo marcan como inseguro).');
  if (crudo?.pixel?.meta && !plan.pixel?.meta) avisos.push('El píxel de Meta tiene que ser solo números (el id que ves en el Administrador de eventos).');
  if (!marca.pais) avisos.push('marca.json no dice el país: las legales salen con un texto general (y no se puede completar el código del WhatsApp).');
  if (!TIPOS[crudo?.tipo]) avisos.push(`El tipo de página «${crudo?.tipo}» no existe: se usó «${plan.tipo}». Tipos: ${Object.keys(TIPOS).join(', ')}.`);

  return { faltan, avisos, plan };
}

function buscarVideo(dirFotos, nombre) {
  return !!dirFotos && existsSync(join(dirFotos, nombre));
}
