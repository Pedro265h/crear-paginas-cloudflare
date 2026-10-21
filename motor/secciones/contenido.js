// Secciones de argumento: beneficios, problema, método, urgencia, comparación y para quién es.
import { CABECERA, BOTON, texto, largo, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, aviso, vacio, visible, lleno } from '../util.js';
import { acciones } from './portada.js';

const n2 = (i) => String(i + 1).padStart(2, '0');
const ICONOS_BENEFICIOS = ['rayo', 'sube', 'corazon', 'brujula', 'estrella', 'escudo'];

// Botón opcional al final de una sección (solo si la sección trae texto de botón).
function botonOpcional(ctx, c) {
  return vacio(c.boton) && !(c.boton && c.boton.porCompletar) ? '' : `<div class="sec-acc">${acciones(ctx, c)}</div>`;
}

export const beneficios = {
  nombre: 'Beneficios / Lo que vas a descubrir',
  descripcion: 'Qué se lleva la persona. Cada ítem: un resultado concreto (no una característica) y una línea que lo explica.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'normal',
  // iconos: tarjetas centradas, cada una con su ícono redondo (sin números).
  variantes: { tarjetas: 'Tarjetas', lista: 'Lista con checks', numerada: 'Numerada grande', iconos: 'Tarjetas con ícono' },
  campos: {
    ...CABECERA,
    rotulo: texto('Rótulo sobre los beneficios', { max: 50, ayuda: 'Opcional: una etiqueta corta entre el título y los beneficios, ej. "Así se verá tu vida en 6 meses"' }),
    items: listaCampo('Beneficios', { titulo: texto('Beneficio', { max: 70 }), texto: largo('Explicación', { max: 180 }) }, { min: 3, max: 6 }),
    ...BOTON,
  },
  extras: (s) => (lleno(s.campos?.rotulo) ? ['+rotulo'] : []),
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'titulo') && ctx.modo === 'publicado') return '';
    const v = s.variante;
    // n: posición entre los que se ven (numeración sin saltos); i: posición en el plan (rutas de edición).
    const item = (it, i, n) => {
      const tt = t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true });
      const tx = t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' });
      if (v === 'lista') return `<li class="be-li">${icono('check')}<div>${tt}${tx}</div></li>`;
      if (v === 'numerada') return `<li class="be-num"><span class="be-n">${n2(n)}</span><div>${tt}${tx}</div></li>`;
      if (v === 'iconos') return `<li class="tj be-ic"><span class="be-ico">${icono(ICONOS_BENEFICIOS[n % ICONOS_BENEFICIOS.length])}</span>${tt}${tx}</li>`;
      return `<li class="tj be-tj"><span class="be-i">${n2(n)}</span>${tt}${tx}</li>`;
    };
    const clase = v === 'lista' ? 'be-l' : v === 'numerada' ? 'be-nl' : v === 'iconos' ? 'be-ics' : 'g3 be-g';
    const rotulo = t(ctx, 'rotulo', c.rotulo, { tag: 'p', clase: 'be-rot' });
    return `<div class="w">${cabecera(ctx, c)}${rotulo ? `<div class="be-rot-c">${rotulo}</div>` : ''}<ul class="${clase}">${lista(ctx, c.items, item, 'titulo')}</ul>${botonOpcional(ctx, c)}</div>`;
  },
  css: {
    '+rotulo':
      '.be-rot-c{display:flex;justify-content:center;margin:calc(clamp(36px,5vw,56px)*-.45) 0 clamp(28px,4vw,40px)}' +
      '.s-beneficios .be-rot{margin:0;padding:8px 20px;border:1px solid var(--linea);border-radius:999px;font-size:.78rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--acento);text-align:center}',
    base: '.be-g,.be-l,.be-nl{list-style:none;padding:0;margin:0}.s-beneficios p{margin:.4em 0 0;color:var(--suave)}',
    tarjetas: '.be-tj{display:flex;flex-direction:column;gap:4px}.be-i{font-family:var(--f-tit);font-weight:700;color:var(--acento);font-size:.95rem;margin-bottom:10px;letter-spacing:.04em}',
    lista:
      '.be-l{display:grid;gap:22px 40px;max-width:980px;margin-inline:auto}@media(min-width:760px){.be-l{grid-template-columns:1fr 1fr}}' +
      '.be-li{display:flex;gap:14px;align-items:flex-start}.be-li .ic{flex:none;width:26px;height:26px;padding:4px;border-radius:50%;background:var(--pri-suave);color:var(--acento);margin-top:2px}',
    iconos:
      '.be-ics{list-style:none;padding:0;margin:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));max-width:1000px;margin-inline:auto}' +
      '.be-ic{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}' +
      '.be-ico{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--pri-suave);color:var(--acento);margin-bottom:12px}.be-ico .ic{width:24px;height:24px}',
    numerada:
      '.be-nl{display:grid;max-width:860px;margin-inline:auto}' +
      '.be-num{display:grid;grid-template-columns:auto 1fr;gap:clamp(16px,3vw,32px);padding:clamp(20px,3vw,30px) 0;border-top:1px solid var(--linea)}' +
      '.be-num:last-child{border-bottom:1px solid var(--linea)}' +
      '.be-n{font-family:var(--f-tit);font-weight:700;font-size:clamp(2rem,5vw,3.4rem);line-height:.9;color:var(--acento);min-width:2ch}',
  },
};

export const problema = {
  nombre: 'El problema',
  descripcion: 'Los dolores que vive hoy la persona, en sus palabras. Cierra con una frase que quita la culpa y abre la solución.',
  paraTipos: ['vsl', 'ventas', 'registro', 'evento'],
  banda: 'sup',
  variantes: { lista: 'Lista', tarjetas: 'Tarjetas' },
  campos: {
    ...CABECERA,
    items: listaCampo('Dolores', { texto: texto('Dolor', { max: 120 }) }, { min: 3, max: 6 }),
    cierre: largo('Frase de cierre', { max: 220, ayuda: 'Ej. "No es tu culpa: nadie te enseñó a…"' }),
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'texto') && ctx.modo === 'publicado') return '';
    const items = lista(ctx, c.items, (it, i) =>
      s.variante === 'tarjetas'
        ? `<li class="tj pr-tj">${icono('x')}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p', siempre: true })}</li>`
        : `<li class="pr-li">${icono('x')}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'span', siempre: true })}</li>`,
      'texto',
    );
    const ul = s.variante === 'tarjetas' ? `<ul class="g3 pr-g">${items}</ul>` : `<ul class="pr-l">${items}</ul>`;
    return `<div class="w">${cabecera(ctx, c)}${ul}${t(ctx, 'cierre', c.cierre, { tag: 'p', clase: 'pr-cierre' })}</div>`;
  },
  css: {
    base:
      '.pr-l,.pr-g{list-style:none;padding:0;margin:0}.s-problema .ic{color:#ff6b6b;flex:none;width:22px;height:22px}' +
      '.pr-cierre{max-width:640px;margin:36px auto 0;text-align:center;font-family:var(--f-tit);font-size:clamp(1.25rem,2.4vw,1.6rem);line-height:1.3;color:var(--texto)}',
    lista:
      '.pr-l{display:grid;gap:12px;max-width:720px;margin-inline:auto}' +
      '.pr-li{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r)}',
    tarjetas: '.pr-tj{display:flex;flex-direction:column;gap:12px;background:var(--fondo)}.pr-tj p{margin:0}',
  },
};

export const mecanismo = {
  nombre: 'El método',
  descripcion: 'Cómo funciona la solución: el nombre del método y sus 3 a 5 pasos o pilares. Es el "por qué esto sí funciona".',
  paraTipos: ['ventas', 'vsl', 'registro', 'local', 'evento'],
  banda: 'normal',
  variantes: { pasos: 'Pasos en fila', linea: 'Línea de tiempo' },
  campos: {
    ...CABECERA,
    items: listaCampo('Pasos', { titulo: texto('Paso', { max: 50 }), texto: largo('Qué pasa en este paso', { max: 180 }) }, { min: 3, max: 5 }),
    cierre: largo('Frase de cierre', { max: 220, ayuda: 'Opcional: una frase debajo de los pasos, ej. "Las 4 áreas no se trabajan por separado."' }),
    ...BOTON,
  },
  extras: (s) => (lleno(s.campos?.cierre) ? ['+cierre'] : []),
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.items, 'titulo') && ctx.modo === 'publicado') return '';
    const items = lista(
      ctx,
      c.items,
      (it, i, n) =>
        `<li class="me-p"><span class="me-n">${n + 1}</span><div>${t(ctx, `items.${i}.titulo`, it.titulo, { tag: 'h3', clase: 'h3', siempre: true })}${t(ctx, `items.${i}.texto`, it.texto, { tag: 'p' })}</div></li>`,
      'titulo',
    );
    return `<div class="w">${cabecera(ctx, c)}<ol class="me-${s.variante === 'linea' ? 'l' : 'f'}">${items}</ol>${t(ctx, 'cierre', c.cierre, { tag: 'p', clase: 'me-cierre' })}${botonOpcional(ctx, c)}</div>`;
  },
  css: {
    '+cierre': '.s-mecanismo .me-cierre{max-width:760px;margin:clamp(36px,5vw,56px) auto 0;text-align:center;font-size:1.06rem;color:var(--suave)}.me-cierre strong{color:var(--texto)}',
    base:
      '.me-f,.me-l{list-style:none;padding:0;margin:0}.s-mecanismo p{margin:.4em 0 0;color:var(--suave)}' +
      '.me-n{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--pri);color:var(--sobre-pri);font-weight:800;font-family:var(--f-tit);flex:none}',
    pasos:
      '.me-f{display:grid;gap:28px;counter-reset:p}@media(min-width:820px){.me-f{grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:32px}}' +
      '.me-f .me-p{display:flex;flex-direction:column;gap:16px;position:relative}' +
      '@media(min-width:820px){.me-f .me-p:not(:last-child)::after{content:"";position:absolute;top:22px;left:60px;right:-16px;height:1px;background:linear-gradient(90deg,var(--pri),transparent)}}',
    linea:
      '.me-l{max-width:720px;margin-inline:auto;display:grid;gap:0}' +
      '.me-l .me-p{display:grid;grid-template-columns:44px 1fr;gap:20px;padding-bottom:34px;position:relative}' +
      '.me-l .me-p:not(:last-child)::before{content:"";position:absolute;left:21.5px;top:48px;bottom:4px;width:1px;background:var(--linea)}',
  },
};

export const urgencia = {
  nombre: 'Por qué ahora',
  descripcion:
    'Por qué actuar hoy: el cambio del mercado o la ventana que se cierra (una primera edición, una fecha que no se repite). ' +
    'Las cifras solo si la persona las dio (con fuente). La variante "frase" es un bloque centrado con una frase grande.',
  paraTipos: ['registro', 'ventas', 'vsl', 'evento'],
  banda: 'sup',
  variantes: { bloque: 'Bloque con cifras', frase: 'Frase centrada' },
  campos: {
    ...CABECERA,
    texto: largo('Texto', { max: 420 }),
    cifras: listaCampo('Cifras', { valor: texto('Cifra', { max: 12, ayuda: 'Ej. 88%' }), etiqueta: texto('Qué significa', { max: 90 }) }, { min: 0, max: 3 }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const cifras = hayItems(ctx, c.cifras, 'valor')
      ? `<ul class="ur-c">${lista(ctx, c.cifras, (it, i) => `<li>${t(ctx, `cifras.${i}.valor`, it.valor, { tag: 'strong', siempre: true })}${t(ctx, `cifras.${i}.etiqueta`, it.etiqueta, { tag: 'span' })}</li>`, 'valor')}</ul>`
      : '';
    // Frase centrada («El inicio del movimiento»): la cabecera, una frase grande y, si hay, las cifras en fila.
    if (s.variante === 'frase') {
      const cab = cabecera(ctx, c);
      const tx = t(ctx, 'texto', c.texto, { tag: 'p', clase: 'ur-t' });
      if (!cab && !tx && !cifras) return '';
      return `<div class="w ur-fr">${cab}${tx}${cifras}${botonOpcional(ctx, c)}</div>`;
    }
    const cuerpo = cabecera(ctx, c, { centrada: false }) + t(ctx, 'texto', c.texto, { tag: 'p', clase: 'ur-t' });
    if (!cuerpo && !cifras) return '';
    return `<div class="w ur">${'<div>' + cuerpo + botonOpcional(ctx, c) + '</div>'}${cifras}</div>`;
  },
  css: {
    base:
      '.ur{display:grid;gap:36px;align-items:center}@media(min-width:900px){.ur{grid-template-columns:1.1fr .9fr;gap:64px}}' +
      '.ur .cab{text-align:left;margin-bottom:0}.ur-t{color:var(--suave);font-size:1.08rem;margin:18px 0 0;max-width:60ch}' +
      '.ur-c{list-style:none;padding:0;margin:0;display:grid;gap:14px}' +
      '.ur-c li{display:grid;gap:4px;padding:20px 22px;background:var(--fondo);border:1px solid var(--linea);border-left:3px solid var(--acento);border-radius:var(--r)}' +
      '.ur-c strong{font-family:var(--f-tit);font-size:clamp(2rem,4.6vw,2.8rem);line-height:1;color:var(--acento)}.ur-c span{color:var(--suave)}',
    frase:
      '.ur-fr{display:flex;flex-direction:column;align-items:center;text-align:center}.ur-fr .cab{margin-bottom:0}' +
      '.ur-fr .ur-t{margin:24px auto 0;max-width:34ch;font-family:var(--f-tit);font-size:clamp(1.2rem,2.2vw,1.6rem);line-height:1.4;color:var(--texto)}' +
      '.ur-fr .ur-c{margin-top:32px;width:100%;max-width:820px;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))}.ur-fr .ur-c li{text-align:left}',
  },
};

export const comparacion = {
  nombre: 'Comparación',
  descripcion: 'Esto contra la alternativa (otros cursos, hacerlo solo, antes/después). Filas cortas, una idea por fila.',
  paraTipos: ['registro', 'ventas', 'vsl', 'local', 'evento'],
  banda: 'normal',
  variantes: { tabla: 'Tabla', tarjetas: 'Dos tarjetas' },
  campos: {
    ...CABECERA,
    columnaA: texto('Nombre de lo tuyo', { max: 30, ayuda: 'Ej. "Esta masterclass"' }),
    columnaB: texto('Nombre de la alternativa', { max: 30, ayuda: 'Ej. "Otros cursos"' }),
    filas: listaCampo('Filas', { a: texto('Lo tuyo', { max: 80 }), b: texto('La alternativa', { max: 80 }) }, { min: 3, max: 7 }),
  },
  render(s, ctx) {
    const c = s.campos;
    // Una fila con un solo lado no compara nada: necesita los dos.
    if (!hayItems(ctx, c.filas, ['a', 'b']) && ctx.modo === 'publicado') return '';
    const nA = t(ctx, 'columnaA', c.columnaA, { tag: 'span', siempre: true });
    const nB = t(ctx, 'columnaB', c.columnaB, { tag: 'span', siempre: true });
    if (s.variante === 'tarjetas') {
      const col = (lado, nombre, ic) =>
        `<div class="co-col co-${lado}"><p class="co-h">${nombre}</p><ul>${lista(ctx, c.filas, (f, i) => `<li>${icono(ic)}${t(ctx, `filas.${i}.${lado}`, f[lado], { tag: 'span', siempre: true })}</li>`, ['a', 'b'])}</ul></div>`;
      return `<div class="w">${cabecera(ctx, c)}<div class="co-2">${col('b', nB, 'x')}${col('a', nA, 'check')}</div></div>`;
    }
    const filas = lista(
      ctx,
      c.filas,
      (f, i) => `<div class="co-f"><div class="co-b">${icono('x')}${t(ctx, `filas.${i}.b`, f.b, { tag: 'span', siempre: true })}</div><div class="co-a">${icono('check')}${t(ctx, `filas.${i}.a`, f.a, { tag: 'span', siempre: true })}</div></div>`,
      ['a', 'b'],
    );
    return `<div class="w">${cabecera(ctx, c)}<div class="co-t"><div class="co-f co-cab"><div class="co-b">${nB}</div><div class="co-a">${nA}</div></div>${filas}</div></div>`;
  },
  css: {
    base: '.s-comparacion .ic{width:20px;height:20px;flex:none;margin-top:2px}',
    tabla:
      '.co-t{max-width:900px;margin-inline:auto;border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden}' +
      '.co-f{display:grid;grid-template-columns:1fr 1fr}.co-f>div{display:flex;gap:10px;align-items:flex-start;padding:16px clamp(14px,2.4vw,24px);border-top:1px solid var(--linea)}' +
      '.co-cab>div{border-top:0;font-weight:700;font-family:var(--f-tit);font-size:1.05rem}' +
      '.co-t .co-b{color:var(--suave)}.co-t .co-b .ic{color:#ff6b6b}.co-t .co-a{background:var(--pri-suave);color:var(--texto)}.co-t .co-a .ic{color:var(--acento)}' +
      '@media(max-width:560px){.co-f>div{font-size:.92rem}}',
    tarjetas:
      '.co-2{display:grid;gap:18px;max-width:960px;margin-inline:auto}@media(min-width:780px){.co-2{grid-template-columns:1fr 1fr;gap:24px}}' +
      '.co-col{border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,3vw,32px)}.co-col ul{list-style:none;padding:0;margin:0;display:grid;gap:14px}' +
      '.co-col li{display:flex;gap:10px}.co-h{margin:0 0 18px;font-family:var(--f-tit);font-weight:700;font-size:1.2rem}' +
      '.co-2 .co-b{color:var(--suave)}.co-2 .co-b .ic{color:#ff6b6b}.co-2 .co-a{background:var(--pri-suave);border-color:var(--pri)}.co-2 .co-a .ic{color:var(--acento)}',
  },
};

export const para_quien = {
  nombre: 'Para quién es',
  descripcion: 'Para quién SÍ es y para quién NO. Filtra y sube la confianza de los que sí son.',
  paraTipos: ['registro', 'ventas', 'vsl', 'evento'],
  banda: 'sup',
  variantes: { columnas: 'Dos columnas' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: CABECERA.titulo,
    resaltado: CABECERA.resaltado,
    tituloSi: texto('Título del sí', { max: 40, ayuda: 'Ej. "Es para ti si…"' }),
    si: listaCampo('Es para', { texto: texto('Perfil', { max: 120 }) }, { min: 2, max: 6 }),
    tituloNo: texto('Título del no', { max: 40, ayuda: 'Ej. "No es para ti si…"' }),
    no: listaCampo('No es para', { texto: texto('Perfil', { max: 120 }) }, { min: 1, max: 5 }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const col = (clave, tituloClave, ic, clase) =>
      hayItems(ctx, c[clave], 'texto')
        ? `<div class="pq-col ${clase}">${t(ctx, tituloClave, c[tituloClave], { tag: 'p', clase: 'pq-h', siempre: true })}<ul>${lista(ctx, c[clave], (it, i) => `<li>${icono(ic)}${t(ctx, `${clave}.${i}.texto`, it.texto, { tag: 'span', siempre: true })}</li>`, 'texto')}</ul></div>`
        : '';
    const si = col('si', 'tituloSi', 'check', 'pq-si');
    const no = col('no', 'tituloNo', 'x', 'pq-no');
    if (!si && !no) return '';
    return `<div class="w">${cabecera(ctx, c)}<div class="pq">${si}${no}</div>${botonOpcional(ctx, c)}</div>`;
  },
  css: {
    base:
      '.pq{display:grid;gap:18px;max-width:980px;margin-inline:auto}@media(min-width:800px){.pq{grid-template-columns:1.15fr .85fr;gap:24px}}' +
      '.pq-col{background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,3vw,34px)}' +
      '.pq-col ul{list-style:none;padding:0;margin:0;display:grid;gap:14px}.pq-col li{display:flex;gap:12px;align-items:flex-start}' +
      '.pq-h{margin:0 0 18px;font-family:var(--f-tit);font-weight:700;font-size:1.2rem}' +
      '.pq-si{border-color:var(--pri)}.pq-si .ic{color:var(--acento)}.pq-no{color:var(--suave)}.pq-no .ic{color:#ff6b6b}' +
      '.s-para_quien .ic{width:21px;height:21px;flex:none;margin-top:2px}',
  },
};

