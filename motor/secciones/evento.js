// Secciones de una página de evento (vender entradas para un evento presencial de un día, 7-oct-2026): las entradas por
// nivel con sus cupos y su link de pago, el equipo que guía, la logística, las dudas por WhatsApp, la idea que lo explica
// y los dos caminos. Nada de esto se inventa: precios, cupos, links, nombres e historias son los que dio la persona; lo
// que falta queda "por completar" (en publicado no sale).
import { CABECERA, BOTON, texto, largo, imagen, lista as listaCampo } from '../campos.js';
import { t, cabecera, lista, hayItems, icono, vacio, esc, plano, sinMarcas, lleno, aviso, pendiente, urlDe, fechaLegible, instanteEvento } from '../util.js';
import { acciones } from './portada.js';
import { linkWhatsapp } from '../telefono.js';
import { css } from '../plantillas/css.js';

const edicion = (ctx, ruta) => (ctx.modo === 'edicion' ? ` data-e="${esc(ctx.sid + ':' + ruta)}"` : '');

// Un número de cupos escrito por la persona ("400", "1.000") → 400, 1000; cualquier otra cosa → null (no hay barra).
export function entero(v) {
  const s = typeof v === 'string' ? v.trim().replace(/[.,\s]/g, '') : '';
  return /^\d{1,7}$/.test(s) ? Number(s) : null;
}

// Las líneas de un párrafo "una cosa por línea", sin viñetas ni vacías.
export function lineas(v) {
  if (typeof v !== 'string') return [];
  return v
    .split('\n')
    .map((x) => x.replace(/^\s*(?:[-•*·✓✔✕✗×]|\d{1,2}[.)])\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 14);
}

// Los niveles de entrada de un plan (los de la primera sección de niveles visible), para saber a dónde va el botón
// principal y qué falta por completar. → [{ nombre, link }] (los que se publican)
export function nivelesDe(plan) {
  const s = (plan?.secciones || []).find((x) => x && x.tipo === 'niveles' && !x.oculta);
  if (!s || !Array.isArray(s.campos?.niveles)) return [];
  return s.campos.niveles.filter((n) => n && typeof n === 'object' && lleno(n.nombre)).map((n) => ({ nombre: n.nombre, link: urlDe(n.link) }));
}

// ---------- entradas por nivel ----------

const caja = (n, nombre) => `<div class="nv-cc"><span class="ct-n" data-${n}>00</span><span class="nv-cl">${nombre}</span></div>`;

// La cuenta regresiva de las ventas (hasta la fecha del evento). Solo con el texto puesto.
function cuentaVentas(ctx, c) {
  if (!lleno(c.cierre) && !(ctx.modo !== 'publicado' && pendiente(c.cierre))) return '';
  const e = ctx.plan.evento;
  const ms = e && instanteEvento(e.fecha, e.zona);
  const etapa = t(ctx, 'etapa', c.etapa, { tag: 'p', clase: 'nv-etapa' });
  const titulo = t(ctx, 'cierre', c.cierre, { tag: 'p', clase: 'nv-ct-t' });
  if (!ms) return ctx.modo === 'publicado' ? '' : `<div class="nv-ct">${etapa}${titulo}<p class="pc">Por completar: la fecha del evento (en Conversión)</p></div>`;
  if (ms <= Date.now()) return ctx.modo === 'publicado' ? '' : `<div class="nv-ct">${titulo}<p class="pc">La fecha del evento ya pasó: cámbiala en Conversión (en la página publicada la cuenta no sale)</p></div>`;
  return `<div class="nv-ct">${etapa}${titulo}<div class="nv-ct-g" data-contador="${ms}">${caja('d', 'días')}${caja('h', 'horas')}${caja('m', 'min')}${caja('s', 'seg')}</div></div>`;
}

export const niveles = {
  nombre: 'Entradas por nivel',
  descripcion:
    'Las entradas (o los planes) de 2 a 4 niveles lado a lado: cada uno con su nombre, su precio, lo que incluye y lo que no ' +
    '(apagado, para comparar), sus cupos con una barra (solo si la persona los dio), su propio link de pago y uno destacado ' +
    '("Recomendada", o "Más elegida" si la persona dijo que es la que más se vende). Con la fecha del evento puede llevar ' +
    'la cuenta regresiva de las ventas. Precios, cupos y links SOLO los que dio la persona.',
  paraTipos: ['evento', 'ventas'],
  banda: 'normal',
  ancla: 'entradas',
  variantes: { tarjetas: 'Tarjetas lado a lado' },
  campos: {
    ...CABECERA,
    etapa: texto('Etapa de venta', { max: 30, ayuda: 'Ej. "Preventa" o "Etapa final". Va sobre la cuenta regresiva y en cada precio (opcional).' }),
    cierre: texto('Texto de la cuenta regresiva', { max: 40, ayuda: 'Ej. "Las ventas cierran en". Con la fecha del evento muestra la cuenta regresiva; vacío = sin cuenta.' }),
    niveles: listaCampo(
      'Niveles',
      {
        nombre: texto('Nombre del nivel', { max: 30, ayuda: 'Ej. General, VIP, Diamante' }),
        precio: texto('Precio', { max: 16, ayuda: 'Ej. $250' }),
        moneda: texto('Moneda', { max: 8, ayuda: 'Ej. USD' }),
        nota: texto('Nota del precio', { max: 60, ayuda: 'Ej. "80 lugares · precio final"' }),
        lugares: texto('Lugares en total', { max: 8, ayuda: 'Solo si la persona lo dio. Ej. 80' }),
        disponibles: texto('Lugares disponibles', { max: 8, ayuda: 'Solo si la persona lo dio. Ej. 40 (con los dos se ve la barra de cupos)' }),
        incluye: largo('Lo que incluye', { max: 700, ayuda: 'Una cosa por línea' }),
        noIncluye: largo('Lo que no incluye', { max: 400, ayuda: 'Una cosa por línea: se ve apagada, para comparar con los otros niveles (opcional)' }),
        etiqueta: texto('Etiqueta destacada', { max: 24, ayuda: 'Ej. "Recomendada" ("Más elegida" solo si de verdad es la que más se vende). Solo en el nivel que se destaca; vacío en los demás' }),
        boton: texto('Texto del botón', { max: 32, ayuda: 'Ej. "Reservar VIP". Vacío = "Reservar" y el nombre del nivel' }),
        link: texto('Link de pago de este nivel', { max: 2000, url: true, ayuda: 'Hotmart, Mercado Pago, Stripe… Vacío = el link de pago de la página' }),
      },
      { min: 2, max: 4 },
    ),
    nota: texto('Nota bajo cada botón', { max: 60, ayuda: 'Ej. "Compra 100% segura". Vacío = "Pago seguro"' }),
    cupos: texto('Texto de los cupos', { max: 30, ayuda: 'Lo que va después de "40 de 80": ej. "en este lote". Vacío = "disponibles"' }),
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.niveles, 'nombre')) {
      return ctx.modo === 'publicado' ? '' : `<div class="w">${cabecera(ctx, c)}<p class="pc-sec"><span class="pc">Por completar: tus entradas (nombre y precio de cada nivel)</span></p></div>`;
    }
    const general = /^https?:\/\//.test(ctx.plan.conversion?.url || '') ? ctx.plan.conversion.url : '';
    // La nota y la etapa se repiten en cada tarjeta: se editan en el panel (no en línea, para no tener el mismo campo varias veces).
    const seguro = lleno(c.nota) ? plano(ctx, c.nota) : 'Pago seguro';
    const etapa = lleno(c.etapa) ? `<p class="nv-etapa">${plano(ctx, c.etapa)}</p>` : '';
    let n = 0;
    const tarjetas = lista(
      ctx,
      c.niveles,
      (it, i) => {
        n++;
        const r = (k) => `niveles.${i}.${k}`;
        const nombre = typeof it.nombre === 'string' ? sinMarcas(it.nombre) : '';
        const dest = lleno(it.etiqueta);
        const etiqueta = dest || (ctx.modo !== 'publicado' && pendiente(it.etiqueta)) ? t(ctx, r('etiqueta'), it.etiqueta, { tag: 'p', clase: 'nv-eti' }) : '';
        // Precio con su moneda; sin precio, en el estudio el aviso (en publicado el nivel sale sin precio).
        const monto = t(ctx, r('precio'), it.precio, { tag: 'strong', siempre: true });
        const precio = monto ? `<p class="nv-p">${monto}${t(ctx, r('moneda'), it.moneda, { tag: 'span', clase: 'nv-mon' })}</p>` : '';
        // Cupos: la barra solo con los dos números (los disponibles sobre el total).
        const total = entero(it.lugares);
        const quedan = entero(it.disponibles);
        let cupos = '';
        if (total && quedan !== null && quedan <= total) {
          const p = Math.round((quedan / total) * 1000) / 1000;
          cupos =
            `<div class="nv-cupos"><p><b${edicion(ctx, r('disponibles'))}>${esc(it.disponibles.trim())}</b> de <span${edicion(ctx, r('lugares'))}>${esc(it.lugares.trim())}</span> ${lleno(c.cupos) ? plano(ctx, c.cupos) : 'disponibles'}</p>` +
            `<span class="nv-barra" role="img" aria-label="${quedan} de ${total} lugares disponibles"><span style="--c:${p}"></span></span></div>`;
        } else if (total && !lleno(it.nota)) {
          cupos = `<div class="nv-cupos"><p><b${edicion(ctx, r('lugares'))}>${esc(it.lugares.trim())}</b> lugares</p></div>`;
        }
        const si = lineas(it.incluye).map((x) => `<li class="nv-si"><span class="nv-sw" aria-hidden="true"></span><span>${esc(x)}</span></li>`);
        const no = lineas(it.noIncluye).map((x) => `<li class="nv-no"><span class="nv-sw" aria-hidden="true"></span><span>${esc(x)}<span class="ew-sr"> (no incluido)</span></span></li>`);
        const incluye = si.length || no.length
          ? `<ul class="nv-l">${si.join('')}${no.join('')}</ul>`
          : pendiente(it.incluye) && ctx.modo !== 'publicado' ? `<p class="nv-l-pc">${aviso(ctx, it.incluye, r('incluye'))}</p>` : '';
        // El botón: el link de este nivel; si no tiene, el de la página. Sin ninguno, en publicado no hay botón.
        const link = urlDe(it.link) || general;
        const texto = sinMarcas(it.boton) ? it.boton : nombre ? `Reservar ${nombre}` : 'Reservar';
        const btn =
          link || ctx.modo !== 'publicado'
            ? `<a class="btn btn-g nv-btn" href="${esc(link || '#')}" data-checkout><span${edicion(ctx, r('boton'))}>${plano(ctx, texto)}</span><span class="btn-f" aria-hidden="true">→</span></a>` +
              (link ? '' : `<p class="pc">Por completar: el link de pago de ${nombre ? 'la entrada ' + esc(nombre) : 'esta entrada'}</p>`) +
              `<p class="nv-seg">${icono('escudo')}${seguro}</p>`
            : '';
        return (
          `<li class="nv-tj${dest ? ' nv-dest' : ''}">${etiqueta}` +
          `<div class="nv-cab">${t(ctx, r('nombre'), it.nombre, { tag: 'p', clase: 'nv-nom', siempre: true })}${etapa}` +
          `${precio}${t(ctx, r('nota'), it.nota, { tag: 'p', clase: 'nv-nota' })}${cupos}</div>` +
          `${incluye}<div class="nv-acc">${btn}</div></li>`
        );
      },
      'nombre',
    );
    return `<div class="w">${cabecera(ctx, c)}${cuentaVentas(ctx, c)}<ul class="nv nv-${Math.min(n, 4)}">${tarjetas}</ul></div>`;
  },
  css: {
    base: css`
      .nv-ct{display:flex;flex-direction:column;align-items:center;text-align:center;margin:0 auto clamp(36px,5vw,56px)}
      .nv-etapa{margin:0;font-size:.74rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acento)}
      .nv-ct .nv-etapa{padding:6px 14px;border:1px solid var(--linea);border-radius:999px;margin-bottom:12px}
      .nv-ct-t{margin:0 0 14px;color:var(--suave)}
      .nv-ct-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;width:100%;max-width:440px}
      .nv-cc{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r);padding:12px 4px;display:grid;gap:4px}
      .nv-cc .ct-n,.nv-cc .ew-odo{font-family:var(--f-tit);font-size:clamp(1.6rem,4.6vw,2.4rem);font-weight:700;line-height:1;font-variant-numeric:tabular-nums;justify-content:center}
      .nv-cl{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:var(--suave)}
      .nv{list-style:none;padding:0;margin:0;display:grid;gap:18px;align-items:stretch;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))}
      .nv-1{max-width:460px;margin-inline:auto}
      .nv-tj{position:relative;display:flex;flex-direction:column;min-width:0;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,2.6vw,30px)}
      .nv-dest{border-color:var(--pri);box-shadow:0 30px 70px -40px var(--pri)}
      .nv-eti{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);margin:0;padding:5px 14px;border-radius:999px;background:var(--pri);color:var(--sobre-pri);
        font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;max-width:calc(100% - 24px);overflow:hidden;text-overflow:ellipsis}
      .nv-cab{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--linea)}
      .nv-nom{margin:0;font-family:var(--f-tit);font-weight:700;font-size:1.15rem;overflow-wrap:anywhere}
      .nv-p{margin:4px 0 0;display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:6px}
      .nv-p strong{font-family:var(--f-tit);font-size:clamp(2.4rem,4.4vw,3.2rem);line-height:1;letter-spacing:-.02em;overflow-wrap:anywhere}
      .nv-mon{font-size:.9rem;color:var(--suave)}
      .nv-nota{margin:0;color:var(--suave);font-size:.9rem}
      .nv-cupos{width:100%;margin-top:8px}.nv-cupos p{margin:0 0 8px;font-size:.88rem;color:var(--suave)}.nv-cupos b{color:var(--texto);font-size:1.05rem}
      .nv-barra{display:block;height:5px;border-radius:999px;background:var(--linea);overflow:hidden}
      .nv-barra>span{display:block;height:100%;width:calc(var(--c,1)*100%);border-radius:inherit;background:var(--pri)}
      .nv-l{list-style:none;padding:0;margin:0 0 22px;display:grid;gap:11px}
      .nv-l li{display:flex;gap:12px;align-items:flex-start;line-height:1.45;font-size:.97rem}
      .nv-sw{position:relative;flex:none;width:30px;height:18px;margin-top:2px;border-radius:999px;background:var(--pri)}
      .nv-sw::after{content:"";position:absolute;top:3px;left:15px;width:12px;height:12px;border-radius:50%;background:var(--sobre-pri)}
      .nv-no{color:var(--suave)}.nv-no>span{text-decoration:line-through;text-decoration-thickness:1px}
      .nv-no .nv-sw{background:var(--sup2);box-shadow:inset 0 0 0 1px var(--linea)}.nv-no .nv-sw::after{left:3px;background:var(--tenue)}
      .nv-l-pc{margin:0 0 18px}
      .nv-acc{margin-top:auto;display:flex;flex-direction:column;align-items:stretch}
      .nv-btn{width:100%}
      .nv-seg{display:flex;justify-content:center;align-items:center;gap:6px;margin:12px 0 0;font-size:.82rem;color:var(--suave)}.nv-seg .ic{width:15px;height:15px}
      .nv-acc .pc{margin:10px 0 0;text-align:center}
    `,
  },
};

// ---------- equipo (quienes guían) ----------

export const equipo = {
  nombre: 'Equipo (quienes guían)',
  descripcion:
    'De 2 a 4 personas que enseñan o guían, lado a lado: foto, nombre, rol y una historia corta de cada una. Nombres, roles e ' +
    'historias SOLO los que dio la persona (si falta alguien, queda por completar). Para una sola persona va "Quién te enseña".',
  paraTipos: ['evento', 'registro', 'ventas', 'vsl'],
  banda: 'normal',
  // retratos: la foto de escenario ocupa toda la tarjeta; el nombre grande y la historia van
  // sobre su parte de abajo, con el primer nombre chiquito arriba a la izquierda.
  variantes: { tarjetas: 'Tarjetas lado a lado', retratos: 'Retratos grandes con el nombre encima' },
  campos: {
    ...CABECERA,
    personas: listaCampo(
      'Personas',
      {
        nombre: texto('Nombre', { max: 50 }),
        rol: texto('Rol', { max: 80, ayuda: 'Ej. "Facilitadora y conferencista"' }),
        bio: largo('Historia corta', { max: 600, ayuda: 'Quién es y por qué creerle, con logros que dio la persona' }),
        imagen: imagen('Foto'),
      },
      { min: 2, max: 4 },
    ),
  },
  render(s, ctx) {
    const c = s.campos;
    if (!hayItems(ctx, c.personas, 'nombre')) {
      return ctx.modo === 'publicado' ? '' : `<div class="w">${cabecera(ctx, c)}<p class="pc-sec"><span class="pc">Por completar: quiénes guían (nombre, rol e historia)</span></p></div>`;
    }
    const retratos = s.variante === 'retratos';
    const tarjetas = lista(
      ctx,
      c.personas,
      (it, i) => {
        const nombre = typeof it.nombre === 'string' ? sinMarcas(it.nombre) : '';
        const foto = ctx.img(it.imagen, `personas.${i}.imagen`, { tam: retratos ? 'mitad' : 'tarjeta', alt: nombre });
        // En retrato, el primer nombre chiquito arriba de la foto (sale del nombre: nada que escribir dos veces).
        const etiqueta = retratos && foto && nombre ? `<span class="eq-et" aria-hidden="true">${esc(nombre.split(/\s+/)[0])}</span>` : '';
        return (
          `<li class="eq-tj${foto ? '' : ' eq-sf'}">${foto ? `<div class="eq-f">${foto}${etiqueta}</div>` : ''}<div class="eq-c">` +
          `${t(ctx, `personas.${i}.nombre`, it.nombre, { tag: 'h3', clase: 'h3 eq-n', siempre: true })}${t(ctx, `personas.${i}.rol`, it.rol, { tag: 'p', clase: 'eq-r' })}` +
          `${t(ctx, `personas.${i}.bio`, it.bio, { tag: 'p', clase: 'eq-b' })}</div></li>`
        );
      },
      'nombre',
    );
    return `<div class="w">${cabecera(ctx, c)}<ul class="eq${retratos ? ' eq-rts' : ''}">${tarjetas}</ul></div>`;
  },
  css: {
    retratos: css`
      .eq-rts .eq-tj{position:relative;isolation:isolate}
      .eq-rts .eq-f{position:relative}
      .eq-rts .eq-f img{aspect-ratio:4/4.3;object-position:50% 30%}
      .eq-rts .eq-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),color-mix(in srgb,var(--sup) 70%,transparent) 22%,transparent 55%)}
      .eq-rts .eq-tj:has(.eq-f img) .eq-c{position:relative;z-index:1;margin-top:-120px}
      .eq-et{position:absolute;left:clamp(18px,2.4vw,28px);top:clamp(18px,2.4vw,28px);z-index:1;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--texto);opacity:.8}
      .eq-rts .eq-n{font-size:clamp(2rem,3.6vw,3rem);text-transform:uppercase;line-height:1.02}
      .eq-rts .eq-b strong{color:var(--texto)}
    `,
    base: css`
      .eq{list-style:none;padding:0;margin:0;display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))}
      .eq:has(>:nth-child(2):last-child){max-width:1000px;margin-inline:auto}
      .eq-tj{display:flex;flex-direction:column;min-width:0;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-g);overflow:hidden}
      .eq-f img{display:block;width:100%;height:auto;aspect-ratio:4/3.4;object-fit:cover;object-position:50% 22%;border:0;border-radius:0}
      .eq-f .img-pc{min-height:0;aspect-ratio:16/7;border-radius:0;border-width:0 0 1px}
      .eq-c{padding:clamp(20px,2.6vw,30px);display:flex;flex-direction:column;gap:8px}
      .eq-n{font-size:clamp(1.3rem,2vw,1.6rem)}
      .eq-r{margin:0;color:var(--acento);font-weight:600;font-size:.95rem}
      .eq-b{margin:6px 0 0;color:var(--suave);line-height:1.7}
    `,
  },
};

// ---------- logística ----------

const horaCorta = (ms, zona) => new Intl.DateTimeFormat('es', { timeZone: zona, hour: 'numeric', minute: '2-digit' }).format(ms);

// Lo que se puede saber del evento: { fecha, horario, lugar, formato } (vacío lo que no hay).
export function datosEvento(plan) {
  const e = plan?.evento || {};
  const ms = instanteEvento(e.fecha, e.zona);
  const f = ms ? fechaLegible(e.fecha, e.zona) : null;
  const dur = Number(e.duracionMin) || 0;
  return {
    fecha: f ? f.dia : '',
    horario: f ? (dur >= 30 ? `${horaCorta(ms, f.iana)} — ${horaCorta(ms + dur * 60000, f.iana)}` : f.hora) : '',
    zona: f ? f.zona : '',
    lugar: typeof e.lugar === 'string' ? e.lugar.trim() : '',
    formato: e.modalidad === 'presencial' ? 'Presencial' : e.fecha ? 'En línea, en vivo' : '',
  };
}

const TARJETAS_LOGISTICA = [
  ['fecha', 'Fecha', 'calendario', 'la fecha del evento (en Conversión)'],
  ['horario', 'Horario', 'reloj', 'el horario'],
  ['lugar', 'Lugar', 'lugar', 'el lugar del evento'],
  ['formato', 'Formato', 'persona', 'el formato'],
];

export const logistica = {
  nombre: 'Logística del evento',
  descripcion:
    'Fecha, horario, lugar y formato en cuatro tarjetas, cada una con una línea de detalle. Lo que no se escriba sale solo de la ' +
    'fecha, la hora, la duración y el lugar del evento (en Conversión).',
  paraTipos: ['evento', 'registro'],
  banda: 'sup',
  variantes: { tarjetas: 'Cuatro tarjetas' },
  campos: {
    antetitulo: CABECERA.antetitulo,
    titulo: CABECERA.titulo,
    resaltado: CABECERA.resaltado,
    fecha: texto('Fecha', { max: 40, ayuda: 'Vacío = la fecha del evento. Ej. "Sábado 21 de noviembre"' }),
    fechaDetalle: texto('Detalle de la fecha', { max: 60, ayuda: 'Ej. "Un solo día, de principio a fin"' }),
    horario: texto('Horario', { max: 40, ayuda: 'Vacío = la hora del evento y su duración. Ej. "9:00 a. m. — 6:00 p. m."' }),
    horarioDetalle: texto('Detalle del horario', { max: 60, ayuda: 'Ej. "Resérvate el día completo"' }),
    lugar: texto('Lugar', { max: 80, ayuda: 'Vacío = el lugar del evento' }),
    lugarDetalle: texto('Detalle del lugar', { max: 80, ayuda: 'Ej. la ciudad o cómo llegar' }),
    formato: texto('Formato', { max: 40, ayuda: 'Vacío = presencial o en línea, según el evento' }),
    formatoDetalle: texto('Detalle del formato', { max: 80, ayuda: 'Ej. "Charlas, dinámicas y una experiencia en vivo"' }),
    mapa: texto('Link de Google Maps', { max: 300, url: true }),
  },
  render(s, ctx) {
    const c = s.campos;
    const auto = datosEvento(ctx.plan);
    const publicado = ctx.modo === 'publicado';
    const tarjetas = TARJETAS_LOGISTICA.map(([k, rotulo, ic, falta]) => {
      const propio = lleno(c[k]) ? c[k] : '';
      const valor = propio || auto[k];
      const det = t(ctx, k + 'Detalle', c[k + 'Detalle'], { tag: 'p', clase: 'lg-d' });
      let v;
      if (valor) v = `<p class="lg-v"${edicion(ctx, k)}>${plano(ctx, valor)}</p>`;
      else if (publicado) return '';
      else v = `<p class="lg-v">${aviso(ctx, pendiente(c[k]) ? c[k] : { porCompletar: falta }, k)}</p>`;
      const zona = k === 'horario' && !propio && auto.zona ? `<p class="lg-d">${esc(auto.zona.charAt(0).toUpperCase() + auto.zona.slice(1))}</p>` : '';
      return `<li class="lg-tj">${icono(ic, 'ic lg-i')}<p class="lg-r">${rotulo}</p>${v}${det || zona}</li>`;
    }).filter(Boolean);
    if (!tarjetas.length) return '';
    const enlace = urlDe(c.mapa);
    const mapa = enlace ? `<div class="sec-acc"><a class="btn btn-sec" href="${esc(enlace)}" target="_blank" rel="noopener">${icono('lugar')}<span>Cómo llegar</span></a></div>` : '';
    return `<div class="w">${cabecera(ctx, c)}<ul class="lg lg-${tarjetas.length}">${tarjetas.join('')}</ul>${mapa}</div>`;
  },
  css: {
    base: css`
      .lg{list-style:none;padding:0;margin:0;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))}
      .lg-tj{min-width:0;background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(20px,2.4vw,28px);display:flex;flex-direction:column;gap:6px}
      .lg-i{width:24px;height:24px;color:var(--acento);margin-bottom:8px}
      .lg-r{margin:0;font-size:.74rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--suave)}
      .lg-v{margin:0;font-family:var(--f-tit);font-weight:700;font-size:1.12rem;line-height:1.3;overflow-wrap:break-word}
      .lg-d{margin:0;color:var(--suave);font-size:.9rem;line-height:1.5}
    `,
  },
};

// ---------- dudas por WhatsApp ----------

export const dudas = {
  nombre: 'Dudas por WhatsApp',
  descripcion: 'Un bloque corto que invita a escribir por WhatsApp con cualquier duda antes de comprar ("¿Tienes dudas? Escríbenos"). Usa el WhatsApp de la página.',
  paraTipos: ['evento', 'ventas', 'vsl', 'registro'],
  banda: 'normal',
  variantes: { tarjeta: 'Tarjeta' },
  campos: {
    titulo: texto('Título', { max: 60, ayuda: 'Ej. "¿Tienes dudas?"' }),
    texto: largo('Texto', { max: 220, ayuda: 'Ej. "Escríbenos por WhatsApp y te ayudamos con cualquier inquietud."' }),
    boton: texto('Texto del botón', { max: 32, ayuda: 'Vacío = "Escribir por WhatsApp"' }),
    whatsapp: texto('WhatsApp', { max: 30, telefono: true, ayuda: 'Con el código del país. Vacío = el WhatsApp de la página' }),
    mensaje: texto('Mensaje que te llega', { max: 200, ayuda: 'Vacío = el de la página. Ej. "Hola, tengo una duda sobre el evento"' }),
  },
  render(s, ctx) {
    const c = s.campos;
    const conv = ctx.plan.conversion || {};
    const numero = sinMarcas(c.whatsapp) || conv.whatsapp || '';
    const mensaje = sinMarcas(c.mensaje) || sinMarcas(conv.mensaje) || '';
    const href = linkWhatsapp(numero, mensaje);
    if (!href && ctx.modo === 'publicado') return '';
    const etiqueta = sinMarcas(c.boton) ? c.boton : 'Escribir por WhatsApp';
    const btn = `<a class="btn btn-g du-btn" href="${esc(href || '#')}" data-whatsapp target="_blank" rel="noopener">${icono('whatsapp')}<span${edicion(ctx, 'boton')}>${plano(ctx, etiqueta)}</span></a>`;
    const falta = href ? '' : `<p class="pc-sec">${aviso(ctx, { porCompletar: numero ? 'el código de país de tu WhatsApp' : 'tu WhatsApp (con el código del país)' }, 'whatsapp')}</p>`;
    return (
      `<div class="w"><div class="du">${icono('whatsapp', 'ic du-i')}${t(ctx, 'titulo', c.titulo, { tag: 'h2', clase: 'h3 du-t', siempre: true })}` +
      `${t(ctx, 'texto', c.texto, { tag: 'p', clase: 'du-x' })}<div class="du-acc">${btn}</div>${falta}</div></div>`
    );
  },
  css: {
    base: css`
      .s-dudas{padding-block:clamp(40px,6vw,80px)}
      .du{max-width:640px;margin-inline:auto;text-align:center;display:flex;flex-direction:column;align-items:center;background:var(--sup);border:1px solid var(--linea);
        border-radius:var(--r-g);padding:clamp(26px,4vw,44px) clamp(20px,4vw,40px)}
      .du-i{width:38px;height:38px;color:var(--acento);margin-bottom:12px}
      .du-t{margin:0;font-size:clamp(1.3rem,2.2vw,1.7rem)}
      .du-x{margin:10px 0 0;color:var(--suave);max-width:46ch}
      .du-acc{margin-top:22px;display:flex;justify-content:center;width:100%}
      .du-btn .ic{width:22px;height:22px}
      @media(max-width:620px){.du-btn{width:100%}}
    `,
  },
};

// ---------- la idea que lo explica ----------

// Un párrafo que es solo un número («200», «+10», «95%»): una marca de nivel (la cifra en una píldora con su línea).
const NUMERO = /^[+−-]?\d[\d.,]{0,6}%?$/;

// Párrafos de un texto largo (separados por una línea en blanco); en edición, uno solo editable.
function parrafos(ctx, ruta, v, clase) {
  if (ctx.modo === 'edicion' || pendiente(v)) return t(ctx, ruta, v, { tag: 'div', clase });
  if (typeof v !== 'string' || !sinMarcas(v)) return '';
  const partes = v.split(/\n\s*\n/).map((p) => [p.trim(), plano(ctx, p)]).filter(([, h]) => h);
  return partes.length ? `<div class="${clase}">${partes.map(([p, h]) => (NUMERO.test(p) ? `<p class="id-num"><span>${h}</span></p>` : `<p>${h}</p>`)).join('')}</div>` : '';
}

export const idea = {
  nombre: 'La idea que lo explica',
  descripcion:
    'El concepto de fondo que explica por qué la persona está donde está y qué lo cambia (el "por qué" del método o del ' +
    'evento): título que lo nombra, uno o dos párrafos, una frase destacada y una imagen al lado o debajo.',
  paraTipos: ['evento', 'registro', 'ventas', 'vsl'],
  banda: 'sup',
  // fondo: la imagen ocupa toda la sección, el título va encima arriba y la frase y el botón
  // abajo, sobre su parte más oscura.
  variantes: { lado: 'Texto e imagen al lado', centrada: 'Centrada con la imagen debajo', fondo: 'La imagen de fondo con el título encima' },
  campos: {
    ...CABECERA,
    encabezado: texto('Título del texto', { max: 80, ayuda: 'Opcional: una línea en negrita arriba del texto, ej. "La ciencia y la espiritualidad, unidas."' }),
    texto: largo('Texto', { max: 1200, ayuda: 'Uno o dos párrafos (sepáralos con una línea en blanco). Un párrafo que es solo un número se ve como una marca de nivel' }),
    frase: largo('Frase destacada', { max: 220, ayuda: 'La idea en una frase, ej. "No es falta de trabajo: es quién eres mientras trabajas."' }),
    imagen: imagen('Imagen', { ayuda: 'Una foto, un esquema o un mapa que explique la idea' }),
    ...BOTON,
  },
  extras: (s) => (lleno(s.campos?.encabezado) ? ['+encabezado'] : []),
  render(s, ctx) {
    const c = s.campos;
    const v = s.variante;
    const cab = cabecera(ctx, c, { centrada: true });
    const enc = t(ctx, 'encabezado', c.encabezado, { tag: 'h3', clase: 'h3 id-h' });
    const texto = parrafos(ctx, 'texto', c.texto, 'id-x');
    const frase = t(ctx, 'frase', c.frase, { tag: 'p', clase: 'id-fr' });
    if (!cab && !enc && !texto && !frase) return '';
    const foto = ctx.img(c.imagen, 'imagen', { tam: v === 'lado' ? 'retrato' : 'ancho', alt: '' });
    const btn = vacio(c.boton) && !pendiente(c.boton) ? '' : `<div class="sec-acc">${acciones(ctx, c)}</div>`;
    if (v === 'fondo') return `<div class="w id-fo${foto ? '' : ' id-sf'}">${foto ? `<div class="id-bg">${foto}</div>` : ''}${cab}<div class="id-pie">${enc}${texto}${frase}${btn}</div></div>`;
    const cuerpo = enc + texto;
    if (v === 'centrada') return `<div class="w id-c">${cab}${foto ? `<div class="id-img">${foto}</div>` : ''}${cuerpo || frase ? `<div class="id-t">${cuerpo}${frase}</div>` : ''}${btn}</div>`;
    // Al lado: con imagen, la frase destacada va debajo de las dos columnas, a lo ancho; sin imagen, debajo del texto.
    const ancha = foto && frase ? frase.replace('class="id-fr"', 'class="id-fr id-fr-a"') : '';
    return `<div class="w">${cab}<div class="id-d${foto ? '' : ' id-sf'}">${foto ? `<div class="id-img">${foto}</div>` : ''}<div class="id-t">${cuerpo}${foto ? '' : frase}</div></div>${ancha}${btn}</div>`;
  },
  css: {
    '+encabezado': css`
      .id-h{margin:0 0 16px;font-size:clamp(1.3rem,2.2vw,1.75rem)}
    `,
    base: css`
      .id-x{color:var(--suave);font-size:1.06rem;line-height:1.75}.id-x p{margin:0 0 1em}.id-x p:last-child{margin-bottom:0}
      .id-num{display:flex;align-items:center}.id-num::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,var(--pri),transparent)}
      .id-num span{padding:1px 14px;border-radius:999px;background:var(--pri);color:var(--sobre-pri);font-family:var(--f-tit);font-weight:700;font-size:1rem;line-height:1.5}
      .id-fr-a{max-width:880px;margin:clamp(36px,5vw,56px) auto 0}
      .id-fr{margin:24px 0 0;padding-left:18px;border-left:3px solid var(--pri);font-family:var(--f-tit);font-size:clamp(1.15rem,2vw,1.4rem);line-height:1.4;color:var(--texto)}
      .id-img img{display:block;width:100%;height:auto;border-radius:var(--r-g);border:1px solid var(--linea)}
    `,
    lado: css`
      .id-d{display:grid;gap:32px;align-items:center}
      @media(min-width:880px){.id-d{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px}}
      .id-d.id-sf{grid-template-columns:minmax(0,760px);justify-content:center}
      .id-d .id-img img{aspect-ratio:4/3.2;object-fit:cover}
    `,
    fondo: css`
      .id-fo{position:relative;isolation:isolate;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:32px;text-align:center;
        min-height:clamp(560px,62vw,880px)}
      .id-fo.id-sf{min-height:0;justify-content:center}
      .id-bg{position:absolute;inset:calc(clamp(64px,9vw,124px)*-1) 0;z-index:-1;overflow:hidden}
      .id-bg img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 62%;border:0;border-radius:0}
      .id-bg::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,var(--fondo),color-mix(in srgb,var(--fondo) 25%,transparent) 22%,transparent 46%,color-mix(in srgb,var(--fondo) 35%,transparent) 84%,var(--fondo))}
      .id-fo .cab{margin-bottom:0}
      .id-pie{display:flex;flex-direction:column;align-items:center;max-width:760px}
      .id-pie .id-fr{border:0;padding:0;margin:0;font-style:italic;font-size:1rem;line-height:1.5;color:var(--texto);background:none}
      .id-pie .sec-acc{margin-top:22px}
    `,
    centrada: css`
      .id-c{display:flex;flex-direction:column;align-items:center}
      .id-c .id-img{width:100%;max-width:960px}.id-c .id-img img{aspect-ratio:16/9;object-fit:cover}
      .id-c .id-t{max-width:720px;margin-top:clamp(28px,4vw,44px);text-align:center}
      .id-c .id-fr{border-left:0;padding-left:0}
    `,
  },
};

// ---------- dos caminos ----------

function camino(ctx, c, l, ic) {
  const items = hayItems(ctx, c['items' + l], 'texto')
    ? `<ul class="cm-l">${lista(ctx, c['items' + l], (it, i) => `<li>${icono(ic)}${t(ctx, `items${l}.${i}.texto`, it.texto, { tag: 'span', siempre: true })}</li>`, 'texto')}</ul>`
    : '';
  const cuerpo =
    t(ctx, 'rotulo' + l, c['rotulo' + l], { tag: 'p', clase: 'cm-r' }) +
    t(ctx, 'titulo' + l, c['titulo' + l], { tag: 'h3', clase: 'h3 cm-t' }) +
    t(ctx, 'texto' + l, c['texto' + l], { tag: 'p', clase: 'cm-x' }) +
    items +
    t(ctx, 'cierre' + l, c['cierre' + l], { tag: 'p', clase: 'cm-c' });
  return cuerpo ? `<div class="cm-col cm-${l.toLowerCase()}">${cuerpo}</div>` : '';
}

export const caminos = {
  nombre: 'Dos caminos',
  descripcion:
    'La decisión en dos columnas: a un lado el costo de no hacer nada (lo que sigue igual otro año), al otro lo que cambia ' +
    'para siempre si da el paso. Cada columna con su rótulo, un título, la lista y una frase de cierre.',
  paraTipos: ['evento', 'registro', 'ventas', 'vsl'],
  banda: 'sup',
  variantes: { columnas: 'Dos columnas' },
  campos: {
    ...CABECERA,
    rotuloA: texto('Rótulo del primer camino', { max: 40, ayuda: 'Ej. "El costo de no ir"' }),
    tituloA: texto('Título del primer camino', { max: 90 }),
    textoA: largo('Texto del primer camino', { max: 260 }),
    itemsA: listaCampo('Lo que sigue igual', { texto: texto('Ítem', { max: 160 }) }, { min: 3, max: 6 }),
    cierreA: largo('Cierre del primer camino', { max: 200 }),
    rotuloB: texto('Rótulo del segundo camino', { max: 40, ayuda: 'Ej. "Lo que cambia"' }),
    tituloB: texto('Título del segundo camino', { max: 90 }),
    textoB: largo('Texto del segundo camino', { max: 260 }),
    itemsB: listaCampo('Lo que cambia', { texto: texto('Ítem', { max: 160 }) }, { min: 3, max: 6 }),
    cierreB: largo('Cierre del segundo camino', { max: 200 }),
  },
  render(s, ctx) {
    const c = s.campos;
    const a = camino(ctx, c, 'A', 'x');
    const b = camino(ctx, c, 'B', 'rayo');
    if (!a && !b) return '';
    return `<div class="w">${cabecera(ctx, c)}<div class="cm${a && b ? '' : ' cm-1'}">${a}${b}</div></div>`;
  },
  css: {
    base: css`
      .cm{display:grid;gap:18px;max-width:1040px;margin-inline:auto}
      @media(min-width:820px){.cm{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px}.cm.cm-1{grid-template-columns:minmax(0,640px);justify-content:center}}
      .cm-col{min-width:0;background:var(--fondo);border:1px solid var(--linea);border-radius:var(--r-g);padding:clamp(22px,3vw,34px);display:flex;flex-direction:column}
      .cm-b{border-color:var(--pri)}
      .cm-r{margin:0 0 10px;font-size:.74rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--acento)}
      .cm-a .cm-r{color:var(--suave)}
      .cm-t{margin:0}.cm-x{margin:12px 0 0;color:var(--suave)}
      .cm-l{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:12px}
      .cm-l li{display:flex;gap:12px;align-items:flex-start;line-height:1.5}
      .cm-l .ic{width:20px;height:20px;flex:none;margin-top:2px}
      .cm-a .ic{color:var(--tenue)}.cm-b .ic{color:var(--acento)}
      .cm-c{margin:auto 0 0;padding-top:20px;border-top:1px solid var(--linea);color:var(--suave);font-size:.95rem}
      .cm-l+.cm-c,.cm-x+.cm-c{margin-top:22px}
    `,
  },
};
