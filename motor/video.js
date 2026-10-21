// Video de la página: un link o un código de inserción → lo que pinta el motor. Solo proveedores conocidos.
// Puro (sin DOM): lo usan normalizarPlan (al guardar) y videoHTML (al pintar), así el motor sanea siempre, venga el
// plan de donde venga. El código de inserción crudo solo lo pega la persona dueña de la página (el director descarta
// el HTML que escribe la IA); aun así aquí se rearma desde cero con lo permitido y lo demás se descarta.

// Proveedores (el dominio y sus subdominios): VTurb, Panda, Wistia, YouTube, Vimeo, Loom y Streamable.
const PROVEEDORES = [
  'converteai.net', 'vturb.com', 'pandavideo.com.br', 'pandavideo.com', 'wistia.com', 'wistia.net',
  'youtube.com', 'youtube-nocookie.com', 'youtu.be', 'vimeo.com', 'loom.com', 'streamable.com',
];
export const MAX_CODIGO_VIDEO = 8000;
const MAX_LINK_VIDEO = 4000;

function deDominio(host, dominio) {
  return host === dominio || host.endsWith('.' + dominio);
}

function leerUrl(v) {
  try {
    const u = new URL(v);
    return /^https?:$/.test(u.protocol) ? u : null;
  } catch {
    return null;
  }
}

// Link https a un proveedor conocido (para src y href del código de inserción). '' si no.
function urlProveedor(v) {
  const u = leerUrl(String(v || '').trim());
  return u && u.protocol === 'https:' && PROVEEDORES.some((d) => deDominio(u.hostname.toLowerCase(), d)) ? u.href : '';
}

// Link → qué pintar: { yt } (fachada de YouTube), { src } (iframe de un proveedor), { archivo } (.mp4/.webm/.mov) o null.
export function fuenteVideo(url) {
  const u = leerUrl(String(url || '').trim());
  if (!u) return null;
  const host = u.hostname.toLowerCase();
  const partes = u.pathname.split('/').filter(Boolean);
  const https = u.protocol === 'https:';
  if (deDominio(host, 'youtube.com') || deDominio(host, 'youtube-nocookie.com') || host === 'youtu.be') {
    const id = host === 'youtu.be' ? partes[0] : u.searchParams.get('v') || (/^(embed|shorts|live|v|e)$/.test(partes[0]) ? partes[1] : '');
    return /^[\w-]{11}$/.test(id || '') ? { yt: id } : null;
  }
  if (deDominio(host, 'vimeo.com')) {
    // vimeo.com/<id>, vimeo.com/<id>/<hash>, player.vimeo.com/video/<id>?h=<hash>, vimeo.com/channels/x/<id>…
    const k = partes.findIndex((p) => /^\d+$/.test(p));
    if (k < 0) return null;
    const h = u.searchParams.get('h') || (/^[\da-f]{6,20}$/i.test(partes[k + 1] || '') ? partes[k + 1] : '');
    // El hash es lo que deja ver un video no listado (el típico de una VSL).
    return { src: `https://player.vimeo.com/video/${partes[k]}?${/^[\da-f]{6,20}$/i.test(h) ? 'h=' + h + '&' : ''}dnt=1` };
  }
  if (deDominio(host, 'loom.com')) {
    const k = partes.findIndex((p) => p === 'share' || p === 'embed');
    return k >= 0 && /^\w+$/.test(partes[k + 1] || '') ? { src: `https://www.loom.com/embed/${partes[k + 1]}` } : null;
  }
  if (deDominio(host, 'streamable.com')) {
    const id = /^(e|o|s)$/.test(partes[0]) ? partes[1] : partes[0];
    return /^\w+$/.test(id || '') ? { src: `https://streamable.com/e/${id}` } : null;
  }
  if (deDominio(host, 'wistia.com') || deDominio(host, 'wistia.net')) {
    const k = partes.findIndex((p) => p === 'medias' || p === 'iframe');
    if (k >= 0 && /^\w+$/.test(partes[k + 1] || '')) return { src: `https://fast.wistia.net/embed/iframe/${partes[k + 1]}?videoFoam=true` };
  }
  // Panda (player-vz-….tv.pandavideo.com.br/embed/?v=…), VTurb (…/embed.html) y Wistia: su link de inserción tal cual.
  if (https && ['pandavideo.com.br', 'pandavideo.com', 'converteai.net', 'vturb.com', 'wistia.com', 'wistia.net'].some((d) => deDominio(host, d))) return { src: u.href };
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { archivo: u.href };
  return null;
}

// ---------- código de inserción ----------

// Etiquetas que se conservan. Los contenedores son los que usan VTurb (<div id="vid_…">, <vturb-smartplayer>) y
// Wistia (<div class="wistia_embed …">, <wistia-player>); scripts e iframes solo con src de un proveedor.
const CONTENEDORES = new Set(['div', 'span', 'vturb-smartplayer', 'wistia-player']);
const REL_LINK = new Set(['preload', 'dns-prefetch', 'preconnect', 'prefetch']);
const AS_LINK = new Set(['script', 'image', 'style', 'fetch', 'font']);

function desentidades(s) {
  return String(s ?? '').replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (m, e) => {
    const x = e.toLowerCase();
    if (x[0] === '#') {
      const n = x[1] === 'x' ? parseInt(x.slice(2), 16) : parseInt(x.slice(1), 10);
      return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '';
    }
    return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[x];
  });
}

const escAttr = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Valor permitido de cada atributo ('' = se descarta). true = atributo sin valor (allowfullscreen, async…).
const ATRIBUTOS = {
  id: (v) => (/^[\w:.-]{1,80}$/.test(v) && !/^(ew|registro$|oferta$)/i.test(v) ? v : ''),
  class: (v) => v.split(/\s+/).filter((c) => /^[\w=.-]{1,60}$/.test(c) && !/^(ew|modal)/.test(c)).join(' ').slice(0, 200),
  // Estilos en línea de los códigos (relleno 56,25 %, posición absoluta…): nada que salga del recuadro ni cargue cosas.
  style: (v) => {
    const s = v.replace(/\s+/g, ' ').trim();
    return s.length <= 400 && !/url\s*\(|expression|javascript|@import|behavior|binding|fixed|sticky|z-index|[<>\\]/i.test(s) ? s : '';
  },
  width: (v) => (/^\d{1,4}(%|px)?$/.test(v) ? v : ''),
  height: (v) => (/^\d{1,4}(%|px)?$/.test(v) ? v : ''),
  title: (v) => v.slice(0, 120),
  alt: (v) => v.slice(0, 120),
  allow: (v) => (/^[\w\s;:=*'.-]{1,300}$/.test(v) ? v.replace(/\s+/g, ' ').trim() : ''),
  allowfullscreen: () => true,
  loading: (v) => (/^(lazy|eager)$/.test(v) ? v : ''),
  fetchpriority: (v) => (/^(high|low|auto)$/.test(v) ? v : ''),
  referrerpolicy: (v) => (/^[a-z-]{1,40}$/.test(v) ? v : ''),
  async: () => true,
  defer: () => true,
  'media-id': (v) => (/^\w{1,40}$/.test(v) ? v : ''),
  aspect: (v) => (/^[\d.]{1,20}$/.test(v) ? v : ''),
};
const PERMITIDOS = {
  div: ['id', 'class', 'style'],
  span: ['id', 'class', 'style'],
  'vturb-smartplayer': ['id', 'class', 'style'],
  'wistia-player': ['id', 'class', 'style', 'media-id', 'aspect'],
  iframe: ['id', 'class', 'style', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'loading', 'fetchpriority', 'referrerpolicy'],
  img: ['id', 'class', 'style', 'width', 'height', 'alt', 'loading', 'fetchpriority'],
  script: ['async', 'defer'],
};

function atributos(etiqueta, lista) {
  let fuera = '';
  const vistos = new Set();
  for (const [nombre, crudo] of lista) {
    if (vistos.has(nombre) || !PERMITIDOS[etiqueta].includes(nombre)) continue;
    vistos.add(nombre);
    const v = ATRIBUTOS[nombre](desentidades(crudo ?? '').trim());
    if (v === true) fuera += ' ' + nombre;
    else if (v) fuera += ` ${nombre}="${escAttr(v)}"`;
  }
  return fuera;
}

const valorDe = (lista, nombre) => (lista.find(([n]) => n === nombre) || [])[1];

// Recorre el HTML: [{ cierre, nombre, attrs: [[nombre, valor]], interior }] (interior solo en script y style).
function etiquetas(html) {
  const fuera = [];
  const bajo = html.toLowerCase();
  const n = html.length;
  let i = 0;
  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (html.startsWith('<!--', lt)) {
      const fin = html.indexOf('-->', lt + 4);
      i = fin < 0 ? n : fin + 3;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][\w-]*)/.exec(html.slice(lt, lt + 80));
    if (!m) {
      i = lt + 1;
      continue;
    }
    let j = lt + m[0].length;
    const attrs = [];
    while (j < n && html[j] !== '>') {
      if (/[\s/]/.test(html[j])) {
        j++;
        continue;
      }
      const mn = /^[^\s"'>/=]+/.exec(html.slice(j, j + 120));
      if (!mn) {
        j++;
        continue;
      }
      j += mn[0].length;
      while (j < n && /\s/.test(html[j])) j++;
      let valor = null;
      if (html[j] === '=') {
        j++;
        while (j < n && /\s/.test(html[j])) j++;
        const q = html[j];
        if (q === '"' || q === "'") {
          const fin = html.indexOf(q, j + 1);
          valor = html.slice(j + 1, fin < 0 ? n : fin);
          j = fin < 0 ? n : fin + 1;
        } else {
          valor = (/^[^\s>]*/.exec(html.slice(j, j + 2000)) || [''])[0];
          j += valor.length;
        }
      }
      attrs.push([mn[0].toLowerCase(), valor]);
    }
    const nombre = m[2].toLowerCase();
    const t = { cierre: !!m[1], nombre, attrs };
    i = j + 1;
    if (!t.cierre && (nombre === 'script' || nombre === 'style')) {
      const fin = bajo.indexOf('</' + nombre, i);
      t.interior = html.slice(i, fin < 0 ? n : fin);
      i = fin < 0 ? n : html.indexOf('>', fin) + 1 || n;
    }
    fuera.push(t);
  }
  return fuera;
}

// Código de inserción → el mismo código rearmado solo con etiquetas, atributos y links permitidos. '' si no queda
// ningún reproductor (iframe o script de un proveedor). Es idempotente: sanear lo saneado da lo mismo.
export function sanearCodigoVideo(html) {
  let fuera = '';
  let reproductores = 0;
  const pila = [];
  const scripts = new Set();
  const script = (src, attrs) => {
    if (scripts.has(src)) return;
    scripts.add(src);
    reproductores++;
    fuera += `<script src="${escAttr(src)}"${attrs}></script>`;
  };
  for (const t of etiquetas(String(html || ''))) {
    if (t.cierre) {
      const k = pila.lastIndexOf(t.nombre);
      if (k >= 0) while (pila.length > k) fuera += `</${pila.pop()}>`;
      continue;
    }
    if (t.nombre === 'script') {
      const src = valorDe(t.attrs, 'src');
      if (src != null) {
        const u = urlProveedor(desentidades(src));
        if (u) script(u, atributos('script', t.attrs) + (valorDe(t.attrs, 'type') && /module/i.test(valorDe(t.attrs, 'type')) ? ' type="module"' : ''));
      } else {
        // Script en línea (VTurb carga así su player.js): se conserva solo la carga de los .js del proveedor.
        for (const x of t.interior.match(/https:\/\/[^\s"'`<>()\\]+/g) || []) {
          const u = urlProveedor(x);
          if (u && /\.js$/i.test(new URL(u).pathname)) script(u, ' async');
        }
      }
    } else if (t.nombre === 'iframe') {
      const u = urlProveedor(desentidades(valorDe(t.attrs, 'src') || ''));
      if (u) {
        reproductores++;
        fuera += `<iframe src="${escAttr(u)}"${atributos('iframe', t.attrs)}></iframe>`;
      }
    } else if (t.nombre === 'img') {
      const u = urlProveedor(desentidades(valorDe(t.attrs, 'src') || ''));
      if (u) fuera += `<img src="${escAttr(u)}"${atributos('img', t.attrs)}>`;
    } else if (t.nombre === 'link') {
      const u = urlProveedor(desentidades(valorDe(t.attrs, 'href') || ''));
      const rel = String(valorDe(t.attrs, 'rel') || '').toLowerCase().trim();
      const as = String(valorDe(t.attrs, 'as') || '').toLowerCase().trim();
      if (u && REL_LINK.has(rel)) fuera += `<link rel="${rel}" href="${escAttr(u)}"${AS_LINK.has(as) ? ` as="${as}"` : ''}>`;
    } else if (CONTENEDORES.has(t.nombre)) {
      fuera += `<${t.nombre}${atributos(t.nombre, t.attrs)}>`;
      pila.push(t.nombre);
    }
    // Cualquier otra etiqueta (style, a, form, object, svg…) y todo el texto suelto quedan fuera.
  }
  while (pila.length) fuera += `</${pila.pop()}>`;
  return reproductores ? fuera : '';
}

// Lo que se guarda en el plan y lo que se pinta: un link (recortado, nunca se toca su forma) o el código saneado.
// Un código de más de 8.000 caracteres no se corta (quedaría a medio cerrar): se descarta. Un código que es un solo
// iframe de un proveedor se guarda como su link, que el motor sabe pintar mejor (fachada de YouTube, hash de Vimeo…).
export function limpiarVideo(v) {
  if (typeof v !== 'string') return '';
  const s = v.replace(/\r\n?/g, '\n').trim();
  if (!s.startsWith('<')) return s.slice(0, MAX_LINK_VIDEO).trim();
  if (s.length > MAX_CODIGO_VIDEO) return '';
  const html = sanearCodigoVideo(s);
  if (html.length > MAX_CODIGO_VIDEO) return '';
  const iframes = [...html.matchAll(/<iframe src="([^"]*)"/g)];
  const otros = [...html.matchAll(/<script src="([^"]*)"/g)].filter((m) => !/^https:\/\/player\.vimeo\.com\/api\//.test(m[1]));
  if (iframes.length === 1 && !otros.length) {
    const src = desentidades(iframes[0][1]);
    const f = fuenteVideo(src);
    if (f && !f.archivo) return src;
  }
  return html;
}
