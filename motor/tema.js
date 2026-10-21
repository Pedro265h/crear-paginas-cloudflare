// Tema de una página: de 4 colores de la marca salen todos los tonos (superficies, líneas, texto suave, texto sobre el
// botón) con contraste revisado, más la pareja de letras y el estilo. Puro: corre en el navegador y en el Worker.
import { LETRAS } from './letras.js';

// Parejas de letras (títulos / texto). "estilo" es el que mejor les va; se puede cambiar aparte.
export const PAREJAS = {
  impacto: { nombre: 'Impacto', titulos: 'big-shoulders-display', texto: 'instrument-sans', estilo: 'impacto' },
  moderno: { nombre: 'Moderno', titulos: 'space-grotesk', texto: 'inter', estilo: 'limpio' },
  editorial: { nombre: 'Editorial', titulos: 'fraunces', texto: 'inter', estilo: 'editorial' },
  elegante: { nombre: 'Elegante', titulos: 'playfair-display', texto: 'manrope', estilo: 'editorial' },
  calido: { nombre: 'Cálido', titulos: 'dm-serif-display', texto: 'dm-sans', estilo: 'editorial' },
  tecnologico: { nombre: 'Tecnológico', titulos: 'sora', texto: 'inter', estilo: 'limpio' },
  amable: { nombre: 'Amable', titulos: 'nunito', texto: 'nunito', estilo: 'limpio' },
  limpio: { nombre: 'Limpio', titulos: 'plus-jakarta-sans', texto: 'plus-jakarta-sans', estilo: 'limpio' },
  potente: { nombre: 'Potente', titulos: 'anton', texto: 'archivo', estilo: 'impacto' },
  creativo: { nombre: 'Creativo', titulos: 'bricolage-grotesque', texto: 'outfit', estilo: 'limpio' },
};

export const ESTILOS = {
  impacto: 'Impacto: títulos grandes en mayúsculas, contraste fuerte',
  editorial: 'Editorial: títulos con serifa, líneas finas, aire de revista',
  limpio: 'Limpio: tarjetas suaves, todo redondeado y ordenado',
};

export const RADIOS = { recto: [2, 4], suave: [10, 18], redondo: [16, 28] };

// Paletas listas para un clic. fondo · texto · primario (botones) · acento (resaltados).
export const PALETAS = {
  carbon_lima: { nombre: 'Carbón y lima', modo: 'oscuro', colores: { fondo: '#0d0f0c', texto: '#f2f5ee', primario: '#d4ff3a', acento: '#ff7a45' } },
  noche_violeta: { nombre: 'Noche violeta', modo: 'oscuro', colores: { fondo: '#0a0910', texto: '#f6f4ff', primario: '#7a4eff', acento: '#3fd0c8' } },
  negro_oro: { nombre: 'Negro y oro', modo: 'oscuro', colores: { fondo: '#0b0b0b', texto: '#f4efe6', primario: '#d4a84b', acento: '#f4efe6' } },
  oceano: { nombre: 'Océano', modo: 'oscuro', colores: { fondo: '#06141b', texto: '#e6f4f8', primario: '#22c3e6', acento: '#ffd166' } },
  rojo_impacto: { nombre: 'Rojo impacto', modo: 'oscuro', colores: { fondo: '#0e0e0e', texto: '#fafafa', primario: '#ff3b30', acento: '#ffd60a' } },
  blanco_azul: { nombre: 'Blanco y azul', modo: 'claro', colores: { fondo: '#ffffff', texto: '#0f172a', primario: '#2563eb', acento: '#f59e0b' } },
  crema_terracota: { nombre: 'Crema y terracota', modo: 'claro', colores: { fondo: '#f6f1e8', texto: '#1d1a16', primario: '#c4532c', acento: '#2f5d50' } },
  bosque: { nombre: 'Bosque', modo: 'claro', colores: { fondo: '#f3f6f1', texto: '#14211a', primario: '#1f7a4d', acento: '#c98a12' } },
  rosa: { nombre: 'Rosa suave', modo: 'claro', colores: { fondo: '#fff6f8', texto: '#2b1220', primario: '#d6336c', acento: '#7c3aed' } },
  arena: { nombre: 'Arena', modo: 'claro', colores: { fondo: '#faf7f2', texto: '#2a2522', primario: '#8a5a44', acento: '#5c7c66' } },
};

// ---------- color ----------
const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function hexValido(h) {
  return typeof h === 'string' && HEX.test(h.trim());
}

export function rgb(h) {
  let s = h.trim().replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

export function hex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

// Mezcla a → b en proporción t (0 = a, 1 = b).
export function mezclar(a, b, t) {
  const x = rgb(a), y = rgb(b);
  return hex(x.map((v, i) => v + (y[i] - v) * t));
}

export function luminancia(h) {
  return rgb(h)
    .map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
}

export function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// El extremo (blanco o negro) que más contrasta con el fondo. Se cruzan cerca de luminancia 0,18: con fondos de tono
// medio (naranjas, rojos, celestes) el negro gana aunque el fondo no sea claro.
export function mejorExtremo(fondo) {
  return contraste('#ffffff', fondo) >= contraste('#000000', fondo) ? '#ffffff' : '#000000';
}

// Acerca c al blanco o al negro (`hacia`, por defecto el que más contrasta) hasta que contraste lo pedido contra el
// fondo. Si no se alcanza, devuelve lo que más contraste entre lo que probó, el color original y el extremo.
export function asegurar(c, fondo, minimo, hacia = mejorExtremo(fondo)) {
  if (contraste(c, fondo) >= minimo) return c;
  let mejor = c;
  for (let t = 0.08; t <= 1; t += 0.08) {
    const p = mezclar(c, hacia, t);
    if (contraste(p, fondo) >= minimo) return p;
    if (contraste(p, fondo) > contraste(mejor, fondo)) mejor = p;
  }
  for (const x of [hacia, mejorExtremo(fondo)]) if (contraste(x, fondo) > contraste(mejor, fondo)) mejor = x;
  return mejor;
}

export function esOscuro(fondo) {
  return luminancia(fondo) < 0.2;
}

// De los 4 colores de la marca, los tokens que usan las secciones.
export function derivarColores(entrada = {}, modo) {
  const base = PALETAS[modo === 'claro' ? 'blanco_azul' : 'carbon_lima'].colores;
  const c = {};
  entrada = entrada && typeof entrada === 'object' ? entrada : {};
  for (const k of ['fondo', 'texto', 'primario', 'acento']) c[k] = hexValido(entrada[k]) ? '#' + entrada[k].trim().replace('#', '').toLowerCase() : base[k];
  const fondo = hex(rgb(c.fondo));
  const oscuro = esOscuro(fondo);
  const texto = asegurar(hex(rgb(c.texto)), fondo, 7);
  // Suave y tenue (mezclas del texto con el fondo) se corrigen hacia el mismo lado que el texto.
  const lado = luminancia(texto) >= luminancia(fondo) ? '#ffffff' : '#000000';
  const primario = asegurar(hex(rgb(c.primario)), fondo, 2.2);
  const sobrePrimario = contraste(primario, '#ffffff') >= contraste(primario, '#0a0a0a') ? '#ffffff' : '#0a0a0a';
  let acento = hex(rgb(c.acento));
  if (contraste(acento, fondo) < 3) acento = contraste(primario, fondo) >= 3 ? primario : asegurar(acento, fondo, 3);
  const sup2 = mezclar(fondo, texto, oscuro ? 0.085 : 0.065);
  return {
    fondo,
    sup: mezclar(fondo, texto, oscuro ? 0.045 : 0.035),
    sup2,
    linea: mezclar(fondo, texto, oscuro ? 0.13 : 0.12),
    texto,
    suave: asegurar(mezclar(texto, fondo, 0.3), fondo, 4.6, lado),
    tenue: asegurar(mezclar(texto, fondo, 0.48), fondo, 3, lado),
    // Rojo de los errores del formulario: legible sobre su fondo (--sup2) en temas claros y oscuros.
    error: asegurar(oscuro ? '#ff6b6b' : '#d92d20', sup2, 4.5),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, primario, oscuro ? 0.16 : 0.1),
    acento,
    oscuro,
  };
}

// Tema completo listo para pintar: colores, letras, radio y estilo.
export function resolverTema(tema = {}) {
  const propia = (o, k) => typeof k === 'string' && Object.hasOwn(o, k);
  const pareja = propia(PAREJAS, tema.letras) ? PAREJAS[tema.letras] : PAREJAS.moderno;
  const colores = derivarColores(tema.colores, tema.modo);
  const radio = propia(RADIOS, tema.radio) ? RADIOS[tema.radio] : RADIOS.suave;
  const estilo = propia(ESTILOS, tema.estilo) ? tema.estilo : pareja.estilo;
  return { colores, pareja, titulos: LETRAS[pareja.titulos], texto: LETRAS[pareja.texto], radio, estilo };
}

// Letras de títulos estrechas: con ellas el estilo Impacto aguanta títulos más grandes en el celular.
const ESTRECHAS = new Set(['big-shoulders-display', 'anton']);

// Cómo espera el navegador cada letra (van precargadas en el <head>): "optional", se usa la real si llega a tiempo para
// el primer dibujo y, si no, el respaldo ajustado se queda toda la visita (la siguiente página ya la tiene en caché).
// Con "swap" (o "block", que igual acomoda la página con las medidas del respaldo) los títulos cambian de largo al
// llegar la letra y empujan el formulario: 0,15-0,20 de CLS en la masterclass con 4G lenta.
export function esperaLetra() {
  return 'optional';
}

// Variables CSS del tema (van en :root). `rutaLetras` es donde se sirven los .woff2.
export function cssTema(t, rutaLetras = '/_f/') {
  const c = t.colores;
  const estrecha = ESTRECHAS.has(t.pareja?.titulos);
  const caras = [...new Set([t.titulos, t.texto])]
    .map((l) => `@font-face{font-family:"${l.familia}";src:url(${rutaLetras}${l.archivo}) format("woff2");font-weight:${l.pesos};font-style:normal;font-display:${esperaLetra(l, t)}}${l.respaldo}`)
    .join('');
  return (
    caras +
    `:root{--fondo:${c.fondo};--sup:${c.sup};--sup2:${c.sup2};--linea:${c.linea};--texto:${c.texto};--suave:${c.suave};` +
    `--tenue:${c.tenue};--error:${c.error};--pri:${c.primario};--sobre-pri:${c.sobrePrimario};--pri-suave:${c.primarioSuave};--acento:${c.acento};` +
    `--f-tit:${t.titulos.pila};--f-txt:${t.texto.pila};--r:${t.radio[0]}px;--r-g:${t.radio[1]}px;--imp-h1:${estrecha ? '2.6rem' : '1.9rem'};--imp-h1l:${estrecha ? '2.2rem' : '1.75rem'};color-scheme:${c.oscuro ? 'dark' : 'light'}}`
  );
}
