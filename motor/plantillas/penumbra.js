// PENUMBRA: oscura e inmersiva. Una aurora viva (ruido a baja resolución) con los tonos de la marca y un objeto de
// partículas en WebGL que cambia de forma en cada sección (esfera en la portada, nube detrás de las tarjetas, anillo
// alrededor de la cuenta regresiva y del precio, galaxia en "por qué ahora", mar de puntos en el cierre) y se inclina
// con el puntero; Sora fina y gigante con Inter, resaltados que se encienden, etiquetas monoespaciadas con la regla
// numerada de cada sección, vidrio, dígitos que ruedan y el pie que se descubre como un telón con la marca gigante.
// Contrato en ./index.js.
import { mezclar, contraste, asegurar, luminancia, hexValido, hex, rgb } from '../tema.js';
import { aHsl, deHsl, esGris } from './color.js';
import { CSS_PENUMBRA, CSS_LEGAL_PENUMBRA } from './penumbra.css.js';
import { esClaro, legible, sobreDe, superficie } from './propios.js';

const NOCHE = '#05070a';
const BLANCO = '#eef3f8';
// Lo más claro que puede llegar a pintar la aurora (luminancia relativa). La escena (motor/cliente/escena-penumbra.js)
// la recorta a este tope y el respaldo en CSS no lo pasa: así todo texto se mide contra el punto más claro del fondo.
const TOPE = 0.042;
// Lo mínimo que pide cada texto contra ese punto (AA con un pelo de margen).
const AA = 4.6;
const luzMinima = (fondo) => AA * (luminancia(fondo) + 0.05) - 0.05;

// Gris de una luminancia dada (para pasar el tope de la aurora como un color más: --aura-tope).
function grisDe(l) {
  let a = 0, b = 255;
  for (let i = 0; i < 20; i++) {
    const m = (a + b) / 2;
    const h = '#' + Math.round(m).toString(16).padStart(2, '0').repeat(3);
    if (luminancia(h) < l) a = m;
    else b = m;
  }
  return '#' + Math.floor(a).toString(16).padStart(2, '0').repeat(3);
}

// El tono de `h` (con su saturación) subiendo la luz hasta llegar a la luminancia pedida: un azul marino pasa a un azul
// que se lee sobre negro en vez de a gris.
function luminoso(h, lum) {
  const [t, s, l0] = aHsl(h);
  const sat = s < 0.12 ? s : Math.max(s, 0.55);
  let l = Math.max(l0, 0.3);
  let c = deHsl(t, sat, l);
  for (let i = 0; i < 80 && luminancia(c) < lum; i++) {
    l += 0.008;
    c = deHsl(t, sat, l);
  }
  return luminancia(c) >= lum ? c : asegurar(c, '#000000', 21, '#ffffff');
}

// Mezcla `a` hacia `b` mientras la luminancia no baje de `lum` (para sacar el texto suave y el tenue del texto).
function bajarHasta(a, b, lum) {
  let x = a;
  for (let t = 0.02; t <= 1; t += 0.02) {
    const c = mezclar(a, b, t);
    if (luminancia(c) < lum) break;
    x = c;
  }
  return x;
}

// Oscurece `c` (mezclándolo con `fondo`) hasta que su luminancia no pase de `lum`.
function apagarHasta(c, fondo, lum) {
  let x = c;
  for (let i = 0; i < 60 && luminancia(x) > lum; i++) x = mezclar(x, fondo, 0.06);
  return x;
}

const distancia = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

// De la marca a los tokens de PENUMBRA. La página siempre es oscura (casi negra con un dejo del tono de la marca): de una
// marca clara se toman sus tonos, no su fondo. Todo texto queda con contraste AA (4,5:1) sobre el fondo, el vidrio y el
// punto más claro de la aurora (--aura-tope).
// `b` es la marca ya derivada para su modo (derivarColores); `tema` trae los colores tal como los eligió la persona: de
// una marca clara se toman esos (derivarColores oscurece un amarillo o un celeste para que se lea sobre blanco, y aquí
// van sobre negro).
export function coloresPenumbra(base, tema = {}) {
  const crudo = (k) => (hexValido(tema?.colores?.[k]) ? hex(rgb(tema.colores[k])) : base[k]);
  const b = { primario: crudo('primario'), acento: crudo('acento') };
  const semilla = !esGris(b.primario) ? b.primario : !esGris(b.acento) ? b.acento : '#6f8cff';
  const [h, s] = aHsl(semilla);
  const fondo = mezclar(NOCHE, deHsl(h, 0.6, 0.45), 0.035);
  const tope = grisDe(TOPE);
  const texto = asegurar(mezclar(BLANCO, semilla, 0.03), fondo, 14, '#ffffff');
  // Tres alturas de texto: el de siempre, el de los párrafos y el de las etiquetas. Las dos últimas, lo más apagadas que
  // se puede sin bajar de AA contra el punto más claro de la aurora.
  const minimo = luzMinima(tope);
  const tenue = bajarHasta(texto, fondo, minimo + 0.012);
  const suave = bajarHasta(texto, fondo, Math.max(minimo + 0.11, 0.5));
  // Resaltados, números y etiquetas de color: el primario de la marca encendido (mismo tono, la luz que haga falta).
  const tono = !esGris(b.primario) ? b.primario : semilla;
  const acento = esGris(tono) ? texto : luminoso(tono, Math.max(minimo + 0.03, 0.4));
  // Botón: el primario de la marca si se distingue del fondo y de la aurora (3:1, lo que pide un control); si no, el
  // mismo tono encendido hasta llegar.
  const okBoton = (c) => contraste(c, fondo) >= 3.2 && contraste(c, tope) >= 3.2;
  let primario = b.primario;
  if (!okBoton(primario)) primario = luminoso(primario, (3.25 * (luminancia(tope) + 0.05)) - 0.05);
  // Sobre el botón: casi negro con el tono del botón (como en el prototipo) o blanco, lo que más contraste.
  const oscuroPri = mezclar('#030405', primario, 0.1);
  const sobrePrimario = contraste(primario, '#ffffff') >= contraste(primario, oscuroPri) ? '#ffffff' : contraste(primario, oscuroPri) >= 4.5 ? oscuroPri : '#000000';
  // La aurora: el primario, el acento de la marca si se distingue (si no, el primario girado hacia el cian) y un tono
  // hondo de noche (índigo; violeta si la marca ya es azul). La escena los usa a pleno y recorta al tope.
  const [hAc, sAc] = aHsl(b.acento);
  const conAcento = !esGris(b.acento) && distancia(hAc, h) > 35;
  const sat = Math.min(Math.max(s, 0.5), 0.85);
  const aura1 = deHsl(h, esGris(semilla) ? 0.3 : sat, 0.5);
  const aura2 = conAcento ? deHsl(hAc, Math.min(Math.max(sAc, 0.5), 0.8), 0.45) : deHsl(h + 42, Math.max(sat, 0.6), 0.42);
  const aura3 = deHsl(distancia(h, 242) < 40 ? 285 : 242, 0.58, 0.38);
  // El respaldo en CSS de la aurora (sin WebGL o mientras llega): manchas de esos tonos que nunca pasan el tope.
  const manchas = [mezclar(fondo, aura1, 0.3), mezclar(fondo, aura2, 0.26), mezclar(fondo, aura3, 0.34)].map((c) => apagarHasta(c, fondo, TOPE * 0.82));
  const sup = mezclar(fondo, texto, 0.05);
  const sup2 = mezclar(fondo, texto, 0.09);
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.12),
    texto,
    suave,
    tenue,
    error: asegurar(asegurar('#ff7b72', sup2, AA, '#ffffff'), tope, AA, '#ffffff'),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, primario, 0.16),
    acento,
    oscuro: true,
    extra: {
      'linea-2': mezclar(fondo, texto, 0.2),
      'linea-3': mezclar(fondo, texto, 0.42),
      // El telón (pie) y la marca gigante.
      pie: mezclar('#020304', fondo, 0.4),
      'aura-1': aura1,
      'aura-2': aura2,
      'aura-3': aura3,
      'aura-c1': manchas[0],
      'aura-c2': manchas[1],
      'aura-c3': manchas[2],
      // El punto más claro que puede pintar la aurora (la escena lee su luminancia y no la pasa).
      'aura-tope': tope,
      // Partículas: el acento y el segundo tono encendidos (son puntitos sueltos, más claros que la aurora).
      'aura-p2': luminoso(aura2, 0.3),
    },
  };
}

// Sube la luz de `a` (mezclándolo con `b`) mientras su luminancia no pase de `lum` (de noche al revés que bajarHasta: para
// sacar el texto suave y el tenue de un texto oscuro sobre una aurora clara).
function subirHasta(a, b, lum) {
  let x = a;
  for (let t = 0.02; t <= 1; t += 0.02) {
    const c = mezclar(a, b, t);
    if (luminancia(c) > lum) break;
    x = c;
  }
  return x;
}

// Aclara `c` (mezclándolo con `fondo`) hasta que su luminancia no baje de `lum`.
function aclararHastaLuz(c, fondo, lum) {
  let x = c;
  for (let i = 0; i < 60 && luminancia(x) < lum; i++) x = mezclar(x, fondo, 0.06);
  return x;
}

// Con colores propios (tema.propios): el fondo, el texto, el botón y los resaltados que pidió la
// persona. Con un fondo oscuro es la aurora de siempre (su tope de luz se ajusta a ese fondo); con uno claro, una aurora
// de día: los tonos de la marca en pastel que oscurecen el fondo hasta un piso (--aura-tope) y partículas de tinta. Todo
// texto con AA contra el fondo, el vidrio y el punto extremo de la aurora.
export function coloresPenumbraPropios(base, tema = {}, P = {}) {
  const crudo = (k) => (hexValido(tema?.colores?.[k]) ? hex(rgb(tema.colores[k])) : base[k]);
  const b = { primario: P.primario || crudo('primario'), acento: P.acento || crudo('acento') };
  // La aurora y la noche salen de la marca; si la persona cambió más que el botón (una paleta, el fondo o los
  // resaltados), de sus colores.
  const suyos = !!(P.primario && (P.fondo || P.acento));
  const m = suyos ? b : { primario: crudo('primario'), acento: b.acento };
  const semilla = !esGris(m.primario) ? m.primario : !esGris(m.acento) ? m.acento : '#6f8cff';
  const [h, s] = aHsl(semilla);
  const fondo = P.fondo || mezclar(NOCHE, deHsl(h, 0.6, 0.45), 0.035);
  const claro = esClaro(fondo);
  const lf = luminancia(fondo);
  let texto = P.texto ? legible(P.texto, [fondo], 4.6) : asegurar(claro ? mezclar('#0b0e14', semilla, 0.04) : mezclar(BLANCO, semilla, 0.03), fondo, 14, claro ? '#000000' : '#ffffff');
  // El punto extremo de la aurora: de noche lo más claro que pinta (sin pasar lo que deja leer un texto blanco); de día,
  // lo más oscuro. Las superficies y el texto se ajustan juntos (un fondo de tono medio deja poco margen).
  let topeL, tope, sup, sup2, vidrio;
  for (let i = 0; i < 4; i++) {
    if (!claro) topeL = Math.max(lf, Math.min(Math.max(TOPE, lf * 1.5 + 0.01), 0.17));
    else topeL = Math.min(lf, Math.max(4.6 * (luminancia(texto) + 0.05) - 0.05 + 0.03, lf * 0.78));
    tope = grisDe(topeL);
    sup = superficie(fondo, texto, 0.05, texto);
    sup2 = superficie(fondo, texto, 0.09, texto);
    vidrio = superficie(mezclar(tope, fondo, 0.52), texto, 0.07, texto);
    const nuevo = legible(texto, [fondo, tope, sup, sup2, vidrio], 4.6);
    if (nuevo === texto) break;
    texto = nuevo;
  }
  let suave, tenue;
  if (!claro) {
    const minimo = luzMinima(tope);
    tenue = bajarHasta(texto, fondo, minimo + 0.012);
    suave = bajarHasta(texto, fondo, Math.max(minimo + 0.11, 0.5));
  } else {
    const maximo = (topeL + 0.05) / AA - 0.05;
    tenue = subirHasta(texto, fondo, maximo - 0.012);
    suave = subirHasta(texto, fondo, Math.min(maximo - 0.06, Math.max(luminancia(texto), maximo * 0.45)));
  }
  suave = legible(suave, [fondo, tope, sup, sup2, vidrio], AA);
  tenue = legible(tenue, [fondo, tope, sup, sup2, vidrio], AA);
  const primario = P.primario || (() => {
    const okBoton = (c) => contraste(c, fondo) >= 3.2 && contraste(c, tope) >= 3.2;
    return okBoton(b.primario) ? b.primario : legible(b.primario, [fondo, tope], 3.25);
  })();
  const oscuroPri = mezclar('#030405', primario, 0.1);
  const sobrePrimario = contraste(primario, '#ffffff') >= contraste(primario, oscuroPri) ? sobreDe(primario) : contraste(primario, oscuroPri) >= 4.5 ? oscuroPri : '#000000';
  const primarioSuave = mezclar(fondo, primario, 0.16);
  // La aurora: de noche, el primario, el acento (o el primario girado hacia el cian) y un tono hondo; de día, los mismos
  // tonos en pastel.
  const [hAc, sAc] = aHsl(b.acento);
  const conAcento = !esGris(b.acento) && distancia(hAc, h) > 35;
  const sat = Math.min(Math.max(s, 0.5), 0.85);
  const luz = claro ? [0.72, 0.7, 0.76] : [0.5, 0.45, 0.38];
  const aura1 = deHsl(h, esGris(semilla) ? 0.3 : sat, luz[0]);
  const aura2 = conAcento ? deHsl(hAc, Math.min(Math.max(sAc, 0.5), 0.8), luz[1]) : deHsl(h + 42, Math.max(sat, 0.6), luz[1]);
  const aura3 = deHsl(distancia(h, 242) < 40 ? 285 : 242, 0.58, luz[2]);
  const manchas = [mezclar(fondo, aura1, 0.3), mezclar(fondo, aura2, 0.26), mezclar(fondo, aura3, 0.34)].map((c) => {
    let x = claro ? aclararHastaLuz(c, fondo, Math.min(topeL * 1.02, lf)) : apagarHasta(c, fondo, Math.max(topeL * 0.82, lf));
    for (let i = 0; i < 30 && contraste(texto, x) < AA; i++) x = mezclar(x, fondo, 0.2);
    return contraste(texto, x) >= AA ? x : fondo;
  });
  const tono = !esGris(m.primario) ? m.primario : semilla;
  const debajo = [fondo, tope, sup, sup2, vidrio, primarioSuave, ...manchas];
  const acento = legible(P.acento || (esGris(tono) ? texto : claro ? deHsl(aHsl(tono)[0], Math.max(aHsl(tono)[1], 0.55), 0.4) : luminoso(tono, Math.max(luzMinima(tope) + 0.03, 0.4))), debajo, AA);
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.12),
    texto,
    suave,
    tenue,
    error: legible(claro ? '#c42b1c' : '#ff7b72', [sup2, tope, fondo], AA),
    primario,
    sobrePrimario,
    primarioSuave,
    acento,
    oscuro: !claro,
    extra: {
      'linea-2': mezclar(fondo, texto, 0.2),
      'linea-3': mezclar(fondo, texto, 0.42),
      pie: claro ? mezclar(fondo, texto, 0.05) : mezclar('#020304', fondo, 0.4),
      'aura-1': aura1,
      'aura-2': aura2,
      'aura-3': aura3,
      'aura-c1': manchas[0],
      'aura-c2': manchas[1],
      'aura-c3': manchas[2],
      'aura-tope': tope,
      'aura-p2': claro ? deHsl(aHsl(aura2)[0], 0.6, 0.38) : luminoso(aura2, 0.3),
      brillo: claro ? '#000000' : '#ffffff',
      sombra: claro ? mezclar(texto, fondo, 0.35) : '#000000',
      'pri-txt': legible(primario, [fondo, sup, sup2], 4.5),
    },
  };
}

// El CSS de PENUMBRA con colores propios: el destello de "por qué ahora" y las sombras negras pasan a variables (con un
// fondo claro el destello es de tinta y las sombras, suaves). Con un fondo oscuro se ve igual que siempre.
export function cssPenumbraPropios(css) {
  // Una sección con su propio fondo tapa la escena de la página: ahí se ve el orbe de respaldo (CSS, con sus colores).
  const fuera = css
    .replace(/color-mix\(in oklab,var\(--acento\) 22%,#fff\)/g, 'color-mix(in oklab,var(--acento) 22%,var(--brillo,#fff))')
    .replace(/rgb\(0 0 0\/([\d.]+)\)/g, (todo, a, i, s) => (/mask:[^;}]*$/.test(s.slice(Math.max(0, i - 120), i)) ? todo : `color-mix(in srgb,var(--sombra,#000) ${Math.round(parseFloat(a) * 100)}%,transparent)`));
  return fuera + '.ew-gl .ew-est-f .ew-ancla::before{opacity:1}';
}

export default {
  id: 'penumbra',
  nombre: 'Penumbra',
  descripcion: 'Oscura y envolvente: aurora de luz y un orbe de partículas que cambia de forma en cada sección.',
  mejorPara: ['vsl', 'ventas', 'registro'],
  cuando:
    'Tecnología, IA, software, finanzas, cripto, trading, marketing digital y lanzamientos premium; públicos que compran ' +
    'de noche en el celular. Va muy bien con marcas oscuras o de colores vivos (verde, azul, violeta, cian); con marcas ' +
    'claras toma sus tonos sobre negro. Evítala si la marca pide luz, calidez o cercanía (salud, niños, repostería).',
  modo: 'oscuro',
  letras: { titulos: 'sora', texto: 'inter', acento: 'sora' },
  lista: true,
  colores: (base, tema) => coloresPenumbra(base, tema),
  propios: (base, tema, P) => coloresPenumbraPropios(base, tema, P),
  cssPropios: cssPenumbraPropios,
  css: CSS_PENUMBRA,
  cssLegal: CSS_LEGAL_PENUMBRA,
  escena: 'penumbra',
  movimiento: {
    // Aparecen al entrar en pantalla (solo lo que está más abajo de la primera pantalla al cargar).
    revelar:
      '.sec:not(.s-hero):not(.s-gracias):not(.s-aviso):not(.s-pie) .cab>*,.sec-acc,.te,.tj:not(.be-tj),.be-tj,.be-li,.ci li,.co-t,.co-2,.pq-col,' +
      '.ex-f,.ex-fc,.ex-d>div>*,.ex-c>*:not(.ex-fc),.of-card,.of-d>*,.ga,.acor,.fq-c>div,.sv-tj,.sv-p>li,.s-galeria figure,.ub,.vi .vid,.ct-g,.ct>.acc,' +
      '.ur>div>*:not(.cab),.ur-c li,.fo-card,.fo-t>.form,.fo-d>div:first-child,.me-p,.pr-li,.pr-cierre,.cta-in,.gr-p li,' +
      // la página de evento: entradas, equipo, logística, dudas, la idea, los dos caminos, la frase y las experiencias
      '.nv-ct,.nv-tj,.eq-tj,.lg-tj,.du,.id-img,.id-t,.cm-col,.ur-fr>.ur-t,.bo-ft',
    // Tarjetas de vidrio que se apilan al bajar.
    pila: '.s-beneficios.v-numerada .be-nl',
    // Cifras con dígitos que ruedan al entrar.
    ruedas: '.ci strong,.ur-c strong',
    // Dígitos de la cuenta regresiva (los escribe el JS de la página; aquí ruedan en sus mosaicos de vidrio).
    reloj: '.ct-n',
    // El pie se descubre como un telón (con el fondo fijo que termina en la última sección: `fondo`).
    telon: true,
    fondo: true,
    // "Por qué ahora": las palabras del título se encienden de a una al bajar.
    encender: '.s-urgencia .cab .h2',
    // La marca gigante del pie sube letra por letra mientras se descubre.
    letras: '.s-pie .pie-m>span',
    // Botón fijo abajo en el celular cuando la portada ya no se ve.
    barra: true,
    // El orbe de la portada (y de gracias): su respaldo en CSS, el visor y el lugar donde la escena pone la esfera.
    anclas: [{ en: '.s-hero:not(.v-video),.s-gracias', cual: 'primero', forma: 'esfera' }],
  },
};
