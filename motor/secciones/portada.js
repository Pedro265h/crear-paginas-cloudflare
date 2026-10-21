// Barra de aviso y portada (la primera pantalla: lo que más pesa en la conversión).
import { CABECERA, BOTON, texto, largo, imagen, lista as listaCampo } from '../campos.js';
import { esc, t, lista, hayItems, boton, nota, antetitulo, icono, fechaLegible, instanteEvento, aviso, vacio, plano, sinMarcas } from '../util.js';
import { formularioHTML } from '../form.js';
import { limpiarVideo, fuenteVideo } from '../video.js';

// ---------- piezas compartidas ----------

// Fecha, hora y modalidad del evento como chips. Con data-hora-local el JS agrega "En tu hora: …" si el visitante
// está en otra zona.
export function infoEvento(ctx) {
  const e = ctx.plan.evento;
  if (!e || !e.fecha) return '';
  const f = fechaLegible(e.fecha, e.zona);
  if (!f.dia) return '';
  const ms = instanteEvento(e.fecha, e.zona);
  const presencial = e.modalidad === 'presencial';
  return (
    `<ul class="evento">` +
    `<li>${icono('calendario')}<span>${esc(f.dia)} · ${esc(f.hora)} <small>(${esc(f.zona)})</small><small class="hl-local" data-hora-local="${ms}" data-zona="${esc(f.iana)}"></small></span></li>` +
    `<li>${icono(presencial ? 'lugar' : 'play')}<span>${presencial ? esc(e.lugar || 'Presencial') : 'Online en vivo'}</span></li>` +
    `</ul>`
  );
}

// Video: YouTube con fachada (carga el reproductor solo al tocar, para no frenar la página), Vimeo (con el hash de los
// no listados), Streamable, Loom, Panda, Wistia, un .mp4, o el código de inserción de VTurb/Panda/Wistia saneado (solo
// las etiquetas y los links de esos proveedores; ver video.js). Cualquier otro link no se pinta.
export function videoHTML(ctx, url, ruta, o = {}) {
  const crudo = typeof url === 'string' ? url.trim() : '';
  const v = limpiarVideo(crudo);
  const edicion = ctx.modo === 'edicion' ? ` data-vid="${esc(ctx.sid + ':' + ruta)}"` : '';
  const invalido = (que) => (ctx.modo === 'publicado' ? '' : `<div class="vid vid-pc"${edicion}>${icono('play', 'ic vid-pc-ic')}${aviso(ctx, { porCompletar: que }, ruta)}</div>`);
  if (!v) return invalido(crudo ? 'un código de video de VTurb, Panda, Wistia, YouTube, Vimeo, Loom o Streamable (hasta 8.000 caracteres)' : 'el link de tu video');
  if (v.startsWith('<')) return `<div class="vid vid-raw"${edicion}>${v}</div>`;
  const f = fuenteVideo(v);
  if (!f) return invalido('un link de video válido (YouTube, Vimeo, Loom, Streamable, Panda, Wistia o un .mp4)');
  const yt = f.yt;
  if (yt) {
    const carga = o.prioridad ? 'fetchpriority="high"' : 'loading="lazy"';
    return (
      `<div class="vid"${edicion}><button class="vid-f" type="button" data-yt="${yt}" aria-label="Ver el video">` +
      `<img src="https://i.ytimg.com/vi/${yt}/hqdefault.jpg" alt="" width="480" height="360" ${carga}>` +
      `<span class="vid-p">${icono('play')}</span></button></div>`
    );
  }
  if (f.archivo) return `<div class="vid"${edicion}><video src="${esc(f.archivo)}" controls playsinline preload="metadata"></video></div>`;
  return `<div class="vid"${edicion}><iframe src="${esc(f.src)}" title="Video" loading="${o.prioridad ? 'eager' : 'lazy'}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
}

// Botón + nota. Con retraso (VSL) el bloque aparece a los N segundos.
export function acciones(ctx, c, o = {}) {
  const seg = Number(o.retraso) || 0;
  const retraso = seg > 0 ? ` data-retraso="${seg}"` : '';
  const etiquetaRetraso = seg > 0 && ctx.modo !== 'publicado' ? `<span class="tag-ret">Aparece a los ${seg >= 60 ? Math.round(seg / 60) + ' min' : seg + ' s'}</span>` : '';
  return `<div class="acc"${retraso}>${etiquetaRetraso}${boton(ctx, 'boton', c.boton, { clase: 'btn-g' })}${nota(ctx, 'nota', c.nota)}</div>`;
}

function puntos(ctx, items) {
  if (!hayItems(ctx, items, 'texto')) return '';
  return `<ul class="hero-pts">${lista(ctx, items, (it, i) => `<li>${icono('check')}${t(ctx, `puntos.${i}.texto`, it.texto, { tag: 'span', siempre: true })}</li>`, 'texto')}</ul>`;
}

// ---------- secciones ----------

export const aviso_ = {
  nombre: 'Barra de aviso',
  descripcion: 'Franja fina arriba de todo con la fecha o la urgencia. Al tocarla hace la acción de la página.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'ninguna',
  variantes: { barra: 'Barra' },
  campos: { texto: texto('Texto', { max: 90, ayuda: 'Ej. "Masterclass gratis en vivo · Sábado 18 de octubre · Cupos limitados"' }) },
  render(s, ctx) {
    const c = s.campos;
    if (vacio(c.texto) && ctx.modo === 'publicado') return '';
    return `<a class="aviso-a" href="${esc(ctx.cta.href)}"${ctx.cta.attrs}>${t(ctx, 'texto', c.texto, { tag: 'span', siempre: true })}<span aria-hidden="true">→</span></a>`;
  },
  css: {
    base:
      '.s-aviso{padding:0;background:var(--pri);color:var(--sobre-pri)}' +
      '.aviso-a{display:flex;justify-content:center;align-items:center;gap:10px;padding:11px 16px;font-size:.86rem;font-weight:650;' +
      'letter-spacing:.01em;color:inherit;text-decoration:none;text-align:center}' +
      '.aviso-a:hover span[aria-hidden]{transform:translateX(3px)}.aviso-a span[aria-hidden]{transition:transform .2s}',
  },
};

export const hero = {
  nombre: 'Portada',
  descripcion:
    'La primera pantalla. Promesa principal específica (resultado + tiempo o mecanismo), subtítulo que quita la objeción ' +
    'principal, 3 puntos clave y el botón. En celular el botón tiene que verse sin bajar.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'portada',
  variantes: { centrado: 'Centrada', dividido: 'Texto y foto', video: 'Video arriba (VSL)', evento: 'Evento con formulario' },
  campos: {
    ...CABECERA,
    titulo: texto('Título principal', { max: 110, ayuda: 'La promesa. Específica, sin humo.' }),
    puntos: listaCampo('Puntos clave', { texto: texto('Punto', { max: 70 }) }, { min: 0, max: 4 }),
    ...BOTON,
    imagen: imagen('Foto', { ayuda: 'La persona que enseña o el producto. Variante "Texto y foto".' }),
    // El logo en lugar del título: el título sigue en la página para Google y los lectores de pantalla. La IA no lo
    // llena (sinIA): lo pone la persona.
    logo: imagen('Logo en lugar del título', { ayuda: 'Opcional: tu logo grande en vez del título escrito.', sinIA: true }),
  },
  extras: (s) => (s.campos?.logo && !vacio(s.campos.logo) ? ['+logo'] : []),
  render(s, ctx) {
    const c = s.campos;
    const v = s.variante;
    const logo = c.logo && !vacio(c.logo) ? ctx.img(c.logo, 'logo', { prioridad: true, tam: 'logo', alt: sinMarcas(typeof c.titulo === 'string' ? c.titulo : '') || ctx.plan.marca?.nombre || '' }) : '';
    const h1 = logo
      ? `<h1 class="h1 h1-logo">${logo}</h1>`
      : t(ctx, 'titulo', c.titulo, { tag: 'h1', clase: 'h1', resaltado: c.resaltado, siempre: true });
    const ante = antetitulo(ctx, 'antetitulo', c.antetitulo);
    const sub = t(ctx, 'subtitulo', c.subtitulo, { tag: 'p', clase: 'lead' });
    const ev = infoEvento(ctx);

    if (v === 'video') {
      const vid = videoHTML(ctx, ctx.plan.video?.url, 'video', { prioridad: true });
      return `<div class="w hero-v">${ante}${h1}${sub}${vid}${acciones(ctx, c, { retraso: ctx.plan.video?.ctaSegundos })}${puntos(ctx, c.puntos)}</div>`;
    }
    if (v === 'evento') {
      const usaForm = ctx.plan.conversion?.accion === 'formulario';
      // En celular el formulario queda abajo, así que arriba va un botón que lo abre: el CTA siempre en la primera pantalla.
      const movil = usaForm ? `<div class="acc solo-movil">${boton(ctx, 'boton', c.boton, { clase: 'btn-g' })}${nota(ctx, 'nota', c.nota)}</div>` : '';
      const derecha = usaForm
        ? `<div class="hero-form"><p class="hero-form-t">${sinMarcas(c.boton) ? plano(ctx, c.boton) : 'Reserva tu cupo gratis'}</p>${formularioHTML(ctx, { id: 'fh-' + s.id, boton: !vacio(c.boton) ? c.boton : '', rutaBoton: 'boton', nota: !vacio(c.nota) ? c.nota : '' })}</div>`
        : `<div class="hero-form">${acciones(ctx, c)}</div>`;
      return `<div class="w hero-e"><div class="hero-t">${ante}${h1}${sub}${ev}${movil}</div>${derecha}<div class="hero-x">${puntos(ctx, c.puntos)}</div></div>`;
    }
    const foto = ctx.img(c.imagen, 'imagen', { prioridad: true, tam: v === 'dividido' ? 'retrato' : 'ancho', alt: '' });
    const textoHero = `${ante}${h1}${sub}${ev}${puntos(ctx, c.puntos)}${acciones(ctx, c)}`;
    if (v === 'dividido') return foto ? `<div class="w hero-d"><div class="hero-t">${textoHero}</div><div class="hero-m">${foto}</div></div>` : `<div class="w hero-d hero-sf"><div class="hero-t">${textoHero}</div></div>`;
    return `<div class="w hero-c">${textoHero}${foto ? `<div class="hero-img">${foto}</div>` : ''}</div>`;
  },
  css: {
    base:
      '.s-hero{padding-block:clamp(36px,6vw,88px) clamp(56px,8vw,112px);position:relative;isolation:isolate}' +
      '.s-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(70% 55% at 50% -5%,var(--pri-suave),transparent 72%);pointer-events:none}' +
      '.s-hero .h1{margin:.18em 0 .32em}' +
      // .acc, .evento, .hero-pts y .tag-ret están en la base de render.js (también los usan otras secciones).
      '.s-hero .lead{font-size:clamp(1.06rem,1.6vw,1.25rem)}',
    centrado:
      '.hero-c{display:flex;flex-direction:column;align-items:center;text-align:center}' +
      '.hero-c .lead{margin-inline:auto}.hero-c .acc{align-items:center}' +
      '.hero-c .hero-pts{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px}' +
      '.hero-c .evento{justify-content:center}' +
      '.hero-img{margin-top:clamp(36px,6vw,64px);width:100%;border-radius:var(--r-g);overflow:hidden;border:1px solid var(--linea)}' +
      '.hero-img img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}',
    dividido:
      '.hero-d{display:grid;gap:36px;align-items:center}' +
      '@media(min-width:920px){.hero-d{grid-template-columns:1.12fr .88fr;gap:64px}}' +
      '.hero-sf{grid-template-columns:minmax(0,880px)!important}.hero-m{position:relative}' +
      '.hero-m img{display:block;width:100%;height:auto;border-radius:var(--r-g);aspect-ratio:4/5;object-fit:cover;border:1px solid var(--linea)}' +
      '@media(max-width:919px){.hero-m img{aspect-ratio:4/3;max-height:62vh}}',
    video:
      '.hero-v{max-width:900px;margin-inline:auto;text-align:center;display:flex;flex-direction:column;align-items:center}' +
      '.hero-v .lead{margin-inline:auto}.hero-v .vid{width:100%;margin-top:clamp(20px,3vw,32px)}' +
      '.hero-v .acc{align-items:center;width:100%}.hero-v .hero-pts{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px;margin-top:26px}' +
      // En una VSL el video tiene que verse sin bajar: título más chico que en las otras portadas.
      '.hero-v .h1{font-size:clamp(1.7rem,3.3vw,2.75rem)!important;line-height:1.08!important;max-width:30ch}.hero-v .lead{font-size:1.05rem}' +
      '@media(max-width:620px){.hero-v .h1{font-size:clamp(1.55rem,6.6vw,2.1rem)!important}}',
    '+logo': '.h1-logo{line-height:0;max-width:100%}.h1-logo img{display:block;width:min(560px,100%);height:auto;max-height:min(240px,40vh);object-fit:contain;object-position:left center}' +
      '.hero-c .h1-logo img,.hero-v .h1-logo img{margin-inline:auto;object-position:center}',
    evento:
      '.hero-e{display:grid;gap:28px;align-items:start}.hero-x:empty{display:none}.hero-x .hero-pts{margin-top:0}' +
      '@media(min-width:960px){.hero-e{grid-template-columns:1.12fr .88fr;grid-template-areas:"t f" "x f";column-gap:60px;row-gap:0;align-items:center}' +
      '.hero-e>.hero-t{grid-area:t}.hero-e>.hero-form{grid-area:f}.hero-e>.hero-x{grid-area:x;align-self:start}.hero-x .hero-pts{margin-top:22px}.hero-e .solo-movil{display:none!important}}' +
      '.hero-form{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,3vw,32px);box-shadow:0 30px 80px -40px rgba(0,0,0,.55)}' +
      '.hero-form-t{margin:0 0 16px;font-family:var(--f-tit);font-weight:700;font-size:1.3rem;line-height:1.15}' +
      '.hero-form .acc{margin:0;align-items:stretch}.hero-form .acc .btn{width:100%}',
  },
};
