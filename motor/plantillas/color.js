// Ayudas de color para las plantillas (puro: corre en el navegador y en el Worker). Lo básico (mezclar, contraste,
// asegurar) vive en tema.js; aquí va lo que necesita una plantilla para sacar tonos nuevos de la marca: girar el tono,
// hacer pasteles y oscurecer conservando el tono hasta un contraste pedido.
import { rgb, hex, contraste, luminancia, mezclar } from '../tema.js';

// #rrggbb → [tono 0-360, saturación 0-1, luz 0-1]
export function aHsl(h) {
  const [r, g, b] = rgb(h).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let t;
  if (max === r) t = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) t = (b - r) / d + 2;
  else t = (r - g) / d + 4;
  return [t * 60, s, l];
}

export function deHsl(t, s, l) {
  t = ((t % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((t / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = t < 60 ? [c, x, 0] : t < 120 ? [x, c, 0] : t < 180 ? [0, c, x] : t < 240 ? [0, x, c] : t < 300 ? [x, 0, c] : [c, 0, x];
  return hex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

// ¿Es un gris? (sin tono que aprovechar)
export const esGris = (h) => aHsl(h)[1] < 0.12;

// Pastel del tono de `h` (girado `giro` grados): luz alta y saturación pareja, para brillos y degradados.
export function pastel(h, giro = 0, luz = 0.84, sat = 0.82) {
  const [t, s] = aHsl(h);
  return deHsl(t + giro, Math.max(sat * (s < 0.12 ? 0.35 : 1), 0.18), luz);
}

// Aclara un pastel hasta que `texto` contraste lo pedido sobre él (texto oscuro sobre brillo claro).
export function aclararHasta(c, texto, minimo) {
  let x = c;
  for (let i = 0; i < 24 && contraste(texto, x) < minimo; i++) x = mezclar(x, '#ffffff', 0.12);
  return x;
}

// El tono de `h`, con su saturación, bajando la luz hasta contrastar lo pedido sobre `fondo` (claro). Un amarillo pasa a
// mostaza oscura en vez de a gris (mezclar con negro lo apaga).
export function hondo(h, fondo, minimo, satMin = 0.5) {
  const [t, s] = aHsl(h);
  const sat = s < 0.12 ? s : Math.max(s, satMin);
  let l = Math.min(aHsl(h)[2], 0.6);
  let c = deHsl(t, sat, l);
  for (let i = 0; i < 60 && contraste(c, fondo) < minimo; i++) {
    l -= 0.012;
    c = deHsl(t, sat, l);
  }
  return contraste(c, fondo) >= minimo ? c : '#000000';
}

export { luminancia };
