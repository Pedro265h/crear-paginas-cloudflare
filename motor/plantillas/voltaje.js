// VOLTAJE: póster de alto impacto. Fondo negro con un panel de LEDs propio en WebGL que se apaga detrás del texto,
// títulos enormes en Anton (mayúsculas) con una franja del color de la marca que barre el resaltado, texto en Bricolage
// Grotesque y etiquetas en la monoespaciada del sistema; bloques de color completos (el primario de la marca, papel crema
// y un tono "choque" que sale de su acento), tarjetas que se apilan con números gigantes, marquesinas cruzadas que siguen
// el scroll, el dato gigante del evento detrás de la foto y el pie que se descubre como un telón con la marca enorme.
// Contrato en ./index.js.
import { mezclar, contraste, asegurar, luminancia, hexValido, rgb, hex } from '../tema.js';
import { aHsl, deHsl, esGris } from './color.js';
import { CSS_VOLTAJE, CSS_LEGAL_VOLTAJE, BLOQUES_VOLTAJE } from './voltaje.css.js';
import { esClaro, legible, sobreDe, porRegla, superficie } from './propios.js';

const NEGRO = '#08090b';
const BLANCO = '#eef1f4';
const PAPEL = '#f2efe7';
// Si la marca es toda gris (sin un tono que aprovechar), el voltaje es verde eléctrico.
const ELECTRICO = '#3ddc84';

const distancia = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

// El tono de `h` (con su saturación, al menos `satMin`) subiendo la luz hasta contrastar `minimo` contra `contra`:
// sobre negro el color "se enciende" en vez de lavarse hacia el blanco (mezclar con blanco lo apaga). Si ya contrasta,
// queda tal cual.
function encender(h, contra, minimo, satMin = 0.55) {
  if (contraste(h, contra) >= minimo) return h;
  const [t, s, l0] = aHsl(h);
  const sat = s < 0.12 ? s : Math.max(s, satMin);
  for (let l = l0; l <= 1; l += 0.01) {
    const c = deHsl(t, sat, l);
    if (contraste(c, contra) >= minimo) return c;
  }
  return '#ffffff';
}

// De la marca a los tokens de VOLTAJE. La página siempre es oscura (negro de póster): de una marca clara se toman sus
// tonos, no su fondo. Todo texto queda con contraste AA (4,5:1) sobre lo que tenga debajo: el negro y sus tarjetas, el
// bloque del primario, el papel y el "choque". `b` = derivarColores (la marca ya normalizada) y `crudos` = los colores
// tal como los eligió la persona: una marca clara oscurece su amarillo o su celeste para que se lea sobre blanco, y sobre
// negro conviene el color original, que brilla.
export function coloresVoltaje(b, crudos = {}) {
  const marca = (k) => (hexValido(crudos?.[k]) ? hex(rgb(crudos[k])) : b[k]);
  const pri = marca('primario');
  const ac = marca('acento');
  const semilla = !esGris(pri) ? pri : !esGris(ac) ? ac : ELECTRICO;
  const [h] = aHsl(semilla);
  // El negro de la marca si ya es casi negro; si no, un negro con un toque de su tono.
  const fondo = b.oscuro && luminancia(b.fondo) < 0.012 ? b.fondo : mezclar(NEGRO, semilla, 0.035);
  // Tinta: el negro de los textos sobre los bloques de color (un poco más hondo que el fondo).
  const tinta = mezclar(fondo, '#000000', 0.4);
  const texto = asegurar(b.oscuro && contraste(b.texto, fondo) >= 13 ? b.texto : mezclar(BLANCO, semilla, 0.03), fondo, 13, '#ffffff');
  const sup = mezclar(fondo, texto, 0.05);
  const sup2 = mezclar(fondo, texto, 0.09);
  const suave = asegurar(mezclar(texto, fondo, 0.24), sup2, 7, '#ffffff');
  const tenue = asegurar(mezclar(texto, fondo, 0.46), sup2, 4.6, '#ffffff');
  // El primario es el botón, las etiquetas y las cifras: se lee como texto sobre el negro y sus tarjetas (4,6:1). Sobre
  // él va la tinta, que contrasta todavía más (es más honda que el fondo).
  const primario = encender(semilla, sup2, 4.6);
  const sobrePrimario = contraste(tinta, primario) >= 4.6 ? tinta : '#000000';
  // Choque (el lila del prototipo): el acento de la marca si se distingue del primario; si no, un tono a 105°. Siempre
  // claro, para llevar tinta encima (8:1).
  const propio = !esGris(ac) && distancia(aHsl(ac)[0], h) > 35;
  const choque = encender(propio ? ac : deHsl(h + 105, 0.85, 0.74), tinta, 8, 0.5);
  const papel = mezclar(PAPEL, semilla, 0.035);
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.15),
    texto,
    suave,
    tenue,
    error: asegurar('#ff6b6b', sup2, 4.6, '#ffffff'),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, primario, 0.14),
    acento: primario,
    oscuro: true,
    extra: {
      tinta,
      papel,
      choque,
      'linea-2': mezclar(fondo, texto, 0.26),
      // Texto suave sobre cada bloque de color (la tinta un poco aclarada, siempre 4,6:1).
      'pri-2': asegurar(mezclar(sobrePrimario, primario, 0.22), primario, 4.6, '#000000'),
      'papel-2': asegurar(mezclar(tinta, papel, 0.34), papel, 4.6, '#000000'),
      'papel-linea': mezclar(papel, tinta, 0.16),
      'choque-2': asegurar(mezclar(tinta, choque, 0.26), choque, 4.6, '#000000'),
      // Sobre la tinta (la tarjeta de quién enseña): papel y un papel apagado legible.
      'tinta-2': asegurar(mezclar(papel, tinta, 0.26), tinta, 7, '#ffffff'),
    },
  };
}

// Con colores propios (tema.propios): el fondo, el texto, el botón y los resaltados que pidió la
// persona. El botón y los bloques del primario van del color pedido y llevan encima la tinta o, si el color es oscuro,
// blanco; las etiquetas y cifras del primario usan su mismo tono con la luz que haga falta para leerse (--pri-txt sobre el
// fondo, --pri-tinta sobre la tinta). Con un fondo claro el póster es de día: la tinta sigue siendo casi negra (texto
// sobre los bloques) y el papel y el choque conservan su papel. Todo texto con AA sobre lo que tiene debajo.
export function coloresVoltajePropios(b, crudos = {}, P = {}) {
  const marca = (k) => (hexValido(crudos?.[k]) ? hex(rgb(crudos[k])) : b[k]);
  const pri = P.primario || marca('primario');
  const ac = P.acento || marca('acento');
  // El negro, el papel y el choque salen de la marca; si la persona cambió más que el botón (una paleta, el fondo o los
  // resaltados), de sus colores.
  const suyos = !!(P.primario && (P.fondo || P.acento));
  const priM = suyos ? pri : marca('primario');
  const semilla = !esGris(priM) ? priM : !esGris(ac) ? ac : ELECTRICO;
  const [h] = aHsl(semilla);
  const fondo = P.fondo || (b.oscuro && luminancia(b.fondo) < 0.012 ? b.fondo : mezclar(NEGRO, semilla, 0.035));
  const claro = esClaro(fondo);
  const lado = claro ? '#000000' : '#ffffff';
  const tinta = claro ? mezclar('#060708', semilla, 0.03) : mezclar(fondo, '#000000', 0.4);
  let texto = P.texto
    ? legible(P.texto, [fondo], 4.6)
    : asegurar(claro ? mezclar('#0b0c0f', semilla, 0.03) : b.oscuro && contraste(b.texto, fondo) >= 13 ? b.texto : mezclar(BLANCO, semilla, 0.03), fondo, 13, lado);
  // El texto y las tarjetas se ajustan juntos (un fondo de tono medio deja poco margen).
  let sup, sup2;
  for (let i = 0; i < 4; i++) {
    sup = superficie(fondo, texto, 0.05, texto);
    sup2 = superficie(fondo, texto, 0.09, texto);
    const nuevo = legible(texto, [fondo, sup, sup2], 4.5);
    if (nuevo === texto) break;
    texto = nuevo;
  }
  const suave = legible(asegurar(mezclar(texto, fondo, 0.24), sup2, 7, lado), [fondo, sup, sup2], 4.6);
  const tenue = legible(asegurar(mezclar(texto, fondo, 0.46), sup2, 4.6, lado), [fondo, sup, sup2], 4.6);
  // El primario: el pedido tal cual; si no, el voltaje de la marca encendido (que lleve la tinta encima).
  const primario = P.primario || encender(semilla, claro ? tinta : sup2, 4.6);
  const sobrePrimario = contraste(tinta, primario) >= 4.6 ? tinta : sobreDe(primario);
  const priTxt = legible(primario, [fondo, sup, sup2], 4.6);
  const propio = !esGris(ac) && distancia(aHsl(ac)[0], h) > 35;
  const choque = encender(propio ? ac : deHsl(h + 105, 0.85, 0.74), tinta, 8, 0.5);
  const papel = mezclar(PAPEL, semilla, 0.035);
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.15),
    texto,
    suave,
    tenue,
    error: legible(claro ? '#c42b1c' : '#ff6b6b', [sup2, fondo], 4.6),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, primario, 0.14),
    acento: P.acento ? legible(P.acento, [fondo, sup, sup2], 4.6) : priTxt,
    oscuro: !claro,
    extra: {
      tinta,
      papel,
      choque,
      'linea-2': mezclar(fondo, texto, 0.26),
      'pri-2': asegurar(mezclar(sobrePrimario, primario, 0.22), primario, 4.6, mejorExtremoDe(primario)),
      'papel-2': asegurar(mezclar(tinta, papel, 0.34), papel, 4.6, '#000000'),
      'papel-linea': mezclar(papel, tinta, 0.16),
      'choque-2': asegurar(mezclar(tinta, choque, 0.26), choque, 4.6, '#000000'),
      'tinta-2': asegurar(mezclar(papel, tinta, 0.26), tinta, 7, '#ffffff'),
      'pri-txt': priTxt,
      'pri-tinta': legible(primario, [tinta], 4.6),
    },
  };
}

const mejorExtremoDe = (c) => (contraste(c, '#ffffff') >= contraste(c, '#000000') ? '#ffffff' : '#000000');

// El CSS de VOLTAJE con colores propios. Los bloques del primario llevan --sobre-pri en vez de la tinta (es la tinta
// cuando el primario es claro, como siempre, y blanco si la persona eligió uno oscuro), y lo que usa el primario como
// texto pasa a --pri-txt (sobre el fondo) o --pri-tinta (sobre la tinta). Con la marca de siempre se ve igual.
export function cssVoltajePropios(css) {
  const { PRI, PAPEL, CHOQUE, TINTA } = BLOQUES_VOLTAJE;
  const conTinta = (bloque) => bloque.replace('--b-txt:var(--pri)', '--b-txt:var(--pri-tinta,var(--pri))') + ';--tinta-txt:var(--tinta)';
  const tinta = TINTA.replace('--acento:var(--pri)', '--acento:var(--pri-tinta,var(--pri))').replace('--ey:var(--pri)', '--ey:var(--pri-tinta,var(--pri))').replace('--hl-0:var(--pri)', '--hl-0:var(--pri-tinta,var(--pri))');
  const fuera = css
    .split(PRI).join(PRI.replaceAll('var(--tinta)', 'var(--sobre-pri)') + ';--tinta-txt:var(--sobre-pri)')
    .split(PAPEL).join(conTinta(PAPEL))
    .split(CHOQUE).join(conTinta(CHOQUE))
    .split(TINTA).join(tinta);
  return porRegla(fuera, (sel, d) => {
    if (sel.trim() === ':root') return d.replace('--hl-0:var(--pri)', '--hl-0:var(--pri-txt,var(--pri))').replace('--ey:var(--pri)', '--ey:var(--pri-txt,var(--pri))');
    const mascara = /(^|;)(-webkit-)?mask:/.test(d);
    const sobreTinta = /(^|;)background:var\(--tinta\)/.test(d);
    const sobrePri = /(^|;)background:var\(--sobre-pri\)/.test(d);
    let x = d;
    if (!sobrePri) x = x.replace(/(^|;)color:var\(--pri\)/g, `$1color:var(${sobreTinta ? '--pri-tinta' : '--pri-txt'},var(--pri))`);
    x = x.replace(/-webkit-text-stroke-color:var\(--pri\)/g, '-webkit-text-stroke-color:var(--pri-txt,var(--pri))');
    if (mascara) x = x.replace(/(^|;)background:var\(--pri\)/g, '$1background:var(--pri-txt,var(--pri))');
    if (!sobreTinta) x = x.replace(/(^|;)(color|caret-color|border-color):var\(--tinta\)/g, '$1$2:var(--tinta-txt,var(--tinta))');
    if (mascara && sobreTinta && /(^|;)color:var\(--tinta\)/.test(d)) x = x.replace(/(^|;)background:var\(--tinta\)/g, '$1background:var(--tinta-txt,var(--tinta))').replace(/(^|;)color:var\(--tinta\)/g, '$1color:var(--tinta-txt,var(--tinta))');
    return x;
  });
}

export default {
  id: 'voltaje',
  nombre: 'Voltaje',
  descripcion: 'Póster de alto impacto: títulos enormes, panel de luces, bloques de color y marquesinas que siguen el scroll.',
  mejorPara: ['registro', 'ventas', 'local'],
  cuando:
    'Eventos, retos, lanzamientos, fitness, deportes, marcas jóvenes, barberías y negocios urbanos, y ofertas con ' +
    'mucha energía y urgencia (cupos, fechas, cuenta regresiva). Va muy bien con marcas de colores vivos o neón y con ' +
    'voz directa; con marcas claras toma sus tonos sobre negro. Evítala si la marca pide calma, lujo discreto o algo clínico.',
  modo: 'oscuro',
  // Títulos en Anton con su respaldo ajustado a las mayúsculas (letras.js): no saltan al llegar la letra.
  letras: { titulos: 'anton-mayus', texto: 'bricolage-grotesque', acento: 'anton-mayus' },
  lista: true,
  colores: (base, tema) => coloresVoltaje(base, tema?.colores),
  propios: (base, tema, P) => coloresVoltajePropios(base, tema?.colores, P),
  cssPropios: cssVoltajePropios,
  css: CSS_VOLTAJE,
  cssLegal: CSS_LEGAL_VOLTAJE,
  escena: 'voltaje',
  movimiento: {
    // Aparecen al entrar en pantalla (solo lo que está más abajo de la primera pantalla al cargar). Los títulos de sección
    // se descubren de abajo hacia arriba (CSS) y las filas de la comparación tachan lo de la alternativa al llegar.
    revelar:
      '.sec:not(.s-hero):not(.s-gracias):not(.s-aviso):not(.s-pie) .cab>*,.sec-acc,.te,.be-tj,.be-li,.ci li,.co-f:not(.co-cab),.co-col,.pq-no,' +
      '.ex-d>div>*,.ex-c>*,.of-card,.of-d>*,.bo-tj,.ga,.acor,.fq-c>div,.sv-tj,.sv-p>li,.s-galeria figure,.ub,.vi .vid,.ct,.ur>*,.ur-c li,' +
      '.fo-card,.fo-d>div:first-child,.me-p,.pr-li,.pr-tj,.pr-cierre,.cta-in,.tm-l>li,.gr-p li,' +
      // la página de evento: entradas, equipo, logística, dudas, la idea, los dos caminos, la frase y las experiencias
      '.nv-ct,.nv-tj,.eq-tj,.lg-tj,.du,.id-img,.id-t,.cm-col,.ur-fr>.ur-t,.bo-ft',
    // Tarjetas de color que se apilan al bajar (la de atrás se achica y se oscurece).
    pila: '.s-beneficios.v-numerada .be-nl',
    // Cifras con dígitos que ruedan al entrar (las de los logros las separa el decorado: .ew-cifra).
    ruedas: '.ci strong,.ur-c strong,.ex-l .ew-cifra',
    // Dígitos de la cuenta regresiva (los escribe el JS de la página; aquí ruedan).
    reloj: '.ct-n',
    // Avance del scroll (--p): el dato de la portada sube, el nombre gigante se abre y las palabras de la urgencia se encienden.
    progreso: '.s-hero,.s-experto,.s-urgencia',
    // "Es para ti si…" en carrusel (3D con CSS donde se puede).
    carrusel: '.s-para_quien .pq-si ul',
    telon: true,
    barra: true,
    // El panel de LEDs: en la portada (o en gracias) y en el cierre: el formulario o, si no hay, la tarjeta final (la
    // escena usa los dos primeros).
    anclas: [
      { en: '.s-hero,.s-gracias', cual: 'primero', forma: 'led' },
      { en: '.s-formulario', cual: 'ultimo', forma: 'led' },
      { en: '.s-cta.v-tarjeta', cual: 'ultimo', forma: 'led' },
    ],
    // Piezas nuevas del JS compartido (motor/cliente/movimiento.js):
    palabras: '.s-hero .h1,.s-gracias .h1',
    encender: '.s-urgencia .h2',
    marquesinas: '.ew-marq',
    cursor: [
      ['a.btn,button.btn', 'Vamos'],
      ['.pq-si ul', 'Arrastra'],
      ['summary', 'Abrir'],
      ['.vid-f', 'Play'],
    ],
    magnetico: 'a.btn,button.btn',
    puntero: '.s-hero',
  },
};
