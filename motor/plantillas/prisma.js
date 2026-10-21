// PRISMA: luz sobre noche. Fondo negro con paneles de azul noche, una portada con foto que se desvanece a negro (o un
// prisma de luz violeta y cian en WebGL detrás del título), botones píldora con un degradado que va de un tono claro de la
// marca a su primario y a su acento, tarjetas de vidrio con borde de color que suben al pasar, rótulos en mayúsculas
// espaciadas, títulos en Sora con resaltados en degradado y secciones claras (blanco lavanda con halos de color)
// intercaladas para dar ritmo: «es / no es» y «para quién es» con una columna oscura y una clara. Cierra con una frase
// grande y el nombre de la marca gigante y tenue que corre como marquesina. Contrato en ./index.js.
import { mezclar, contraste, luminancia, hexValido, hex, rgb } from '../tema.js';
import { aHsl, deHsl, esGris } from './color.js';
import { CSS_PRISMA, CSS_LEGAL_PRISMA } from './prisma.css.js';
import { esClaro, legible, sobreDe, superficie } from './propios.js';

// La paleta de la identidad: la de una marca sin colores (o toda gris).
const VIOLETA = '#7a4eff';
const CIAN = '#3fd0c8';
const NEGRO = '#000000';

const distancia = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
// Diferencia con signo de `a` a `b` por el camino corto (-180 a 180).
const giro = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;
// Cuánto cambió un color al ajustarlo (diferencia de luz, 0-1).
const cambio = (a, b) => Math.abs(aHsl(a)[2] - aHsl(b)[2]);

// El tono de `h` subiendo la luz (con su saturación, al menos `satMin`) hasta contrastar `minimo` contra `contra`: sobre
// la noche un azul marino se enciende en vez de lavarse hacia el blanco. Si ya contrasta, queda tal cual.
function encender(h, contra, minimo, satMin = 0.5) {
  if (contraste(h, contra) >= minimo) return h;
  const [t, s, l0] = aHsl(h);
  const sat = s < 0.12 ? s : Math.max(s, satMin);
  for (let l = l0; l <= 1; l += 0.01) {
    const c = deHsl(t, sat, l);
    if (contraste(c, contra) >= minimo) return c;
  }
  return '#ffffff';
}

// El texto del botón (blanco o una tinta honda del tono de la marca) y las tres paradas del degradado ajustadas para que
// ese texto se lea sobre TODO el botón (4,5:1 contra cada parada): gana el que menos cambia los colores. Si la persona
// eligió el color del botón (`fija`), la parada del medio queda tal cual.
function botonDegradado(a, b, c, tinta, fija, fondo) {
  let mejor = null;
  for (const txt of ['#ffffff', tinta]) {
    if (fija && contraste(txt, b) < 4.5) continue;
    const x = { txt, a: legible(a, [txt], 4.5), b: fija ? b : legible(b, [txt], 4.5), c: legible(c, [txt], 4.5) };
    // El botón se sigue distinguiendo del fondo (3:1).
    if (!fija && contraste(x.b, fondo) < 3) continue;
    x.costo = cambio(a, x.a) + cambio(b, x.b) * 1.6 + cambio(c, x.c);
    if (!mejor || x.costo < mejor.costo) mejor = x;
  }
  if (mejor) return mejor;
  // Un botón pedido de tono medio (ni blanco ni tinta llegan): el texto que más contraste y las puntas a su medida.
  const txt = sobreDe(b, tinta);
  return { txt, a: legible(a, [txt], 4.5), b, c: legible(c, [txt], 4.5) };
}

// De la marca (y de los colores propios de la persona, `P`) a los tokens de PRISMA. `b` = derivarColores (la marca ya
// normalizada) y `crudos` = los colores tal como los eligió la persona (sobre la noche conviene el original, que brilla).
// Sin colores propios la página es negra con paneles de azul noche y secciones claras; con un fondo propio, ese fondo en
// toda la página (las secciones de contraste pasan a un tinte del mismo fondo). Todo texto con AA (4,5:1) sobre lo que
// tiene debajo: el fondo, los paneles, las tarjetas, las secciones claras, sus tarjetas blancas y las tarjetas oscuras.
export function coloresPrisma(b, crudos = {}, P = {}) {
  const marca = (k) => (hexValido(crudos?.[k]) ? hex(rgb(crudos[k])) : null);
  // La identidad (el degradado, la noche, los halos) sale de la marca; si la persona cambió más que el botón (una
  // paleta, el fondo o los resaltados), de sus colores.
  const suyos = !!(P.primario && (P.fondo || P.acento));
  const priM = suyos ? P.primario : marca('primario');
  // El tono de la identidad: el primario si tiene color; si no, el acento de la marca; si tampoco (una marca sin colores
  // o toda gris), el violeta de la identidad con su cian.
  let semilla = VIOLETA;
  if (priM && !esGris(priM)) semilla = priM;
  else if (!suyos && marca('acento') && !esGris(marca('acento'))) semilla = marca('acento');
  const acM = P.acento || (semilla === VIOLETA ? CIAN : marca('acento'));
  const [h, sh] = aHsl(semilla);
  // El final del degradado: el acento si se distingue del primario; si no, un vecino del primario más luminoso (en la
  // identidad, violeta → cian).
  const conAcento = acM && !esGris(acM) && distancia(aHsl(acM)[0], h) > 35;
  const hFin = conAcento ? aHsl(acM)[0] : h - 24;
  const d = giro(h, hFin);
  const corrido = (k, tope) => h + Math.max(-tope, Math.min(tope, d * k));
  const hA = corrido(0.35, 30); // la punta clara (lavanda en la identidad)
  const hN = corrido(0.25, 22); // la noche (azul noche en la identidad)
  const sat = esGris(semilla) ? 0.3 : Math.min(Math.max(sh, 0.6), 0.95);
  // La noche es azul con las marcas azules, violetas o cian; con las demás, un negro apenas teñido de su tono.
  const cerca = Math.max(0, Math.min(1, (110 - distancia(hN, 235)) / 60));
  const satN = 0.36 + 0.36 * cerca;

  const fondo = P.fondo || (marca('fondo') && b.oscuro && luminancia(b.fondo) < 0.006 ? b.fondo : NEGRO);
  const claro = esClaro(fondo);
  const tinta = deHsl(hN, 0.5, 0.07);

  // Paneles (azul noche) y tarjetas. Sin fondo propio salen del tono de la marca; con uno, de ese fondo.
  let noche, noche2, hacia2;
  if (!P.fondo) {
    noche = deHsl(hN, satN, 0.055);
    noche2 = deHsl(hN, satN * 0.95, 0.105);
  } else if (claro) {
    noche = mezclar(fondo, deHsl(hA, 0.7, 0.6), 0.07);
    hacia2 = deHsl(hFin, 0.6, 0.6);
  } else {
    noche = mezclar(fondo, NEGRO, 0.3);
    hacia2 = deHsl(hA, 0.6, 0.5);
  }
  // El degradado del botón: punta clara → primario (42 %) → acento. Sobre la noche, el primario se enciende hasta
  // distinguirse del fondo (3:1, lo que pide un control).
  const pA = P.primario && !suyos ? mezclar(P.primario, '#ffffff', 0.28) : deHsl(hA, Math.min(sat, 0.8), 0.75);
  const pB = P.primario || (claro ? legible(semilla, [fondo], 3.2) : encender(semilla, fondo, 3.2));
  let pC;
  if (P.primario && !P.acento) {
    // Solo el botón («el botón rojo»): el degradado queda en ese color (un vecino apenas girado en la punta).
    const [t, s, l] = aHsl(P.primario);
    pC = deHsl(t - 10, Math.max(s, 0.5), Math.min(l + 0.06, 0.7));
  } else if (conAcento) pC = claro ? acM : encender(acM, fondo, 4, 0.5);
  else pC = deHsl(hFin, Math.max(sat * 0.65, 0.55), 0.53);
  const boton = botonDegradado(pA, pB, pC, tinta, !!P.primario, fondo);
  const primario = boton.b;

  // El texto, las tarjetas y `luz` (el brillo más fuerte de los halos de la noche: portada, paneles, el resplandor de
  // abajo), que se ajustan juntos: todo texto se mide también contra ese brillo.
  let texto = P.texto ? legible(P.texto, [fondo], 4.6) : claro ? mezclar('#0d0b1f', semilla, 0.04) : mezclar('#e3e3ec', semilla, 0.02);
  let sup, sup2, luz;
  for (let i = 0; i < 4; i++) {
    sup = P.fondo ? superficie(fondo, texto, 0.06, texto) : deHsl(corrido(0.13, 12), satN * 0.8, 0.085);
    sup2 = P.fondo ? superficie(fondo, texto, 0.1, texto) : deHsl(corrido(0.13, 12), satN * 0.7, 0.12);
    // Con un fondo propio de tono medio (un rojo, un gris) hay poco margen: los paneles y los halos van hacia el lado
    // que no le quita contraste al texto.
    if (P.fondo) noche2 = superficie(fondo, hacia2, 0.1, texto);
    luz = !P.fondo ? mezclar(noche2, primario, 0.14) : superficie(noche2, primario, claro ? 0.06 : 0.12, texto);
    const nuevo = legible(texto, [fondo, sup, sup2, noche, noche2, luz], 4.6);
    if (nuevo === texto) break;
    texto = nuevo;
  }
  const oscuras = [fondo, sup, sup2, noche, noche2, luz];
  const suave = legible(mezclar(texto, fondo, 0.18), oscuras, 4.6);
  const tenue = legible(mezclar(texto, fondo, 0.4), oscuras, 4.5);
  const fuerte = claro ? legible(mezclar(texto, '#000000', 0.5), oscuras, 4.6) : P.texto ? legible(mezclar(texto, '#ffffff', 0.5), oscuras, 4.6) : '#ffffff';

  // Resaltados de los títulos (degradado de la punta clara al acento) y los textos de color: legibles en la noche.
  const hlA = legible(P.acento ? P.acento : boton.a, oscuras, 4.5);
  const hlC = legible(P.acento ? deHsl(aHsl(P.acento)[0] - 22, Math.max(aHsl(P.acento)[1], 0.45), aHsl(P.acento)[2]) : pC, oscuras, 4.5);

  // Secciones de contraste (las claras de la identidad): blanco lavanda con su tinta. Con un fondo propio, un tinte del
  // mismo fondo (la página queda del color pedido).
  let alt, altSup;
  if (!P.fondo) {
    alt = deHsl(corrido(0.15, 14), 0.75, 0.972);
    altSup = '#ffffff';
  } else {
    alt = mezclar(fondo, deHsl(hA, 0.7, claro ? 0.55 : 0.62), claro ? 0.08 : 0.1);
    altSup = superficie(alt, claro ? '#ffffff' : texto, claro ? 0.6 : 0.07, texto);
  }
  // Los halos de color de las secciones claras (lo más fuerte que pintan), también debajo de su texto.
  const haloA = mezclar(alt, primario, 0.08);
  const haloC = mezclar(alt, boton.c, 0.12);
  const claras = [alt, altSup, haloA, haloC];
  const altTexto = !P.fondo ? (P.texto ? legible(P.texto, claras, 4.6) : legible(deHsl(hN, 0.45, 0.085), claras, 12)) : legible(texto, claras, 4.6);
  const altClaro = esClaro(alt);
  const altSuave = legible(mezclar(altTexto, alt, 0.3), claras, 4.6);
  const altTenue = legible(mezclar(altTexto, alt, 0.46), claras, 4.5);
  const altHlA = legible(P.acento || primario, claras, 4.5);
  const altHlC = legible(P.acento ? hlC : pC, claras, 4.5);
  // El botón sobre una sección clara lleva un anillo que lo separa del fondo (3:1, lo que pide un control): su mismo tono
  // con la tinta de la sección.
  const anillo = legible(mezclar(primario, altTexto, 0.5), claras, 3);

  // Tarjeta oscura dentro de una sección clara (la columna «es»): la noche con su texto.
  const osc = !claro ? noche : deHsl(hN, 0.55, 0.075);
  const oscTexto = legible(!claro ? texto : '#ececf4', [osc], 7);
  const oscSuave = legible(mezclar(oscTexto, osc, 0.2), [osc], 4.6);
  const oscAcento = legible(P.acento ? hlC : pC, [osc], 4.5);
  const oscHl = legible(P.acento ? P.acento : boton.a, [osc], 4.5);

  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.13),
    texto,
    suave,
    tenue,
    error: legible(claro ? '#c42b1c' : '#ff6b6b', oscuras, 4.6),
    primario,
    sobrePrimario: boton.txt,
    primarioSuave: mezclar(fondo, primario, 0.14),
    acento: hlA,
    oscuro: !claro,
    extra: {
      noche,
      'noche-2': noche2,
      luz,
      fuerte,
      'linea-2': mezclar(fondo, texto, 0.24),
      // Las puntas del degradado del botón (la del medio es --pri).
      'pri-a': boton.a,
      'pri-c': boton.c,
      // Los resaltados de los títulos (degradado) y el segundo color de los textos de color (vistos, íconos).
      'hl-a': hlA,
      'hl-c': hlC,
      alt,
      'alt-sup': altSup,
      'alt-texto': altTexto,
      'alt-suave': altSuave,
      'alt-tenue': altTenue,
      'alt-linea': mezclar(alt, altTexto, 0.12),
      'alt-fuerte': legible(mezclar(altTexto, altClaro ? '#000000' : '#ffffff', 0.6), claras, 4.6),
      'alt-hl-a': altHlA,
      'alt-hl-c': altHlC,
      'alt-halo-a': haloA,
      'alt-halo-c': haloC,
      'alt-anillo': anillo,
      osc,
      'osc-texto': oscTexto,
      'osc-suave': oscSuave,
      'osc-acento': oscAcento,
      'osc-hl': oscHl,
    },
  };
}

export default {
  id: 'prisma',
  nombre: 'Prisma',
  descripcion: 'Luz sobre noche: un prisma de luz o tu foto en la portada, botones de degradado, tarjetas de vidrio y secciones claras que le dan ritmo.',
  mejorPara: ['registro', 'ventas', 'vsl'],
  cuando:
    'Eventos presenciales o en vivo, lanzamientos, desarrollo personal, espiritualidad, conciencia y bienestar profundo, ' +
    'mentorías, retiros y comunidades: marcas con energía aspiracional y premium. Va muy bien con marcas violetas, azules, ' +
    'cian o de colores vivos y con fotos de escenario o de quien enseña; con marcas claras toma sus tonos sobre la noche. ' +
    'Evítala si el negocio pide algo rústico, infantil, clínico o de urgencia gritada (ahí va Voltaje).',
  modo: 'oscuro',
  // Títulos en Sora, texto en Manrope y rótulos en mayúsculas espaciadas en Jost (con su respaldo medido).
  letras: { titulos: 'sora', texto: 'manrope', acento: 'sora', rotulos: 'jost-mayus' },
  lista: true,
  colores: (base, tema) => coloresPrisma(base, tema?.colores),
  propios: (base, tema, P) => coloresPrisma(base, tema?.colores, P),
  css: CSS_PRISMA,
  cssLegal: CSS_LEGAL_PRISMA,
  escena: 'prisma',
  // Jost se precarga si hay rótulos en la primera pantalla: la barra de arriba (el aviso primero) o el formulario de la
  // portada de evento.
  precarga(plan, t) {
    const visibles = (plan.secciones || []).filter((s) => s && !s.oculta);
    const conForm = plan.conversion?.accion === 'formulario' && visibles.some((s) => s.tipo === 'hero' && s.variante === 'evento');
    return t.rotulos && (visibles[0]?.tipo === 'aviso' || conForm) ? [t.rotulos.archivo] : [];
  },
  movimiento: {
    // Aparecen al entrar en pantalla (solo lo que está más abajo de la primera pantalla al cargar).
    revelar:
      '.sec:not(.s-hero):not(.s-gracias):not(.s-aviso):not(.s-pie) .cab>*,.sec-acc,.te,.be-tj,.be-li,.be-num,.ci li,.co-f:not(.co-cab),.co-col,.pq-col,' +
      '.ex-f,.ex-fc,.ex-d>div>*,.ex-c>*:not(.ex-fc),.of-card,.of-d>*,.bo-tj,.ga,.acor details,.fq-c>div,.sv-tj,.sv-p>li,.s-galeria figure,.ub>div,' +
      '.vi .vid,.ct,.ur>*,.ur-c li,.fo-card,.fo-d>div:first-child,.me-p,.pr-li,.pr-tj,.pr-cierre,.cta-in>*,.tm-l>li,.gr-p li,' +
      // la página de evento: entradas, equipo, logística, dudas, la idea, los dos caminos, la frase y las experiencias
      '.nv-ct,.nv-tj,.eq-tj,.lg-tj,.du,.id-img,.id-t,.cm-col,.ur-fr>.ur-t,.bo-ft',
    // Cifras con dígitos que ruedan al entrar.
    ruedas: '.ci strong,.ur-c strong',
    // Dígitos de la cuenta regresiva (los escribe el JS de la página; aquí ruedan).
    reloj: '.ct-n',
    // La marca gigante del pie corre como marquesina (la arma el decorado de la escena).
    marquesinas: '.ew-marq',
    // Botón fijo abajo en el celular cuando la portada ya pasó (si no hay barra de arriba con su botón).
    barra: true,
    // El prisma de luz, en la portada (o en gracias): la escena lo dibuja en el escenario que el CSS reserva arriba del
    // texto (o del formulario, o a la derecha del texto).
    anclas: [{ en: '.s-hero,.s-gracias', cual: 'primero', forma: 'prisma' }],
  },
};
