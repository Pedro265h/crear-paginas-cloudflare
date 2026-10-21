// NÁCAR: clara y luminosa. Fondo marfil con brillos de nácar que salen de los colores de la marca, una gota de vidrio en
// WebGL en la portada, Instrument Sans con resaltados en Fraunces cursiva, botones píldora con su perla, beneficios en
// tarjetas que se apilan, un arco de luz con la cuenta regresiva, "para quién es" en carrusel y el pie que se descubre
// como un telón. Contrato en ./index.js.
import { mezclar, contraste, asegurar, luminancia } from '../tema.js';
import { aHsl, deHsl, pastel, aclararHasta, hondo, esGris } from './color.js';
import { CSS_NACAR, CSS_LEGAL_NACAR } from './nacar.css.js';
import { esClaro, legible, sobreDe, superficie } from './propios.js';

const MARFIL = '#f4f0e8';
const TINTA = '#16131d';

// De la marca a los tokens de NÁCAR. La página siempre es clara (marfil): de una marca oscura se toman sus tonos, no su
// fondo. Todo texto queda con contraste AA (4,5:1) sobre lo que tenga debajo: marfil, tarjetas y brillos del nácar.
export function coloresNacar(b) {
  const semilla = !esGris(b.primario) ? b.primario : !esGris(b.acento) ? b.acento : '#7a5cff';
  const [h] = aHsl(semilla);
  // Segundo tono: el acento de la marca si se distingue del primario; si no, uno a 110° (para que el nácar tenga juego).
  const hAcento = aHsl(b.acento)[0];
  const distinto = !esGris(b.acento) && Math.min(Math.abs(hAcento - h), 360 - Math.abs(hAcento - h)) > 35;
  const segunda = distinto ? b.acento : deHsl(h + 110, 0.7, 0.6);

  const fondo = !b.oscuro && luminancia(b.fondo) > 0.78 ? b.fondo : mezclar(MARFIL, semilla, 0.03);
  const texto = asegurar(!b.oscuro && luminancia(b.texto) < 0.04 ? b.texto : mezclar(TINTA, semilla, 0.06), fondo, 12, '#000000');
  // Los brillos: la marca, su acento y dos vecinos en la rueda de color, en pastel.
  const crudos = [pastel(semilla, 0, 0.83, 0.9), pastel(segunda, 0, 0.84, 0.85), pastel(semilla, 200, 0.86, 0.8), pastel(semilla, 55, 0.88, 0.9)];
  let suave = asegurar(mezclar(texto, fondo, 0.26), fondo, 7, '#000000');
  // El subtítulo y los puntos de la portada caen sobre los brillos: cada brillo se aclara hasta que se lean (4,6:1).
  const iri = crudos.map((c) => aclararHasta(c, suave, 4.6));
  for (const c of iri) suave = asegurar(suave, c, 4.6, '#000000');
  const sup = mezclar(fondo, '#ffffff', 0.62);
  const sup2 = mezclar(fondo, texto, 0.045);
  const tenue = asegurar(asegurar(mezclar(texto, fondo, 0.42), fondo, 4.6, '#000000'), sup2, 4.5, '#000000');
  const acento = hondo(!esGris(b.acento) ? b.acento : semilla, sup2, 4.8);
  // Botón: el color de botones de la marca si se distingue del marfil (3:1, lo que pide un control); si no, tinta, y el
  // color de la marca queda en la perla del botón.
  const primario = contraste(b.primario, fondo) >= 3 ? b.primario : texto;
  const sobrePrimario = contraste(primario, '#ffffff') >= contraste(primario, '#0a0a0a') ? '#ffffff' : '#0a0a0a';
  // Sobre la tinta (barra de aviso, pie, "no es para ti"): marfil y un marfil apagado legible.
  const sobreTinta = fondo;
  const sobreTintaSuave = asegurar(mezclar(fondo, texto, 0.3), texto, 6, '#ffffff');
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.1),
    texto,
    suave,
    tenue,
    error: asegurar('#c42b1c', sup2, 4.6, '#000000'),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, iri[1], 0.55),
    acento,
    oscuro: false,
    extra: {
      'iri-1': iri[0],
      'iri-2': iri[1],
      'iri-3': iri[2],
      'iri-4': iri[3],
      'linea-2': mezclar(fondo, texto, 0.17),
      'fondo-2': mezclar(fondo, mezclar(semilla, '#c8b89c', 0.6), 0.16),
      duo: mezclar(texto, semilla, 0.28),
      'sobre-tinta': sobreTinta,
      'sobre-tinta-2': sobreTintaSuave,
      'linea-tinta': mezclar(texto, fondo, 0.16),
    },
  };
}

// Con colores propios (tema.propios): el fondo, el texto, el botón y los resaltados que pidió la
// persona, y NÁCAR adaptado a ese fondo. Con un fondo claro es la de siempre (marfil → su fondo); con uno oscuro, un nácar
// de noche: brillos hondos de sus tonos, vidrio oscuro y la tinta clara. Todo texto con AA sobre lo que tiene debajo.
export function coloresNacarPropios(b, P = {}) {
  // Los tonos del nácar salen de la marca; si la persona cambió más que el botón (una paleta, el fondo o los resaltados),
  // de sus colores.
  const suyos = !!(P.primario && (P.fondo || P.acento));
  const pri = suyos ? P.primario : b.primario;
  const ac = P.acento || b.acento;
  const semilla = !esGris(pri) ? pri : !esGris(ac) ? ac : '#7a5cff';
  const [h] = aHsl(semilla);
  const hAcento = aHsl(ac)[0];
  const distinto = !esGris(ac) && Math.min(Math.abs(hAcento - h), 360 - Math.abs(hAcento - h)) > 35;
  const segunda = distinto ? ac : deHsl(h + 110, 0.7, 0.6);
  const fondo = P.fondo || (!b.oscuro && luminancia(b.fondo) > 0.78 ? b.fondo : mezclar(MARFIL, semilla, 0.03));
  const claro = esClaro(fondo);
  const lado = claro ? '#000000' : '#ffffff';
  let texto = P.texto || (claro ? (!b.oscuro && luminancia(b.texto) < 0.04 ? b.texto : mezclar(TINTA, semilla, 0.06)) : mezclar('#f7f3ec', semilla, 0.05));
  texto = P.texto ? legible(texto, [fondo], 4.5) : asegurar(texto, fondo, 12, lado);
  const sup = superficie(fondo, '#ffffff', claro ? 0.62 : 0.07, texto);
  // El vidrio (lo que en el marfil es blanco: campos, mosaicos del reloj, bordes de cristal).
  const vidrio = claro && contraste(texto, '#ffffff') >= 4.6 ? '#ffffff' : superficie(fondo, '#ffffff', claro ? 0.7 : 0.12, texto);
  const sup2 = superficie(fondo, texto, claro ? 0.045 : 0.07, texto);
  texto = legible(texto, [fondo, sup, sup2, vidrio], 4.5);
  const crudos = claro
    ? [pastel(semilla, 0, 0.83, 0.9), pastel(segunda, 0, 0.84, 0.85), pastel(semilla, 200, 0.86, 0.8), pastel(semilla, 55, 0.88, 0.9)]
    : [pastel(semilla, 0, 0.3, 0.7), pastel(segunda, 0, 0.28, 0.65), pastel(semilla, 200, 0.26, 0.6), pastel(semilla, 55, 0.3, 0.7)];
  let suave = legible(mezclar(texto, fondo, 0.26), [fondo, sup, sup2, vidrio], claro ? 7 : 6);
  // Los brillos: se aclaran (o, de noche, se apagan) hasta que el texto y el subtítulo se lean encima.
  const iri = crudos.map((c) => {
    let x = c;
    for (let i = 0; i < 30 && (contraste(suave, x) < 4.6 || contraste(texto, x) < 4.6); i++) x = mezclar(x, claro ? '#ffffff' : '#000000', 0.12);
    return x;
  });
  suave = legible(suave, [fondo, sup, sup2, vidrio, ...iri], 4.6);
  texto = legible(texto, [fondo, sup, sup2, vidrio, ...iri], 4.6);
  const tenue = legible(mezclar(texto, fondo, 0.42), [fondo, sup, sup2, vidrio, ...iri], 4.6);
  const base = P.acento || (!esGris(ac) ? ac : semilla);
  const acento = legible(P.acento ? base : claro ? hondo(base, sup2, 4.8) : deHsl(aHsl(base)[0], Math.max(aHsl(base)[1], 0.5), 0.72), [sup2, fondo, sup, vidrio, ...iri], 4.8);
  const primario = P.primario || (contraste(b.primario, fondo) >= 3 ? b.primario : texto);
  const sobrePrimario = sobreDe(primario);
  return {
    fondo,
    sup,
    sup2,
    linea: mezclar(fondo, texto, 0.1),
    texto,
    suave,
    tenue,
    error: legible(claro ? '#c42b1c' : '#ff7b72', [sup2, fondo, vidrio], 4.6),
    primario,
    sobrePrimario,
    primarioSuave: mezclar(fondo, iri[1], 0.55),
    acento,
    oscuro: !claro,
    extra: {
      'iri-1': iri[0],
      'iri-2': iri[1],
      'iri-3': iri[2],
      'iri-4': iri[3],
      'linea-2': mezclar(fondo, texto, 0.17),
      'fondo-2': mezclar(fondo, mezclar(semilla, claro ? '#c8b89c' : '#000000', 0.6), 0.16),
      duo: mezclar(texto, semilla, 0.28),
      'sobre-tinta': legible(fondo, [texto], 4.6),
      'sobre-tinta-2': asegurar(mezclar(fondo, texto, 0.3), texto, 6, claro ? '#ffffff' : '#000000'),
      'linea-tinta': mezclar(texto, fondo, 0.16),
      vidrio,
      sombra: claro ? '#16131d' : '#000000',
      'sombra-2': claro ? '#28195a' : '#000000',
      'pri-txt': legible(primario, [fondo, sup, sup2], 4.5),
    },
  };
}

// El CSS de NÁCAR con colores propios: lo que era blanco fijo (vidrio, campos, mosaicos) y las sombras de tinta pasan a
// variables, para que un fondo oscuro tenga vidrio oscuro. Con un fondo claro se ve igual que siempre.
export function cssNacarPropios(css) {
  const pct = (a) => `${Math.round(parseFloat(a) * 1000) / 10}%`;
  return css
    .replace(/rgba\(255,255,255,([\d.]+)\)/g, (_, a) => `color-mix(in srgb,var(--vidrio,#fff) ${pct(a)},transparent)`)
    .replace(/rgba\(22,19,29,([\d.]+)\)/g, (_, a) => `color-mix(in srgb,var(--sombra,#16131d) ${pct(a)},transparent)`)
    .replace(/rgba\(40,25,90,([\d.]+)\)/g, (_, a) => `color-mix(in srgb,var(--sombra-2,#28195a) ${pct(a)},transparent)`)
    .replace(/#fff(?![0-9a-f])/gi, 'var(--vidrio,#fff)');
}

export default {
  id: 'nacar',
  nombre: 'Nácar',
  descripcion: 'Clara y luminosa: brillos de nácar con tus colores, una gota de vidrio que se mueve y tarjetas que se apilan.',
  mejorPara: ['registro', 'ventas', 'local', 'vsl'],
  cuando:
    'Marcas cálidas, cercanas o premium y públicos que valoran lo cuidado: educación, bienestar, belleza, consultoría, ' +
    'servicios profesionales y masterclass gratis. Va muy bien con marcas claras o pastel; con marcas oscuras toma sus ' +
    'tonos sobre marfil. Evítala si la marca pide algo oscuro, agresivo o de "póster".',
  modo: 'claro',
  letras: { titulos: 'instrument-sans', texto: 'instrument-sans', acento: 'fraunces-italic' },
  lista: true,
  colores: (base) => coloresNacar(base),
  propios: (base, tema, P) => coloresNacarPropios(base, P),
  cssPropios: cssNacarPropios,
  css: CSS_NACAR,
  cssLegal: CSS_LEGAL_NACAR,
  escena: 'nacar',
  // La cursiva de los resaltados se precarga si el título de la portada (o el de gracias) tiene uno: está en la primera
  // pantalla y, si llega tarde, la línea podría cambiar de ancho.
  precarga(plan, t) {
    const primera = [...(plan.secciones || []), ...(plan.gracias?.secciones || [])].find((s) => s && !s.oculta && (s.tipo === 'hero' || s.tipo === 'gracias'));
    const r = primera?.campos?.resaltado;
    return t.letrasPropias && typeof r === 'string' && r.trim() ? [t.acento.archivo] : [];
  },
  movimiento: {
    // Aparecen al entrar en pantalla (solo lo que está más abajo de la primera pantalla al cargar).
    revelar:
      '.sec:not(.s-hero):not(.s-gracias):not(.s-aviso):not(.s-pie) .cab>*,.sec-acc,.te,.tj:not(.be-tj),.be-tj,.be-li,.ci li,.co-t,.co-2,.pq-col,' +
      '.ex-f,.ex-fc,.ex-d>div>*,.ex-c>*:not(.ex-fc),.of-card,.of-d,.ga,.acor,.fq-c,.sv-tj,.sv-p>li,.s-galeria figure,.ub,.vi .vid,.ct,.ur>*,' +
      '.fo-card,.fo-d>div:first-child,.me-p,.pr-li,.pr-cierre,.cta-in,.s-video .acc,' +
      // la página de evento: entradas, equipo, logística, dudas, la idea, los dos caminos, la frase y las experiencias
      '.nv-ct,.nv-tj,.eq-tj,.lg,.du,.id-img,.id-t,.cm-col,.ur-fr>.ur-t,.bo-ft',
    // Tarjetas que se apilan al bajar (la de atrás se achica un poco).
    pila: '.s-beneficios.v-numerada .be-nl',
    // Cifras con dígitos que ruedan al entrar.
    ruedas: '.ci strong,.ur-c strong',
    // Dígitos de la cuenta regresiva (los escribe el JS de la página; aquí ruedan).
    reloj: '.ct-n',
    // Avance del scroll (--p de 0 a 1) para el arco que se cierra.
    progreso: '.s-contador .ct,.s-urgencia .ur',
    // "Es para ti si…" en carrusel con flechas y contador.
    carrusel: '.s-para_quien .pq-si ul',
    // El pie se descubre como un telón.
    telon: true,
    // Botón fijo abajo en el celular cuando la portada ya no se ve.
    barra: true,
    // Dónde va el objeto de vidrio de la escena (y su respaldo en CSS): la gota en la portada, el anillo en el cierre.
    anclas: [
      { en: '.s-hero:not(.v-video),.s-gracias', cual: 'primero', forma: 'gota' },
      { en: '.s-cta', cual: 'ultimo', forma: 'anillo' },
    ],
  },
};
