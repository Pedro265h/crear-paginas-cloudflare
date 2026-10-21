// Páginas de ejemplo: una por tipo de página, cada una con una plantilla distinta. Todas son de negocios FICTICIOS (sin
// testimonios, cifras ni reseñas: nada que se lea como el resultado de alguien que no existe). Sirven para mostrarle a
// la persona cómo se ve cada plantilla (vista.mjs --plantillas) y como modelo de un plan bien escrito.
//
// Las fechas se ponen solas al armarlas (una masterclass a tres semanas, un evento a cinco): así la cuenta regresiva
// nunca está en cero. En los JSON van como {{fecha}}, {{dia}}, {{diaSemana}}, {{fechaEvento}} y {{diaEvento}}.
// Fotos: ejemplos/fotos/ (de Pexels, ver ejemplos/fotos/CREDITOS.md).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
export const FOTOS_EJEMPLOS = join(aqui, 'fotos');

export const EJEMPLOS = [
  { id: 'masterclass', tipo: 'registro', plantilla: 'nacar', negocio: 'Masterclass gratis de finanzas para freelancers (Bolsillo Claro)' },
  { id: 'agenda', tipo: 'vsl', plantilla: 'clasica', negocio: 'VSL de un software de turnos para consultorios (Agenda Clara)' },
  { id: 'curso-fotografia', tipo: 'ventas', plantilla: 'penumbra', negocio: 'Página de ventas de un curso de fotografía de producto' },
  { id: 'despierta-hoy', tipo: 'evento', plantilla: 'prisma', negocio: 'Entradas para un encuentro presencial de desarrollo personal (Despierta Hoy)' },
  { id: 'barberia', tipo: 'local', plantilla: 'voltaje', negocio: 'Barbería de barrio con reservas por WhatsApp' },
];

export const ejemplo = (id) => EJEMPLOS.find((e) => e.id === id) || null;
// El ejemplo que mejor muestra un tipo de página.
export const ejemploDeTipo = (tipo) => EJEMPLOS.find((e) => e.tipo === tipo) || EJEMPLOS[0];

// La masterclass: el jueves que cae al menos tres semanas después de hoy, 19:00.
function fechaMasterclass(hoy) {
  const d = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate() + 21));
  while (d.getUTCDay() !== 4) d.setUTCDate(d.getUTCDate() + 1);
  const dia = new Intl.DateTimeFormat('es', { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(d);
  return { fecha: `${d.toISOString().slice(0, 10)}T19:00`, dia, diaSemana: `jueves ${dia}` };
}

// El evento presencial: el sábado que cae al menos cinco semanas después de hoy, 9:00.
function fechaEvento(hoy) {
  const d = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate() + 35));
  while (d.getUTCDay() !== 6) d.setUTCDate(d.getUTCDate() + 1);
  const dia = new Intl.DateTimeFormat('es', { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(d);
  return { fecha: `${d.toISOString().slice(0, 10)}T09:00`, dia };
}

// El plan del ejemplo (sin normalizar, como un plan.json) con sus fechas y, si se pide, otra plantilla.
export function planEjemplo(id, { hoy = new Date(), plantilla } = {}) {
  const e = ejemplo(id);
  if (!e) throw new Error(`No hay un ejemplo «${id}». Ejemplos: ${EJEMPLOS.map((x) => x.id).join(', ')}`);
  const f = fechaMasterclass(hoy);
  const ev = fechaEvento(hoy);
  const texto = readFileSync(join(aqui, id + '.json'), 'utf8')
    .replaceAll('{{dia}}', f.dia)
    .replaceAll('{{diaSemana}}', f.diaSemana)
    .replaceAll('{{fecha}}', f.fecha)
    .replaceAll('{{diaEvento}}', ev.dia)
    .replaceAll('{{fechaEvento}}', ev.fecha);
  const plan = JSON.parse(texto);
  if (plantilla) plan.tema = { ...plan.tema, plantilla, ...(plantilla === 'clasica' ? {} : { letras: '' }) };
  return plan;
}

// Los datos de la marca del ejemplo (ficticios): las legales salen completas en la vista.
export function marcaEjemplo(id) {
  const plan = planEjemplo(id);
  return {
    nombre: plan.marca?.nombre || 'Marca de ejemplo',
    pais: 'Colombia',
    legal: { razon_social: `${plan.marca?.nombre || 'Marca de ejemplo'} (negocio ficticio)`, documento: '000000000-0' },
    contacto: { correo: 'hola@ejemplo.com', whatsapp: '' },
  };
}
