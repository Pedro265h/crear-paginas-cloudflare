// Prueba: quién enseña, testimonios y cifras. Nada de esto se inventa: si falta, queda "por completar".
import { CABECERA, texto, largo, imagen, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, antetitulo, vacio, esc, soloPendiente } from '../util.js';

export const experto = {
  nombre: 'Quién te enseña',
  descripcion: 'La persona detrás: nombre, rol, historia corta en primera persona y logros VERIFICABLES (solo los que dio la persona).',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'normal',
  variantes: { lado: 'Foto al lado', centrado: 'Centrado' },
  campos: {
    antetitulo: texto('Antetítulo', { max: 40, ayuda: 'Ej. "Quién te enseña"' }),
    nombre: texto('Nombre', { max: 60 }),
    rol: texto('Rol', { max: 90 }),
    bio: largo('Historia corta', { max: 650, ayuda: 'En primera persona. Por qué le deben creer.' }),
    logros: listaCampo('Logros', { texto: texto('Logro', { max: 110 }) }, { min: 0, max: 5 }),
    imagen: imagen('Foto'),
  },
  render(s, ctx) {
    const c = s.campos;
    if (vacio(c.nombre) && vacio(c.bio) && ctx.modo === 'publicado') return '';
    const logros = hayItems(ctx, c.logros, 'texto')
      ? `<ul class="ex-l">${lista(ctx, c.logros, (it, i) => `<li>${icono('estrella')}${t(ctx, `logros.${i}.texto`, it.texto, { tag: 'span', siempre: true })}</li>`, 'texto')}</ul>`
      : '';
    const foto = ctx.img(c.imagen, 'imagen', { tam: 'retrato', alt: typeof c.nombre === 'string' ? c.nombre : '' });
    const textoEx =
      antetitulo(ctx, 'antetitulo', c.antetitulo) +
      t(ctx, 'nombre', c.nombre, { tag: 'h2', clase: 'h2', siempre: true }) +
      t(ctx, 'rol', c.rol, { tag: 'p', clase: 'ex-r' }) +
      t(ctx, 'bio', c.bio, { tag: 'p', clase: 'ex-b' }) +
      logros;
    if (s.variante === 'centrado') return `<div class="w ex-c">${foto ? `<div class="ex-fc">${foto}</div>` : ''}${textoEx}</div>`;
    return `<div class="w ex-d">${foto ? `<div class="ex-f">${foto}</div>` : ''}<div>${textoEx}</div></div>`;
  },
  css: {
    base:
      '.ex-r{color:var(--acento);font-weight:600;margin:-.2em 0 1em}.ex-b{color:var(--suave);font-size:1.06rem;line-height:1.7;max-width:62ch}' +
      '.ex-l{list-style:none;padding:0;margin:24px 0 0;display:grid;gap:12px}.ex-l li{display:flex;gap:12px;align-items:flex-start}' +
      '.ex-l .ic{width:20px;height:20px;flex:none;color:var(--acento);margin-top:2px}',
    lado:
      '.ex-d{display:grid;gap:36px;align-items:center}@media(min-width:880px){.ex-d{grid-template-columns:.8fr 1.2fr;gap:64px}}' +
      '.ex-f img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r-g);border:1px solid var(--linea)}' +
      '@media(max-width:879px){.ex-f{max-width:420px}}',
    centrado:
      '.ex-c{max-width:760px;margin-inline:auto;text-align:center;display:flex;flex-direction:column;align-items:center}' +
      '.ex-fc img{width:168px;height:168px;border-radius:50%;object-fit:cover;border:3px solid var(--pri);margin-bottom:22px}' +
      '.ex-c .ex-b{margin-inline:auto}.ex-c .ex-l{text-align:left}',
  },
};

export const testimonios = {
  nombre: 'Testimonios',
  descripcion: 'Lo que dicen clientes reales. La IA NUNCA los inventa: deja cada uno "por completar" si la persona no los dio.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'sup',
  variantes: { tarjetas: 'Tarjetas', destacado: 'Uno destacado' },
  campos: {
    ...CABECERA,
    items: listaCampo(
      'Testimonios',
      { texto: largo('Testimonio', { max: 320 }), nombre: texto('Nombre', { max: 50 }), detalle: texto('Detalle', { max: 70, ayuda: 'Ciudad, profesión o resultado' }), imagen: imagen('Foto') },
      { min: 0, max: 6 },
    ),
  },
  render(s, ctx) {
    const c = s.campos;
    // Sin el texto, un testimonio es una tarjeta de 5 estrellas vacía: no se publica.
    if (!hayItems(ctx, c.items, 'texto')) return ctx.modo === 'publicado' ? '' : `<div class="w">${cabecera(ctx, c)}<p class="pc-sec"><span class="pc">Por completar: testimonios reales de tus clientes</span></p></div>`;
    const tarjeta = (it, i, grande) => {
      const falta = soloPendiente(it);
      if (falta) return `<figure class="te te-pc"${ctx.modo === 'edicion' ? ` data-e="${ctx.sid}:items.${i}.texto"` : ''} data-pc>${icono('persona')}<span>Por completar: ${esc(falta)}</span></figure>`;
      const foto = ctx.img(it.imagen, `items.${i}.imagen`, { tam: 'avatar', alt: typeof it.nombre === 'string' ? it.nombre : '' });
      return (
        `<figure class="te${grande ? ' te-g' : ''}"><div class="te-e" aria-hidden="true">${icono('estrella')}${icono('estrella')}${icono('estrella')}${icono('estrella')}${icono('estrella')}</div>` +
        `<blockquote>${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p', siempre: true })}</blockquote>` +
        `<figcaption>${foto ? `<span class="te-f">${foto}</span>` : ''}<span>${t(ctx, `items.${i}.nombre`, it.nombre, { tag: 'strong', siempre: true })}${t(ctx, `items.${i}.detalle`, it.detalle, { tag: 'small' })}</span></figcaption></figure>`
      );
    };
    if (s.variante === 'destacado') {
      let primero = true;
      const html = lista(ctx, c.items, (it, i) => {
        const g = primero;
        primero = false;
        return tarjeta(it, i, g);
      }, 'texto');
      return `<div class="w">${cabecera(ctx, c)}<div class="te-d">${html}</div></div>`;
    }
    return `<div class="w">${cabecera(ctx, c)}<div class="te-m">${lista(ctx, c.items, (it, i) => tarjeta(it, i, false), 'texto')}</div></div>`;
  },
  css: {
    base:
      '.te{margin:0;background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(20px,2.6vw,28px);display:flex;flex-direction:column;gap:16px;break-inside:avoid}' +
      '.te blockquote{margin:0}.te blockquote p{margin:0;font-size:1.02rem;line-height:1.65}' +
      '.te-e{display:flex;gap:2px;color:#f5b301}.te-e .ic{width:16px;height:16px;fill:currentColor}' +
      '.te figcaption{display:flex;gap:12px;align-items:center;margin-top:auto}.te figcaption strong{display:block}.te figcaption small{color:var(--tenue)}' +
      '.te-f img{width:44px;height:44px;border-radius:50%;object-fit:cover;display:block}.te figcaption>span{min-width:0}' +
      '.te-pc{align-items:center;justify-content:center;text-align:center;min-height:180px;border-style:dashed;color:var(--suave);font-size:.9rem}.te-pc .ic{width:30px;height:30px;color:var(--tenue)}',
    tarjetas: '.te-m{columns:1;column-gap:18px}.te-m .te{margin-bottom:18px}@media(min-width:760px){.te-m{columns:2}}@media(min-width:1080px){.te-m{columns:3}}',
    destacado:
      '.te-d{display:grid;gap:18px}@media(min-width:860px){.te-d{grid-template-columns:repeat(2,1fr)}.te-g{grid-column:1/-1}}' +
      '.te-g blockquote p{font-family:var(--f-tit);font-size:clamp(1.3rem,2.6vw,1.9rem);line-height:1.35}',
  },
};

export const cifras = {
  nombre: 'Cifras',
  descripcion: 'Números que dan confianza (años, clientes, alumnos). SOLO cifras que dio la persona.',
  paraTipos: ['local', 'ventas', 'registro', 'vsl', 'evento'],
  banda: 'normal',
  variantes: { fila: 'En fila' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    items: listaCampo(
      'Cifras',
      {
        valor: texto('Cifra', { max: 12, ayuda: 'Ej. +3.000' }),
        etiqueta: texto('Qué significa', { max: 50 }),
        detalle: texto('Detalle', { max: 60, ayuda: 'Opcional: una línea más chica debajo, ej. "impactadas en eventos"' }),
      },
      { min: 2, max: 4 },
    ),
  },
  extras: (s) => (Array.isArray(s.campos?.items) && s.campos.items.some((it) => typeof it?.detalle === 'string' && it.detalle.trim()) ? ['+detalle'] : []),
  render(s, ctx) {
    const c = s.campos;
    // Una cifra sin su número no se publica (quedaría solo la etiqueta).
    if (!hayItems(ctx, c.items, 'valor')) return ctx.modo === 'publicado' ? '' : `<div class="w"><p class="pc-sec"><span class="pc">Por completar: cifras reales (años, clientes, alumnos)</span></p></div>`;
    return (
      `<div class="w">${antetitulo(ctx, 'antetitulo', c.antetitulo).replace('class="ey"', 'class="ey ci-ey"')}` +
      `<ul class="ci">${lista(ctx, c.items, (it, i) => `<li>${t(ctx, `items.${i}.valor`, it.valor, { tag: 'strong', siempre: true })}${t(ctx, `items.${i}.etiqueta`, it.etiqueta, { tag: 'span' })}${t(ctx, `items.${i}.detalle`, it.detalle, { tag: 'small', clase: 'ci-d' })}</li>`, 'valor')}</ul></div>`
    );
  },
  css: {
    '+detalle': '.ci .ci-d{display:block;color:var(--suave);font-size:.88rem;line-height:1.4}',
    base:
      '.s-cifras{padding-block:clamp(40px,6vw,72px)}.ci-ey{text-align:center}' +
      // Filas que se estiran: una cifra suelta al final ocupa todo el ancho (sin celda gris) y una cifra larga pasa a su
      // propia fila en vez de cortarse.
      '.ci{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:1px;background:var(--linea);border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden}' +
      '.ci li{flex:1 1 150px;background:var(--fondo);padding:clamp(20px,3vw,32px) 14px;display:grid;gap:6px;align-content:start;text-align:center;overflow-wrap:break-word}' +
      '.ci strong{font-family:var(--f-tit);font-size:clamp(2rem,4.6vw,3rem);line-height:1;color:var(--acento)}.ci span{color:var(--suave);font-size:.95rem}',
  },
};

