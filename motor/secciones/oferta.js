// La oferta: temario, qué incluye y precio, bonos, garantía y preguntas frecuentes.
import { CABECERA, BOTON, texto, largo, imagen, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, vacio, pendiente, boton, plano, sinMarcas } from '../util.js';
import { acciones } from './portada.js';

export const temario = {
  nombre: 'Temario',
  descripcion: 'Módulos o clases, cada uno con el resultado que deja (no solo el tema).',
  paraTipos: ['ventas', 'vsl', 'registro'],
  banda: 'normal',
  variantes: { acordeon: 'Acordeón', lista: 'Lista de módulos' },
  campos: {
    ...CABECERA,
    items: listaCampo('Módulos', { titulo: texto('Módulo', { max: 80 }), texto: largo('Qué logra', { max: 260 }) }, { min: 3, max: 12 }),
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'titulo') && ctx.modo === 'publicado') return '';
    // Se numera con n (los módulos que se ven), no con la posición en el plan: un módulo sin publicar no deja hueco.
    if (s.variante === 'lista') {
      return `<div class="w">${cabecera(ctx, c)}<ol class="tm-l">${lista(ctx, c.items, (it, i, n) => `<li class="tj"><span class="tm-n">Módulo ${n + 1}</span>${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}</li>`, 'titulo')}</ol></div>`;
    }
    const abierto = ctx.modo === 'edicion' ? ' open' : '';
    return `<div class="w">${cabecera(ctx, c)}<div class="acor">${lista(ctx, c.items, (it, i, n) => `<details${n === 0 || abierto ? ' open' : ''}><summary><span class="tm-n">${String(n + 1).padStart(2, '0')}</span>${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'span', siempre: true })}${icono('mas', 'ic acor-i')}</summary>${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}</details>`, 'titulo')}</div></div>`;
  },
  css: {
    base: '.tm-n{font-family:var(--f-tit);font-weight:700;color:var(--acento);font-size:.85rem;letter-spacing:.06em;text-transform:uppercase}',
    lista: '.tm-l{list-style:none;padding:0;margin:0;display:grid;gap:16px}@media(min-width:780px){.tm-l{grid-template-columns:1fr 1fr}}.tm-l p{color:var(--suave);margin:.4em 0 0}.tm-l .h3{margin:.35em 0 0}',
    acordeon: '.acor summary .tm-n{min-width:2.2ch}',
  },
};

export const oferta = {
  nombre: 'Oferta y precio',
  descripcion: 'Todo lo que incluye con su valor, el total, el precio real y el botón de compra. Precios SOLO los que dio la persona.',
  paraTipos: ['ventas', 'vsl', 'local'],
  banda: 'sup',
  ancla: 'oferta',
  variantes: { tarjeta: 'Tarjeta de precio', dividida: 'Lista y precio' },
  campos: {
    ...CABECERA,
    items: listaCampo('Lo que incluye', { texto: texto('Ítem', { max: 90 }), valor: texto('Valor', { max: 20, ayuda: 'Ej. $297 (opcional)' }) }, { min: 2, max: 10 }),
    valorTotal: texto('Valor total', { max: 20 }),
    precioAntes: texto('Precio tachado', { max: 20 }),
    precio: texto('Precio', { max: 20 }),
    detallePrecio: texto('Detalle del precio', { max: 60, ayuda: 'Ej. "Pago único" o "o 12 cuotas de $9,90"' }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const items = hayItems(ctx, c.items, 'texto')
      ? `<ul class="of-l">${lista(ctx, c.items, (it, i) => `<li>${icono('check')}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'span', siempre: true })}${t(ctx, `items.${i}.valor`, it.valor, { tag: 'em', clase: 'of-v' })}</li>`, 'texto')}</ul>`
      : '';
    const total = t(ctx, 'valorTotal', c.valorTotal, { tag: 'p', clase: 'of-total' });
    const precio =
      `<div class="of-p">${total}${t(ctx, 'precioAntes', c.precioAntes, { tag: 's', clase: 'of-antes' })}` +
      `${t(ctx, 'precio', c.precio, { tag: 'p', clase: 'of-precio', siempre: true })}${t(ctx, 'detallePrecio', c.detallePrecio, { tag: 'p', clase: 'of-det' })}` +
      `${acciones(ctx, c)}${vacio(c.nota) ? `<p class="of-seg">${icono('escudo')}Pago seguro</p>` : ''}</div>`;
    if (s.variante === 'dividida') return `<div class="w">${cabecera(ctx, c)}<div class="of-d"><div class="of-inc">${items}</div>${precio}</div></div>`;
    return `<div class="w">${cabecera(ctx, c)}<div class="of-card">${items}${precio}</div></div>`;
  },
  css: {
    base:
      '.of-l{list-style:none;padding:0;margin:0;display:grid;gap:12px}.of-l li{display:flex;gap:12px;align-items:flex-start;padding-bottom:12px;border-bottom:1px dashed var(--linea)}' +
      '.of-l li span{flex:1}.of-l .ic{width:20px;height:20px;flex:none;color:var(--acento);margin-top:2px}.of-v{font-style:normal;color:var(--tenue);white-space:nowrap}' +
      '.of-p{display:flex;flex-direction:column;align-items:center;text-align:center}' +
      '.of-total{margin:0;color:var(--suave)}.of-antes{color:var(--tenue);font-size:1.1rem;margin-top:6px}' +
      '.of-precio{margin:2px 0 0;font-family:var(--f-tit);font-weight:800;font-size:clamp(2.8rem,8vw,4.4rem);line-height:1;letter-spacing:-.02em}' +
      '.of-det{margin:8px 0 0;color:var(--suave)}.of-p .acc{align-items:center;width:100%}.of-p .acc .btn{width:100%;max-width:420px}' +
      '.of-seg{display:flex;gap:6px;align-items:center;margin:14px 0 0;font-size:.82rem;color:var(--tenue)}.of-seg .ic{width:16px;height:16px}',
    tarjeta:
      '.of-card{max-width:620px;margin-inline:auto;background:var(--fondo);border:1px solid var(--pri);border-radius:calc(var(--r-g) + 4px);' +
      'padding:clamp(24px,4vw,44px);box-shadow:0 40px 100px -50px var(--pri);display:grid;gap:30px}',
    dividida:
      '.of-d{display:grid;gap:24px;align-items:center;max-width:1000px;margin-inline:auto}@media(min-width:880px){.of-d{grid-template-columns:1.1fr .9fr;gap:40px}}' +
      '.of-d .of-p{background:var(--fondo);border:1px solid var(--pri);border-radius:var(--r-g);padding:clamp(24px,3vw,36px);box-shadow:0 40px 100px -50px var(--pri)}',
  },
};

export const bonos = {
  nombre: 'Bonos',
  descripcion:
    'Regalos que suben el valor de la oferta, cada uno con su valor (si la persona lo dio). En un evento, las experiencias ' +
    'exclusivas de algunos niveles: variante "fotos" (foto grande y la etiqueta en "valor", ej. "Incluido en VIP").',
  paraTipos: ['ventas', 'vsl', 'registro', 'evento'],
  banda: 'normal',
  variantes: { tarjetas: 'Tarjetas', fotos: 'Fotos con etiqueta' },
  campos: {
    ...CABECERA,
    items: listaCampo(
      'Bonos',
      {
        titulo: texto('Bono', { max: 70 }),
        texto: largo('Qué es', { max: 400, ayuda: 'Uno o dos párrafos (sepáralos con una línea en blanco)' }),
        valor: texto('Valor', { max: 40 }),
        imagen: imagen('Imagen'),
        fecha: texto('Fecha o rótulo', { max: 40, ayuda: 'Opcional, en "Fotos con etiqueta": una línea chica arriba del título, ej. "18 de octubre"' }),
        boton: texto('Texto del botón', { max: 40, ayuda: 'Opcional, en "Fotos con etiqueta": un botón que lleva a las entradas, ej. "Ir a la entrada VIP"' }),
      },
      { min: 1, max: 5 },
    ),
  },
  extras: (s) => {
    const items = Array.isArray(s.campos?.items) ? s.campos.items : [];
    const con = (k) => items.some((it) => typeof it?.[k] === 'string' && it[k].trim());
    return s.variante === 'fotos' ? [...(con('fecha') ? ['+fecha'] : []), ...(con('boton') ? ['+boton'] : [])] : [];
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'titulo') && ctx.modo === 'publicado') return '';
    // Fotos con etiqueta (las experiencias de un evento): la foto grande y su etiqueta encima, sin "Bono 1"; si tiene,
    // su fecha arriba del título y un botón que lleva a las entradas (la acción de la página).
    if (s.variante === 'fotos') {
      return `<div class="w">${cabecera(ctx, c)}<ul class="bo-fs">${lista(ctx, c.items, (it, i) => {
        const foto = ctx.img(it.imagen, `items.${i}.imagen`, { tam: 'mitad', alt: typeof it.titulo === 'string' ? sinMarcas(it.titulo) : '' });
        const etq = t(ctx, `items.${i}.valor`, it.valor, { tag: 'p', clase: 'bo-et' });
        const texto = typeof it.texto === 'string' && ctx.modo !== 'edicion' && /\n\s*\n/.test(it.texto)
          ? it.texto.split(/\n\s*\n/).map((p) => plano(ctx, p)).filter(Boolean).map((p) => `<p>${p}</p>`).join('')
          : t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' });
        const btn = vacio(it.boton) ? '' : `<div class="bo-acc">${boton(ctx, `items.${i}.boton`, it.boton, { clase: 'bo-btn' })}</div>`;
        return (
          `<li class="bo-ft">${foto ? `<div class="bo-ff">${foto}${etq}</div>` : etq}<div class="bo-fc">${t(ctx, `items.${i}.fecha`, it.fecha, { tag: 'p', clase: 'bo-fe' })}` +
          `${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${texto}${btn}</div></li>`
        );
      }, 'titulo')}</ul></div>`;
    }
    return `<div class="w">${cabecera(ctx, c)}<ul class="g3 bo">${lista(ctx, c.items, (it, i, n) => {
      const foto = ctx.img(it.imagen, `items.${i}.imagen`, { tam: 'tarjeta', alt: '' });
      return `<li class="tj bo-tj">${foto ? `<div class="bo-f">${foto}</div>` : `<span class="bo-i">${icono('regalo')}</span>`}<span class="bo-n">Bono ${n + 1}</span>${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}${t(ctx, `items.${i}.valor`, it.valor, { tag: 'p', clase: 'bo-v' })}</li>`;
    }, 'titulo')}</ul></div>`;
  },
  css: {
    base:
      '.bo{list-style:none;padding:0;margin:0}.bo-tj{display:flex;flex-direction:column;gap:6px}.bo-tj p{margin:.2em 0 0;color:var(--suave)}' +
      '.bo-i{display:grid;place-items:center;width:52px;height:52px;border-radius:var(--r);background:var(--pri-suave);color:var(--acento);margin-bottom:10px}.bo-i .ic{width:26px;height:26px}' +
      '.bo-f img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;border-radius:var(--r);margin-bottom:10px;display:block}' +
      '.bo-n{font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;color:var(--acento);font-weight:700}.bo-v{margin-top:auto!important;padding-top:10px;color:var(--texto)!important;font-weight:700}',
    '+fecha': '.bo-fc .bo-fe{margin:0 0 8px;font-size:.74rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--tenue)}',
    '+boton': '.bo-acc{margin-top:22px}.bo-acc .btn{min-height:48px;padding:12px 24px;font-size:.92rem}@media(max-width:620px){.bo-acc .btn{width:100%}}',
    fotos:
      '.bo-fs{list-style:none;padding:0;margin:0;display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))}' +
      '.bo-ft{min-width:0;display:flex;flex-direction:column;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden}' +
      '.bo-ff{position:relative}.bo-ff img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover}' +
      '.bo-et{margin:0;align-self:flex-start;padding:6px 12px;border-radius:999px;background:var(--fondo);color:var(--texto);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}' +
      '.bo-ff .bo-et{position:absolute;left:14px;top:14px;max-width:calc(100% - 28px)}.bo-ft>.bo-et{margin:20px 22px 0}' +
      '.bo-fc{padding:clamp(18px,2.4vw,26px)}.bo-fc .h3{margin:0}.bo-fc p{margin:.5em 0 0;color:var(--suave)}',
  },
};

export const garantia = {
  nombre: 'Garantía',
  descripcion: 'La garantía que ofrece la persona (días y condiciones). Nunca inventar una garantía que no dio.',
  paraTipos: ['ventas', 'vsl', 'evento'],
  banda: 'normal',
  variantes: { sello: 'Sello' },
  campos: {
    dias: texto('Días', { max: 4, ayuda: 'Ej. 7' }),
    titulo: texto('Título', { max: 80 }),
    texto: largo('Condiciones', { max: 360 }),
  },
  render(s, ctx) {
    const c = s.campos;
    if ((vacio(c.dias) || pendiente(c.dias)) && vacio(c.texto) && ctx.modo === 'publicado') return '';
    const dias = !vacio(c.dias) ? String(c.dias).replace(/\D/g, '') : '';
    // Sin días: en publicado el sello no lleva número (escudo y "garantía"); el "—" queda solo para el estudio.
    const centro = dias ? `<strong>${dias}</strong>días` : ctx.modo === 'publicado' ? `${icono('escudo', 'ic ga-ic')}garantía` : '<strong>—</strong>días';
    return (
      `<div class="w ga"><div class="ga-s" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 5"/>` +
      `<circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>${centro}</span></div>` +
      `<div>${t(ctx, 'titulo', c.titulo, { tag: 'h2', clase: 'h3 ga-t', siempre: true })}${t(ctx, 'texto', c.texto, { tag: 'p', clase: 'ga-x' })}${ctx.modo === 'edicion' ? `<p class="ga-ed">Días: <span data-e="${ctx.sid}:dias">${dias || ''}</span>${dias ? '' : ' (escribe cuántos)'}</p>` : ''}</div></div>`
    );
  },
  css: {
    base:
      '.ga{display:grid;gap:24px;align-items:center;max-width:820px;margin-inline:auto;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,4vw,40px)}' +
      '@media(min-width:680px){.ga{grid-template-columns:auto 1fr;gap:36px}}' +
      '.ga-s{position:relative;width:128px;height:128px;color:var(--acento);margin-inline:auto}.ga-s>svg{position:absolute;inset:0;width:100%;height:100%}' +
      '.ga-s span{position:absolute;inset:0;display:grid;place-content:center;text-align:center;font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;color:var(--texto)}' +
      '.ga-s strong{font-family:var(--f-tit);font-size:2.4rem;line-height:1;letter-spacing:0}.ga-s .ga-ic{width:34px;height:34px;margin:0 auto 4px;color:var(--acento)}.ga-t{margin:0}.ga-x{color:var(--suave);margin:.6em 0 0}.ga-ed{font-size:.8rem;color:var(--tenue)}',
  },
};

export const faq = {
  nombre: 'Preguntas frecuentes',
  descripcion: 'Las dudas que frenan la compra o el registro (precio, tiempo, para quién, acceso, garantía), con respuestas cortas.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'normal',
  variantes: { acordeon: 'Acordeón', columnas: 'Dos columnas' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: CABECERA.titulo,
    items: listaCampo('Preguntas', { pregunta: texto('Pregunta', { max: 110 }), respuesta: largo('Respuesta', { max: 380 }) }, { min: 3, max: 8 }),
  },
  render(s, ctx) {
    const c = s.campos;
    // Una pregunta sin respuesta (o al revés) no se publica.
    const esencial = ['pregunta', 'respuesta'];
    if (!hayItems(ctx, c.items, esencial) && ctx.modo === 'publicado') return '';
    if (s.variante === 'columnas') {
      return `<div class="w">${cabecera(ctx, c)}<dl class="fq-c">${lista(ctx, c.items, (it, i) => `<div>${t(ctx, `items.${i}.pregunta`, it.pregunta, { tag: 'dt', siempre: true })}${t(ctx, `items.${i}.respuesta`, it.respuesta, { tag: 'dd' })}</div>`, esencial)}</dl></div>`;
    }
    const abierto = ctx.modo === 'edicion' ? ' open' : '';
    return `<div class="w fq">${cabecera(ctx, c)}<div class="acor">${lista(ctx, c.items, (it, i) => `<details${abierto}><summary>${t(ctx, `items.${i}.pregunta`, it.pregunta, { tag: 'span', siempre: true })}${icono('mas', 'ic acor-i')}</summary>${t(ctx, `items.${i}.respuesta`, it.respuesta, { tag: 'p' })}</details>`, esencial)}</div></div>`;
  },
  css: {
    acordeon: '.fq .acor{max-width:820px;margin-inline:auto}',
    columnas:
      '.fq-c{display:grid;gap:28px 48px;margin:0}@media(min-width:820px){.fq-c{grid-template-columns:1fr 1fr}}' +
      '.fq-c dt{font-weight:700;font-size:1.08rem;margin-bottom:6px}.fq-c dd{margin:0;color:var(--suave)}',
  },
};
