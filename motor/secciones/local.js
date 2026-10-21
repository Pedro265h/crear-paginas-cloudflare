// Negocio local: servicios con precio, galería y ubicación con horarios.
import { CABECERA, BOTON, texto, largo, imagen, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, vacio, esc, urlDe, lleno } from '../util.js';
import { acciones } from './portada.js';

export const servicios = {
  nombre: 'Servicios',
  descripcion: 'Lo que ofrece el negocio: nombre, para qué sirve y precio (solo si la persona lo dio).',
  paraTipos: ['local'],
  banda: 'normal',
  variantes: { tarjetas: 'Tarjetas con foto', precios: 'Lista de precios' },
  campos: {
    ...CABECERA,
    items: listaCampo('Servicios', { titulo: texto('Servicio', { max: 60 }), texto: largo('Descripción', { max: 180 }), precio: texto('Precio', { max: 24 }), imagen: imagen('Foto') }, { min: 2, max: 9 }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'titulo') && ctx.modo === 'publicado') return '';
    const pie = vacio(c.boton) ? '' : `<div class="sec-acc">${acciones(ctx, c)}</div>`;
    if (s.variante === 'precios') {
      return `<div class="w">${cabecera(ctx, c)}<ul class="sv-p">${lista(ctx, c.items, (it, i) => `<li><div class="sv-pt">${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}<span class="sv-pd" aria-hidden="true"></span>${t(ctx, `items.${i}.precio`, it.precio, { tag: 'span', clase: 'sv-pr' })}</div>${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}</li>`, 'titulo')}</ul>${pie}</div>`;
    }
    return `<div class="w">${cabecera(ctx, c)}<ul class="g3 sv-g">${lista(ctx, c.items, (it, i) => {
      const foto = ctx.img(it.imagen, `items.${i}.imagen`, { tam: 'tarjeta', alt: typeof it.titulo === 'string' ? it.titulo : '' });
      return `<li class="sv-tj">${foto ? `<div class="sv-f">${foto}</div>` : ''}<div class="sv-c">${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}${t(ctx, `items.${i}.precio`, it.precio, { tag: 'p', clase: 'sv-pr' })}</div></li>`;
    }, 'titulo')}</ul>${pie}</div>`;
  },
  css: {
    base: '.sv-g,.sv-p{list-style:none;padding:0;margin:0}.s-servicios p{color:var(--suave);margin:.35em 0 0}.sv-pr{font-family:var(--f-tit);font-weight:700;color:var(--acento)!important}',
    tarjetas:
      '.sv-tj{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden;display:flex;flex-direction:column}' +
      '.sv-f img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}.sv-c{padding:20px 22px 24px;display:flex;flex-direction:column;flex:1}.sv-c .sv-pr{margin-top:auto;padding-top:12px}',
    precios:
      '.sv-p{max-width:760px;margin-inline:auto;display:grid;gap:22px}.sv-pt{display:flex;align-items:baseline;gap:12px}.sv-pt .h3{margin:0}' +
      '.sv-pd{flex:1;border-bottom:1px dotted var(--tenue);transform:translateY(-4px)}.sv-p .sv-pr{white-space:nowrap}',
  },
};

export const galeria = {
  nombre: 'Galería',
  descripcion: 'Fotos del lugar, del trabajo o de resultados (antes/después con permiso).',
  paraTipos: ['local', 'ventas', 'evento'],
  banda: 'normal',
  variantes: { cuadricula: 'Cuadrícula', mosaico: 'Mosaico' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: CABECERA.titulo,
    items: listaCampo('Fotos', { imagen: imagen('Foto'), texto: texto('Pie de foto', { max: 70 }) }, { min: 3, max: 9 }),
  },
  render(s, ctx) {
    const c = s.campos;
    const fotos = lista(ctx, c.items, (it, i) => {
      const f = ctx.img(it.imagen, `items.${i}.imagen`, { tam: 'tarjeta', alt: typeof it.texto === 'string' ? it.texto : '' });
      return f ? `<figure>${f}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'figcaption' })}</figure>` : '';
    });
    if (!fotos) return ctx.modo === 'publicado' ? '' : `<div class="w">${cabecera(ctx, c)}<p class="pc-sec"><span class="pc">Por completar: fotos del negocio</span></p></div>`;
    return `<div class="w">${cabecera(ctx, c)}<div class="ga-${s.variante === 'mosaico' ? 'm' : 'c'}">${fotos}</div></div>`;
  },
  css: {
    base: '.s-galeria figure{margin:0;position:relative;border-radius:var(--r);overflow:hidden}.s-galeria img{display:block;width:100%;height:100%;object-fit:cover}' +
      '.s-galeria figcaption{position:absolute;left:0;right:0;bottom:0;padding:24px 14px 12px;font-size:.85rem;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.65))}',
    cuadricula: '.ga-c{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}@media(min-width:820px){.ga-c{grid-template-columns:repeat(3,1fr);gap:14px}}.ga-c figure{aspect-ratio:1}',
    mosaico: '.ga-m{display:grid;grid-template-columns:repeat(2,1fr);grid-auto-rows:180px;gap:10px}@media(min-width:820px){.ga-m{grid-template-columns:repeat(4,1fr);grid-auto-rows:220px;gap:14px}}' +
      '.ga-m figure:nth-child(5n+1){grid-row:span 2}.ga-m figure:nth-child(5n+3){grid-column:span 2}',
  },
};

export const ubicacion = {
  nombre: 'Ubicación y horarios',
  descripcion: 'Dirección, horarios y cómo llegar. Para negocios con local.',
  paraTipos: ['local'],
  banda: 'sup',
  variantes: { tarjeta: 'Tarjeta' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: CABECERA.titulo,
    direccion: texto('Dirección', { max: 120 }),
    referencia: texto('Referencia', { max: 120, ayuda: 'Ej. "Frente al parque principal"' }),
    horarios: listaCampo('Horarios', { dia: texto('Días', { max: 30 }), hora: texto('Horas', { max: 40 }) }, { min: 1, max: 7 }),
    mapa: texto('Link de Google Maps', { max: 300, url: true }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const enlace = urlDe(c.mapa);
    const mapa = enlace ? `<a class="btn btn-sec" href="${esc(enlace)}" target="_blank" rel="noopener">${icono('lugar')}<span>Cómo llegar</span></a>` : '';
    const hay = hayItems(ctx, c.horarios, ['dia', 'hora']);
    const horarios = hay
      ? `<dl class="ub-h">${lista(ctx, c.horarios, (h, i) => `<div>${t(ctx, `horarios.${i}.dia`, h.dia, { tag: 'dt', siempre: true })}${t(ctx, `horarios.${i}.hora`, h.hora, { tag: 'dd', siempre: true })}</div>`, ['dia', 'hora'])}</dl>`
      : '';
    // En publicado cada celda sale solo si tiene algo (dirección, referencia o mapa; horarios), y si queda una sola la
    // tarjeta va a una columna. En el estudio las dos se ven, con su aviso.
    const publicado = ctx.modo === 'publicado';
    const conDir = !publicado || lleno(c.direccion) || lleno(c.referencia) || !!mapa;
    const conHoras = !publicado || hay;
    if (!conDir && !conHoras) return '';
    const dir = conDir
      ? `<div class="ub-d">${icono('lugar', 'ic ub-i')}<div>${t(ctx, 'direccion', c.direccion, { tag: 'p', clase: 'ub-dir', siempre: true })}${t(ctx, 'referencia', c.referencia, { tag: 'p', clase: 'ub-ref' })}${mapa}</div></div>`
      : '';
    const horas = conHoras ? `<div class="ub-hh">${icono('reloj', 'ic ub-i')}${horarios || '<p class="pc">Por completar: los horarios</p>'}</div>` : '';
    return (
      `<div class="w">${cabecera(ctx, c)}<div class="ub${dir && horas ? '' : ' ub-1'}">${dir}${horas}</div>` +
      `${vacio(c.boton) ? '' : `<div class="sec-acc">${acciones(ctx, c)}</div>`}</div>`
    );
  },
  css: {
    base:
      '.ub{display:grid;gap:1px;background:var(--linea);border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden;max-width:900px;margin-inline:auto}' +
      '@media(min-width:760px){.ub{grid-template-columns:1fr 1fr}.ub.ub-1{grid-template-columns:1fr;max-width:560px}}.ub>div{background:var(--fondo);padding:clamp(22px,3vw,32px);display:flex;gap:16px;align-items:flex-start}' +
      '.ub-i{width:26px;height:26px;color:var(--acento);flex:none}.ub-dir{margin:0;font-weight:700;font-size:1.1rem}.ub-ref{margin:.3em 0 0;color:var(--suave)}' +
      '.ub .btn-sec{margin-top:16px}.ub-h{margin:0;display:grid;gap:8px;flex:1}.ub-h div{display:flex;justify-content:space-between;gap:16px;border-bottom:1px dashed var(--linea);padding-bottom:8px}' +
      '.ub-h dt{font-weight:600}.ub-h dd{margin:0;color:var(--suave);text-align:right}',
  },
};
