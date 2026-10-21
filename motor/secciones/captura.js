// Formulario, cuenta regresiva y llamada final.
import { CABECERA, BOTON, texto } from '../campos.js';
import { esc, t, cabecera, antetitulo, vacio, instanteEvento } from '../util.js';
import { formularioHTML } from '../form.js';
import { infoEvento, acciones } from './portada.js';

export const formulario = {
  nombre: 'Formulario de registro',
  descripcion: 'Bloque con el formulario a la vista. Solo si la acción de la página es "formulario".',
  paraTipos: ['registro', 'local'],
  banda: 'sup',
  ancla: 'registro',
  variantes: { tarjeta: 'Tarjeta centrada', dividido: 'Texto y formulario' },
  campos: { ...CABECERA, ...BOTON },
  render(s, ctx) {
    const c = s.campos;
    // Ids propios de esta sección: si se duplica el formulario, cada etiqueta apunta a su propio campo.
    const form = formularioHTML(ctx, { id: 'fs-' + s.id, boton: vacio(c.boton) ? '' : c.boton, rutaBoton: 'boton', nota: vacio(c.nota) ? '' : c.nota });
    if (ctx.plan.conversion?.accion !== 'formulario') {
      return `<div class="w fo-t">${cabecera(ctx, c)}${acciones(ctx, c)}</div>`;
    }
    if (s.variante === 'dividido') {
      return `<div class="w fo-d"><div>${cabecera(ctx, c, { centrada: false })}${infoEvento(ctx)}</div><div class="fo-card">${form}</div></div>`;
    }
    return `<div class="w fo-t">${cabecera(ctx, c)}<div class="fo-card">${form}</div></div>`;
  },
  css: {
    base:
      '.fo-card{background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,3vw,34px);box-shadow:0 30px 80px -45px rgba(0,0,0,.55)}' +
      '.fo-t{max-width:560px;margin-inline:auto;text-align:center}.fo-t .fo-card{margin-top:28px}.fo-t .acc{align-items:center}',
    dividido: '.fo-d{display:grid;gap:32px;align-items:center}@media(min-width:900px){.fo-d{grid-template-columns:1fr 1fr;gap:64px}}',
  },
};

export const contador = {
  nombre: 'Cuenta regresiva',
  descripcion: 'Días, horas, minutos y segundos hasta el evento. Solo si hay fecha de evento.',
  paraTipos: ['registro', 'ventas', 'evento'],
  banda: 'normal',
  variantes: { bloque: 'Bloque' },
  campos: {
    titulo: texto('Título', { max: 60, ayuda: 'Ej. "Empezamos en"' }),
    ...BOTON,
  },
  render(s, ctx) {
    const c = s.campos;
    const e = ctx.plan.evento;
    const ms = e && instanteEvento(e.fecha, e.zona);
    if (!ms) return ctx.modo === 'publicado' ? '' : `<div class="w ct">${t(ctx, 'titulo', c.titulo, { tag: 'h2', clase: 'h3' })}<p class="pc">Por completar: la fecha del evento (en Conversión)</p></div>`;
    // Evento que ya pasó: la cuenta en ceros no sirve. En publicado no sale (y si pasa después de publicar, el JS de la
    // página esconde la sección); en el estudio se avisa.
    const paso = ms <= Date.now();
    if (paso && ctx.modo === 'publicado') return '';
    const avisoPaso = paso ? '<p class="pc">La fecha del evento ya pasó: cámbiala en Conversión (en la página publicada esta sección no sale)</p>' : '';
    const caja = (n, nombre) => `<div class="ct-c"><span class="ct-n" data-${n}>00</span><span class="ct-l">${nombre}</span></div>`;
    return (
      `<div class="w ct">${t(ctx, 'titulo', c.titulo, { tag: 'h2', clase: 'h3' })}${avisoPaso}` +
      `<div class="ct-g" data-contador="${ms}">${caja('d', 'días')}${caja('h', 'horas')}${caja('m', 'min')}${caja('s', 'seg')}</div>` +
      `${acciones(ctx, c)}</div>`
    );
  },
  css: {
    base:
      '.ct{text-align:center;display:flex;flex-direction:column;align-items:center}.ct .h3{margin:0 0 18px}' +
      '.ct-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;width:100%;max-width:520px}' +
      '.ct-c{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:16px 6px;display:grid;gap:4px}' +
      '.ct-n{font-family:var(--f-tit);font-size:clamp(2rem,6vw,3.2rem);font-weight:700;line-height:1;font-variant-numeric:tabular-nums}' +
      '.ct-l{font-size:.75rem;text-transform:uppercase;letter-spacing:.12em;color:var(--tenue)}.ct .acc{align-items:center}',
  },
};

export const cta = {
  nombre: 'Llamada final',
  descripcion: 'El cierre: repite la promesa en una frase, quita la última duda y vuelve a mostrar el botón.',
  paraTipos: ['registro', 'vsl', 'ventas', 'local', 'evento'],
  banda: 'normal',
  variantes: { banda: 'Banda de color', tarjeta: 'Tarjeta destacada' },
  campos: { ...CABECERA, ...BOTON },
  render(s, ctx) {
    const c = s.campos;
    const cuerpo =
      antetitulo(ctx, 'antetitulo', c.antetitulo) +
      t(ctx, 'titulo', c.titulo, { tag: 'h2', clase: 'h2', resaltado: c.resaltado, siempre: true }) +
      t(ctx, 'subtitulo', c.subtitulo, { tag: 'p', clase: 'lead' }) +
      acciones(ctx, c);
    return `<div class="w"><div class="cta-in">${cuerpo}</div></div>`;
  },
  css: {
    base: '.cta-in{text-align:center;display:flex;flex-direction:column;align-items:center}.cta-in .lead{margin-inline:auto}.cta-in .acc{align-items:center}',
    banda:
      '.s-cta.v-banda{background:var(--pri);color:var(--sobre-pri)}' +
      '.s-cta.v-banda h2,.s-cta.v-banda .h2{color:inherit}.s-cta.v-banda .ey,.s-cta.v-banda .lead,.s-cta.v-banda .nota{color:inherit;opacity:.85}' +
      '.s-cta.v-banda .hl{color:inherit;text-decoration:underline;text-decoration-thickness:.08em;text-underline-offset:.12em}' +
      '.s-cta.v-banda .btn{background:var(--sobre-pri);color:var(--pri);box-shadow:none}',
    tarjeta:
      '.s-cta.v-tarjeta .cta-in{background:linear-gradient(180deg,var(--sup2),var(--sup));border:1px solid var(--linea);border-radius:calc(var(--r-g) + 6px);' +
      'padding:clamp(36px,6vw,72px) clamp(20px,5vw,64px);position:relative;overflow:hidden;isolation:isolate}' +
      '.s-cta.v-tarjeta .cta-in::before{content:"";position:absolute;inset:auto -20% -60% -20%;height:90%;z-index:-1;background:radial-gradient(closest-side,var(--pri-suave),transparent)}',
  },
};

