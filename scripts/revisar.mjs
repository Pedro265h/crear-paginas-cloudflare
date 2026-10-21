#!/usr/bin/env node
// Revisa la página y dice, en palabras simples, qué falta para publicarla. Nada se inventa: lo que la persona no dio
// queda «por completar» y la página no se publica con huecos.
//
//   node scripts/revisar.mjs [carpeta]   lista lo que falta (sale con código 1 si falta algo)
//   --json                               el resultado en JSON (para Claude)
import { join } from 'node:path';
import { argumentos, carpetaProyecto, leerProyecto, guardarEstado, comando } from './lib/comun.mjs';
import { pendientesDe } from './lib/pendientes.mjs';

const args = argumentos();
const dir = carpetaProyecto(args);
const { plan: crudo, marca, estado } = leerProyecto(dir);
let r;
try {
  r = pendientesDe(crudo, marca, { dirFotos: join(dir, 'fotos') });
} catch (e) {
  console.error('\n  ✗ No pude leer la página: ' + e.message);
  process.exit(2);
}
const { faltan, avisos } = r;
guardarEstado(dir, {
  pendientes: faltan.length,
  ...(estado.publicado ? {} : faltan.length
    ? { fase: 'Fase 3/4 · completar y ajustar la página', siguiente: `Completar lo que falta (${comando('revisar.mjs', dir)}) y pedir cambios.` }
    : { fase: 'Fase 4/5 · la página se puede publicar', siguiente: `Cuando le guste: publicar (${comando('publicar.mjs', dir)}).` }),
});

if (args.json) {
  console.log(JSON.stringify({ listo: !faltan.length, faltan, avisos }, null, 2));
} else if (!faltan.length) {
  console.log('\n  ✓ La página está completa: se puede publicar.');
  if (avisos.length) {
    console.log('\n  Para revisar (no impide publicar):');
    for (const a of avisos) console.log('   · ' + a);
  }
} else {
  console.log(`\n  ${faltan.length === 1 ? 'Le falta 1 cosa' : `Le faltan ${faltan.length} cosas`} a tu página antes de publicarla:\n`);
  faltan.forEach((f, i) => console.log(`   ${String(i + 1).padStart(2)}. ${f.que}\n       (${f.donde})`));
  if (avisos.length) {
    console.log('\n  Además, para revisar:');
    for (const a of avisos) console.log('   · ' + a);
  }
  console.log('\n  Dime los datos que tengas y los pongo. Lo que no quieras mostrar, lo quito de la página.');
}
process.exit(faltan.length ? 1 : 0);
