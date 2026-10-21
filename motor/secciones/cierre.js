// Página de gracias, bloque de video y pie de página.
import { CABECERA, BOTON, texto, largo, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, vacio, esc, antetitulo, instanteEvento, plano, sinMarcas, urlDe, aviso } from '../util.js';
import { videoHTML, acciones, infoEvento } from './portada.js';

function fechaCal(ms) {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Links para agregar el evento al calendario (Google y archivo .ics para iPhone/Outlook).
function calendario(ctx) {
  const e = ctx.plan.evento;
  const ms = e && instanteEvento(e.fecha, e.zona);
  if (!ms) return '';
  const fin = ms + (Number(e.duracionMin) || 90) * 60000;
  const titulo = e.nombre || ctx.plan.seo?.titulo || 'Evento';
  const lugar = e.modalidad === 'presencial' ? e.lugar || '' : 'Online';
  const g = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${fechaCal(ms)}/${fechaCal(fin)}&location=${encodeURIComponent(lugar)}`;
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${fechaCal(ms)}`, `DTEND:${fechaCal(fin)}`, `SUMMARY:${titulo}`, `LOCATION:${lugar}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return (
    `<div class="gr-cal"><a class="btn btn-sec" href="${esc(g)}" target="_blank" rel="noopener">${icono('calendario')}<span>Google Calendar</span></a>` +
    `<a class="btn btn-sec" href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}" download="evento.ics">${icono('calendario')}<span>iPhone / Outlook</span></a></div>`
  );
}

export const gracias = {
  nombre: 'Confirmación (gracias)',
  descripcion:
    'Lo primero que ve la persona después de registrarse o comprar: confirma, dice los siguientes pasos y lleva al grupo. ' +
    'Escribe {nombre} en el título donde va el nombre de la persona (ej. "¡Listo{nombre}! Tu cupo está confirmado").',
  paraTipos: ['gracias'],
  banda: 'portada',
  variantes: { confirmacion: 'Confirmación' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: texto('Título', { max: 90 }),
    texto: largo('Texto', { max: 300 }),
    pasos: listaCampo('Siguientes pasos', { titulo: texto('Paso', { max: 60 }), texto: largo('Detalle', { max: 160 }) }, { min: 0, max: 4 }),
    grupoTexto: texto('Texto del botón del grupo', { max: 40, ayuda: 'Ej. "Entrar al grupo de WhatsApp"' }),
    grupoUrl: texto('Link del grupo', { max: 300, url: true, ayuda: 'Link de invitación al grupo de WhatsApp o Telegram' }),
  },
  render(s, ctx) {
    const c = s.campos;
    // Un título hecho solo de marcas "[[POR COMPLETAR]]" queda vacío en publicado: va el de fábrica.
    const titulo = typeof c.titulo === 'string' && (ctx.modo === 'publicado' ? sinMarcas(c.titulo) : c.titulo.trim()) ? c.titulo : '¡Listo{nombre}!';
    // En edición {nombre} se ve como una pastilla no editable que edicion.js vuelve a convertir en {nombre} al guardar.
    const nombre = ctx.modo === 'edicion' ? '<span class="ew-var" contenteditable="false" data-marca="{nombre}">nombre</span>' : '<span data-nombre></span>';
    const h1 = `<h1 class="h1"${ctx.modo === 'edicion' ? ` data-e="${ctx.sid}:titulo"` : ''}>${plano(ctx, titulo).replace('{nombre}', nombre)}</h1>`;
    // El link puede venir con texto alrededor (pegado encima de un aviso): vale el primer link que tenga.
    const url = urlDe(c.grupoUrl);
    const textoGrupo = sinMarcas(c.grupoTexto) || ctx.modo !== 'publicado' ? c.grupoTexto : '';
    const grupo = url
      ? `<a class="btn btn-g" href="${esc(url)}" target="_blank" rel="noopener">${icono('whatsapp')}<span${ctx.modo === 'edicion' ? ` data-e="${ctx.sid}:grupoTexto"` : ''}>${vacio(textoGrupo) ? 'Entrar al grupo' : plano(ctx, textoGrupo)}</span></a>`
      : ctx.modo === 'publicado' ? '' : `<p class="pc-sec">${aviso(ctx, { porCompletar: 'el link de tu grupo (opcional)' }, 'grupoUrl')}</p>`;
    const pasos = hayItems(ctx, c.pasos, 'titulo')
      ? `<ol class="gr-p">${lista(ctx, c.pasos, (p, i, n) => `<li><span class="gr-n">${n + 1}</span><div>${t(ctx, `pasos.${i}.titulo`, p.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${t(ctx, `pasos.${i}.texto`, p.texto, { tag: 'p' })}</div></li>`, 'titulo')}</ol>`
      : '';
    return (
      `<div class="w gr"><div class="gr-ok">${icono('check')}</div>${antetitulo(ctx, 'antetitulo', c.antetitulo)}${h1}` +
      `${t(ctx, 'texto', c.texto, { tag: 'p', clase: 'lead' })}${infoEvento(ctx)}<div class="gr-acc">${grupo}</div>${calendario(ctx)}${pasos}</div>`
    );
  },
  css: {
    base:
      '.gr{max-width:760px;margin-inline:auto;text-align:center;display:flex;flex-direction:column;align-items:center}.gr .lead{margin-inline:auto}' +
      '.gr-ok{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;background:var(--pri);color:var(--sobre-pri);margin-bottom:18px;box-shadow:0 0 0 10px var(--pri-suave)}' +
      '.gr-ok .ic{width:36px;height:36px;stroke-width:2.4}.gr .evento{justify-content:center}.gr-acc{margin-top:28px;width:100%;display:flex;justify-content:center}' +
      '.gr-acc .btn .ic{width:22px;height:22px}.gr-cal{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:14px}' +
      '.gr-p{list-style:none;padding:0;margin:40px 0 0;display:grid;gap:14px;text-align:left;width:100%}' +
      '.gr-p li{display:flex;gap:16px;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:18px 20px}.gr-p .h3{margin:0}.gr-p p{margin:.3em 0 0;color:var(--suave)}' +
      '.gr-n{flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--pri-suave);color:var(--acento);font-weight:800}',
  },
};

export const video = {
  nombre: 'Video',
  descripcion: 'Un video a lo ancho con su título. Para una presentación, un testimonio en video o el VSL más abajo.',
  paraTipos: ['vsl', 'ventas', 'registro', 'local', 'evento', 'gracias'],
  banda: 'normal',
  variantes: { centrado: 'Centrado' },
  campos: {
    ...CABECERA,
    // video: true → se guarda con limpiarVideo (link, o código de inserción saneado de hasta 8.000 caracteres).
    url: texto('Link del video', { max: 400, video: true, ayuda: 'YouTube, Vimeo, Streamable, Loom, Panda, Wistia o el código de VTurb/Panda/Wistia' }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const vid = videoHTML(ctx, c.url, 'url');
    if (!vid) return '';
    return `<div class="w vi">${cabecera(ctx, c)}${vid}${vacio(c.boton) ? '' : acciones(ctx, c)}</div>`;
  },
  css: { base: '.vi{max-width:920px;margin-inline:auto;display:flex;flex-direction:column;align-items:center}.vi .vid{width:100%}.vi .acc{align-items:center}' },
};

export const pie = {
  nombre: 'Pie de página',
  descripcion: 'Marca, aviso legal corto y links a privacidad y términos.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento', 'gracias'],
  banda: 'pie',
  variantes: { simple: 'Simple' },
  campos: {
    marca: texto('Nombre de la marca', { max: 60 }),
    texto: largo('Aviso', { max: 300, ayuda: 'Ej. "Esta formación es educativa y no garantiza resultados ni ingresos específicos."' }),
  },
  // El logo de la marca de la página (plan.marca.logo), si tiene: va primero (con PRISMA también en la barra de arriba).
  extras: (s, plan) => (plan?.marca?.logo && !vacio(plan.marca.logo) ? ['+logo'] : []),
  render(s, ctx) {
    const c = s.campos;
    const anio = new Date().getFullYear();
    const propia = ctx.modo === 'publicado' ? sinMarcas(c.marca) : vacio(c.marca) ? '' : c.marca;
    const marca = propia ? c.marca : ctx.plan.marca?.nombre || '';
    const logo = ctx.plan.marca?.logo && !vacio(ctx.plan.marca.logo) ? ctx.img(ctx.plan.marca.logo, '', { tam: 'logo', alt: sinMarcas(marca) }) : '';
    return (
      `<div class="w pie">${logo ? `<p class="pie-logo">${logo.replace(/ data-img="[^"]*"/, '')}</p>` : ''}<p class="pie-m">© ${anio} <span${ctx.modo === 'edicion' ? ` data-e="${ctx.sid}:marca"` : ''}>${plano(ctx, marca)}</span></p>` +
      `<nav class="pie-l"><a href="/privacidad" data-legal>Política de privacidad</a><a href="/terminos" data-legal>Términos y condiciones</a></nav>` +
      `${t(ctx, 'texto', c.texto, { tag: 'p', clase: 'pie-x' })}</div>`
    );
  },
  css: {
    '+logo': '.pie-logo{line-height:0}.pie-logo img{display:block;height:auto;width:auto;max-width:min(240px,70vw);max-height:30px}',
    base:
      '.s-pie{padding-block:36px 44px;border-top:1px solid var(--linea)}.pie{display:grid;gap:10px;justify-items:center;text-align:center;font-size:.85rem;color:var(--tenue)}' +
      '.pie p{margin:0}.pie-l{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px}.pie-l a{color:var(--suave);text-decoration:none}.pie-l a:hover{text-decoration:underline}' +
      '.pie-x{max-width:70ch;font-size:.78rem;line-height:1.55}',
  },
};
