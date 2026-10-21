// El sitio de tu página en Cloudflare (un Worker con archivos estáticos).
//
// Qué hace:
//   · sirve la página (/), la de gracias (/gracias) y las legales (/privacidad y /terminos), que arma armar.mjs en sitio/;
//   · recibe el formulario (POST /api/lead): lo revisa, frena a los robots (campo trampa) y a quien manda demasiados,
//     lo guarda en tu base D1 (REGISTROS) y, si lo configuraste, lo reenvía a tu webhook y a la API de conversiones de Meta;
//   · cuenta las visitas por día (POST /api/v), sin guardar datos de nadie;
//   · pone las cabeceras de seguridad y de caché, y manda todo por HTTPS.
//
// Configuración (wrangler.jsonc, la escribe la skill):
//   vars.ZONA_HORARIA      la zona de tus estadísticas (America/Bogota, America/Mexico_City…)
//   vars.META_PIXEL        el id de tu píxel de Meta (opcional, sale de plan.pixel.meta)
//   vars.LIMITE_REGISTROS  cuántos registros por persona cada 10 minutos (5 si no se dice)
// Secretos (se guardan con `npx wrangler secret put NOMBRE`, nunca en el código):
//   WEBHOOK_URL            a dónde reenviar cada registro: GoHighLevel, Zapier o Make (opcional)
//   META_CAPI_TOKEN        el token de la API de conversiones de Meta (opcional)

const PAGINAS = {
  '/': '/index.html',
  '/gracias': '/gracias.html',
  '/privacidad': '/privacidad.html',
  '/terminos': '/terminos.html',
};
const SIN_INDEXAR = new Set(['/gracias', '/privacidad', '/terminos']);
const MAX_LEAD = 16 * 1024;
const MAX_VISITA = 4 * 1024;
const VENTANA_MS = 10 * 60 * 1000;
const PREFIJO_PRUEBA = 'prueba-skill-';

const SEGURIDAD = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    // Solo HTTPS: lo que llega por HTTP se manda a la misma dirección con https (los formularios nunca viajan en claro).
    if (url.protocol === 'http:' && !local) {
      url.protocol = 'https:';
      const metodo = request.method;
      return new Response(null, { status: metodo === 'GET' || metodo === 'HEAD' ? 301 : 308, headers: { location: url.href } });
    }
    let r;
    try {
      r = await atender(request, env, ctx, url);
    } catch (e) {
      console.error('[sitio]', e?.stack || e?.message || e);
      r = url.pathname.startsWith('/api/') ? json({ error: 'Algo falló. Inténtalo otra vez en un momento.' }, 500) : html(PAGINA_ERROR, 500, 'no-store');
    }
    const h = new Headers(r.headers);
    for (const [k, v] of Object.entries(SEGURIDAD)) if (!h.has(k)) h.set(k, v);
    if (!local) h.set('strict-transport-security', 'max-age=31536000');
    return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
  },
};

async function atender(request, env, ctx, url) {
  const ruta = url.pathname;

  if (ruta === '/api/lead') {
    if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
    return recibirLead(request, env, ctx, url);
  }
  if (ruta === '/api/v') {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    return recibirVisita(request, env, ctx, url);
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Método no permitido', { status: 405 });

  if (ruta === '/robots.txt') {
    return texto(`User-agent: *\nAllow: /\nDisallow: /gracias\nSitemap: ${url.origin}/sitemap.xml\n`, 'text/plain; charset=utf-8');
  }
  if (ruta === '/sitemap.xml') {
    return texto(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.origin}/</loc></url></urlset>`, 'application/xml; charset=utf-8');
  }

  // Direcciones limpias: /gracias/ → /gracias, /gracias.html → /gracias, /index.html → /.
  if (ruta.length > 1 && ruta.endsWith('/')) return redirigir(url, ruta.replace(/\/+$/, '') || '/');
  if (ruta === '/index.html') return redirigir(url, '/');
  const conHtml = /^\/(gracias|privacidad|terminos)\.html$/.exec(ruta);
  if (conHtml) return redirigir(url, '/' + conHtml[1]);

  if (Object.hasOwn(PAGINAS, ruta)) {
    const r = await archivo(env, url, PAGINAS[ruta]);
    if (!r.ok) return noEncontrada();
    const extra = SIN_INDEXAR.has(ruta) ? { 'x-robots-tag': 'noindex' } : {};
    // Un minuto de caché: cuando vuelves a publicar, la gente ve lo nuevo enseguida.
    return new Response(r.body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60', ...extra } });
  }

  // Letras, fotos y videos (en Cloudflare los sirve directo la capa de archivos; aquí llegan solo en pruebas locales).
  if (/^\/(_f|img|media)\//.test(ruta) || /^\/favicon\.(ico|png|svg)$/.test(ruta)) {
    const r = await archivo(env, url, ruta);
    if (!r.ok) return noEncontrada();
    const h = new Headers(r.headers);
    h.set('cache-control', ruta.startsWith('/_f/') ? 'public, max-age=604800' : 'public, max-age=31536000, immutable');
    return new Response(r.body, { status: 200, headers: h });
  }
  return noEncontrada();
}

// Lee un archivo de sitio/ por su nombre exacto.
function archivo(env, url, ruta) {
  return env.ASSETS.fetch(new Request(new URL(ruta, url.origin), { method: 'GET' }));
}

function redirigir(url, ruta) {
  return new Response(null, { status: 301, headers: { location: ruta + url.search, 'cache-control': 'public, max-age=300' } });
}

function json(datos, estado = 200) {
  return new Response(JSON.stringify(datos), { status: estado, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function texto(cuerpo, tipo) {
  return new Response(cuerpo, { headers: { 'content-type': tipo, 'cache-control': 'public, max-age=3600' } });
}

function html(cuerpo, estado, cache) {
  return new Response(cuerpo, { status: estado, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': cache, 'x-robots-tag': 'noindex' } });
}

const PAGINA_SIMPLE = (titulo, linea) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titulo}</title>` +
  `<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0b0d;color:#e9edf2;font:16px/1.6 system-ui,sans-serif;text-align:center;padding:24px}h1{font-size:1.6rem;margin:0 0 8px}p{color:#9aa3ae;margin:0}a{color:#e9edf2}</style></head>` +
  `<body><main><h1>${titulo}</h1><p>${linea}</p></main></body></html>`;
const PAGINA_404 = PAGINA_SIMPLE('No encontramos esta página', 'Revisa la dirección o vuelve al <a href="/">inicio</a>.');
const PAGINA_ERROR = PAGINA_SIMPLE('Algo falló', 'Inténtalo otra vez en un momento.');
const noEncontrada = () => html(PAGINA_404, 404, 'no-store');

// ---------- quién manda el pedido ----------

// Lo que manda la propia página trae su mismo Origin (o ninguno) y Sec-Fetch-Site same-origin (o ninguno). Una web
// ajena que intenta mandar registros desde el navegador de sus visitantes siempre trae uno de los dos distinto.
function deOtraWeb(request, url) {
  const origen = request.headers.get('origin');
  if (origen && origen !== url.origin) return true;
  const sitio = request.headers.get('sec-fetch-site');
  return !!sitio && sitio !== 'same-origin';
}

// Lee el cuerpo contando bytes y corta apenas pasa `max`. { texto } o { grande: true }.
async function leerTexto(request, max) {
  const largo = request.headers.get('content-length');
  if (largo !== null && Number(largo) > max) return { grande: true };
  if (!request.body) return { texto: '' };
  const lector = request.body.getReader();
  const partes = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      lector.cancel().catch(() => {});
      return { grande: true };
    }
    partes.push(value);
  }
  const todo = new Uint8Array(total);
  let i = 0;
  for (const p of partes) {
    todo.set(p, i);
    i += p.byteLength;
  }
  return { texto: new TextDecoder().decode(todo) };
}

async function leerJSON(request, max) {
  const { texto, grande } = await leerTexto(request, max);
  if (grande) return { grande: true };
  try {
    const d = JSON.parse(texto);
    return d && typeof d === 'object' && !Array.isArray(d) ? { datos: d } : {};
  } catch {
    return {};
  }
}

// Huella de la IP (SHA-256 con el dominio): sirve para frenar abusos sin guardar la IP de nadie. Las IPv6 se agrupan
// por /64 (una sola conexión de casa tiene muchísimas direcciones).
async function huellaIP(ip, host) {
  let s = String(ip || '').trim().toLowerCase();
  if (s.includes(':')) {
    const [cabeza, cola] = s.split('::');
    const a = cabeza ? cabeza.split(':') : [];
    const b = cola === undefined ? null : cola ? cola.split(':') : [];
    const grupos = b === null ? a : [...a, ...Array(Math.max(0, 8 - a.length - b.length)).fill('0'), ...b];
    s = grupos.slice(0, 4).map((g) => (Number.parseInt(g, 16) || 0).toString(16)).join(':') + '::/64';
  }
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${host}|${s}`));
  return [...new Uint8Array(bytes)].slice(0, 12).map((x) => x.toString(16).padStart(2, '0')).join('');
}

// ---------- registro (lead) ----------

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^\+?[\d\s().-]{7,30}$/;
const CAMPOS_LEAD = { nombre: 120, correo: 160, whatsapp: 30, telefono: 30, ciudad: 80, empresa: 120 };
// Las mismas claves de campaña que guarda la página.
const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'gclid', 'ttclid', 'sck', 'src', 'xcod'];
const UTM_EN_COLUMNA = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

// Datos del formulario → solo los campos conocidos, recortados y revisados. { datos } o { error }. Basta un dato de
// contacto: correo, WhatsApp o teléfono.
function revisarLead(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return { error: 'No pude leer el formulario.' };
  const fuera = {};
  for (const [k, max] of Object.entries(CAMPOS_LEAD)) {
    const v = typeof datos[k] === 'string' ? datos[k].trim().slice(0, max) : '';
    if (v) fuera[k] = v;
  }
  if (fuera.correo && !CORREO.test(fuera.correo)) return { error: 'Revisa tu correo.' };
  for (const k of ['whatsapp', 'telefono']) {
    if (fuera[k] && (!TELEFONO.test(fuera[k]) || fuera[k].replace(/\D/g, '').length < 7)) return { error: 'Revisa tu número (con código de país).' };
  }
  if (!fuera.correo && !fuera.whatsapp && !fuera.telefono) return { error: 'Déjanos tu correo o tu WhatsApp para poder escribirte.' };
  return { datos: fuera };
}

function limpiarUtm(utm) {
  const fuera = {};
  if (!utm || typeof utm !== 'object') return fuera;
  for (const k of CLAVES_UTM) if (typeof utm[k] === 'string' && utm[k].trim()) fuera[k] = utm[k].trim().slice(0, 200);
  return fuera;
}

const normalizarFuente = (v) => String(v ?? '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// De dónde vino una visita o un registro: la utm_source, o el sitio que lo mandó (sin www.) si no es el propio, o «directo».
function fuenteDe(utm, ref, host) {
  const s = normalizarFuente(utm?.utm_source);
  if (s) return s;
  try {
    const h = new URL(String(ref || '')).hostname.toLowerCase().replace(/^(www|l|m|lm)\./, '');
    if (h && h !== String(host || '').toLowerCase().replace(/^www\./, '')) return normalizarFuente(h) || 'directo';
  } catch {
    /* sin referencia */
  }
  return 'directo';
}

// La URL que dice el navegador, solo si es de este mismo sitio.
function urlPropia(v, url) {
  if (typeof v !== 'string' || v.length > 500) return null;
  try {
    const u = new URL(v);
    return u.origin === url.origin && !u.username && !u.password ? u.href : null;
  } catch {
    return null;
  }
}

// Un texto que empieza con = + - @ se toma como fórmula en una hoja de cálculo (destino típico del webhook).
const neutro = (v) => (typeof v === 'string' && /^[=+\-@\t\r]/.test(v) ? "'" + v : v);
const neutralizar = (o, salvo = []) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, salvo.includes(k) ? v : neutro(v)]));

async function recibirLead(request, env, ctx, url) {
  if (deOtraWeb(request, url)) return json({ error: 'Envía el formulario desde la página.' }, 403);
  // Solo JSON: desde otra web eso exige un permiso previo (CORS) que este sitio nunca da.
  if (!/^application\/json\b/i.test(request.headers.get('content-type') || '')) return json({ error: 'Envía el formulario desde la página.' }, 415);
  const { datos: cuerpo, grande } = await leerJSON(request, MAX_LEAD);
  if (grande) return json({ error: 'El formulario es demasiado grande.' }, 413);
  if (!cuerpo) return json({ error: 'No pude leer el formulario.' }, 400);
  // Robot (llenó el campo que la gente no ve): se le responde bien para que no insista, pero no se guarda.
  if (cuerpo.datos?.sitio_web) return json({ ok: true });
  const revision = revisarLead(cuerpo.datos);
  if (!revision.datos) return json({ error: revision.error }, 400);
  const datos = revision.datos;
  if (!env.REGISTROS) return json({ error: 'La página todavía no tiene su base de registros.' }, 503);

  const ip = await huellaIP(request.headers.get('cf-connecting-ip'), url.host);
  const limite = Math.max(1, Number.parseInt(env.LIMITE_REGISTROS, 10) || 5);
  const desde = new Date(Date.now() - VENTANA_MS).toISOString();
  const previos = await env.REGISTROS.prepare('SELECT COUNT(*) AS n FROM registros WHERE ip = ? AND creado > ?').bind(ip, desde).first();
  if ((previos?.n || 0) >= limite) return json({ error: 'Demasiados intentos. Espera unos minutos.' }, 429);

  const utm = limpiarUtm(cuerpo.utm);
  const eventId = typeof cuerpo.event_id === 'string' && /^[\w-]{4,64}$/.test(cuerpo.event_id) ? cuerpo.event_id : 'sv' + crypto.randomUUID().replace(/-/g, '');
  const prueba = eventId.startsWith(PREFIJO_PRUEBA);
  const urlPagina = urlPropia(cuerpo.url, url) || url.origin + '/';
  const ref = typeof cuerpo.ref === 'string' ? cuerpo.ref.slice(0, 300) : '';
  const pagina = typeof cuerpo.pagina === 'string' ? cuerpo.pagina.slice(0, 80) : '';
  const extra = Object.fromEntries(Object.entries(utm).filter(([k]) => !UTM_EN_COLUMNA.includes(k)));
  const r = await env.REGISTROS.prepare(
    'INSERT INTO registros (creado, pagina, nombre, correo, whatsapp, telefono, ciudad, empresa, fuente, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid, utm_extra, url, referencia, pais, ip, event_id, prueba) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(event_id) DO NOTHING',
  )
    .bind(
      new Date().toISOString(), pagina, datos.nombre || null, datos.correo || null, datos.whatsapp || null, datos.telefono || null,
      datos.ciudad || null, datos.empresa || null, fuenteDe(utm, ref, url.host),
      ...UTM_EN_COLUMNA.map((k) => utm[k] || null),
      Object.keys(extra).length ? JSON.stringify(extra) : null,
      urlPagina, ref || null, request.cf?.country || null, ip, eventId, prueba ? 1 : 0,
    )
    .run();
  // Reintento del mismo registro (la persona tocó dos veces o se cortó la conexión): ya se guardó y ya se avisó.
  if (!r.meta?.changes) return json({ ok: true, repetido: true });

  if (!prueba) {
    ctx.waitUntil(
      (async () => {
        if (env.META_PIXEL && env.META_CAPI_TOKEN) {
          await eventoMeta(env.META_PIXEL, env.META_CAPI_TOKEN, {
            id: eventId, url: urlPagina, email: datos.correo, telefono: datos.whatsapp || datos.telefono, nombre: datos.nombre, request,
            fbp: typeof cuerpo.fbp === 'string' ? cuerpo.fbp.slice(0, 200) : '', fbc: typeof cuerpo.fbc === 'string' ? cuerpo.fbc.slice(0, 300) : '',
          });
        }
        // Las UTM primero: nunca pisan lo revisado (datos, página, url, fecha).
        if (env.WEBHOOK_URL) {
          await avisarWebhook(env.WEBHOOK_URL, {
            ...neutralizar(utm),
            ...neutralizar(datos, ['whatsapp', 'telefono']),
            pagina: neutro(pagina),
            url: urlPagina,
            fecha: new Date().toISOString(),
          });
        }
      })(),
    );
  }
  return json({ ok: true });
}

async function avisarWebhook(destino, datos) {
  if (!/^https:\/\//.test(destino || '')) return;
  const ctrl = new AbortController();
  const reloj = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(destino, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(datos), signal: ctrl.signal });
    if (!r.ok) console.error('[webhook]', r.status);
  } catch (e) {
    console.error('[webhook]', e?.message || e);
  } finally {
    clearTimeout(reloj);
  }
}

// ---------- API de conversiones de Meta (el mismo Lead que manda el píxel, con el mismo event_id: Meta lo cuenta una vez) ----------

async function sha(v) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(v).trim().toLowerCase()));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function galleta(request, nombre) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${nombre}=([^;]+)`));
  try {
    return m ? decodeURIComponent(m[1]) : '';
  } catch {
    return '';
  }
}

async function eventoMeta(pixel, token, e) {
  try {
    const u = {};
    if (e.email) {
      const h = await sha(e.email);
      u.em = [h];
      u.external_id = [h];
    }
    const tel = String(e.telefono || '').replace(/\D/g, '');
    if (tel) u.ph = [await sha(tel)];
    const partes = String(e.nombre || '').trim().split(/\s+/).filter(Boolean);
    if (partes.length) u.fn = [await sha(partes[0])];
    if (partes.length > 1) u.ln = [await sha(partes[partes.length - 1])];
    const ip = e.request.headers.get('cf-connecting-ip');
    if (ip) u.client_ip_address = ip;
    const ua = e.request.headers.get('user-agent');
    if (ua) u.client_user_agent = ua;
    const fbp = galleta(e.request, '_fbp') || e.fbp;
    const fbc = galleta(e.request, '_fbc') || e.fbc;
    if (fbp) u.fbp = fbp;
    if (fbc) u.fbc = fbc;
    const evento = { event_name: 'Lead', event_time: Math.floor(Date.now() / 1000), event_id: e.id, event_source_url: e.url, action_source: 'website', user_data: u };
    const r = await fetch(`https://graph.facebook.com/v23.0/${encodeURIComponent(pixel)}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: [evento] }),
    });
    if (!r.ok) console.error('[meta]', r.status, (await r.text()).slice(0, 300));
  } catch (err) {
    console.error('[meta]', err?.message || err);
  }
}

// ---------- visitas ----------

function diaEn(zona) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: zona || 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function recibirVisita(request, env, ctx, url) {
  if (deOtraWeb(request, url)) return new Response(null, { status: 403 });
  const { datos: cuerpo, grande } = await leerJSON(request, MAX_VISITA);
  if (grande) return new Response(null, { status: 413 });
  if (cuerpo && env.REGISTROS) {
    const utm = limpiarUtm(cuerpo.utm);
    const ref = typeof cuerpo.ref === 'string' ? cuerpo.ref.slice(0, 300) : '';
    const tipo = cuerpo.tipo === 'gracias' ? 'gracias' : 'principal';
    ctx.waitUntil(
      env.REGISTROS.prepare('INSERT INTO visitas (dia, tipo, fuente, n) VALUES (?, ?, ?, 1) ON CONFLICT(dia, tipo, fuente) DO UPDATE SET n = n + 1')
        .bind(diaEn(env.ZONA_HORARIA), tipo, fuenteDe(utm, ref, url.host))
        .run()
        .catch((e) => console.error('[visita]', e?.message || e)),
    );
  }
  return new Response(null, { status: 204 });
}
