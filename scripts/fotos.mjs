#!/usr/bin/env node
// Optimiza las fotos de la página para que cargue rápido en el celular: de cada foto pesada de fotos/ hace tres
// tamaños en WebP (retrato-480.webp, retrato-960.webp y retrato-1600.webp) y deja la original como está. armar.mjs usa
// esos tamaños solos (el celular baja el chico y la compu el grande). Usa sharp-cli con npx (se descarga la primera vez).
//
//   node scripts/fotos.mjs [carpeta]        las fotos de más de 250 KB o más anchas de 1600 px
//   --todas                                 todas las fotos, aunque sean livianas
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { argumentos, carpetaProyecto, exigirProyecto, fallar, ok, aviso, linea } from './lib/comun.mjs';
import { medidas } from './lib/imagenes.mjs';

const args = argumentos();
const dir = carpetaProyecto(args);
exigirProyecto(dir);
const fotos = join(dir, 'fotos');
if (!existsSync(fotos)) fallar('No hay carpeta fotos/ en esta página.');

const ANCHOS = [480, 960, 1600];
const candidatas = readdirSync(fotos)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !/-\d{2,4}\.(webp|jpe?g|png|avif)$/i.test(f) && !/^favicon\./i.test(f))
  .map((f) => {
    const ruta = join(fotos, f);
    const peso = statSync(ruta).size;
    const [ancho] = medidas(readFileSync(ruta)) || [0];
    return { f, ruta, peso, ancho, base: f.replace(/\.[^.]+$/, '') };
  })
  .filter((x) => args.todas || x.peso > 250 * 1024 || x.ancho > 1600);

if (!candidatas.length) {
  ok('Tus fotos ya están livianas: no hay nada que optimizar.');
  process.exit(0);
}
linea(`Optimizo ${candidatas.length} ${candidatas.length === 1 ? 'foto' : 'fotos'} (la primera vez se descarga la herramienta: 1 minuto)…`);

let hechas = 0;
for (const w of ANCHOS) {
  // Solo los tamaños que no agrandan la foto (una foto de 800 px no se estira a 1600).
  const lote = candidatas.filter((x) => !x.ancho || x.ancho >= w || (w === ANCHOS[0] && x.ancho < w));
  if (!lote.length) continue;
  const r = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['--yes', 'sharp-cli@5', '-i', ...lote.map((x) => x.ruta), '-o', join(fotos, `{name}-${w}.webp`), '--format', 'webp', '--quality', '80', 'rotate', '--', 'resize', String(w), '--withoutEnlargement'],
    { encoding: 'utf8', shell: process.platform === 'win32', timeout: 5 * 60 * 1000 },
  );
  if (r.status !== 0) fallar('No pude optimizar las fotos.', (r.stderr || r.error?.message || '').slice(-600));
  hechas += lote.length;
}
for (const x of candidatas) {
  const nuevas = ANCHOS.map((w) => join(fotos, `${x.base}-${w}.webp`)).filter(existsSync);
  const mayor = nuevas.length ? statSync(nuevas[nuevas.length - 1]).size : 0;
  ok(`${x.f}: ${(x.peso / 1024).toFixed(0)} KB → ${nuevas.length} tamaños en WebP (el más grande, ${(mayor / 1024).toFixed(0)} KB)`);
}
if (!hechas) aviso('No hice ningún tamaño nuevo.');
linea('La página usa los tamaños nuevos solos la próxima vez que se arme. Las originales quedan en fotos/ por si las necesitas.');
