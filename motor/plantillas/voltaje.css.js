// CSS de VOLTAJE por sección (contrato en ./index.js). Va después del CSS clásico y lo pisa. Todo color sale de los
// tokens que arma coloresVoltaje() con la marca (--fondo, --pri, --tinta, --papel, --choque…). Los bloques de color
// (primario, papel, choque) redefinen --texto, --suave, --linea, el botón y el resaltado para lo que llevan dentro: así
// cada sección se escribe una sola vez. Lo que se mueve, se fija o se dibuja al hacer scroll va bajo .ew-mv (lo pone el
// JS de movimiento): sin JS y en edición la página queda quieta, completa y clicable. Las piezas .ew-* que no vienen en
// el HTML (marquesinas, dato gigante, sello, nombre gigante, cursor) las arma el JS y solo existen con él.
import { css } from './css.js';

const SVG = (s) => `url("data:image/svg+xml,${s.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23').replace(/"/g, "'")}")`;
// Asterisco de cuatro barras (la firma de VOLTAJE) y flecha: máscaras que toman el color de cada lugar.
const AST = SVG(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40"><g fill="#000"><rect x="-3.4" y="-20" width="6.8" height="40" rx="3.4"/>' +
    '<rect x="-3.4" y="-20" width="6.8" height="40" rx="3.4" transform="rotate(45)"/><rect x="-3.4" y="-20" width="6.8" height="40" rx="3.4" transform="rotate(90)"/>' +
    '<rect x="-3.4" y="-20" width="6.8" height="40" rx="3.4" transform="rotate(135)"/></g></svg>',
);
const FLECHA = SVG('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 5.5 19.5 12 13 18.5"/></svg>');
const MASCARA = (m) => `-webkit-mask:${m} center/contain no-repeat;mask:${m} center/contain no-repeat`;
// Puntos de LED quietos (lo que se ve sin WebGL, en edición o mientras la escena llega).
const LEDS = (alpha = 34, paso = 13) => `radial-gradient(circle,color-mix(in srgb,var(--pri) ${alpha}%,transparent) 1.2px,transparent 1.8px) 0 0/${paso}px ${paso}px`;

// Bloques de color: lo que va dentro se lee en tinta (4,6:1 medido en coloresVoltaje) y el botón pasa a tinta con el
// primario encima. --hl-*: la franja del resaltado (color, texto antes y después del barrido).
const BLOQUE = (fondo, suave) =>
  `background:${fondo};color:var(--tinta);--texto:var(--tinta);--suave:${suave};--tenue:${suave};--acento:var(--tinta);` +
  '--linea:color-mix(in srgb,var(--tinta) 16%,transparent);--linea-2:color-mix(in srgb,var(--tinta) 30%,transparent);' +
  '--pri-suave:color-mix(in srgb,var(--tinta) 9%,transparent);--foco:var(--tinta);--ey:var(--tinta);--b-fondo:var(--tinta);--b-txt:var(--pri)';
const PRI = `${BLOQUE('var(--pri)', 'var(--pri-2)')};--hl-banda:var(--tinta);--hl-0:var(--tinta);--hl-1:var(--pri)`;
const PAPEL = `${BLOQUE('var(--papel)', 'var(--papel-2)')};--hl-banda:var(--pri);--hl-0:var(--tinta);--hl-1:var(--sobre-pri)`;
const CHOQUE = `${BLOQUE('var(--choque)', 'var(--choque-2)')};--hl-banda:var(--tinta);--hl-0:var(--tinta);--hl-1:var(--choque)`;
// Tinta dentro de un bloque claro (la tarjeta de quién enseña, la columna "lo tuyo" de la comparación): vuelve el texto
// claro y el botón y el resaltado al primario.
const TINTA =
  'background:var(--tinta);color:var(--papel);--texto:var(--papel);--suave:var(--tinta-2);--tenue:var(--tinta-2);--acento:var(--pri);' +
  '--linea:color-mix(in srgb,var(--papel) 14%,transparent);--linea-2:color-mix(in srgb,var(--papel) 26%,transparent);--pri-suave:color-mix(in srgb,var(--pri) 14%,transparent);' +
  '--foco:var(--pri);--ey:var(--pri);--b-fondo:var(--pri);--b-txt:var(--sobre-pri);--hl-banda:var(--pri);--hl-0:var(--pri);--hl-1:var(--sobre-pri)';
// Tarjeta oscura con un brillo del primario (la cuarta de cada rueda de color).
const NEGRA =
  'background:radial-gradient(60% 80% at 88% 12%,color-mix(in srgb,var(--pri) 20%,transparent),transparent 70%),var(--sup2);color:var(--texto);' +
  'box-shadow:inset 0 0 0 1px var(--linea)';
// Rueda de color de las tarjetas: primario, papel, choque y negra.
const RUEDA = (sel) => `${sel}:nth-child(4n+1){${PRI}}${sel}:nth-child(4n+2){${PAPEL}}${sel}:nth-child(4n+3){${CHOQUE}}${sel}:nth-child(4n+4){${NEGRA}}`;
// Etiqueta monoespaciada (fechas, numeraciones, notas).
const MONO = (tam = '.72rem') => `font:700 ${tam}/1.35 var(--f-mono);letter-spacing:.15em;text-transform:uppercase`;
// Número gigante de contorno (decorativo: el número real está en el texto o es una numeración).
const CONTORNO = (color = 'var(--texto)') => `color:color-mix(in srgb,${color} 7%,transparent);-webkit-text-stroke:2px ${color};paint-order:stroke fill`;

const BASE = css`
  :root{
    --ease:cubic-bezier(.2,.8,.2,1);--ease-io:cubic-bezier(.65,0,.35,1);
    --m:clamp(16px,4.4vw,72px);--r-v:clamp(22px,2.2vw,28px);
    --f-mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
    --ast:${AST};--flecha:${FLECHA};
    --b-fondo:var(--pri);--b-txt:var(--sobre-pri);
    --hl-banda:var(--pri);--hl-0:var(--pri);--hl-1:var(--sobre-pri);
    --foco:var(--pri);--ey:var(--pri);
  }
  html{background:var(--pri);scroll-padding-top:16px}
  body{background:var(--fondo);font-size:1.0625rem;line-height:1.5;letter-spacing:-.004em;overflow-x:clip}
  ::selection{background:var(--pri);color:var(--sobre-pri)}
  .sec{padding-block:clamp(76px,11vw,168px);position:relative;overflow-x:clip}
  .b-sup{background:transparent}.b-ninguna{padding:0}
  .w{max-width:1440px;padding-inline:var(--m)}
  :focus-visible{outline:3px solid var(--foco);outline-offset:3px}
  @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}

  /* letras: títulos en mayúsculas (Anton), texto en Bricolage y etiquetas en la monoespaciada del sistema */
  h1,h2,h3,.h1,.h2,.h3{font-weight:400}
  .h1,.h2{text-transform:uppercase;letter-spacing:.004em;text-wrap:balance}
  .h1{font-size:clamp(2.55rem,11vw,4rem);line-height:1.12}
  .h1.h1-l{font-size:clamp(2.3rem,9.4vw,3.6rem)}
  @media (min-width:900px){.h1{font-size:clamp(3.4rem,5.4vw,5.9rem)}.h1.h1-l{font-size:clamp(3rem,4.5vw,4.9rem)}}
  .h2{font-size:clamp(2.35rem,6.3vw,6.6rem);line-height:1.1}
  .h2.h2-l{font-size:clamp(2.05rem,4.8vw,4.8rem)}
  .h3{font-family:var(--f-txt);font-weight:650;font-size:clamp(1.15rem,1.55vw,1.4rem);line-height:1.25;letter-spacing:-.012em}
  /* el resaltado: una franja del primario que lo barre (sin JS, ya barrido) */
  .hl{font-style:normal;color:var(--hl-1);background:linear-gradient(var(--hl-banda),var(--hl-banda)) no-repeat 0 .26em/100% .93em;
    padding:0 .07em;margin:0 -.03em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
  @media (prefers-reduced-motion:no-preference){
    .ew-mv .hl{animation:ew-barre .85s var(--ease) .45s both}
    .ew-mv .s-hero .hl,.ew-mv .s-gracias .hl{animation-delay:.95s}
    .ew-mv .ew-rv:not(.ew-visto) .hl{animation-play-state:paused}}
  @keyframes ew-barre{from{background-size:0% .93em;color:var(--hl-0)}}
  .ey{font:700 .72rem/1.3 var(--f-mono);letter-spacing:.17em;color:var(--ey);gap:10px;margin:0 0 20px}
  .ey::before{width:9px;height:9px;border-radius:2px;background:currentColor;flex:none}
  .lead{font-size:clamp(1.03rem,1.35vw,1.25rem);line-height:1.5;color:var(--suave);max-width:60ch;margin-top:22px}
  .cab{max-width:1180px;margin-bottom:clamp(40px,5.5vw,84px)}
  .cab-c{margin-inline:0;text-align:left}.cab-c .lead{margin-inline:0}
  /* los títulos de sección se descubren de abajo hacia arriba al llegar */
  .ew-mv .h2.ew-rv{opacity:1;transform:none;clip-path:inset(-.2em -.2em 100% -.2em);transition:clip-path 1.1s var(--ease) .05s}
  .ew-mv .h2.ew-rv.ew-visto{clip-path:inset(-.2em -.2em -.3em -.2em)}

  /* botón: píldora del primario con su círculo y la flecha que gira */
  .btn{--mx:0px;--my:0px;min-height:60px;padding:8px 8px 8px 26px;gap:16px;justify-content:space-between;border-radius:99px;
    background:var(--b-fondo);color:var(--b-txt);font:700 1.0625rem/1.15 var(--f-txt);letter-spacing:-.005em;text-transform:none;text-align:left;
    transform:translate3d(var(--mx),var(--my),0);box-shadow:0 14px 44px -14px color-mix(in srgb,var(--b-fondo) 75%,transparent);
    transition:transform .45s var(--ease),box-shadow .35s,background-color .3s,color .3s}
  .btn:hover{filter:none;transform:translate3d(var(--mx),calc(var(--my) - 2px),0);box-shadow:0 20px 50px -16px color-mix(in srgb,var(--b-fondo) 85%,transparent)}
  .btn:active{transform:translate3d(var(--mx),var(--my),0) scale(.98)}
  .btn-f{flex:none;width:44px;height:44px;border-radius:50%;background:var(--b-txt);display:grid;place-items:center;font-size:0;color:transparent;transition:transform .5s var(--ease)}
  .btn-f::before{content:"";width:20px;height:20px;background:var(--b-fondo);${MASCARA('var(--flecha)')}}
  .btn:hover .btn-f,.btn:focus-visible .btn-f{transform:rotate(-45deg)}
  .btn-g{min-height:62px;font-size:1.0625rem}
  .btn-sec{min-height:48px;padding:10px 18px;gap:10px;justify-content:center;background:transparent;color:var(--texto);border:1px solid var(--linea-2);box-shadow:none;
    ${MONO('.7rem')}}
  .btn-sec:hover{border-color:var(--texto);box-shadow:none;background:color-mix(in srgb,var(--texto) 6%,transparent)}
  .btn-sec .ic{width:18px;height:18px;color:var(--acento)}
  .nota{${MONO('.68rem')};font-weight:600;letter-spacing:.14em;color:var(--tenue);margin-top:14px;line-height:1.6}
  .acc{margin-top:30px}
  .sec-acc{margin-top:clamp(36px,5vw,64px);justify-content:flex-start}
  .sec-acc .acc{align-items:flex-start}
  .sec-acc .nota,.cta-in .nota,.ct .nota,.hero-c .nota,.hero-v .nota,.of-p .nota,.fo-t .nota{text-align:left}
  @media (max-width:620px){.acc .nota{text-align:left}.sec-acc .acc{align-items:stretch}}

  /* piezas compartidas */
  .tj{background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-v)}
  .evento{gap:8px;margin-top:22px}
  .evento li{padding:8px 14px;border:1px solid var(--linea-2);border-radius:99px;background:color-mix(in srgb,var(--fondo) 60%,transparent);
    ${MONO('.68rem')};letter-spacing:.12em;color:var(--suave)}
  .evento small{color:var(--tenue);font-size:1em}.evento .hl-local:not(:empty){color:var(--pri)}
  .evento .ic{color:var(--pri);width:16px;height:16px}
  .hero-pts{gap:10px;margin-top:24px}
  .hero-pts li{align-items:center;gap:12px;font-size:.98rem;color:var(--suave);line-height:1.4}
  .hero-pts .ic{width:14px;height:14px;margin:0;padding:0;color:var(--pri);background:var(--pri);flex:none;${MASCARA('var(--ast)')}}
  .acor{display:block;gap:0;border-bottom:1px solid var(--linea)}
  .acor details{background:none;border:0;border-top:1px solid var(--linea);border-radius:0;overflow:visible}
  .acor summary{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1fr) 38px;align-items:center;gap:12px;padding:22px 10px;border-radius:16px;
    font:600 clamp(1.05rem,1.55vw,1.4rem)/1.3 var(--f-txt);letter-spacing:-.012em;transition:color .35s}
  .acor summary::after{content:"";position:absolute;inset:4px 0;z-index:-1;border-radius:inherit;background:var(--pri);transform:scaleX(0);transform-origin:0 50%;transition:transform .5s var(--ease)}
  .acor-i{width:38px;height:38px;padding:10px;border-radius:50%;border:1px solid var(--linea-2);color:currentColor;transition:transform .45s var(--ease),border-color .35s}
  .acor details[open] .acor-i{transform:rotate(45deg);border-color:var(--pri)}
  .acor details>p{padding:0 10px 26px;color:var(--suave);font-size:1.03rem;line-height:1.55;max-width:64ch}
  @media (hover:hover){.acor summary:hover{color:var(--sobre-pri)}.acor summary:hover::after{transform:scaleX(1)}.acor summary:hover .acor-i{border-color:var(--sobre-pri)}
    .acor summary:hover .tm-n,.fq .acor summary:hover::before{color:var(--sobre-pri)}}
  @supports (interpolate-size:allow-keywords){@media (prefers-reduced-motion:no-preference){
    .acor{interpolate-size:allow-keywords}
    .acor details::details-content{block-size:0;overflow:clip;transition:block-size .45s var(--ease),content-visibility .45s allow-discrete}
    .acor details[open]::details-content{block-size:auto}}}
  .vid{border-radius:22px;border:1px solid var(--linea-2);box-shadow:0 40px 100px -40px color-mix(in srgb,var(--pri) 45%,transparent)}
  .vid-p{width:84px;height:84px;margin:-42px 0 0 -42px;background:var(--pri);color:var(--sobre-pri);box-shadow:0 0 0 12px color-mix(in srgb,var(--pri) 22%,transparent)}
  .vid-pc{background:var(--sup2)}
  .pc{border-radius:8px;${MONO('.7rem')};letter-spacing:.06em;text-transform:none;border-color:var(--acento)}
  .img-pc{border-radius:var(--r-v);background:var(--sup2);border-color:var(--linea-2)}

  /* formulario: campos con la etiqueta adentro, en mono */
  .form{gap:8px}
  .campo{display:flex;flex-direction:column;justify-content:center;gap:5px;min-height:60px;padding:9px 18px 8px;border:1px solid transparent;border-radius:18px;
    background:var(--sup2);cursor:text;transition:border-color .25s,background .25s}
  .campo>span{${MONO('.62rem')};letter-spacing:.16em;color:var(--tenue)}
  .campo small{font:inherit;color:var(--tenue);text-transform:none;letter-spacing:.04em}
  .campo input{-webkit-appearance:none;appearance:none;width:100%;min-width:0;min-height:0;margin:0;padding:0;border:0;border-radius:0;outline:0;background:transparent;
    color:var(--texto);font:500 1rem/1.3 var(--f-txt);box-shadow:none}
  .campo input::placeholder{color:var(--tenue);opacity:.8}
  .campo input:focus{box-shadow:none;border:0}
  .campo:focus-within{border-color:var(--pri);background:color-mix(in srgb,var(--sup2) 80%,var(--texto))}
  .campo:has(input[aria-invalid=true]){border-color:var(--error)}
  .form .btn{margin-top:4px;min-height:62px}
  .form .nota{text-align:center}
  .form-msg{border-radius:14px;background:var(--sup2)}
  .form-priv{color:var(--tenue);font-size:.8rem}
  .modal{width:min(520px,calc(100vw - 24px))}
  .modal::backdrop{background:color-mix(in srgb,var(--tinta) 70%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
  .modal-c{border-radius:var(--r-v);border:1px solid var(--linea-2);background:var(--sup);padding:30px 22px 22px;box-shadow:0 40px 120px -30px #000}
  .modal-t{font:400 clamp(1.8rem,5vw,2.3rem)/1.05 var(--f-tit);text-transform:uppercase;margin:0 48px 20px 0}
  .modal-x{top:14px;right:14px;width:40px;height:40px;border:1px solid var(--linea-2);color:var(--texto)}
  @media (max-width:760px){.modal{margin:auto 0 0;width:100%;max-width:100%;max-height:calc(100dvh - 12px)}.modal-c{border-radius:var(--r-v) var(--r-v) 0 0;padding-bottom:calc(22px + env(safe-area-inset-bottom))}
    .modal.modal-fijo{top:auto;bottom:0;margin:0}}
  @media (prefers-reduced-motion:no-preference){.modal[open]{animation:ew-sube-m .55s var(--ease)}}
  @keyframes ew-sube-m{from{transform:translateY(40px);opacity:0}}

  /* panel de LEDs: el lienzo de la escena (y el ancla que la ubica) */
  .ew-ancla{position:absolute;inset:0;z-index:-3;pointer-events:none}
  .ew-lienzo{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:-1;opacity:0;transition:opacity 1.4s ease;pointer-events:none}
  .ew-lienzo.ew-on{opacity:1}

    /* el dato gigante (la fecha del evento) detrás de la foto, con paralaje, y el sello que gira: los arma el JS */
    .ew-dato{position:absolute;margin:0;pointer-events:none;user-select:none;font:400 var(--dato,clamp(140px,40vw,420px))/.8 var(--f-tit);text-transform:uppercase;
      color:var(--pri);white-space:nowrap;display:flex;flex-direction:column}
    .ew-dato>span{position:relative;display:block;transform:translate3d(calc(var(--px,0)*-20px),calc(var(--py,0)*-12px + (var(--p,.5) - .5)*-90px),0)}
    .ew-dato>.ew-dato-b{font-size:.7em;margin-top:.06em;-webkit-text-stroke:2px var(--pri)}
    .ew-mv .ew-dato>.ew-dato-b{color:transparent}
    @media (prefers-reduced-motion:no-preference){.ew-mv .ew-dato>span{animation:ew-sube 1.1s var(--ease) both;animation-delay:calc(var(--i,0)*120ms + 300ms)}}
    @keyframes ew-sube{from{opacity:.16;translate:0 22%}}
    .ew-sello{position:absolute;z-index:3;width:clamp(96px,10vw,150px);aspect-ratio:1;color:var(--texto);pointer-events:none}
    .ew-sello svg{display:block;width:100%;height:100%;overflow:visible}
    .ew-sello text{font:700 13.6px var(--f-mono);letter-spacing:.2em;fill:currentColor}
    .ew-sello .ew-s-fondo{fill:var(--fondo);stroke:var(--linea-2)}.ew-sello .ew-s-centro{fill:var(--pri)}.ew-sello .ew-s-ast{fill:var(--sobre-pri)}
    @media (prefers-reduced-motion:no-preference){.ew-mv .ew-sello .ew-gira{animation:ew-gira 22s linear infinite;transform-origin:100px 100px}}
    @keyframes ew-gira{to{transform:rotate(360deg)}}
  /* palabras que entran (nunca desde invisibles: arrancan tenues y desenfocadas; en línea, sin mover nada) y palabras que
     se encienden con el scroll (la clave encender del JS compartido; con .ew-telon, que pone también cualquier error,
     todas encendidas) */
  @media (prefers-reduced-motion:no-preference){
    .ew-mv .ew-pal{animation:ew-entra .9s var(--ease) both;animation-delay:calc(var(--i,0)*60ms + 40ms)}
    .ew-mv:not(.ew-telon) .ew-enc .ew-w{opacity:clamp(.17,calc(var(--lp,99) - var(--j)),1);transition:opacity .3s linear}}
  @keyframes ew-entra{from{opacity:.16;filter:blur(.12em)}}

  /* marquesinas (las arma el JS): una pista con el contenido dos veces que corre con el scroll */
  .ew-marq{overflow:hidden;white-space:nowrap}
  .ew-pista{display:flex;width:max-content;will-change:transform}
  .ew-it{display:inline-flex;align-items:center;gap:.55em;padding-right:.55em}
  .ew-ast{display:inline-block;flex:none;width:.62em;height:.62em;background:currentColor;${MASCARA('var(--ast)')}}

  /* cursor con etiqueta (solo escritorio con mouse) */
  .ew-cursor{position:fixed;left:0;top:0;z-index:90;width:0;height:0;pointer-events:none}
  .ew-mv .ew-cursor>span{position:absolute;left:-7px;top:-7px;width:14px;height:14px;display:grid;place-items:center;border-radius:50%;background:#fff;mix-blend-mode:difference;
    color:transparent;font:800 10px/1 var(--f-mono);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;
    transition:width .4s var(--ease),height .4s var(--ease),left .4s var(--ease),top .4s var(--ease),background-color .3s,color .3s}
  .ew-mv .ew-cursor.ew-lab>span{left:-46px;top:-46px;width:92px;height:92px;background:var(--pri);color:var(--sobre-pri);mix-blend-mode:normal}
  .ew-mv .ew-cursor.ew-fuera{opacity:0}

  /* el telón: el pie (primario) queda quieto detrás y la página se levanta al llegar al final */
  .ew-mv :where(.sec:not(.s-pie)){z-index:1;background-color:var(--fondo)}
  .ew-mv:not(.ew-sin-telon) .s-pie{position:sticky;bottom:0;z-index:0}
  .ew-mv:not(.ew-sin-telon):not(.ew-telon) .s-pie>*{visibility:hidden}
  .ew-mv:not(.ew-sin-telon) .sec:has(+.s-pie){border-radius:0 0 clamp(26px,4vw,60px) clamp(26px,4vw,60px);overflow:clip;box-shadow:0 50px 90px -30px rgba(0,0,0,.75)}

  /* barra del botón en el celular y flechas del carrusel */
  .ew-barra{left:10px;right:10px}
  .ew-barra .btn{box-shadow:0 0 0 1px color-mix(in srgb,var(--texto) 14%,transparent),0 18px 40px -12px #000}
  .ew-car{justify-content:center;gap:16px}
  .ew-car-b{width:52px;height:52px;border:1px solid var(--linea-2);background:color-mix(in srgb,var(--texto) 4%,transparent);color:var(--texto);
    transition:background .25s,color .25s,transform .4s var(--ease)}
  .ew-car-b::before{content:"";width:20px;height:20px;background:currentColor;${MASCARA('var(--flecha)')}}
  .ew-car-b.ew-prev::before{transform:scaleX(-1)}
  .ew-car-b:not(:disabled):hover{background:var(--pri);color:var(--sobre-pri);transform:scale(1.06)}
  .ew-car-n{margin:0;min-width:84px;text-align:center;${MONO('.75rem')};letter-spacing:.16em;color:var(--texto)}
  .ew-car-n span{color:var(--tenue)}

  @media (prefers-reduced-motion:reduce){.ew-mv .s-pie{position:static!important}.btn,.btn-f{transition:none}}
  @media print{.ew-mv .ew-w,.ew-mv .ew-pal{opacity:1!important;filter:none!important}}
`;

const S = {};

S.aviso = {
  base: css`
    .s-aviso{background:var(--pri);color:var(--sobre-pri);position:relative;z-index:3}
    .aviso-a{min-height:36px;padding:9px 16px;${MONO('.7rem')};letter-spacing:.16em;line-height:1.4;gap:12px}
    .aviso-a>span[aria-hidden]:not(.ew-marq){font-family:var(--f-txt);letter-spacing:0}
    /* con JS: el texto corre como marquesina (el original queda para los lectores de pantalla) */
    .ew-mv .aviso-a.ew-con-marq{justify-content:flex-start;padding:0;height:36px;overflow:hidden}
    .ew-mv .ew-con-marq>span:not(.ew-marq){position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
    .aviso-a .ew-marq{display:block;flex:1;min-width:0}
    .aviso-a .ew-it{gap:22px;padding-right:22px}
    .aviso-a .ew-ast{width:12px;height:12px}
  `,
};

S.hero = {
  base: css`
    .s-hero{z-index:2;isolation:isolate;padding-block:clamp(22px,3vw,44px) clamp(104px,11vw,170px);
      background:radial-gradient(48% 58% at 80% 70%,color-mix(in srgb,var(--pri) 18%,transparent),transparent 72%),var(--fondo)}
    .ew-mv .s-hero{z-index:2}
    .s-hero::before{content:"";position:absolute;inset:0;z-index:-2;background:${LEDS()};pointer-events:none;transition:opacity 1.4s;
      -webkit-mask:radial-gradient(70% 80% at 80% 58%,#000 8%,transparent 74%);mask:radial-gradient(70% 80% at 80% 58%,#000 8%,transparent 74%)}
    .s-hero.ew-gl::before{opacity:0}
    .s-hero>.w{position:relative;z-index:1}
    @media (min-width:900px){.s-hero{min-height:min(100svh,1000px);padding-top:clamp(40px,6vh,80px)}}
    .s-hero .h1{margin:18px 0 0;max-width:15em}
    .s-hero .lead{max-width:52ch;font-size:clamp(1rem,1.25vw,1.19rem);line-height:1.45;margin-top:18px}
    .s-hero .ey{display:inline-flex;align-self:flex-start;align-items:center;gap:10px;margin:0;padding:8px 14px 8px 10px;border:1px solid var(--linea-2);border-radius:99px;
      background:color-mix(in srgb,var(--fondo) 55%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-size:.68rem;letter-spacing:.15em;color:var(--suave)}
    .s-hero .ey::before{width:8px;height:8px;border-radius:50%;background:var(--pri)}
    @media (prefers-reduced-motion:no-preference){.ew-mv .s-hero .ey::before{animation:ew-latido 1.8s ease-out infinite}}
    @keyframes ew-latido{from{box-shadow:0 0 0 0 color-mix(in srgb,var(--pri) 60%,transparent)}to{box-shadow:0 0 0 9px transparent}}
    .s-hero .acc{margin-top:28px}
    @media (max-width:760px){.s-hero .h1{margin-top:16px}.s-hero .lead{font-size:.98rem;margin-top:14px}.s-hero .evento{margin-top:16px}.s-hero .acc{margin-top:22px}}

    /* cintas cruzadas al pie de la portada (las arma el JS con los puntos clave y los datos del evento) */
    .ew-cintas{--alto:clamp(124px,15vw,230px);position:absolute;left:0;right:0;bottom:calc(var(--alto)*-.5);height:var(--alto);z-index:5;overflow:hidden;pointer-events:none}
    .ew-cinta{position:absolute;left:-12vw;width:124vw;top:50%;padding:clamp(10px,1.1vw,16px) 0;font:400 clamp(1.5rem,3.3vw,3.1rem)/1.05 var(--f-tit);text-transform:uppercase}
    .ew-cinta .ew-it{padding-right:.5em;gap:.5em}
    .ew-c1{z-index:2;background:var(--pri);color:var(--sobre-pri);transform:translateY(-62%) rotate(-3.6deg);box-shadow:0 24px 60px -24px rgba(0,0,0,.7)}
    .ew-c2{background:var(--papel);color:var(--tinta);transform:translateY(-30%) rotate(2.6deg)}

  `,
  centrado: css`
    .hero-c{align-items:flex-start;text-align:left}
    .hero-c .lead{margin-inline:0}.hero-c .acc{align-items:flex-start}
    .hero-c .hero-pts{display:grid;gap:10px}.hero-c .evento{justify-content:flex-start}
    @media (min-width:900px){.hero-c{align-items:center;text-align:center}.hero-c .h1{max-width:17em}.hero-c .lead{margin-inline:auto}.hero-c .acc{align-items:center}
      .hero-c .ey{align-self:center}.hero-c .evento{justify-content:center}.hero-c .hero-pts{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 26px}
      .hero-c .acc .nota{text-align:center}.s-hero.v-centrado::before{-webkit-mask:radial-gradient(70% 70% at 50% 40%,#000 8%,transparent 74%);mask:radial-gradient(70% 70% at 50% 40%,#000 8%,transparent 74%)}}
    .hero-img{position:relative;isolation:isolate;margin-top:clamp(40px,6vw,80px);border:0;border-radius:var(--r-v);overflow:hidden;box-shadow:16px 16px 0 var(--pri)}
    .hero-img img{aspect-ratio:16/8;filter:saturate(1.06) contrast(1.05)}
    .hero-img::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--pri),transparent 55%);mix-blend-mode:color;opacity:.85}
  `,
  dividido: css`
    /* arriba y no centrado: si el texto cambia de alto al llegar la letra, lo de arriba no se mueve */
    .hero-d{gap:40px;align-items:start}
    @media (min-width:920px){.hero-d{grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:56px}}
    /* la foto (normal, con su fondo): marco del primario corrido, la parte de abajo virada al color de la marca y LEDs encima */
    .hero-m{position:relative;isolation:isolate;max-width:520px;width:100%;justify-self:center;margin:24px 18px 18px 0}
    .hero-m img{position:relative;z-index:0;display:block;border:0;border-radius:var(--r-v);aspect-ratio:4/5;object-fit:cover;filter:saturate(1.05) contrast(1.06);
      box-shadow:16px 16px 0 var(--pri)}
    .hero-m:has(img)::before{content:"";position:absolute;inset:0;z-index:1;border-radius:var(--r-v);pointer-events:none;
      background:linear-gradient(to top,var(--pri),transparent 60%);mix-blend-mode:color;opacity:.9}
    .hero-m:has(img)::after{content:"";position:absolute;inset:0;z-index:1;border-radius:var(--r-v);pointer-events:none;background:${LEDS(60, 9)};
      -webkit-mask:linear-gradient(to top,#000,transparent 45%);mask:linear-gradient(to top,#000,transparent 45%)}
    .hero-m .img-pc{aspect-ratio:4/5}
    @media (max-width:919px){.hero-m{max-width:440px;justify-self:start}.hero-m img{aspect-ratio:4/4.4;max-height:64vh}}
    .hero-m>.ew-dato{inset:-11% -9% -7% -12%;justify-content:space-between;--dato:clamp(120px,15vw,250px)}
    .hero-m>.ew-dato>.ew-dato-a{z-index:-1;align-self:flex-end}
    .hero-m>.ew-dato>.ew-dato-b{z-index:2;align-self:flex-start;font-size:.62em}
    .hero-m>.ew-sello{left:-9%;bottom:12%}
    /* sin foto: el texto a lo ancho y el dato a la derecha */
    .hero-sf{position:relative}
    /* sin foto ni fecha: el asterisco de VOLTAJE, enorme, a la derecha */
    @media (min-width:900px){.hero-sf::after{content:"";position:absolute;z-index:-1;right:2%;top:50%;width:clamp(220px,24vw,380px);aspect-ratio:1;translate:0 -50%;
      background:var(--pri);${MASCARA('var(--ast)')}}}
    @media (prefers-reduced-motion:no-preference){.ew-mv .hero-sf::after{animation:ew-gira 40s linear infinite}}
    .ew-mv .hero-sf:has(.ew-dato)::after{display:none}
    .hero-sf .h1{max-width:13em}
    .hero-sf>.ew-dato{right:0;top:50%;margin-top:calc(var(--dato,300px)*-.75);--dato:clamp(180px,24vw,400px);align-items:flex-end;opacity:.95}
    .hero-sf>.ew-sello{right:calc(var(--dato,300px)*.9);top:50%}
    @media (max-width:899px){.ew-mv .hero-sf>.ew-dato,.ew-mv .hero-sf>.ew-sello{display:none}}
    @media (min-width:900px) and (max-width:1199px){.hero-sf .h1{max-width:11em}}
  `,
  video: css`
    .s-hero.v-video{padding-top:clamp(22px,3vw,44px)}
    .s-hero.v-video::before{-webkit-mask:radial-gradient(80% 60% at 50% 45%,#000 10%,transparent 75%);mask:radial-gradient(80% 60% at 50% 45%,#000 10%,transparent 75%)}
    .hero-v{max-width:1040px}
    .hero-v .ey{align-self:center}
    .hero-v .h1{font-size:clamp(1.85rem,3.6vw,3.25rem)!important;line-height:1.08!important;max-width:24em;margin-top:16px}
    .hero-v .lead{font-size:1.02rem;max-width:58ch}
    .hero-v .vid{margin-top:clamp(20px,3vw,34px);border:2px solid var(--pri);box-shadow:0 0 0 6px color-mix(in srgb,var(--pri) 16%,transparent),0 50px 120px -40px color-mix(in srgb,var(--pri) 55%,transparent)}
    .hero-v .acc{align-items:center}
    .hero-v .hero-pts{gap:10px 26px}
    @media (max-width:620px){.hero-v .h1{font-size:clamp(1.65rem,7.2vw,2.2rem)!important}.hero-v .acc{align-items:stretch}
      .hero-v .hero-pts{display:grid;justify-content:start;text-align:left}}
  `,
  evento: css`
    .hero-e{position:relative;gap:28px}
    @media (min-width:960px){.hero-e{grid-template-columns:minmax(0,1.14fr) minmax(0,.86fr);grid-template-rows:auto 1fr;column-gap:clamp(40px,5vw,88px);align-items:start}}
    /* la tarjeta del formulario: vidrio oscuro, con lugar arriba para el dato gigante */
    .hero-form{position:relative;z-index:2;margin-top:clamp(96px,26vw,130px);padding:clamp(20px,2.4vw,32px);border-radius:var(--r-v);border:1px solid var(--linea-2);
      background:color-mix(in srgb,var(--fondo) 62%,transparent);-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3);box-shadow:0 40px 100px -50px #000}
    @media (min-width:960px){.hero-form{margin-top:clamp(170px,16.5vw,270px)}}
    .hero-form-t{font:400 clamp(1.6rem,2.4vw,2.25rem)/1.1 var(--f-tit);text-transform:uppercase;margin:0 0 18px}
    .hero-x .hero-pts{margin-top:4px}
    .hero-e>.ew-dato{top:0;right:0;align-items:flex-end;--dato:clamp(118px,30vw,170px);flex-direction:row;gap:.12em}
    .hero-e>.ew-dato>.ew-dato-b{font-size:1em}
    @media (max-width:959px){.hero-e>.ew-dato{grid-column:1/2;grid-row:2/3}}
    @media (min-width:960px){.hero-e>.ew-dato{grid-column:2/3;grid-row:1/3;flex-direction:column;gap:0;--dato:clamp(200px,18vw,320px);top:0}
      .hero-e>.ew-dato>.ew-dato-b{font-size:.7em}}
    .hero-form>.ew-sello{left:auto;right:-10px;top:-40px;width:clamp(86px,9vw,130px)}
    @media (min-width:960px){.hero-form>.ew-sello{right:auto;left:-58px;top:-104px}}
  `,
};

S.formulario = {
  base: css`
    .s-formulario{isolation:isolate;background:radial-gradient(60% 60% at 70% 60%,color-mix(in srgb,var(--pri) 16%,transparent),transparent 70%),var(--fondo)}
    .s-formulario::before{content:"";position:absolute;inset:0;z-index:-2;background:${LEDS(26)};pointer-events:none;transition:opacity 1.4s;
      -webkit-mask:radial-gradient(60% 70% at 72% 60%,#000 6%,transparent 72%);mask:radial-gradient(60% 70% at 72% 60%,#000 6%,transparent 72%)}
    .s-formulario.ew-gl::before{opacity:0}
    .s-formulario>.w{position:relative;z-index:1}
    .fo-card{position:relative;z-index:2;padding:clamp(20px,2.4vw,32px);border-radius:var(--r-v);border:1px solid var(--linea-2);
      background:color-mix(in srgb,var(--fondo) 70%,transparent);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);box-shadow:0 40px 100px -50px #000}
    .fo-t{max-width:none;text-align:left;display:grid;gap:36px;align-items:center}
    .fo-t .cab,.fo-d .cab{margin:0}
    .fo-t .fo-card{margin-top:0}
    .fo-t .acc{align-items:flex-start}
    .s-formulario .h2{font-size:clamp(2.6rem,7vw,7.4rem)}
    .s-formulario .h2.h2-l{font-size:clamp(2.2rem,5.4vw,5.6rem)}
    @media (min-width:900px){.s-formulario{min-height:min(100svh,980px);display:flex;align-items:center}.s-formulario>.w{width:100%}
      .fo-t:has(.fo-card){grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:64px}}
  `,
  dividido: css`
    .fo-d{gap:36px;align-items:center}
    @media (min-width:900px){.fo-d{grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:64px}}
    .fo-d .evento{margin-top:28px}
  `,
};

S.contador = {
  base: css`
    .s-contador{${PRI}}
    .s-urgencia+.s-contador{padding-top:0}
    .s-contador:has(+.s-urgencia){padding-bottom:clamp(40px,5vw,72px)}
    .ct{align-items:stretch;text-align:left;max-width:none;border-top:2px solid var(--tinta);padding-top:18px}
    .ct .h3{order:-1;margin:0 0 6px;${MONO('.72rem')};font-family:var(--f-mono);color:var(--tinta)}
    .ct-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;max-width:none;width:100%;margin-top:6px}
    .ct-c{display:flex;flex-direction:column;gap:6px;padding:0 clamp(4px,1.4vw,22px);background:none;border:0;border-left:2px solid var(--tinta);border-radius:0;text-align:left}
    .ct-c:first-child{border-left:0;padding-left:0}
    .ct-n,.ct-c .ew-odo{font:400 clamp(3.6rem,15.5vw,15.6rem)/1 var(--f-tit);letter-spacing:-.01em;color:var(--tinta)}
    .ct-l{${MONO('.66rem')};color:var(--tinta)}
    .ct .acc{margin-top:clamp(36px,5vw,64px);align-items:flex-start}
  `,
};

S.cta = {
  base: css`
    .cta-in{text-align:left;align-items:flex-start}
    .cta-in .lead{margin-inline:0}
    .cta-in .acc{align-items:flex-start}
    .s-cta .h2{font-size:clamp(2.6rem,7.4vw,8rem);max-width:12em}
    .s-cta .h2.h2-l{font-size:clamp(2.25rem,5.6vw,5.9rem)}
  `,
  banda: css`
    .s-cta.v-banda{${PRI}}
    .s-cta.v-banda::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--tinta) 22%,transparent) 1.2px,transparent 1.8px) 0 0/13px 13px;
      -webkit-mask:radial-gradient(55% 80% at 92% 100%,#000,transparent 70%);mask:radial-gradient(55% 80% at 92% 100%,#000,transparent 70%)}
    .s-cta.v-banda .h2,.s-cta.v-banda h2{color:var(--tinta)}
    .s-cta.v-banda .ey,.s-cta.v-banda .lead,.s-cta.v-banda .nota{color:var(--suave);opacity:1}
    .s-cta.v-banda .hl{text-decoration:none;color:var(--hl-1)}
    .s-cta.v-banda .btn{background:var(--b-fondo);color:var(--b-txt);box-shadow:0 18px 40px -18px rgba(0,0,0,.6)}
  `,
  tarjeta: css`
    .s-cta.v-tarjeta{isolation:isolate;background:radial-gradient(60% 60% at 70% 60%,color-mix(in srgb,var(--pri) 16%,transparent),transparent 70%),var(--fondo)}
    .s-cta.v-tarjeta::before{content:"";position:absolute;inset:0;z-index:-2;background:${LEDS(26)};pointer-events:none;transition:opacity 1.4s;
      -webkit-mask:radial-gradient(60% 70% at 75% 60%,#000 6%,transparent 72%);mask:radial-gradient(60% 70% at 75% 60%,#000 6%,transparent 72%)}
    .s-cta.v-tarjeta.ew-gl::before{opacity:0}
    .s-cta.v-tarjeta>.w{position:relative;z-index:1}
    .s-cta.v-tarjeta .cta-in{background:none;border:0;border-radius:0;padding:0;overflow:visible}
    @media (min-width:900px){.s-cta.v-tarjeta{min-height:min(88svh,860px);display:flex;align-items:center}.s-cta.v-tarjeta>.w{width:100%}}
  `,
};

S.beneficios = {
  base: css`
    .s-beneficios p{color:var(--suave)}
  `,
  tarjetas: css`
    .be-g{gap:14px;counter-reset:ew-be}
    .be-tj{position:relative;overflow:hidden;isolation:isolate;min-height:clamp(300px,30vw,400px);padding:clamp(22px,2.4vw,32px);border:0;gap:12px;justify-content:flex-end;counter-increment:ew-be}
    ${RUEDA('.be-tj')}
    .be-tj::before{content:"[ " counter(ew-be,decimal-leading-zero) " ]";content:"[ " counter(ew-be,decimal-leading-zero) " ]" / "";position:absolute;top:clamp(22px,2.4vw,32px);left:clamp(22px,2.4vw,32px);${MONO('.68rem')}}
    .be-i{position:absolute;z-index:-1;right:-.04em;top:-.12em;margin:0;font:400 clamp(150px,16vw,240px)/.8 var(--f-tit);letter-spacing:0;${CONTORNO()}}
    .be-tj .h3{font:400 clamp(1.8rem,2.6vw,2.6rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;max-width:12ch}
    .be-tj p{font-weight:500;color:var(--suave);margin:0}
  `,
  lista: css`
    .be-l{gap:0 56px;max-width:none;border-top:1px solid var(--linea);counter-reset:ew-be}
    .be-li{position:relative;padding:26px 0 26px 64px;border-bottom:1px solid var(--linea);gap:0;counter-increment:ew-be}
    .be-li::before{content:counter(ew-be,decimal-leading-zero);content:counter(ew-be,decimal-leading-zero) / "";position:absolute;left:0;top:28px;${MONO('.7rem')};color:var(--tenue)}
    .be-li .ic{position:absolute;left:30px;top:26px;width:22px;height:22px;padding:4px;margin:0;border-radius:50%;background:var(--pri);color:var(--sobre-pri);stroke-width:3}
    .be-li .h3{font-size:clamp(1.2rem,1.7vw,1.5rem)}
  `,
  numerada: css`
    /* la pila de tarjetas de color con su número gigante */
    .be-nl{display:grid;gap:clamp(18px,4vh,40px);max-width:none;margin:0;--tope:12px;counter-reset:ew-be}
    .be-num{position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;gap:18px;min-height:min(58svh,560px);padding:clamp(22px,3.4vw,52px);
      border:0;border-radius:var(--r-v);transform-origin:50% 0;box-shadow:0 -14px 60px -22px rgba(0,0,0,.65);counter-increment:ew-be}
    .be-num:last-child{border-bottom:0}
    ${RUEDA('.be-num')}
    .be-num:nth-child(1){--i:0}.be-num:nth-child(2){--i:1}.be-num:nth-child(3){--i:2}.be-num:nth-child(4){--i:3}.be-num:nth-child(5){--i:4}.be-num:nth-child(6){--i:5}
    .be-num::before{content:"[ " counter(ew-be,decimal-leading-zero) " ]";content:"[ " counter(ew-be,decimal-leading-zero) " ]" / "";${MONO('.7rem')};letter-spacing:.16em}
    .be-n{position:absolute;z-index:-1;right:-.04em;top:-.1em;min-width:0;font:400 clamp(170px,26vw,420px)/.8 var(--f-tit);letter-spacing:0;${CONTORNO()};pointer-events:none}
    .be-num:nth-child(4n+4) .be-n{-webkit-text-stroke-color:var(--pri)}
    .be-num>div{margin-top:auto;display:grid;gap:16px}
    .be-num .h3{font:400 clamp(2.15rem,5.2vw,5.25rem)/1.1 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;max-width:13ch;margin:0}
    .be-num p{margin:0;font-size:clamp(1rem,1.35vw,1.25rem);line-height:1.45;font-weight:500;max-width:38ch;color:var(--suave)}
    @media (min-width:900px){.be-nl{--tope:5vh}.be-num>div{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:end;column-gap:48px}.be-num p{margin-bottom:.4em}}
    .ew-mv .be-num{position:sticky;top:calc(var(--tope) + var(--i,0)*16px);transform:scale(calc(1 - var(--tapa,0)*.05))}
    .ew-mv .be-num::after{content:"";position:absolute;inset:0;z-index:3;border-radius:inherit;background:#000;opacity:calc(var(--tapa,0)*.55);pointer-events:none}
  `,
};

S.problema = {
  base: css`
    .s-problema .ic{width:28px;height:28px;padding:6px;margin:0;border-radius:50%;border:1px solid var(--linea-2);color:var(--tenue);stroke-width:2.2;flex:none}
    .pr-cierre{max-width:30em;margin:clamp(40px,5vw,64px) 0 0;text-align:left;font:400 clamp(1.6rem,2.8vw,2.7rem)/1.12 var(--f-tit);text-transform:uppercase;color:var(--texto)}
    .pr-cierre::before{content:"";display:block;width:56px;height:56px;margin-bottom:18px;background:var(--pri);${MASCARA('var(--ast)')}}
  `,
  lista: css`
    .pr-l{gap:0;max-width:none;border-top:1px solid var(--linea);counter-reset:ew-pr}
    .pr-li{position:relative;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:16px;padding:22px 0;background:none;border:0;border-bottom:1px solid var(--linea);border-radius:0;
      font:600 clamp(1.05rem,1.6vw,1.45rem)/1.35 var(--f-txt);letter-spacing:-.012em;counter-increment:ew-pr}
    @media (min-width:760px){.pr-li{grid-template-columns:56px 28px minmax(0,1fr)}
      .pr-li::before{content:counter(ew-pr,decimal-leading-zero);content:counter(ew-pr,decimal-leading-zero) / "";${MONO('.7rem')};color:var(--tenue)}}
  `,
  tarjetas: css`
    .pr-g{gap:14px}
    .pr-tj{background:transparent;border:1px dashed var(--linea-2);gap:18px;padding:clamp(22px,2.6vw,30px)}
    .pr-tj p{font:600 clamp(1.05rem,1.4vw,1.25rem)/1.4 var(--f-txt);color:var(--texto)}
  `,
};

S.mecanismo = {
  base: css`
    .s-mecanismo p{color:var(--suave)}
    .me-n{width:auto;height:auto;border-radius:0;background:none;color:var(--pri);font:400 clamp(4.5rem,8vw,7.5rem)/.8 var(--f-tit);place-items:start}
  `,
  pasos: css`
    .me-f{gap:clamp(24px,3vw,40px);counter-reset:ew-me}
    @media (min-width:820px){.me-f{grid-template-columns:repeat(auto-fit,minmax(0,1fr))}}
    .me-f .me-p{position:relative;gap:20px;padding-top:24px;border-top:2px solid var(--pri)}
    .me-f .me-p::before{content:"";position:absolute;top:-7px;left:0;width:12px;height:12px;border-radius:50%;background:var(--pri)}
    .me-f .me-p:not(:last-child)::after{content:none}
    .me-f .h3{font:400 clamp(1.6rem,2.2vw,2.2rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
  `,
  linea: css`
    .me-l{max-width:900px;margin-inline:0}
    .me-l .me-p{grid-template-columns:clamp(84px,10vw,128px) minmax(0,1fr);gap:clamp(16px,3vw,40px);padding-bottom:clamp(30px,4vw,48px)}
    .me-l .me-p:not(:last-child)::before{left:calc(clamp(84px,10vw,128px)/2 - 1px);top:clamp(80px,8vw,110px);width:2px;background:linear-gradient(var(--pri),transparent)}
    .me-l .me-n{justify-self:center}
    .me-l .h3{font:400 clamp(1.6rem,2.4vw,2.4rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;margin-top:.15em}
  `,
};

S.urgencia = {
  base: css`
    /* bloque del primario: marquesina de tinta arriba, palabras que se encienden y cifras que ruedan */
    .s-urgencia{${PRI};overflow:hidden;padding-top:clamp(120px,14vw,200px)}
    .ew-cinta-u{position:absolute;top:0;left:0;right:0;padding:12px 0;background:var(--tinta);color:var(--pri);font:400 clamp(1.1rem,1.9vw,1.75rem)/1 var(--f-tit);text-transform:uppercase;letter-spacing:.02em}
    .ur{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(48px,7vw,104px);align-items:start}
    @media (min-width:900px){.ur{grid-template-columns:minmax(0,1fr);gap:clamp(48px,7vw,104px)}}
    .ur .cab{margin:0;max-width:1180px}
    .s-urgencia .h2{font-size:clamp(2.6rem,7.4vw,7.6rem);line-height:1.08}
    .s-urgencia .h2.h2-l{font-size:clamp(2.3rem,5.6vw,5.8rem)}
    .s-urgencia .lead,.ur-t{color:var(--tinta);font-weight:500;max-width:46ch}
    .ur-t{margin:22px 0 0;padding:0;border:0;font-size:clamp(1.03rem,1.35vw,1.25rem);line-height:1.5}
    @media (min-width:900px){.ur>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.62fr);column-gap:56px;align-items:end}
      .ur>div>.cab{grid-column:1/-1}.ur>div>.ur-t{grid-column:2}.ur>div>.sec-acc{grid-column:1;grid-row:2;margin-top:22px}}
    .ur-c{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:0;border-top:2px solid var(--tinta);padding-top:18px}
    .ur-c li{display:flex;flex-direction:column;gap:8px;padding:0 clamp(4px,1.4vw,22px) 20px;background:none;border:0;border-left:2px solid var(--tinta);border-radius:0}
    .ur-c li:first-child{border-left:0;padding-left:0}
    @media (max-width:619px){.ur-c li{border-left:0;padding:16px 0;border-top:2px solid var(--tinta)}.ur-c li:first-child{border-top:0;padding-top:0}}
    .ur-c strong,.ur-c .ew-odo{font:400 clamp(4rem,11vw,10rem)/1 var(--f-tit);color:var(--tinta);letter-spacing:-.01em}
    .ur-c li>span{${MONO('.7rem')};color:var(--tinta);max-width:28ch}
    .ur-c strong span{font:inherit;color:inherit;letter-spacing:inherit}
  `,
  frase: css`
    /* la frase de póster: a la izquierda, en mayúsculas gigantes */
    .ur-fr{align-items:flex-start;text-align:left}
    .ur-fr .ur-t{margin:clamp(28px,4vw,48px) 0 0;max-width:22ch;font:400 clamp(1.9rem,4.4vw,4rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;color:var(--tinta)}
    .ur-fr .ur-c{margin-top:clamp(36px,5vw,64px);max-width:none}
  `,
};

S.comparacion = {
  base: css`
    .s-comparacion{${PAPEL}}
    .s-comparacion .ic{width:28px;height:28px;padding:6px;margin:0;border-radius:50%;flex:none}
  `,
  tabla: css`
    .co-t{max-width:none;border:0;border-radius:0;overflow:visible;border-top:1px solid var(--linea);counter-reset:ew-co}
    .co-f{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:22px 0;border-bottom:1px solid var(--linea)}
    .co-f:not(.co-cab){counter-increment:ew-co}
    .co-f>div{display:flex;gap:14px;align-items:flex-start;padding:0;border:0;background:none}
    .co-t .co-a{order:-1;font:600 clamp(1.08rem,1.75vw,1.6rem)/1.25 var(--f-txt);letter-spacing:-.012em;color:var(--tinta);background:none}
    .co-t .co-b{color:var(--suave);font-size:clamp(.95rem,1.2vw,1.12rem);line-height:1.4}
    .co-t .co-a .ic{background:var(--tinta);color:var(--pri);stroke-width:3}
    .co-t .co-b .ic{border:1px solid var(--linea-2);color:var(--suave)}
    /* lo de la alternativa se tacha (con JS: la raya se dibuja al llegar) */
    .co-f:not(.co-cab) .co-b>span{background:linear-gradient(currentColor,currentColor) no-repeat 0 58%/100% 1.5px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
    .ew-mv .co-f.ew-rv .co-b>span{background-size:0 1.5px;transition:background-size 1s var(--ease) .35s}
    .ew-mv .co-f.ew-rv.ew-visto .co-b>span{background-size:100% 1.5px}
    .co-f::after{content:"";position:absolute;left:0;top:-1px;height:1px;width:100%;background:var(--tinta);transform:scaleX(0);transform-origin:0;transition:transform .8s var(--ease)}
    .co-f:hover::after{transform:scaleX(1)}
    .co-cab{padding:0 0 18px;gap:10px;grid-template-columns:none;display:flex;flex-wrap:wrap}
    .co-cab>div{${MONO('.68rem')};letter-spacing:.14em;padding:9px 14px;border-radius:99px;font-family:var(--f-mono);font-size:.68rem}
    .co-cab .co-a{order:-1;background:var(--tinta);color:var(--pri);font-family:var(--f-mono);font-size:.68rem}
    .co-cab .co-b{border:1px solid var(--linea-2);color:var(--suave);font-size:.68rem;line-height:1.35}
    @media (min-width:900px){
      .co-f{grid-template-columns:56px minmax(0,1.15fr) minmax(0,1fr);gap:28px;align-items:center;padding:26px 0}
      .co-f::before{order:-2;content:counter(ew-co,decimal-leading-zero);content:counter(ew-co,decimal-leading-zero) / "";${MONO('.72rem')};color:var(--suave)}
      .co-cab{display:grid;grid-template-columns:56px minmax(0,1.15fr) minmax(0,1fr);gap:28px;padding:0 0 18px}
      .co-cab::before{content:"";order:-2}.co-cab>div{justify-self:start}}
  `,
  tarjetas: css`
    .co-2{gap:14px;max-width:none}
    .co-col{border-radius:var(--r-v);padding:clamp(24px,3vw,40px)}
    .co-col ul{gap:16px}
    .co-col li{gap:14px;align-items:flex-start;line-height:1.45}
    .co-h{font:400 clamp(1.6rem,2.4vw,2.4rem)/1.05 var(--f-tit);text-transform:uppercase;margin:0 0 22px}
    .co-2 .co-b{background:transparent;border:1px dashed var(--linea-2);color:var(--suave)}
    .co-2 .co-b .ic{border:1px solid var(--linea-2);color:var(--suave)}
    .co-2 .co-b li>span{background:linear-gradient(currentColor,currentColor) no-repeat 0 58%/100% 1.5px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
    .ew-mv .co-2 .co-b.ew-rv li>span{background-size:0 1.5px;transition:background-size 1s var(--ease) .35s}
    .ew-mv .co-2 .co-b.ew-rv.ew-visto li>span{background-size:100% 1.5px}
    .co-2 .co-a{${TINTA};border:0;font-weight:600}
    .co-2 .co-a .ic{background:var(--pri);color:var(--sobre-pri);stroke-width:3}
  `,
};

S.para_quien = {
  base: css`
    .pq{display:block;max-width:none}
    .pq-col{background:none;border:0;padding:0;border-radius:0}
    .pq-h{font:400 clamp(1.5rem,2.6vw,2.4rem)/1 var(--f-tit);text-transform:uppercase;margin:0 0 6px}
    /* "es para ti si…": tarjetas de color en carrusel 3D (sin JS, una cuadrícula) */
    .pq-si{position:relative;display:flex;flex-direction:column;--halo:var(--pri)}
    .pq-si::before{content:"";position:absolute;left:50%;top:52%;width:min(1100px,140vw);height:min(640px,110vw);transform:translate(-50%,-50%);background:var(--halo);
      -webkit-mask:radial-gradient(closest-side,#000,transparent);mask:radial-gradient(closest-side,#000,transparent);opacity:.22;pointer-events:none}
    .pq-si .pq-h{position:relative;color:var(--pri)}
    .pq-si ul{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));gap:14px;margin-top:24px;counter-reset:ew-pq}
    .pq-si li{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:14px;min-height:clamp(320px,32vw,440px);padding:clamp(22px,2.4vw,32px);
      border-radius:var(--r-v);counter-increment:ew-pq;transition:transform .7s var(--ease),opacity .7s}
    .pq-si li:nth-child(3n+1){${PRI}}.pq-si li:nth-child(3n+2){${CHOQUE}}.pq-si li:nth-child(3n+3){${PAPEL}}
    .pq-si li::before{content:"[ " counter(ew-pq,decimal-leading-zero) " ]";content:"[ " counter(ew-pq,decimal-leading-zero) " ]" / "";${MONO('.68rem')}}
    .pq-si li>.ic{width:clamp(44px,4vw,60px);height:clamp(44px,4vw,60px);margin:0;padding:0;color:var(--tinta);background:var(--tinta);${MASCARA('var(--ast)')}}
    .pq-si li>span{margin-top:auto;font:600 clamp(1.15rem,1.6vw,1.45rem)/1.3 var(--f-txt);letter-spacing:-.012em;color:var(--tinta)}
    .pq-si .ew-car{order:3;margin-top:4px}
    .ew-mv .pq-si ul{--w:min(78vw,400px);display:flex;gap:clamp(12px,2vw,30px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;
      margin-inline:calc(-1*var(--m));padding:34px calc(50% - var(--w)/2) 50px;perspective:1300px;outline-offset:-4px}
    .ew-mv .pq-si ul::-webkit-scrollbar{display:none}
    .ew-mv .pq-si li{flex:0 0 var(--w);scroll-snap-align:center}
    .ew-mv .pq-si ul.ew-arrastre{scroll-snap-type:none;cursor:grabbing;user-select:none}
    @supports (animation-timeline:view()){@media (prefers-reduced-motion:no-preference){
      .ew-mv .pq-si li{animation:ew-giro linear both;animation-timeline:view(inline);animation-range:cover calc(50% - var(--w)) cover calc(50% + var(--w))}}}
    @keyframes ew-giro{0%{transform:rotateY(38deg) scale(.82);opacity:.55}50%{transform:none;opacity:1}100%{transform:rotateY(-38deg) scale(.82);opacity:.55}}
    /* "no es para ti si…": tarjetas de línea punteada */
    .pq-no{margin-top:clamp(48px,7vw,96px)}
    .pq-no .pq-h{color:var(--tenue);margin-bottom:18px}
    .pq-no ul{display:grid;gap:10px}
    @media (min-width:760px){.pq-no ul{grid-template-columns:repeat(3,minmax(0,1fr))}}
    .pq-no li{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border:1px dashed var(--linea-2);border-radius:14px;color:var(--suave);font-size:1rem;line-height:1.45}
    .pq-no .ic{width:28px;height:28px;padding:6px;margin:0;border-radius:50%;border:1px solid var(--linea-2);color:var(--tenue);flex:none}
  `,
};

S.experto = {
  base: css`
    /* bloque "choque": el nombre gigante en dos filas detrás de la foto, que se abren en sentido contrario al bajar */
    .s-experto{${CHOQUE};overflow:hidden;isolation:isolate;padding-bottom:clamp(56px,7vw,110px)}
    .s-experto>.w{position:relative;z-index:1}
    .ew-nombre{position:absolute;z-index:0;left:0;right:0;top:clamp(76px,11vw,168px);margin:0;font-family:var(--f-tit);text-transform:uppercase;line-height:.8;text-align:center;
      white-space:nowrap;pointer-events:none;user-select:none;color:var(--tinta)}
    .ew-nombre>span{display:block;font-size:min(var(--tope,560px),calc(170vw / var(--n,6)))}
    .ew-nombre>.ew-n1{transform:translate3d(calc((var(--p,.5) - .5)*-16vw),0,0)}
    .ew-nombre>.ew-n2{margin-top:.04em;font-size:min(calc(var(--tope,560px)*.62),calc(160vw / var(--n,9)));-webkit-text-stroke:2px var(--tinta);transform:translate3d(calc((var(--p,.5) - .5)*16vw),0,0)}
    .ew-mv .ew-nombre>.ew-n2{color:transparent}
    .ex-r{${MONO('.72rem')};letter-spacing:.12em;line-height:1.6;color:var(--suave);margin:14px 0 0}
    .ex-b{color:var(--suave);font-size:1.05rem;line-height:1.55;margin-top:18px;max-width:52ch}
    .ex-l{margin-top:26px;gap:1px;background:var(--linea);border:1px solid var(--linea);border-radius:18px;overflow:hidden}
    .ex-l li{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:16px;padding:14px 18px;background:var(--tinta);font-size:.95rem;line-height:1.4;color:var(--suave)}
    .ex-l .ic{width:22px;height:22px;margin:0;padding:0;color:var(--pri);background:var(--pri);${MASCARA('var(--ast)')}}
    .ex-l .ew-cifra{display:inline-flex;align-items:baseline;white-space:nowrap;font:400 clamp(2.2rem,3.2vw,3.1rem)/1 var(--f-tit);color:var(--pri);margin-right:.25em;vertical-align:middle}
    .s-experto .h2{font-size:clamp(2.5rem,4.6vw,4.4rem);line-height:1.05}
  `,
  lado: css`
    .ex-d{position:relative;gap:0;align-items:start;grid-template-columns:minmax(0,1fr)}
    .ex-f{position:relative;z-index:1;justify-self:center;width:min(78vw,520px)}
    /* con JS, lugar arriba para el nombre gigante (sin JS y en edición no hay nombre: la foto va arriba) */
    .ew-mv .ex-f{margin-top:clamp(84px,24vw,230px)}
    .ex-f img{display:block;border:0;border-radius:var(--r-v);aspect-ratio:4/5;object-fit:cover;box-shadow:14px 14px 0 var(--tinta);filter:saturate(1.05) contrast(1.05)}
    /* la tarjeta de tinta con el nombre, el rol, la historia y los logros */
    .ex-d>div:last-child{position:relative;z-index:2;margin:-80px calc(var(--m)*-1) 0;padding:clamp(24px,3vw,44px) var(--m) clamp(28px,3.4vw,52px);border-radius:var(--r-v);${TINTA}}
    .ex-d>div:only-child{margin-top:0}.ew-mv .ex-d>div:only-child{margin-top:clamp(140px,30vw,300px)}
    .ex-d>div:last-child .ex-r{color:var(--choque)}
    @media (min-width:900px){.ex-f{width:min(42vw,560px)}
      .ex-d>div:last-child{margin:-120px 0 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);column-gap:clamp(28px,4vw,64px);align-items:start}
      .ex-d>div:last-child>.ey,.ex-d>div:last-child>.h2,.ex-d>div:last-child>.ex-r{grid-column:1}
      .ex-d>div:last-child>.ex-b,.ex-d>div:last-child>.ex-l{grid-column:2}
      .ex-d>div:last-child>.ex-b{grid-row:1/span 3;margin-top:0}
      .ex-d>div:last-child>.ex-l{grid-row:4/span 2;margin-top:20px}
      .ex-d>div:only-child{margin-top:0}.ew-mv .ex-d>div:only-child{margin-top:clamp(200px,24vw,330px)}}
  `,
  centrado: css`
    .ex-c{position:relative;max-width:none;align-items:center;text-align:center}
    .ex-fc{position:relative;z-index:1;margin:0 0 24px;padding:0;border-radius:50%}
    .ew-mv .ex-fc{margin-top:clamp(84px,22vw,220px)}
    .ex-fc img{width:clamp(180px,26vw,300px);height:clamp(180px,26vw,300px);border:4px solid var(--tinta);box-shadow:12px 12px 0 var(--tinta);margin:0}
    .ex-c .ex-b{margin-inline:auto}
    .ex-c .ex-l{text-align:left;width:min(100%,640px);${TINTA};background:var(--linea)}
  `,
};

S.testimonios = {
  base: css`
    .te{position:relative;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-v);padding:clamp(22px,2.6vw,32px);gap:18px;overflow:hidden}
    .te:not(.te-pc)::before{content:"";position:absolute;right:clamp(20px,2.4vw,30px);top:clamp(20px,2.4vw,30px);width:34px;height:34px;background:var(--pri);pointer-events:none;${MASCARA('var(--ast)')}}
    .te-e{color:var(--pri);gap:3px}
    .te blockquote{position:relative}
    .te blockquote p{font-size:1.05rem;line-height:1.55}
    .te figcaption strong{${MONO('.72rem')};letter-spacing:.14em}
    .te figcaption small{color:var(--tenue);font-size:.88rem}
    .te-f img{width:46px;height:46px;box-shadow:0 0 0 2px var(--pri)}
    .te-pc{background:none;border:1px dashed var(--linea-2);color:var(--suave)}
  `,
  tarjetas: css`
    .te-m .te:not(.te-pc):nth-child(3n+2){${PAPEL};border:0}
    .te-m .te:nth-child(3n+2)::before{background:var(--tinta)}
    .te-m .te:nth-child(3n+2) .te-e{color:var(--tinta)}
    .te-m .te:nth-child(3n+2) .te-f img{box-shadow:0 0 0 2px var(--tinta)}
  `,
  destacado: css`
    .te-g{${PRI};border:0;padding:clamp(28px,4.4vw,64px)}
    .te-g::before{background:var(--tinta)!important}
    .te-g .te-e{color:var(--tinta)}
    .te-g blockquote p{font:600 clamp(1.35rem,2.5vw,2.2rem)/1.3 var(--f-txt);letter-spacing:-.015em;max-width:40ch}
    .te-g .te-f img{box-shadow:0 0 0 2px var(--tinta)}
  `,
};

S.cifras = {
  base: css`
    .s-cifras{padding-block:clamp(56px,7vw,104px)}
    .ci-ey{text-align:left}
    .ci{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;background:none;border:0;border-top:2px solid var(--pri);border-radius:0;overflow:visible}
    .ci li{background:none;padding:18px 14px 22px;text-align:left;gap:10px;align-content:start}
    .ci li:nth-child(odd){padding-left:0}
    .ci li:nth-child(even){border-left:1px solid var(--linea-2)}
    .ci li:nth-child(n+3){border-top:1px solid var(--linea)}
    .ci li:last-child:nth-child(odd){grid-column:1/-1}
    .ci strong,.ci .ew-odo{font:400 clamp(3.4rem,7vw,7rem)/1 var(--f-tit);color:var(--pri);letter-spacing:-.01em}
    .ci li>span{${MONO('.68rem')};color:var(--suave);max-width:22ch}
    .ci strong span{font:inherit;color:inherit;letter-spacing:inherit}
    @media (min-width:900px){
      .ci{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr)}
      .ci li,.ci li:nth-child(n){padding:22px 28px 6px;border-top:0;border-left:1px solid var(--linea-2);grid-column:auto}
      .ci li:first-child{border-left:0;padding-left:0}}
  `,
};

S.temario = {
  base: css`
    .tm-n{${MONO('.7rem')};color:var(--tenue);letter-spacing:.12em;transition:color .35s}
  `,
  acordeon: css`
    .s-temario .acor{max-width:none}
    .s-temario .acor summary{grid-template-columns:44px minmax(0,1fr) 38px}
    .acor summary .tm-n{min-width:0}
  `,
  lista: css`
    .tm-l{gap:14px}
    .tm-l li{position:relative;padding:clamp(22px,2.6vw,32px);border-top:3px solid var(--pri)}
    .tm-l li:nth-child(3n+2){border-top-color:var(--choque)}.tm-l li:nth-child(3n+3){border-top-color:var(--papel)}
    .tm-l .h3{font:400 clamp(1.5rem,2.1vw,2rem)/1.1 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;margin-top:.5em}
    .tm-l p{color:var(--suave)}
  `,
};

S.oferta = {
  base: css`
    .of-l{gap:0}
    .of-l li{padding:14px 0;border-bottom:1px solid var(--linea);align-items:center;gap:14px;font-weight:500}
    .of-l .ic{width:26px;height:26px;padding:5px;margin:0;border-radius:50%;background:var(--tinta);color:var(--pri);stroke-width:3;flex:none}
    .of-v{${MONO('.7rem')};color:var(--suave)}
    .of-p{align-items:flex-start;text-align:left}
    .of-total{${MONO('.72rem')};color:var(--suave)}
    .of-antes{color:var(--suave);font:400 clamp(1.4rem,2.4vw,2rem)/1 var(--f-tit);margin-top:10px;text-decoration-thickness:3px}
    .of-precio{font:400 clamp(4.4rem,11vw,9rem)/.95 var(--f-tit);letter-spacing:0;margin-top:6px}
    .of-det{${MONO('.72rem')};color:var(--suave);margin-top:10px}
    .of-p .acc{align-items:stretch;width:100%}.of-p .acc .btn{width:100%;max-width:none}
    .of-seg{${MONO('.66rem')};color:var(--suave)}
  `,
  tarjeta: css`
    .of-card{${PAPEL};max-width:760px;margin-inline:0;border:0;border-radius:var(--r-v);padding:clamp(26px,4vw,56px);gap:clamp(24px,3vw,40px);box-shadow:0 40px 120px -50px color-mix(in srgb,var(--pri) 55%,transparent)}
    @media (min-width:900px){.of-card{max-width:none;grid-template-columns:minmax(0,1fr) minmax(0,.85fr);align-items:end}}
  `,
  dividida: css`
    .of-d{max-width:none;gap:clamp(24px,4vw,56px);align-items:stretch}
    @media (min-width:880px){.of-d{grid-template-columns:minmax(0,1fr) minmax(0,.9fr)}}
    .of-inc .of-l li{border-color:var(--linea)}
    .of-inc .of-l .ic{background:var(--pri);color:var(--sobre-pri)}
    .of-d .of-p{${PRI};border:0;border-radius:var(--r-v);padding:clamp(26px,3.4vw,48px);box-shadow:none;justify-content:flex-end}
  `,
};

S.bonos = {
  base: css`
    .bo{gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))}
    .bo-tj{position:relative;overflow:hidden;isolation:isolate;border:0;padding:clamp(22px,2.4vw,30px);gap:10px;min-height:340px}
    ${RUEDA('.bo-tj')}
    .bo-i{width:64px;height:64px;margin-bottom:auto;border-radius:50%;background:var(--tinta);color:var(--pri)}
    .bo-tj:nth-child(4n+4) .bo-i{background:var(--pri);color:var(--sobre-pri)}
    .bo-i .ic{width:30px;height:30px}
    .bo-f{margin:calc(clamp(22px,2.4vw,30px)*-1) calc(clamp(22px,2.4vw,30px)*-1) 14px}
    .bo-f img{border-radius:0;margin:0;aspect-ratio:16/10}
    .bo-n{${MONO('.68rem')};color:var(--suave);margin-top:18px}
    .bo-tj .h3{font:400 clamp(1.6rem,2.2vw,2.2rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .bo-tj p{color:var(--suave)}
    .bo-v{align-self:flex-start;margin-top:auto!important;padding:8px 14px!important;border-radius:99px;background:var(--tinta);color:var(--pri)!important;${MONO('.7rem')}}
    .bo-tj:nth-child(4n+4) .bo-v{background:var(--pri);color:var(--sobre-pri)!important}
  `,
  fotos: css`
    .bo-fs{gap:14px}
    .bo-ft{position:relative;border:0;border-radius:var(--r-v)}
    ${RUEDA('.bo-ft')}
    .bo-ff::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,color-mix(in srgb,var(--pri) 80%,transparent),transparent 55%);mix-blend-mode:color}
    .bo-et{z-index:1;${TINTA};${MONO('.66rem')};border-radius:99px}
    .bo-ft>.bo-et{margin:22px 22px 0}
    .bo-fc{padding:clamp(22px,2.4vw,30px)}
    .bo-fc .h3{font:400 clamp(1.6rem,2.2vw,2.2rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .bo-fc p{color:var(--suave)}
  `,
};

S.garantia = {
  base: css`
    .ga{${PAPEL};width:calc(100% - 2*var(--m));max-width:calc(1440px - 2*var(--m));margin-inline:auto;border:0;border-radius:var(--r-v);padding:clamp(28px,4.4vw,64px);gap:clamp(24px,4vw,56px)}
    @media (min-width:680px){.ga{grid-template-columns:auto minmax(0,1fr)}}
    .ga-s{width:clamp(150px,16vw,210px);height:clamp(150px,16vw,210px);color:var(--tinta);margin-inline:0}
    @media (prefers-reduced-motion:no-preference){.ew-mv .ga-s>svg{animation:ew-gira-g 24s linear infinite}}
    @keyframes ew-gira-g{to{transform:rotate(360deg)}}
    .ga-s span{${MONO('.66rem')};color:var(--tinta)}
    .ga-s strong{font:400 clamp(3.6rem,6vw,5.4rem)/.9 var(--f-tit);letter-spacing:0;color:var(--tinta)}
    .ga-s .ga-ic{color:var(--tinta)}
    .ga-t{font:400 clamp(2rem,4vw,3.8rem)/1.05 var(--f-tit);text-transform:uppercase}
    .ga-x{color:var(--suave);font-size:1.05rem;max-width:58ch}
  `,
};

S.faq = {
  acordeon: css`
    .fq{display:grid;gap:36px}
    .fq .cab{margin:0}
    .fq .h2{font-size:clamp(2.3rem,4.6vw,5rem)}.fq .h2.h2-l{font-size:clamp(2.1rem,3.8vw,4rem)}
    .fq .acor{max-width:none;width:100%;margin:0;counter-reset:ew-fq}
    .fq .acor summary{grid-template-columns:34px minmax(0,1fr) 38px}
    .fq .acor summary::before{counter-increment:ew-fq;content:counter(ew-fq,decimal-leading-zero);content:counter(ew-fq,decimal-leading-zero) / "";${MONO('.68rem')};color:var(--tenue);transition:color .35s}
    .fq .acor details>p{padding-left:54px}
    @media (min-width:900px){.fq{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:64px;align-items:start}.ew-mv .fq .cab{position:sticky;top:48px}}
    @media (max-width:620px){.fq .acor details>p{padding-left:10px}}
  `,
  columnas: css`
    .fq-c{gap:0 56px;counter-reset:ew-fq}
    .fq-c>div{position:relative;padding:24px 0 24px 46px;border-top:1px solid var(--linea);counter-increment:ew-fq}
    .fq-c>div::before{content:counter(ew-fq,decimal-leading-zero);content:counter(ew-fq,decimal-leading-zero) / "";position:absolute;left:0;top:28px;${MONO('.68rem')};color:var(--tenue)}
    .fq-c dt{font:600 clamp(1.08rem,1.5vw,1.3rem)/1.3 var(--f-txt);letter-spacing:-.012em;margin-bottom:8px}
    .fq-c dd{color:var(--suave);line-height:1.55}
  `,
};

S.servicios = {
  base: css`
    .sv-pr{font-family:var(--f-tit);font-weight:400;color:var(--pri)!important;letter-spacing:.01em}
  `,
  tarjetas: css`
    .sv-g{gap:14px}
    .sv-tj{position:relative;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r-v);transition:transform .5s var(--ease),border-color .3s}
    .sv-tj:hover{transform:translateY(-4px);border-color:var(--pri)}
    .sv-f{position:relative;overflow:hidden}
    .sv-f img{transition:transform .8s var(--ease),filter .5s}
    .sv-tj:hover .sv-f img{transform:scale(1.04)}
    .sv-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,color-mix(in srgb,var(--pri) 80%,transparent),transparent 55%);mix-blend-mode:color}
    .sv-c{padding:22px 24px 26px;gap:8px}
    .sv-c .h3{font:400 clamp(1.5rem,2vw,2rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .sv-c .sv-pr{align-self:flex-start;margin-top:auto;padding:8px 16px;border-radius:99px;background:var(--pri);color:var(--sobre-pri)!important;font-size:1.25rem;line-height:1}
    .sv-c .sv-pr{margin-top:18px}
  `,
  precios: css`
    .sv-p{gap:0;max-width:none;border-top:2px solid var(--pri)}
    .sv-p li{padding:22px 0;border-bottom:1px solid var(--linea)}
    .sv-pt{gap:14px}
    .sv-pt .h3{font:400 clamp(1.5rem,2.6vw,2.6rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .sv-pd{border-bottom:2px dotted var(--linea-2);transform:translateY(-.35em)}
    .sv-p .sv-pr{font-size:clamp(1.5rem,2.6vw,2.6rem);line-height:1.05}
    .sv-p p{max-width:60ch}
  `,
};

S.galeria = {
  base: css`
    .s-galeria figure{border-radius:var(--r-v);background:var(--sup2)}
    .s-galeria img{transition:transform .8s var(--ease)}
    .s-galeria figure:hover img{transform:scale(1.04)}
    .s-galeria figcaption{left:12px;right:auto;bottom:12px;max-width:calc(100% - 24px);padding:7px 12px;border-radius:99px;background:var(--pri);color:var(--sobre-pri);${MONO('.64rem')};letter-spacing:.12em}
  `,
  cuadricula: css`.ga-c{gap:10px}@media (min-width:820px){.ga-c{gap:14px}}`,
  mosaico: css`.ga-m{gap:10px}@media (min-width:820px){.ga-m{gap:14px}}`,
};

S.ubicacion = {
  base: css`
    .ub{gap:0;max-width:none;border:0;background:none;border-radius:var(--r-v);overflow:hidden}
    @media (min-width:760px){.ub{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}.ub.ub-1{max-width:760px}}
    .ub>div{padding:clamp(26px,3.4vw,48px);gap:18px}
    .ub>.ub-d{${PRI}}
    .ub>.ub-hh{background:var(--sup);box-shadow:inset 0 0 0 1px var(--linea);border-radius:0 0 var(--r-v) var(--r-v)}
    @media (min-width:760px){.ub>.ub-hh{border-radius:0 var(--r-v) var(--r-v) 0}}
    .ub.ub-1>div{border-radius:var(--r-v)}
    .ub-i{width:30px;height:30px;color:var(--acento)}
    .ub-hh .ub-i{color:var(--pri)}
    .ub-dir{font:400 clamp(1.8rem,3.2vw,3rem)/1.05 var(--f-tit);text-transform:uppercase}
    .ub-ref{color:var(--suave);font-weight:500}
    .ub .btn-sec{margin-top:22px;border-color:var(--tinta);color:var(--tinta)}
    .ub .btn-sec .ic{color:var(--tinta)}
    .ub-h div{border-bottom:1px solid var(--linea);padding-bottom:10px}
    .ub-h dt{${MONO('.7rem')};align-self:center}
    .ub-h dd{color:var(--texto);font-weight:600}
  `,
};

S.video = {
  base: css`
    .vi{max-width:1120px;align-items:flex-start}
    .vi .vid{width:100%;margin-top:4px;border:2px solid var(--pri)}
    .vi .acc{align-items:flex-start}
  `,
};

S.gracias = {
  base: css`
    .s-gracias{isolation:isolate;padding-block:clamp(40px,6vw,96px) clamp(76px,9vw,140px);
      background:radial-gradient(48% 58% at 80% 30%,color-mix(in srgb,var(--pri) 18%,transparent),transparent 72%),var(--fondo)}
    .s-gracias::before{content:"";position:absolute;inset:0;z-index:-2;background:${LEDS()};pointer-events:none;transition:opacity 1.4s;
      -webkit-mask:radial-gradient(70% 80% at 80% 30%,#000 8%,transparent 74%);mask:radial-gradient(70% 80% at 80% 30%,#000 8%,transparent 74%)}
    .s-gracias.ew-gl::before{opacity:0}
    .s-gracias>.w{position:relative;z-index:1}
    .gr{max-width:1100px;margin-inline:0;align-items:flex-start;text-align:left}
    .gr .lead{margin-inline:0}
    .gr .evento{justify-content:flex-start}
    .gr-ok{width:84px;height:84px;margin-bottom:24px;background:var(--pri);color:var(--sobre-pri);box-shadow:0 0 0 12px color-mix(in srgb,var(--pri) 18%,transparent)}
    .gr-ok .ic{width:38px;height:38px;stroke-width:2.6}
    .gr .ey{margin-bottom:0}
    .gr .h1{margin-top:16px}
    .gr-acc{justify-content:flex-start}
    .gr-acc .btn{padding:8px 26px 8px 8px;gap:14px}
    .gr-acc .btn .ic{width:44px;height:44px;padding:11px;border-radius:50%;background:var(--sobre-pri);color:var(--pri);flex:none}
    .gr-cal{justify-content:flex-start}
    .gr-p{margin-top:clamp(40px,5vw,64px);gap:14px;counter-reset:ew-gr}
    @media (min-width:860px){.gr-p{grid-template-columns:repeat(auto-fit,minmax(0,1fr))}}
    .gr-p li{position:relative;flex-direction:column;gap:18px;padding:clamp(22px,2.4vw,30px);border:0;border-radius:var(--r-v);min-height:220px}
    .gr-p li:nth-child(3n+1){${PRI}}.gr-p li:nth-child(3n+2){${PAPEL}}.gr-p li:nth-child(3n+3){${CHOQUE}}
    .gr-n{width:auto;height:auto;border-radius:0;background:none;color:var(--tinta);font:400 clamp(3rem,5vw,4.4rem)/.85 var(--f-tit);place-items:start}
    .gr-p .h3{font:400 clamp(1.5rem,2vw,2rem)/1.08 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .gr-p p{color:var(--suave)}
    .s-gracias .ew-dato{right:var(--m);top:-2%;align-items:flex-end;--dato:clamp(120px,12vw,210px);opacity:.9}
    @media (max-width:899px){.ew-mv .s-gracias .ew-dato{display:none}}
  `,
};

S.pie = {
  base: css`
    /* el telón: el primario con la marca enorme */
    .s-pie{${PRI};border-top:0;padding-block:clamp(56px,7vw,100px) calc(26px + env(safe-area-inset-bottom))}
    @media (min-width:900px){.s-pie{min-height:min(80svh,720px);display:flex;align-items:flex-end}.s-pie>.w{width:100%}}
    .pie{justify-items:stretch;text-align:left;gap:0;color:var(--tinta);font-size:.92rem}
    .pie-m{display:flex;flex-direction:column-reverse;gap:clamp(28px,4vw,52px);${MONO('.68rem')};color:var(--tinta)}
    .pie-m>span{display:block;font:400 var(--tam,min(clamp(4.2rem,23vw,20.6rem),calc(175vw / var(--l,9)),18vh))/.9 var(--f-tit);text-transform:uppercase;letter-spacing:-.005em;
      color:var(--tinta);caret-color:var(--tinta);overflow-wrap:anywhere;text-wrap:balance;padding-top:.04em}
    @media (prefers-reduced-motion:no-preference){.ew-mv .pie-m>span{transition:transform 1.1s var(--ease)}.ew-mv:not(.ew-telon):not(.ew-sin-telon) .pie-m>span{transform:translate3d(0,30%,0)}}
    .pie-l{justify-content:flex-start;gap:8px 28px;margin-top:clamp(28px,4vw,48px);padding-top:16px;border-top:2px solid var(--tinta)}
    .pie-l a{color:var(--tinta);${MONO('.68rem')}}
    .pie .pie-x{margin-top:18px;max-width:72ch;color:var(--suave);font-size:.86rem;line-height:1.5}
  `,
};

// ---------- las secciones de una página de evento (7-oct) ----------

S.niveles = {
  base: css`
    /* las entradas como bloques de póster: la primera negra, la destacada del primario y la última en papel */
    .nv-ct{align-items:flex-start;text-align:left}
    .nv-ct .nv-etapa{border:0;background:var(--pri);color:var(--sobre-pri);${MONO('.68rem')}}
    .nv-ct-t{${MONO('.72rem')};color:var(--texto)}
    .nv-ct-g{gap:8px;max-width:520px}
    .nv-cc{background:var(--sup2);border:0;border-radius:18px;padding:14px 4px 10px}
    .nv-cc .ct-n,.nv-cc .ew-odo{font:400 clamp(2.4rem,6vw,3.8rem)/1 var(--f-tit);color:var(--texto)}
    .nv-cl{${MONO('.6rem')};color:var(--tenue)}
    .nv{gap:14px}
    @media (min-width:1000px){.nv-3{grid-template-columns:repeat(3,minmax(0,1fr))}.nv-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    .nv-tj{border:0;border-radius:var(--r-v);padding:clamp(28px,3vw,40px) clamp(20px,2.4vw,30px) clamp(22px,2.4vw,30px);${NEGRA}}
    .nv-dest{${PRI}}
    :is(.nv-3,.nv-4)>.nv-tj:last-child:not(.nv-dest){${PAPEL}}
    .nv-eti{${CHOQUE};${MONO('.66rem')};border-radius:99px;z-index:2}
    .nv-cab{align-items:flex-start;text-align:left;border-bottom:2px solid var(--linea-2)}
    .nv-nom{${MONO('.74rem')};color:var(--texto)}
    .nv-cab .nv-etapa{${MONO('.62rem')};color:var(--suave)}
    .nv-p{justify-content:flex-start}
    .nv-p strong{font:400 clamp(3.2rem,5.6vw,5.2rem)/1 var(--f-tit);letter-spacing:.004em;color:var(--texto)}
    .nv-mon{${MONO('.7rem')};color:var(--suave)}
    .nv-nota,.nv-cupos p{color:var(--suave);font-weight:500}
    .nv-cupos b{font:400 1.4rem/1 var(--f-tit);color:var(--texto)}
    .nv-barra{height:8px;background:var(--linea)}.nv-barra>span{background:var(--b-fondo)}
    .nv-sw{background:var(--b-fondo)}.nv-sw::after{background:var(--b-txt)}
    .nv-no{color:var(--suave)}.nv-no>span{text-decoration:line-through;text-decoration-thickness:1px}
    .nv-no .nv-sw{background:transparent;box-shadow:inset 0 0 0 1.5px var(--linea-2)}.nv-no .nv-sw::after{background:var(--linea-2)}
    .nv-seg{justify-content:flex-start;${MONO('.62rem')};color:var(--suave)}
  `,
};

S.equipo = {
  base: css`
    .eq{gap:14px}
    .eq-tj{border:0;border-radius:var(--r-v);${NEGRA}}
    .eq-tj:nth-child(even){${PAPEL}}
    .eq-f{position:relative;overflow:hidden}
    .eq-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,color-mix(in srgb,var(--pri) 80%,transparent),transparent 55%);mix-blend-mode:color}
    .eq-sf .eq-c::before{content:"";width:34px;height:34px;margin-bottom:10px;background:var(--pri);${MASCARA('var(--ast)')}}
    .eq-n{font:400 clamp(2rem,3.6vw,3.2rem)/1.02 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .eq-r{${MONO('.7rem')};color:var(--suave);line-height:1.6}
    .eq-b{color:var(--suave);font-size:1.02rem;line-height:1.55}
  `,
};

S.logistica = {
  base: css`
    /* el bloque de papel con los cuatro datos separados por líneas de tinta */
    .s-logistica{${PAPEL}}
    .lg{gap:0;border-top:2px solid var(--tinta);padding-top:18px;grid-template-columns:minmax(0,1fr)}
    @media (min-width:760px){.lg{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media (min-width:1100px){.lg-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    .lg-tj{background:none;border:0;border-radius:0;padding:16px clamp(4px,1.4vw,22px) 22px 0;gap:8px}
    .lg-i{width:26px;height:26px;color:var(--tinta)}
    .lg-r{${MONO('.68rem')};color:var(--tinta)}
    .lg-v{font:400 clamp(1.7rem,2.8vw,2.6rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .lg-d{color:var(--suave);font-weight:500}
  `,
};

S.dudas = {
  base: css`
    .du{border:0;border-radius:var(--r-v);${CHOQUE}}
    .du-i{color:var(--tinta)}
    .du-t{font:400 clamp(2rem,4vw,3.2rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .du-x{color:var(--suave);font-weight:500}
  `,
};

S.idea = {
  base: css`
    .id-img img{border:0;border-radius:var(--r-v);box-shadow:14px 14px 0 var(--pri)}
    .id-x{color:var(--suave)}
    .id-fr{border-left:0;padding-left:0;font:400 clamp(1.8rem,3.4vw,3rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em;color:var(--texto)}
    .id-fr::before{content:"";display:block;width:30px;height:30px;margin-bottom:14px;background:var(--pri);${MASCARA('var(--ast)')}}
  `,
  lado: css`
    @media (min-width:880px){.id-d{gap:clamp(40px,5vw,88px)}}
  `,
  centrada: css`
    .id-c{align-items:flex-start}.id-c .id-t{text-align:left;margin-inline:0}
  `,
};

S.caminos = {
  base: css`
    .cm{gap:14px;max-width:none}
    .cm-col{border:0;border-radius:var(--r-v);padding:clamp(26px,3.2vw,44px)}
    .cm-a{${NEGRA}}
    .cm-b{${PRI}}
    .cm-r{${MONO('.7rem')};color:var(--suave)}.cm-b .cm-r{color:var(--texto)}
    .cm-t{font:400 clamp(1.9rem,3.2vw,3rem)/1.05 var(--f-tit);text-transform:uppercase;letter-spacing:.004em}
    .cm-l li{font-weight:500}
    .cm-a .ic{color:var(--tenue)}
    .cm-b .ic{width:16px;height:16px;margin-top:4px;color:var(--texto);background:var(--texto);${MASCARA('var(--ast)')}}
    .cm-c{border-top:2px solid var(--linea-2);font-weight:500}
  `,
};

export const CSS_VOLTAJE = { base: BASE, secciones: S };
// Los bloques de color tal como quedan en el CSS (coloresVoltajePropios y cssVoltajePropios los ajustan con colores propios).
export const BLOQUES_VOLTAJE = { PRI, PAPEL, CHOQUE, TINTA };

// Privacidad y términos: el negro de la página, títulos en Anton y etiquetas en mono.
export const CSS_LEGAL_VOLTAJE = css`
  body{background:var(--fondo);letter-spacing:-.004em}
  .lg h1{font-weight:400;text-transform:uppercase;letter-spacing:.004em;line-height:1.05}
  .lg h2{font-weight:400;text-transform:uppercase;letter-spacing:.01em}
`;
