// Fotos y videos de la página: dónde están, cuánto miden y cómo quedan en sitio/ (con una huella en el nombre, así el
// navegador nunca muestra una foto vieja después de cambiarla). Solo Node: lee las medidas del encabezado del archivo.
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

export const EXT_IMAGEN = /\.(jpe?g|png|webp|gif|avif|svg)$/i;
export const EXT_VIDEO = /\.(mp4|webm|mov)$/i;
const TIPOS = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp', '.gif': 'gif', '.avif': 'avif', '.svg': 'svg' };

// Ancho y alto de una imagen (PNG, JPEG, WebP, GIF, SVG). null si no se puede leer.
export function medidas(buf, ext = '') {
  try {
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    if (buf.length > 10 && buf.toString('ascii', 0, 3) === 'GIF') return [buf.readUInt16LE(6), buf.readUInt16LE(8)];
    if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const tipo = buf.toString('ascii', 12, 16);
      if (tipo === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
      if (tipo === 'VP8L') {
        const n = buf.readUInt32LE(21);
        return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1];
      }
      if (tipo === 'VP8X') return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
    }
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) {
          i++;
          continue;
        }
        const marca = buf[i + 1];
        if (marca === 0xd8 || marca === 0x01 || (marca >= 0xd0 && marca <= 0xd7)) {
          i += 2;
          continue;
        }
        const largo = buf.readUInt16BE(i + 2);
        // SOF0..SOF15 (menos DHT, JPG y DAC): ahí están el alto y el ancho.
        if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
          const alto = buf.readUInt16BE(i + 5);
          const ancho = buf.readUInt16BE(i + 7);
          // Fotos del celular giradas (EXIF): el navegador las muestra derechas; da igual para reservar el espacio
          // porque la proporción la pone el CSS (height:auto).
          return [ancho, alto];
        }
        i += 2 + largo;
      }
    }
    if (ext.toLowerCase() === '.svg' || /^\s*(<\?xml|<svg)/.test(buf.toString('utf8', 0, 200))) {
      const s = buf.toString('utf8', 0, 4000);
      const w = /\bwidth="([\d.]+)(px)?"/.exec(s);
      const h = /\bheight="([\d.]+)(px)?"/.exec(s);
      if (w && h) return [Math.round(+w[1]), Math.round(+h[1])];
      const vb = /\bviewBox="[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/.exec(s);
      if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])];
    }
  } catch {
    /* archivo raro: sin medidas */
  }
  return null;
}

const huella = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

// Una referencia del plan ("fotos/retrato.jpg", "retrato.jpg" o "retrato") → los archivos que le corresponden en la
// carpeta de fotos: el archivo tal cual, o sus tamaños "retrato-480.webp", "retrato-960.webp"… (más liviano en el celular).
export function buscarFoto(dirFotos, ref) {
  if (!dirFotos || !existsSync(dirFotos) || typeof ref !== 'string') return null;
  const nombre = basename(ref.replace(/\\/g, '/'));
  if (!nombre || nombre.startsWith('.')) return null;
  const directo = join(dirFotos, nombre);
  const base = nombre.replace(EXT_IMAGEN, '');
  const archivos = readdirSync(dirFotos);
  // Primero sus tamaños optimizados (los hace fotos.mjs: retrato-480.webp, retrato-960.webp, retrato-1600.webp).
  const tamanos = archivos
    .map((f) => ({ f, m: new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d{2,4})\\.(webp|jpe?g|png|avif)$', 'i').exec(f) }))
    .filter((x) => x.m)
    .map((x) => ({ ruta: join(dirFotos, x.f), ancho: Number(x.m[1]) }))
    .sort((a, b) => a.ancho - b.ancho);
  if (tamanos.length) return { tamanos };
  if (EXT_IMAGEN.test(nombre) && existsSync(directo) && statSync(directo).isFile()) return { tamanos: [{ ruta: directo }] };
  const otra = archivos.find((f) => f.replace(EXT_IMAGEN, '') === base && EXT_IMAGEN.test(f));
  return otra ? { tamanos: [{ ruta: join(dirFotos, otra) }] } : null;
}

// Lo que el motor pide para una foto ({ ref }): copia los archivos a <salida>/img/ y devuelve { src, srcset, ancho, alto }.
// `usadas` junta lo que se copió (para avisar de fotos pesadas).
export function resolutorFotos(dirFotos, salida, usadas = new Map()) {
  return (ref) => {
    if (usadas.has(ref)) return usadas.get(ref).motor;
    const f = buscarFoto(dirFotos, ref);
    if (!f) return null;
    mkdirSync(join(salida, 'img'), { recursive: true });
    const copias = f.tamanos.map((t) => {
      const buf = readFileSync(t.ruta);
      const ext = extname(t.ruta).toLowerCase();
      const m = medidas(buf, ext);
      const nombre = `${basename(t.ruta, extname(t.ruta)).toLowerCase().replace(/[^a-z0-9-]+/g, '-')}-${huella(buf)}${ext === '.jpeg' ? '.jpg' : ext}`;
      copyFileSync(t.ruta, join(salida, 'img', nombre));
      return { src: '/img/' + nombre, ancho: t.ancho || m?.[0] || 0, medidas: m, peso: buf.length, tipo: TIPOS[ext] || ext };
    });
    const mayor = copias[copias.length - 1];
    const base = copias.find((c) => c.ancho >= 960) || mayor;
    const [ancho, alto] = mayor.medidas || [1200, 900];
    const motor = {
      src: base.src,
      srcset: copias.length > 1 ? copias.map((c) => `${c.src} ${c.ancho}w`).join(', ') : '',
      ancho,
      alto,
    };
    usadas.set(ref, { motor, copias });
    return motor;
  };
}

// Un video propio ("fotos/demo.mp4"): se copia a <salida>/media/ con su huella. Si junto a él hay una imagen con el mismo
// nombre (demo.webp, demo.jpg…), va de portada. → { src, portada } o null.
export function copiarVideo(dirFotos, ref, salida) {
  if (!dirFotos || typeof ref !== 'string') return null;
  const nombre = basename(ref.replace(/\\/g, '/'));
  const ruta = join(dirFotos, nombre);
  if (!EXT_VIDEO.test(nombre) || !existsSync(ruta)) return null;
  mkdirSync(join(salida, 'media'), { recursive: true });
  const buf = readFileSync(ruta);
  const ext = extname(nombre).toLowerCase();
  const base = basename(nombre, extname(nombre));
  const destino = `${base.toLowerCase().replace(/[^a-z0-9-]+/g, '-')}-${huella(buf)}${ext}`;
  copyFileSync(ruta, join(salida, 'media', destino));
  let portada = '';
  const img = readdirSync(dirFotos).find((f) => f.replace(EXT_IMAGEN, '') === base && EXT_IMAGEN.test(f));
  if (img) {
    const b = readFileSync(join(dirFotos, img));
    const p = `${base.toLowerCase().replace(/[^a-z0-9-]+/g, '-')}-${huella(b)}${extname(img).toLowerCase()}`;
    copyFileSync(join(dirFotos, img), join(salida, 'media', p));
    portada = '/media/' + p;
  }
  return { src: '/media/' + destino, portada, peso: buf.length };
}
