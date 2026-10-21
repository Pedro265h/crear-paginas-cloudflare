#!/usr/bin/env node
// Baja tus registros (las personas que llenaron el formulario) a un archivo que se abre en Excel o Google Sheets, y te
// da un resumen: cuántos hay, de dónde vinieron y cuántas visitas tuvo la página.
//
//   node scripts/registros.mjs [carpeta]            todos → registros/registros-AAAA-MM-DD.csv
//   --desde 2026-10-01                              solo desde esa fecha
//   --punto-y-coma                                  separado con «;» (si Excel te muestra todo en una sola columna)
//   --salida <archivo.csv>                          otro nombre de archivo
//   --local                                         de la base de prueba de tu compu (wrangler dev), no de Cloudflare
//   --con-pruebas                                   incluye los registros de prueba de la skill
import { join, resolve } from 'node:path';
import { argumentos, carpetaProyecto, leerProyecto, escribir, fallar, ok, linea, comando } from './lib/comun.mjs';
import { wrangler, explicarError } from './lib/cloudflare.mjs';

const args = argumentos();
const dir = carpetaProyecto(args);
const { estado } = leerProyecto(dir);
const base = estado.base?.nombre;
if (!base) fallar('Esta página todavía no tiene base de registros.', `Se crea al publicar: ${comando('publicar.mjs', dir)}`);
const donde = args.local ? '--local' : '--remote';
const desde = args.desde ? String(args.desde) : '';
if (desde && !/^\d{4}-\d{2}-\d{2}$/.test(desde)) fallar('La fecha va así: --desde 2026-10-01');

function consultar(sql) {
  const r = wrangler(['d1', 'execute', base, donde, '--json', '--command', sql], { cwd: dir });
  if (!r.ok) {
    const e = explicarError(r.todo);
    fallar(`No pude leer tus registros. ${e.que}`, `${e.hacer}\n${r.todo.trim().split('\n').slice(-6).join('\n')}`);
  }
  try {
    const datos = JSON.parse(r.salida.slice(r.salida.indexOf('[')));
    return datos.map((x) => x.results || []);
  } catch {
    fallar('Cloudflare respondió algo que no entiendo.', r.salida.slice(0, 400));
  }
}

const filtros = [args['con-pruebas'] ? '' : 'prueba = 0', desde ? `creado >= '${desde}'` : ''].filter(Boolean);
const where = filtros.length ? ' WHERE ' + filtros.join(' AND ') : '';
const [filas, visitas, fuentes] = consultar(
  `SELECT * FROM registros${where} ORDER BY id; ` +
    `SELECT tipo, SUM(n) AS n FROM visitas${desde ? ` WHERE dia >= '${desde}'` : ''} GROUP BY tipo; ` +
    `SELECT fuente, COUNT(*) AS n FROM registros${where} GROUP BY fuente ORDER BY n DESC LIMIT 6`,
);

// La fecha en la zona de la página (no en la hora de Londres).
const zona = estado.zona || 'America/Bogota';
const formato = new Intl.DateTimeFormat('es-CO', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
const fecha = (iso) => {
  try {
    return formato.format(new Date(iso)).replace(',', '');
  } catch {
    return iso;
  }
};

const COLUMNAS = [
  ['Fecha', (f) => fecha(f.creado)], ['Nombre', (f) => f.nombre], ['Correo', (f) => f.correo], ['WhatsApp', (f) => f.whatsapp],
  ['Teléfono', (f) => f.telefono], ['Ciudad', (f) => f.ciudad], ['Negocio', (f) => f.empresa], ['Fuente', (f) => f.fuente],
  ['utm_source', (f) => f.utm_source], ['utm_medium', (f) => f.utm_medium], ['utm_campaign', (f) => f.utm_campaign],
  ['utm_content', (f) => f.utm_content], ['utm_term', (f) => f.utm_term], ['País', (f) => f.pais], ['Página', (f) => f.url], ['Id', (f) => f.id],
];
const sep = args['punto-y-coma'] ? ';' : ',';
// Comillas siempre; y un texto que empieza con = + - @ no se toma como fórmula al abrirlo en Excel.
const celda = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^\+\d[\d\s]*$/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
};
const csv = '﻿' + [COLUMNAS.map(([t]) => celda(t)).join(sep), ...filas.map((f) => COLUMNAS.map(([, v]) => celda(v(f))).join(sep))].join('\r\n') + '\r\n';
const hoy = new Date().toISOString().slice(0, 10);
const archivo = args.salida ? resolve(String(args.salida)) : join(dir, 'registros', `registros-${hoy}${args.local ? '-local' : ''}.csv`);
escribir(archivo, csv);

const vistas = Object.fromEntries((visitas || []).map((v) => [v.tipo, v.n]));
const ultimos7 = filas.filter((f) => Date.now() - new Date(f.creado).getTime() < 7 * 864e5).length;
ok(`${filas.length} ${filas.length === 1 ? 'registro' : 'registros'}${desde ? ' desde el ' + desde : ''} → ${archivo}`);
linea(`Últimos 7 días: ${ultimos7}`);
if (vistas.principal) linea(`Visitas a la página: ${vistas.principal} · conversión: ${((filas.length / vistas.principal) * 100).toFixed(1)} % de las visitas se registró`);
if (fuentes?.length) linea('De dónde vinieron: ' + fuentes.map((f) => `${f.fuente || 'directo'} ${f.n}`).join(' · '));
linea('Ábrelo con Excel o súbelo a Google Sheets (Archivo › Importar). Si en Excel todo sale en una columna: --punto-y-coma');
