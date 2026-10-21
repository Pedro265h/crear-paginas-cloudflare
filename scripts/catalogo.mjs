#!/usr/bin/env node
// Escribe reference/secciones.md a partir del motor (los tipos de página, sus recetas y cada sección con sus variantes y
// sus campos). Así la referencia nunca se desfasa del motor.
//   node scripts/catalogo.mjs            reescribe reference/secciones.md
//   node scripts/catalogo.mjs --mostrar  lo imprime sin escribir
import { join } from 'node:path';
import { argumentos, escribir, motor, SKILL, ok } from './lib/comun.mjs';

const { SECCIONES, TIPOS, ACCIONES, RECETA_GRACIAS } = await motor('catalogo.js');
const { PLANTILLAS } = await motor('plantillas/index.js');
const { CAMPOS } = await motor('form.js');

const T = { texto: 'texto (una línea)', largo: 'texto largo (párrafo)', imagen: 'foto', lista: 'lista' };
const celda = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

let md = `# Catálogo de páginas y secciones

> Generado desde el motor con \`node scripts/catalogo.mjs\`. No lo edites a mano: si cambia el motor, se vuelve a generar.
> Úsalo para escribir planes válidos: cada sección lleva \`tipo\`, \`variante\` y \`campos\` con estas claves.

## Tipos de página

| tipo | nombre | qué es | botón principal | plantilla por defecto |
|---|---|---|---|---|
${Object.entries(TIPOS)
  .map(([id, t]) => `| \`${id}\` | ${t.nombre} | ${celda(t.descripcion)} | \`${t.accion}\` (${ACCIONES[t.accion]}) | ${t.plantilla ? PLANTILLAS[t.plantilla].nombre : 'Clásica'} |`)
  .join('\n')}

### La receta de cada tipo (el orden de las secciones)

${Object.entries(TIPOS)
  .map(([id, t]) => `- **${id}**: ${t.receta.map((s) => `\`${s}\`${t.variantes[s] ? ` (${t.variantes[s]})` : ''}`).join(' → ')}`)
  .join('\n')}
- **página de gracias** (todas): ${RECETA_GRACIAS.map((s) => `\`${s}\``).join(' → ')}

### Acciones del botón principal (\`conversion.accion\`)

${Object.entries(ACCIONES).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n')}

### Campos del formulario (\`conversion.campos\`)

${Object.entries(CAMPOS).map(([k, c]) => `- \`${k}\`: ${c.etiqueta}${c.requerido ? ' (obligatorio)' : ' (opcional)'}`).join('\n')}

Siempre va al menos un dato de contacto (correo, WhatsApp o teléfono): si no hay ninguno, el motor agrega el correo.

## Secciones

Para cada una: en qué tipos de página se puede usar, sus variantes (diseños) y sus campos. Los textos aceptan
\`**negrita**\`, \`*resaltado*\` y saltos de línea. Un dato que falta va como \`{ "porCompletar": "qué falta" }\` o, dentro de un
texto, \`[[POR COMPLETAR: qué falta]]\` (ver copy.md). Una foto va como \`"fotos/archivo.jpg"\` (ver plan.md).
`;

for (const [id, d] of Object.entries(SECCIONES)) {
  md += `\n### \`${id}\` · ${d.nombre}\n\n${celda(d.descripcion)}\n\n`;
  md += `- Tipos de página: ${d.paraTipos.map((x) => `\`${x}\``).join(', ')}\n`;
  md += `- Variantes: ${Object.entries(d.variantes).map(([k, v]) => `\`${k}\` (${v})`).join(', ')}\n`;
  if (d.ancla) md += `- Ancla: \`#${d.ancla}\` (los botones pueden llevar aquí)\n`;
  md += `\n| campo | tipo | qué es | largo máx. | ayuda |\n|---|---|---|---|---|\n`;
  for (const [k, c] of Object.entries(d.campos)) {
    const tipo = c.t === 'lista' ? `lista (${c.min ? c.min + ' a ' : 'hasta '}${c.max || 12})` : T[c.t] || c.t;
    md += `| \`${k}\` | ${tipo}${c.url ? ', link' : ''}${c.video ? ', video' : ''} | ${celda(c.etiqueta)} | ${c.max && c.t !== 'lista' ? c.max : ''} | ${celda(c.ayuda)}${c.sinIA ? ' (solo si la persona lo da)' : ''} |\n`;
    if (c.t === 'lista') {
      for (const [kk, cc] of Object.entries(c.campos)) {
        md += `| \`${k}[].${kk}\` | ${T[cc.t] || cc.t}${cc.url ? ', link' : ''} | ${celda(cc.etiqueta)} | ${cc.max || ''} | ${celda(cc.ayuda)} |\n`;
      }
    }
  }
}

const args = argumentos();
if (args.mostrar) console.log(md);
else {
  escribir(join(SKILL, 'reference', 'secciones.md'), md);
  ok('reference/secciones.md generado desde el motor.');
}
