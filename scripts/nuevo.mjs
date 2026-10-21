#!/usr/bin/env node
// Crea la carpeta de una página nueva con todo lo que necesita para publicarse en Cloudflare.
//
//   node scripts/nuevo.mjs --nombre "Despierta Hoy" [--tipo evento] [--plantilla prisma] [--carpeta <ruta>]
//
// Por defecto la carpeta es ~/mis-paginas/<nombre> (en Windows: C:\Users\<tú>\mis-paginas\<nombre>).
//   --tipo       registro | vsl | ventas | evento | local (arma el plan con la receta de ese tipo; Claude lo llena después)
//   --plantilla  clasica | nacar | penumbra | voltaje | prisma
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { argumentos, fallar, ok, linea, motor, escribirJSON, guardarEstado, escribirWrangler, nombreCloudflare, PLANTILLA_SITIO } from './lib/comun.mjs';

const args = argumentos();
const nombreMarca = String(args.nombre || args._[0] || '').trim();
if (!nombreMarca) fallar('Dime el nombre de la página o de la marca.', 'Ejemplo: node scripts/nuevo.mjs --nombre "Despierta Hoy" --tipo evento');

const { planBase, TIPOS } = await motor('catalogo.js');
const { PLANTILLAS, plantillaValida } = await motor('plantillas/index.js');

const tipo = args.tipo ? String(args.tipo) : 'registro';
if (!Object.hasOwn(TIPOS, tipo)) fallar(`No conozco el tipo «${tipo}».`, 'Tipos: ' + Object.keys(TIPOS).join(', '));
if (args.plantilla && !Object.hasOwn(PLANTILLAS, String(args.plantilla))) fallar(`No conozco la plantilla «${args.plantilla}».`, 'Plantillas: ' + Object.keys(PLANTILLAS).join(', '));

const slug = nombreCloudflare(nombreMarca);
const dir = resolve(args.carpeta ? String(args.carpeta).replace(/^~(?=$|[\\/])/, homedir()) : join(homedir(), 'mis-paginas', slug));
if (existsSync(join(dir, 'plan.json'))) fallar(`Ya hay una página en ${dir}.`, 'Para seguir con ella, trabaja en esa carpeta. Para una nueva, usa otro nombre o --carpeta.');
if (existsSync(dir) && readdirSync(dir).filter((f) => !f.startsWith('.')).length) fallar(`La carpeta ${dir} ya tiene archivos.`, 'Elige otra con --carpeta.');

mkdirSync(join(dir, 'src'), { recursive: true });
mkdirSync(join(dir, 'fotos'), { recursive: true });
copyFileSync(join(PLANTILLA_SITIO, 'src', 'index.js'), join(dir, 'src', 'index.js'));
copyFileSync(join(PLANTILLA_SITIO, 'schema.sql'), join(dir, 'schema.sql'));
copyFileSync(join(PLANTILLA_SITIO, '_gitignore'), join(dir, '.gitignore'));
writeFileSync(
  join(dir, 'fotos', 'LEEME.txt'),
  'Pon aquí tus fotos (JPG, PNG o WebP): tu retrato, tu logo, tu producto, tu local...\n' +
    'En la página se nombran así: "fotos/mi-foto.jpg". Si pones un archivo llamado favicon.png, va de ícono en la pestaña.\n',
);

// El plan de arranque: la receta del tipo con su plantilla. Claude lo reescribe con la oferta real.
const plan = planBase(tipo, { nombre: nombreMarca });
if (args.plantilla) {
  plan.tema.plantilla = plantillaValida(String(args.plantilla));
  if (plan.tema.plantilla !== 'clasica') plan.tema.letras = '';
}
escribirJSON(join(dir, 'plan.json'), plan);
escribirJSON(join(dir, 'marca.json'), {
  nombre: nombreMarca,
  pais: '',
  legal: { razon_social: '', documento: '' },
  contacto: { correo: '', whatsapp: '' },
});

const estado = guardarEstado(dir, {
  nombre: slug,
  titulo: nombreMarca,
  tipo,
  plantilla: plan.tema.plantilla,
  base: { nombre: slug + '-registros' },
  zona: 'America/Bogota',
  dominios: [],
  fase: 'Fase 2 · entrevista (la oferta, la marca y el diseño)',
  siguiente: 'Contarle a Claude tu oferta para que escriba la página.',
  creado: new Date().toISOString(),
});
escribirWrangler(dir, estado, plan);

ok(`Carpeta de la página lista: ${dir}`);
linea(`Nombre en Cloudflare: ${slug} · tipo: ${TIPOS[tipo].nombre} · plantilla: ${PLANTILLAS[plan.tema.plantilla].nombre}`);
linea('Adentro: plan.json (la página), marca.json (tus datos), fotos/ (tus fotos), src/ y schema.sql (el sitio en Cloudflare).');
