// CSS de PENUMBRA por sección (contrato en ./index.js). Va después del CSS clásico y lo pisa. Todo color sale de los
// tokens (--fondo, --texto, --acento, --aura-c1…3…) que arma coloresPenumbra() con la marca.
//
// Capas: el fondo de la página es fijo (body::before con la aurora en CSS y, encima, el lienzo de la escena: .ew-lienzo)
// y las secciones van transparentes por arriba (z-index 1). Con el telón, el pie queda fijo DEBAJO del fondo (z-index -1)
// y el fondo se recorta donde termina la última sección (--ew-fin, lo pone el JS de movimiento): el pie se descubre ahí.
// Lo que se mueve, se fija o se apaga va bajo .ew-mv (lo pone el JS de movimiento): sin JS y en edición la página queda
// quieta, completa y clicable.
import { css } from './css.js';

// Grano blanco muy suave (nunca sube el fondo por encima del tope de la aurora).
const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .045 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Vidrio: un velo del texto sobre el fondo a medias, borde fino, desenfoque. En el celular, sin desenfoque y más denso
// (el lienzo cambia en cada cuadro y desenfocar encima cuesta). Los colores van escritos (no en variables): si el
// navegador no entiende color-mix, la declaración se ignora y queda la de antes.
const VIDRIO =
  'background:var(--sup);' +
  'background:linear-gradient(180deg,color-mix(in oklab,var(--texto) 7%,transparent),color-mix(in oklab,var(--texto) 2%,transparent)),color-mix(in oklab,var(--fondo) 52%,transparent);' +
  'border:1px solid var(--linea);border:1px solid color-mix(in oklab,var(--texto) 12%,transparent);' +
  '-webkit-backdrop-filter:blur(22px) saturate(1.5);backdrop-filter:blur(22px) saturate(1.5);' +
  'box-shadow:inset 0 1px 0 color-mix(in oklab,var(--texto) 12%,transparent),0 40px 80px -40px rgb(0 0 0/.75)';
const VIDRIO_MOVIL =
  'background:linear-gradient(180deg,color-mix(in oklab,var(--texto) 7%,var(--fondo)),color-mix(in oklab,var(--texto) 3%,var(--fondo)));-webkit-backdrop-filter:none;backdrop-filter:none';
const vidrio = (sel, extra = '') => `${sel}{${VIDRIO};${extra}}@media (max-width:860px){${sel}{${VIDRIO_MOVIL}}}`;

// Esquinas de visor (como el marco de una cámara), en el fondo de un elemento.
const VISOR = (c = 'var(--linea-3)', l = '18px') =>
  [
    ['0 0', `${l} 1px`], ['0 0', `1px ${l}`], ['100% 0', `${l} 1px`], ['100% 0', `1px ${l}`],
    ['0 100%', `${l} 1px`], ['0 100%', `1px ${l}`], ['100% 100%', `${l} 1px`], ['100% 100%', `1px ${l}`],
  ].map(([p, t]) => `linear-gradient(${c},${c}) ${p}/${t} no-repeat`).join(',');

// Etiquetas monoespaciadas.
const MONO = 'font-family:var(--f-mono);font-weight:500;letter-spacing:.14em;text-transform:uppercase';
// Íconos en círculo: el visto (sí) encendido y la cruz (no) apagada.
const SI = 'width:24px;height:24px;padding:6px;margin:0;border-radius:50%;flex:none;background:color-mix(in oklab,var(--pri) 16%,transparent);color:var(--acento);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--pri) 40%,transparent);stroke-width:2.6';
const NO = 'width:24px;height:24px;padding:6.5px;margin:0;border-radius:50%;flex:none;background:none;color:var(--suave);box-shadow:inset 0 0 0 1px var(--linea-2);stroke-width:2.2';
// Número gigante con degradado del acento (si el navegador no recorta el fondo al texto, queda del color del acento).
const NUM = (sel) =>
  `${sel}{color:var(--acento)}@supports ((-webkit-background-clip:text) or (background-clip:text)){${sel}{background:linear-gradient(180deg,var(--acento) 10%,transparent 125%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}}`;
// El título en dos tonos: blanco que se apaga hacia abajo y los resaltados encendidos. Al editarlo en el estudio vuelve
// a ser texto común (si no, el fondo de edición quedaría recortado a las letras).
const DOS_TONOS = (sel) =>
  `@supports ((-webkit-background-clip:text) or (background-clip:text)){` +
  `${sel}{background:linear-gradient(180deg,var(--texto) 42%,color-mix(in oklab,var(--texto) 68%,var(--fondo)) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;caret-color:var(--texto)}` +
  `${sel}[contenteditable]{-webkit-text-fill-color:currentColor;color:var(--texto);-webkit-background-clip:border-box;background-clip:border-box}}`;
// Brillo del primario detrás de un bloque destacado.
const BRILLO = 'border-color:color-mix(in oklab,var(--pri) 38%,transparent);box-shadow:0 0 90px -30px color-mix(in oklab,var(--pri) 55%,transparent),inset 0 1px 0 color-mix(in oklab,var(--pri) 30%,transparent)';

const BASE = css`
  :root{
    --ease:cubic-bezier(.2,.7,.2,1);--ease-io:cubic-bezier(.65,0,.35,1);
    --r-xl:28px;--r-l:22px;--r-m:16px;--gut:clamp(16px,4vw,48px);--ancho:1240px;
    --f-mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,Consolas,"Roboto Mono","Liberation Mono",monospace;
    --grano:${GRANO};
  }
  html{background:var(--pie);scroll-padding-top:20px}
  body{background:transparent;font-size:1rem;line-height:1.6;overflow-x:clip;counter-reset:ew-n}
  ::selection{background:var(--pri);color:var(--sobre-pri)}
  :focus-visible{outline:2px solid var(--acento);outline-offset:3px}

  /* el fondo fijo: la aurora en CSS (respaldo de la escena; nunca pasa el tope de luz) y el lienzo de la escena */
  body::before{content:"";position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;z-index:0;pointer-events:none;
    background:var(--grano),
      radial-gradient(52% 58% at 86% 12%,var(--aura-c1),transparent 72%),
      radial-gradient(38% 46% at 102% 62%,var(--aura-c2),transparent 72%),
      radial-gradient(58% 52% at 6% 106%,var(--aura-c3),transparent 72%),
      radial-gradient(36% 40% at 30% 22%,color-mix(in oklab,var(--aura-c3) 40%,transparent),transparent 70%),
      var(--fondo)}
  .ew-lienzo{position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;z-index:0;display:block;pointer-events:none;opacity:0;transition:opacity 1.6s var(--ease)}
  .ew-lienzo.ew-on{opacity:1}
  .sec{position:relative;z-index:1;padding-block:clamp(104px,12vw,176px) clamp(48px,6vw,96px);overflow-x:clip;background:none}
  .b-sup{background:none}.b-ninguna{padding:0}
  .w{max-width:var(--ancho);padding-inline:var(--gut)}

  /* la regla numerada con cruces arriba de cada sección */
  .sec:not(.s-hero):not(.s-aviso):not(.s-pie):not(.s-gracias):not(.s-cifras)::before{content:"";position:absolute;z-index:0;pointer-events:none;
    top:clamp(40px,5vw,72px);left:max(var(--gut),calc(50% - var(--ancho)/2 + var(--gut)));right:max(var(--gut),calc(50% - var(--ancho)/2 + var(--gut)));height:9px;
    background:linear-gradient(var(--linea-3),var(--linea-3)) 0 50%/9px 1px no-repeat,linear-gradient(var(--linea-3),var(--linea-3)) 4px 0/1px 9px no-repeat,
      linear-gradient(var(--linea-3),var(--linea-3)) 100% 50%/9px 1px no-repeat,linear-gradient(var(--linea-3),var(--linea-3)) calc(100% - 4px) 0/1px 9px no-repeat,
      linear-gradient(var(--linea-2),var(--linea-2)) 0 50%/100% 1px no-repeat}

  /* letras: Sora fina y gigante, Inter para leer, etiquetas monoespaciadas */
  h1,h2,h3,.h1,.h2,.h3{font-family:var(--f-tit)}
  .h1{font-size:clamp(2.45rem,5.6vw,5.25rem);line-height:1.02;letter-spacing:-.046em;font-weight:250;max-width:15em;text-wrap:balance}
  .h2{font-size:clamp(2.1rem,4.4vw,4.1rem);line-height:1.05;letter-spacing:-.042em;font-weight:250;text-wrap:balance}
  .h3{font-size:clamp(1.2rem,1.7vw,1.6rem);line-height:1.22;letter-spacing:-.025em;font-weight:300}
  .h1.h1-l{font-size:clamp(2.1rem,4.6vw,4.25rem)}.h2.h2-l{font-size:clamp(1.85rem,3.5vw,3.2rem)}
  .hl{font-family:var(--f-acento);font-style:var(--estilo-acento);font-weight:inherit;color:var(--acento);-webkit-text-fill-color:var(--acento);
    text-shadow:0 0 42px color-mix(in oklab,var(--acento) 40%,transparent)}
  .ey{${MONO};font-size:.7rem;line-height:1.45;color:var(--tenue);gap:12px;margin:0 0 22px}
  .ey::before{width:7px;height:7px;border-radius:50%;background:var(--pri);box-shadow:0 0 12px var(--pri)}
  .sec:not(.s-hero):not(.s-gracias) .ey::before{counter-increment:ew-n;content:counter(ew-n,decimal-leading-zero);content:counter(ew-n,decimal-leading-zero) / "";
    width:auto;height:auto;border-radius:0;background:none;box-shadow:none;color:var(--acento)}
  .lead{font-size:clamp(1rem,1.25vw,1.125rem);line-height:1.6;color:var(--suave);max-width:36em;text-wrap:pretty}
  .cab{margin-bottom:clamp(44px,5vw,72px);max-width:900px}
  .cab .lead{margin-top:22px}
  .pc{display:inline-block;padding:2px 9px;border:1px dashed color-mix(in oklab,var(--acento) 60%,transparent);border-radius:7px;background:none;
    color:var(--acento);-webkit-text-fill-color:var(--acento);${MONO};font-size:.66rem;line-height:1.8;letter-spacing:.1em;text-shadow:none}
  .ew-var{-webkit-text-fill-color:var(--acento);text-shadow:none}
  .tag-ret{${MONO};font-size:.62rem;letter-spacing:.1em;border-color:var(--linea-3);color:var(--tenue)}
  .img-pc{border:1px dashed var(--linea-3);border-radius:var(--r-l);background:color-mix(in oklab,var(--fondo) 60%,transparent);color:var(--suave)}

  /* botón: píldora que brilla con su círculo y la flecha */
  .btn{--h:56px;min-height:var(--h);padding:8px 8px 8px 26px;gap:18px;justify-content:space-between;border-radius:999px;border:0;
    font:600 1rem/1.2 var(--f-txt);letter-spacing:-.01em;text-align:left;color:var(--sobre-pri);
    background:linear-gradient(105deg,transparent 38%,rgb(255 255 255/.5) 50%,transparent 62%) -160% 0/260% 100% no-repeat,var(--pri);
    box-shadow:inset 0 1px 0 rgb(255 255 255/.4),0 14px 44px -14px color-mix(in oklab,var(--pri) 85%,transparent);
    transition:transform .4s var(--ease),box-shadow .4s,background-position 1.1s var(--ease)}
  .btn:hover{transform:translateY(-1px);filter:none;background-position:260% 0,0 0;box-shadow:inset 0 1px 0 rgb(255 255 255/.4),0 18px 60px -14px var(--pri)}
  .btn:active{transform:translateY(0) scale(.985)}
  .btn-f{flex:none;display:grid;place-items:center;width:calc(var(--h) - 16px);height:calc(var(--h) - 16px);border-radius:50%;background:var(--sobre-pri);color:var(--pri);
    font-size:1.05rem;line-height:1;transition:transform .5s var(--ease)}
  .btn:hover .btn-f{transform:rotate(-45deg)}
  .btn-g{--h:60px;font-size:1.03rem}
  .btn-sec{--h:46px;padding:10px 18px;justify-content:center;gap:10px;color:var(--texto);background:color-mix(in oklab,var(--fondo) 45%,transparent);
    border:1px solid var(--linea-2);box-shadow:none;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-weight:500;font-size:.92rem}
  .btn-sec:hover{border-color:var(--acento);box-shadow:none;background-position:0 0}
  .btn-sec .ic{color:var(--acento)}
  .btn .ic{width:20px;height:20px}
  .nota{${MONO};font-size:.66rem;line-height:1.6;letter-spacing:.12em;color:var(--tenue);margin-top:14px}
  .acc{margin-top:36px}
  .sec-acc{margin-top:clamp(40px,5vw,60px)}

  /* piezas compartidas */
  ${vidrio('.tj', 'border-radius:var(--r-l)')}
  .evento{gap:8px;margin-top:24px}
  .evento li{padding:8px 14px;border:1px solid var(--linea-2);background:color-mix(in oklab,var(--fondo) 45%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-size:.88rem}
  .evento .ic{color:var(--acento)}.evento small{color:var(--tenue)}.evento .hl-local:not(:empty){color:var(--acento)}
  .hero-pts{gap:12px;margin-top:24px}
  .hero-pts li{align-items:center;font-size:.95rem;color:var(--suave)}
  .hero-pts .ic{${SI}}
  .vid{border-radius:var(--r-l);border:1px solid var(--linea-2);background:var(--pie);
    box-shadow:0 0 0 6px color-mix(in oklab,var(--texto) 4%,transparent),0 50px 120px -40px color-mix(in oklab,var(--pri) 40%,transparent),0 40px 90px -40px rgb(0 0 0/.8)}
  .vid-p{background:var(--pri);color:var(--sobre-pri);box-shadow:0 0 0 10px color-mix(in oklab,var(--pri) 22%,transparent),0 0 60px color-mix(in oklab,var(--pri) 55%,transparent)}
  .vid-pc{background:color-mix(in oklab,var(--fondo) 70%,transparent)}

  /* acordeón (temario y preguntas) */
  .acor{display:block;gap:0;counter-reset:ew-fq}
  .acor details{background:none;border:0;border-top:1px solid var(--linea);border-radius:0;overflow:visible;counter-increment:ew-fq}
  .acor details:last-child{border-bottom:1px solid var(--linea)}
  .acor summary{padding:24px 0;gap:16px;font:300 clamp(1.08rem,1.6vw,1.375rem)/1.3 var(--f-tit);letter-spacing:-.015em;transition:color .25s}
  .acor summary:hover{color:var(--acento)}
  .acor-i{width:34px;height:34px;padding:10px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--linea-2);color:var(--texto);transition:transform .5s var(--ease),background .3s,color .3s}
  .acor details[open] .acor-i{transform:rotate(135deg);background:var(--pri);color:var(--sobre-pri);box-shadow:none}
  .acor details>p{padding:0 56px 26px 0;color:var(--suave);font-size:1rem;line-height:1.65;max-width:42em}
  @supports (interpolate-size:allow-keywords){@media (prefers-reduced-motion:no-preference){
    .acor{interpolate-size:allow-keywords}
    .acor details::details-content{height:0;overflow:clip;transition:height .5s var(--ease),content-visibility .5s allow-discrete}
    .acor details[open]::details-content{height:auto}}}

  /* formulario de vidrio: los campos en una sola caja con líneas finas y la etiqueta monoespaciada adentro */
  .form{gap:0}
  .campo{position:relative;display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:62px;padding:10px 20px;cursor:text;
    background:color-mix(in oklab,var(--fondo) 45%,transparent);border:1px solid var(--linea-2);border-bottom-width:0;transition:background .3s,box-shadow .3s}
  .campo>span{${MONO};font-size:.6rem;line-height:1.2;letter-spacing:.16em;color:var(--tenue);transition:color .25s}
  .campo small{font:inherit;letter-spacing:.06em;color:var(--tenue)}
  .campo input{height:auto;min-height:0;padding:4px 0 0;border:0;border-radius:0;background:none;font-size:15px;color:var(--texto);box-shadow:none;-webkit-appearance:none;appearance:none}
  .campo input:focus{outline:0;border:0;box-shadow:none}
  .campo input::placeholder{color:color-mix(in oklab,var(--texto) 40%,transparent)}
  .campo:focus-within{background:color-mix(in oklab,var(--texto) 6%,transparent);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--pri) 60%,transparent)}
  .campo:focus-within>span{color:var(--acento)}
  .campo:has(input[aria-invalid=true]){box-shadow:inset 0 0 0 1px var(--error)}
  .form>.campo:first-child{border-radius:20px 20px 0 0}
  .campo:has(+.hp){border-bottom-width:1px;border-radius:0 0 20px 20px}
  .form>.campo:first-child:has(+.hp){border-radius:20px}
  .form .btn{margin-top:14px;width:100%}
  .form .nota{text-align:center}
  .form-msg{border-radius:14px;background:var(--sup2);margin-top:10px}
  .form-priv{margin-top:12px;font-size:.76rem;color:var(--tenue)}

  /* ventana del formulario: vidrio oscuro (hoja que sube en el celular) */
  .modal{width:min(520px,calc(100vw - 24px))}
  .modal::backdrop{background:rgb(0 0 0/.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
  .modal-c{border-radius:var(--r-xl);border:1px solid var(--linea-2);padding:30px 22px 22px;
    background:radial-gradient(80% 60% at 100% 0%,var(--aura-c1),transparent 70%),var(--fondo);box-shadow:0 40px 120px -20px rgb(0 0 0/.9)}
  .modal-t{font:300 1.6rem/1.15 var(--f-tit);letter-spacing:-.025em;margin:4px 48px 22px 0}
  .modal-x{top:16px;right:16px;width:40px;height:40px;font-size:22px;color:var(--texto);box-shadow:inset 0 0 0 1px var(--linea-2)}
  @media (max-width:760px){.modal{margin:auto 0 0;width:100%;max-width:100%;max-height:calc(100dvh - 12px)}.modal-c{border-radius:var(--r-xl) var(--r-xl) 0 0;padding-bottom:calc(22px + env(safe-area-inset-bottom))}.modal.modal-fijo{top:auto;bottom:0;margin:0}}
  @media (prefers-reduced-motion:no-preference){.modal[open]{animation:ew-p-sube .6s var(--ease)}}
  @keyframes ew-p-sube{from{transform:translateY(40px);opacity:0}}

  /* el orbe (ancla de la escena): su respaldo en CSS de puntos y el visor que lo enmarca */
  .ew-ancla{position:absolute;z-index:0;pointer-events:none;aspect-ratio:1}
  .ew-ancla-esfera{background:${VISOR('var(--linea-3)', '20px')}}
  .ew-ancla-esfera::before{content:"";position:absolute;inset:3%;border-radius:50%;transition:opacity 1.6s var(--ease);
    background:radial-gradient(circle,transparent 50%,var(--aura-c1) 66%,transparent 71%),radial-gradient(circle at 40% 36%,var(--aura-c1),transparent 58%),
      radial-gradient(circle,color-mix(in oklab,var(--texto) 40%,transparent) .8px,transparent 1.5px) 0 0/9px 9px;
    -webkit-mask:radial-gradient(circle,#000 56%,transparent 71%);mask:radial-gradient(circle,#000 56%,transparent 71%)}
  .ew-gl .ew-ancla::before{opacity:0}

  /* el telón: el pie queda fijo debajo del fondo y se descubre donde termina la última sección */
  .ew-mv:not(.ew-sin-telon) body::before,.ew-mv:not(.ew-sin-telon) .ew-lienzo{clip-path:inset(0 0 calc(100% - var(--ew-fin,300vh)) 0 round 0 0 var(--r-xl) var(--r-xl))}
  .ew-mv:not(.ew-sin-telon) .s-pie{position:sticky;bottom:0;z-index:-1}
  .ew-mv:not(.ew-sin-telon):not(.ew-telon) .s-pie>*{visibility:hidden}
  .ew-mv:not(.ew-sin-telon) .sec:has(+.s-pie)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:var(--r-xl);pointer-events:none;
    border:1px solid color-mix(in oklab,var(--pri) 50%,transparent);border-top:0;border-radius:0 0 var(--r-xl) var(--r-xl)}

  /* resaltados que se encienden al llegar y palabras que se encienden al bajar ("por qué ahora") */
  @media (prefers-reduced-motion:no-preference){
    .ew-mv .s-hero .hl,.ew-mv .s-gracias .hl,.ew-mv .ew-visto .hl{animation:ew-p-enciende 1.6s ease-in-out .5s both}
    .ew-mv .aviso-a::before,.ew-mv .s-hero .ey::before{animation:ew-p-latido 2.4s ease-out infinite}}
  @keyframes ew-p-enciende{0%,100%{-webkit-text-fill-color:var(--acento);color:var(--acento)}45%{-webkit-text-fill-color:color-mix(in oklab,var(--acento) 22%,#fff);color:color-mix(in oklab,var(--acento) 22%,#fff);text-shadow:0 0 30px var(--acento)}}
  @keyframes ew-p-latido{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--pri) 70%,transparent),0 0 12px var(--pri)}75%,100%{box-shadow:0 0 0 9px transparent,0 0 12px var(--pri)}}
  .ew-mv:not(.ew-telon) .ew-enc .ew-w{opacity:clamp(.18,calc(var(--lp,99) - var(--j)),1);transition:opacity .3s linear}

  /* barra fija del botón en el celular */
  .ew-barra{left:10px;right:10px;padding:6px;border-radius:999px;border:1px solid var(--linea-2);background:color-mix(in oklab,var(--fondo) 82%,transparent);
    -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 20px 50px rgb(0 0 0/.6)}
  .ew-barra .btn{--h:50px}

  @media print{body::before{content:none}.sec{z-index:auto}}
`;

const S = {};

S.aviso = {
  base: css`
    .s-aviso{background:none;border-bottom:1px solid var(--linea);z-index:2}
    .aviso-a{min-height:38px;padding:8px var(--gut);${MONO};font-size:.66rem;line-height:1.45;color:var(--suave);gap:12px}
    .aviso-a::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:var(--pri);box-shadow:0 0 12px var(--pri)}
    .aviso-a>span[aria-hidden]{color:var(--acento)}
    .aviso-a:hover>span:first-of-type{color:var(--texto)}
  `,
};

S.hero = {
  base: css`
    .s-hero{padding-block:clamp(28px,5vw,64px) clamp(72px,9vw,120px)}
    .s-hero::before{background:none}
    @media (min-width:900px){.s-hero{min-height:min(880px,calc(100svh - 38px));display:flex;align-items:center}.s-hero>.w{width:100%}}
    .s-hero .w{position:relative;z-index:1}
    .s-hero .ey{display:inline-flex;align-items:center;gap:12px;margin:0;padding:8px 16px 8px 13px;border-radius:999px;border:1px solid var(--linea-2);color:var(--texto);
      background:color-mix(in oklab,var(--fondo) 45%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
    .s-hero .h1{margin:24px 0 0}
    .s-hero .lead{margin-top:24px;max-width:34em}
    ${DOS_TONOS('.s-hero .h1')}
    .s-hero .acc{margin-top:32px}
    @media (max-width:860px){.s-hero{padding-top:26px}.s-hero .h1{margin-top:20px;font-weight:300;letter-spacing:-.04em}.s-hero .lead{margin-top:18px;font-size:.97rem;line-height:1.55}
      .s-hero .ey{padding:7px 14px 7px 12px;font-size:.62rem}}
    /* el orbe: arriba a la derecha (en el celular asoma por la esquina) */
    .s-hero .ew-ancla{top:-86px;right:-66px;width:281px;background:none}
    @media (min-width:900px){.s-hero .ew-ancla{top:max(2%,20px);right:max(1vw,calc(50% - 660px));width:min(42vw,600px);background:${VISOR('var(--linea-3)', '20px')}}}
  `,
  centrado: css`
    .hero-c .h1{margin-inline:auto}.hero-c .lead{margin-inline:auto}
    .hero-c .ey{margin-inline:auto}
    .hero-img{margin-top:clamp(40px,6vw,72px);padding:14px;border-radius:var(--r-xl);position:relative;background:${VISOR('var(--linea-3)', '22px')}}
    .hero-img img{border-radius:var(--r-l);border:1px solid var(--linea-2)}
    @media (min-width:900px){.s-hero.v-centrado .ew-ancla{top:2%;right:auto;left:50%;translate:-50% 0;width:min(64vw,780px);background:none}.s-hero.v-centrado .ew-ancla::before{opacity:.55}}
  `,
  dividido: css`
    .hero-d{gap:44px}
    @media (min-width:920px){.hero-d{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:72px}}
    .hero-m{padding:16px;border-radius:var(--r-xl);background:${VISOR('var(--linea-3)', '22px')}}
    .hero-m img{border-radius:var(--r-l);border:1px solid var(--linea-2);box-shadow:0 50px 100px -40px rgb(0 0 0/.85),0 0 0 6px color-mix(in oklab,var(--texto) 3%,transparent)}
    .hero-m .img-pc{aspect-ratio:4/5}
    @media (min-width:920px){
      .s-hero.v-dividido:not(:has(.hero-sf)) .ew-ancla{top:50%;translate:0 -50%;width:min(50vw,700px);background:none;
        right:calc(max(var(--gut),50% - var(--ancho)/2 + var(--gut)) + (min(100%,var(--ancho)) - 2*var(--gut) - 72px)*.225 - min(50vw,700px)/2)}}
  `,
  video: css`
    .s-hero.v-video{padding-top:clamp(28px,4vw,56px)}
    .hero-v{max-width:1040px}
    .hero-v .h1{font-size:clamp(1.75rem,3.4vw,2.9rem)!important;line-height:1.08!important;letter-spacing:-.04em;max-width:22em}
    .hero-v .ey{margin-inline:auto}
    .hero-v .lead{font-size:1.02rem;margin-inline:auto}
    .hero-v .vid{margin-top:clamp(24px,3vw,36px)}
    @media (max-width:620px){.hero-v .h1{font-size:clamp(1.55rem,6.6vw,2.1rem)!important}
      .hero-v .hero-pts{display:grid;justify-content:start;width:fit-content;max-width:100%;margin-inline:auto;text-align:left}}
  `,
  evento: css`
    /* una sola columna, como la portada del prototipo: título, subtítulo, el formulario píldora y la franja de puntos */
    .hero-e{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
    @media (min-width:960px){.hero-e{grid-template-columns:minmax(0,1fr);grid-template-areas:none}.hero-e>.hero-t,.hero-e>.hero-form,.hero-e>.hero-x{grid-area:auto}}
    .hero-t{max-width:860px}
    .hero-form{max-width:840px;margin-top:32px;padding:0;background:none;border:0;border-radius:0;box-shadow:none}
    .hero-form-t{${MONO};font-size:.62rem;line-height:1.4;color:var(--tenue);margin:0 0 12px 4px}
    .hero-form:not(:has(.form)) .acc{align-items:flex-start}
    @media (min-width:621px){.hero-form:not(:has(.form)) .acc .btn{width:auto}}
    .hero-x .hero-pts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:0;margin-top:clamp(36px,6vh,64px);border-top:1px solid var(--linea)}
    .hero-x .hero-pts li{padding:18px 24px 20px 0;font-size:.94rem;line-height:1.45}
    @media (min-width:700px){.hero-x .hero-pts li+li{padding-left:24px;border-left:1px solid var(--linea)}}
    @media (max-width:699px){.hero-x .hero-pts li+li{border-top:1px solid var(--linea)}.hero-x .hero-pts li{padding:14px 0}}
    @media (max-width:959px){.hero-form{margin-top:28px}}
  `,
};

// El formulario en una píldora de vidrio (como la portada del prototipo): en el escritorio, con hasta 3 campos.
const PILDORA = (sel) => css`
  @media (min-width:900px){
    ${sel} .form:not(:has(>.campo:nth-child(4))){grid-template-columns:minmax(0,.8fr) minmax(0,1fr) minmax(0,1.2fr) auto;grid-template-rows:76px;position:relative;row-gap:12px}
    ${sel} .form:not(:has(>.campo:nth-child(3))){grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) auto}
    ${sel} .form:not(:has(>.campo:nth-child(2))){grid-template-columns:minmax(0,1fr) auto}
    ${sel} .form:not(:has(>.campo:nth-child(4)))::before{content:"";position:absolute;left:0;right:0;top:0;height:76px;border-radius:999px;pointer-events:none;${VIDRIO}}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>*{position:relative;z-index:1}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.campo{grid-row:1;margin:6px 0 6px 6px;min-height:0;padding:8px 22px;border:0;border-radius:999px;background:none}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.campo+.campo::before{content:"";position:absolute;left:-3px;top:14px;bottom:14px;width:1px;background:var(--linea-2);transition:background .25s}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.campo:focus-within::before,${sel} .form:not(:has(>.campo:nth-child(4)))>.campo:focus-within+.campo::before{background:transparent}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.campo:focus-within{background:color-mix(in oklab,var(--texto) 6%,transparent)}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.btn{grid-row:1;width:auto;margin:8px 8px 8px 10px;white-space:nowrap}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>:not(.campo):not(.btn){grid-column:1/-1}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.nota{text-align:left;margin:4px 0 0 4px}
    ${sel} .form:not(:has(>.campo:nth-child(4)))>.form-priv{text-align:left;margin-left:4px}}
`;

S.formulario = {
  base: css`
    ${vidrio('.fo-card', 'border-radius:var(--r-xl);padding:clamp(22px,3vw,36px)')}
    .fo-t{max-width:900px}
    .fo-t .cab{margin-bottom:0}
    .fo-t .fo-card{margin-top:36px}
  `,
  tarjeta: css`
    @media (min-width:900px){.fo-t .fo-card:not(:has(.campo:nth-child(4))){padding:0;background:none;border:0;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}}
    ${PILDORA('.fo-t .fo-card')}
  `,
  dividido: css`
    .fo-d{gap:44px}
    @media (min-width:900px){.fo-d{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(48px,6vw,96px)}}
    .fo-d .cab{text-align:left;margin:0}
    .fo-d .cab .lead{margin-inline:0}
    .fo-d .fo-card{${BRILLO}}
  `,
};
S.hero.evento += PILDORA('.hero-e .hero-form');

S.contador = {
  base: css`
    .s-contador .ct{max-width:none;min-height:min(70svh,640px);justify-content:center}
    .ct .h3{margin:0;font:300 clamp(1.15rem,1.6vw,1.4rem)/1.3 var(--f-tit);letter-spacing:-.01em;text-transform:none;color:var(--suave)}
    .ct-g{display:flex;justify-content:center;gap:clamp(6px,1.4vw,18px);width:100%;max-width:none;margin-top:30px}
    ${vidrio('.ct-c', 'position:relative;flex:0 1 auto;min-width:clamp(72px,14.5vw,208px);display:grid;justify-items:center;gap:12px;padding:clamp(14px,2vw,26px) clamp(8px,1.5vw,22px) clamp(12px,1.5vw,18px);border-radius:clamp(16px,2vw,26px)')}
    .ct-n,.ct-c .ew-odo{font:200 clamp(2.9rem,9.4vw,8.75rem)/1 var(--f-tit);letter-spacing:-.03em;font-variant-numeric:tabular-nums;justify-content:center}
    .ct-l{${MONO};font-size:.6rem;line-height:1;color:var(--tenue)}
    .ct-c+.ct-c::after{content:":";content:":" / "";position:absolute;left:calc(clamp(6px,1.4vw,18px)/-2);top:50%;translate:-50% -62%;font:200 clamp(1.8rem,5vw,5rem)/1 var(--f-tit);color:var(--tenue)}
    @media (max-width:860px){.ct-c{flex:1;min-width:0}.ct-c+.ct-c::after{content:none}}
    .ct .acc{align-items:center;margin-top:36px}
    .ct .acc .nota{text-align:center}
  `,
};

S.cta = {
  base: css`
    .s-cta{padding-bottom:clamp(150px,17vw,250px)}
    .cta-in{max-width:1000px;margin-inline:auto}
    .s-cta .h2{font-size:clamp(2.4rem,5.4vw,5.25rem);max-width:13em}
    .cta-in .lead{margin-top:22px;margin-inline:auto}
    .cta-in .acc{align-items:center}
  `,
  banda: css`
    .s-cta.v-banda{background:none;color:var(--texto)}
    .s-cta.v-banda h2,.s-cta.v-banda .h2{color:var(--texto)}
    .s-cta.v-banda .ey,.s-cta.v-banda .nota{color:var(--tenue);opacity:1}
    .s-cta.v-banda .lead{color:var(--suave);opacity:1}
    .s-cta.v-banda .hl{color:var(--acento);text-decoration:none}
    .s-cta.v-banda .btn{color:var(--sobre-pri);background:linear-gradient(105deg,transparent 38%,rgb(255 255 255/.5) 50%,transparent 62%) -160% 0/260% 100% no-repeat,var(--pri);
      box-shadow:inset 0 1px 0 rgb(255 255 255/.4),0 14px 44px -14px color-mix(in oklab,var(--pri) 85%,transparent)}
    .s-cta.v-banda .btn:hover{background-position:260% 0,0 0}
  `,
  tarjeta: css`
    ${vidrio('.s-cta.v-tarjeta .cta-in', 'border-radius:var(--r-xl);padding:clamp(40px,6vw,88px) clamp(22px,5vw,72px);position:relative;overflow:hidden;isolation:isolate')}
    .s-cta.v-tarjeta .cta-in{${BRILLO}}
    .s-cta.v-tarjeta .cta-in::before{background:radial-gradient(closest-side,var(--aura-c1),transparent)}
    .s-cta.v-tarjeta .cta-in::after{content:"";position:absolute;inset:16px;pointer-events:none;background:${VISOR('var(--linea-3)', '18px')}}
  `,
};

S.beneficios = {
  base: css`
    .s-beneficios p{color:var(--suave)}
  `,
  tarjetas: css`
    .be-g{gap:18px}
    .be-tj{position:relative;padding:28px 28px 30px;gap:6px;overflow:hidden}
    .be-i{font:200 clamp(3.2rem,4.4vw,4rem)/.9 var(--f-tit);letter-spacing:-.06em;margin:0 0 26px}
    ${NUM('.be-i')}
    .be-tj::after{content:"";position:absolute;top:22px;right:22px;width:64px;aspect-ratio:1;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,var(--acento) 0 2.5px,transparent 3.5px),radial-gradient(circle,transparent 0 46%,var(--linea-2) calc(46% + .5px) calc(46% + 1.5px),transparent calc(46% + 2px)),
        radial-gradient(circle,transparent 0 70%,var(--linea-2) calc(70% + .5px) calc(70% + 1.5px),transparent calc(70% + 2px))}
  `,
  lista: css`
    .be-l{gap:0 56px;max-width:none}
    .be-li{padding:22px 0;border-top:1px solid var(--linea);gap:16px}
    .be-li .ic{${SI};margin-top:2px}
  `,
  numerada: css`
    /* la pila: la cabecera a la izquierda (fija al bajar) y las tarjetas de vidrio que se apilan a la derecha */
    .s-beneficios.v-numerada .w{display:grid;gap:44px}
    .s-beneficios.v-numerada .cab{text-align:left;margin:0}
    .s-beneficios.v-numerada .cab .lead{margin-inline:0}
    .s-beneficios.v-numerada .sec-acc{justify-content:flex-start;margin-top:0}
    .be-nl{max-width:none;width:100%;margin:0;gap:28px;padding-bottom:12px;--tope:16px}
    ${vidrio('.be-num', 'position:relative;display:grid;grid-template-columns:minmax(0,1fr);align-content:start;gap:14px;padding:24px 22px 28px;border-radius:var(--r-xl);transform-origin:50% 0')}
    .be-num:last-child{border-bottom-width:1px}
    .be-num:nth-child(1){--i:0}.be-num:nth-child(2){--i:1}.be-num:nth-child(3){--i:2}.be-num:nth-child(4){--i:3}.be-num:nth-child(5){--i:4}.be-num:nth-child(6){--i:5}
    .be-n{display:block;min-width:0;font:200 clamp(3.25rem,5vw,4.25rem)/.9 var(--f-tit);letter-spacing:-.06em}
    ${NUM('.be-n')}
    .be-num .h3{font-size:clamp(1.3rem,1.9vw,1.7rem);line-height:1.2;margin-top:6px}
    .be-num p{font-size:.98rem;line-height:1.6;margin-top:12px;max-width:30em}
    /* el dibujo de cada tarjeta: órbitas con un punto encendido (cambia en cada una) */
    .be-num::before{content:"";position:absolute;top:22px;right:22px;width:84px;aspect-ratio:1;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle at var(--px,78%) var(--py,22%),var(--acento) 0 3px,transparent 4px),radial-gradient(circle,var(--acento) 0 3.5px,transparent 4.5px),
        radial-gradient(circle,transparent 0 22%,color-mix(in oklab,var(--acento) 70%,transparent) calc(22% + .5px) calc(22% + 1.5px),transparent calc(22% + 2px)),
        radial-gradient(circle,transparent 0 46%,var(--linea-2) calc(46% + .5px) calc(46% + 1.5px),transparent calc(46% + 2px)),
        radial-gradient(circle,transparent 0 69%,var(--linea-2) calc(69% + .5px) calc(69% + 1.5px),transparent calc(69% + 2px))}
    .be-num:nth-child(4n+2){--px:16%;--py:62%}.be-num:nth-child(4n+3){--px:70%;--py:86%}.be-num:nth-child(4n+4){--px:30%;--py:12%}
    @media (min-width:900px){
      .s-beneficios.v-numerada .w{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,6vw,96px);align-items:start}
      .s-beneficios.v-numerada .cab,.s-beneficios.v-numerada .sec-acc{grid-column:1}
      .s-beneficios.v-numerada .be-nl{grid-column:2;grid-row:1/span 3}
      .be-nl{--tope:28px}
      .be-num{grid-template-columns:minmax(0,1fr) minmax(0,.8fr);grid-template-rows:auto 1fr;min-height:340px;padding:30px 30px 34px;column-gap:28px}
      .be-num>div{grid-column:1;align-self:end}
      .be-num::before{top:50%;right:30px;width:min(220px,30%);translate:0 -50%}}
    .ew-mv .be-num{position:sticky;top:calc(var(--tope) + var(--i,0)*16px);transform:scale(calc(1 - var(--tapa,0)*.06))}
    .ew-mv .be-num::after{content:"";position:absolute;inset:-1px;border-radius:inherit;background:var(--fondo);opacity:calc(var(--tapa,0)*.62);pointer-events:none}
    @media (prefers-reduced-motion:no-preference){.ew-mv .be-num::before{animation:ew-p-gira 60s linear infinite}}
    @keyframes ew-p-gira{to{rotate:1turn}}
    @media (min-width:900px){.ew-mv .s-beneficios.v-numerada .w:not(:has(>.sec-acc))>.cab{position:sticky;top:110px}}
  `,
};

S.problema = {
  base: css`
    .s-problema .ic{${NO}}
    .pr-cierre{max-width:26em;margin:52px auto 0;font:300 clamp(1.3rem,2.4vw,1.9rem)/1.35 var(--f-tit);letter-spacing:-.02em;color:var(--texto)}
  `,
  lista: css`
    .pr-l{gap:0;max-width:880px;border-top:1px solid var(--linea)}
    .pr-li{padding:20px 4px;gap:16px;align-items:center;background:none;border:0;border-bottom:1px solid var(--linea);border-radius:0;font-size:1.04rem;line-height:1.5;color:var(--suave)}
  `,
  tarjetas: css`
    .pr-g{gap:18px}
    .pr-tj{gap:16px;padding:26px}
    .pr-tj p{font-size:1.02rem;line-height:1.55;color:var(--suave)}
  `,
};

S.mecanismo = {
  base: css`
    .s-mecanismo p{color:var(--suave)}
    .me-n{width:52px;height:52px;background:color-mix(in oklab,var(--fondo) 60%,transparent);color:var(--acento);font:300 1.3rem/1 var(--f-tit);
      box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--acento) 55%,transparent),0 0 30px -6px color-mix(in oklab,var(--pri) 55%,transparent)}
  `,
  pasos: css`
    .me-f{gap:18px}
    ${vidrio('.me-f .me-p', 'padding:clamp(22px,2.6vw,30px);border-radius:var(--r-l);gap:22px')}
    @media (min-width:820px){.me-f .me-p:not(:last-child)::after{top:52px;left:calc(100% + 1px);right:auto;width:16px;height:1px;background:color-mix(in oklab,var(--acento) 60%,transparent)}}
  `,
  linea: css`
    .me-l{max-width:820px}
    .me-l .me-p{grid-template-columns:52px 1fr;gap:24px;padding-bottom:44px}
    .me-l .me-p:not(:last-child)::before{left:25.5px;top:60px;bottom:6px;width:1px;background:linear-gradient(color-mix(in oklab,var(--acento) 70%,transparent),var(--linea))}
  `,
};

S.urgencia = {
  base: css`
    .ur{gap:clamp(36px,5vw,72px)}
    @media (min-width:900px){.ur{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr)}}
    .s-urgencia .cab{max-width:none}
    .s-urgencia .cab .h2{font-size:clamp(2.1rem,5.2vw,5.4rem);line-height:1.04;letter-spacing:-.046em;max-width:16.5em}
    .ur:not(:has(.ur-c)){grid-template-columns:minmax(0,1fr)}
    @media (min-width:900px){
      .ur:not(:has(.ur-c))>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:clamp(32px,6vw,96px);align-items:start}
      .ur:not(:has(.ur-c))>div>.cab{grid-column:1/-1}
      .ur:not(:has(.ur-c)) .sec-acc{grid-column:2;margin-top:clamp(32px,4vw,52px);padding-top:28px;border-top:1px solid var(--linea)}}
    .s-urgencia .sec-acc{justify-content:flex-start}
    .s-urgencia .sec-acc .acc{align-items:flex-start}
    .s-urgencia .sec-acc .nota{text-align:left}
    .ur-t{margin-top:clamp(32px,4vw,52px);padding-top:28px;border-top:1px solid var(--linea);font:300 clamp(1.08rem,1.6vw,1.4rem)/1.5 var(--f-tit);letter-spacing:-.012em;color:var(--suave);max-width:38em}
    .ur-c{gap:14px}
    ${vidrio('.ur-c li', 'padding:24px 26px;border-radius:var(--r-l);border-left-width:1px')}
    .ur-c strong{font:200 clamp(2.6rem,4.6vw,3.9rem)/1 var(--f-tit);letter-spacing:-.045em;color:var(--texto)}
    .ur-c span{color:var(--suave)}
  `,
  frase: css`
    .ur-fr .cab{margin-inline:auto}.ur-fr .cab .h2{margin-inline:auto}
    .ur-fr .ur-t{border-top:0;padding-top:0;margin-top:30px;font:250 clamp(1.5rem,2.8vw,2.4rem)/1.25 var(--f-tit);letter-spacing:-.03em;color:var(--texto)}
    .ur-fr .ur-c{margin-top:36px}
  `,
};

S.comparacion = {
  base: css`
    .s-comparacion .co-a .ic{${SI}}
    .s-comparacion .co-b .ic{${NO}}
  `,
  tabla: css`
    .co-t{position:relative;max-width:none;border:0;border-radius:0;overflow:visible}
    .co-t::before{content:"";position:absolute;left:0;top:0;bottom:0;width:50%;border-radius:var(--r-xl);border:1px solid var(--linea-2);
      background:radial-gradient(90% 50% at 30% 0%,var(--aura-c1),transparent 70%),color-mix(in oklab,var(--fondo) 55%,transparent);
      -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);${BRILLO}}
    .co-f{position:relative}
    .co-f>div{gap:16px;padding:22px clamp(18px,2.6vw,34px);border-top:1px solid var(--linea);font-size:1rem;line-height:1.5}
    .co-t .co-a{order:-1;background:none;color:var(--texto)}
    .co-f+.co-f>.co-a{border-top-color:color-mix(in oklab,var(--pri) 16%,transparent)}
    .co-t .co-b{color:var(--suave)}
    .co-cab>div{border-top:0;padding-block:26px 20px;align-items:center;font:300 clamp(1.1rem,1.6vw,1.375rem)/1.2 var(--f-tit);letter-spacing:-.02em}
    .co-cab .co-a::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:var(--pri);box-shadow:0 0 12px var(--pri)}
    @media (max-width:760px){
      .co-t::before{content:none}
      .co-f{grid-template-columns:1fr;margin-top:10px;border-radius:20px;border:1px solid var(--linea);background:color-mix(in oklab,var(--fondo) 80%,transparent)}
      .co-f>div,.co-f+.co-f>div{border-top:0;padding:16px 18px 6px}
      .co-f>.co-b{padding:4px 18px 16px;font-size:.93rem}
      .co-cab{display:flex;justify-content:space-between;gap:12px;border:0;background:none;margin-top:0}
      .co-f.co-cab>div{padding:0 4px 8px;${MONO};font-size:.6rem;letter-spacing:.12em}
      .co-cab .co-b{text-align:right}}
  `,
  tarjetas: css`
    .co-2{gap:18px;max-width:none}
    .co-col{border-radius:var(--r-xl);padding:clamp(24px,3vw,40px)}
    .co-col li{gap:14px;padding:14px 0;border-top:1px solid var(--linea)}
    .co-col ul{gap:0}
    .co-2 .co-b{border:1px solid var(--linea);background:color-mix(in oklab,var(--fondo) 72%,transparent);color:var(--suave)}
    ${vidrio('.co-2 .co-a', 'border-radius:var(--r-xl)')}
    .co-2 .co-a{background:radial-gradient(70% 55% at 0% 0%,var(--aura-c1),transparent 70%),color-mix(in oklab,var(--fondo) 55%,transparent);${BRILLO}}
    .co-h{font:300 clamp(1.3rem,2vw,1.7rem)/1.2 var(--f-tit);letter-spacing:-.02em;margin-bottom:20px}
    .co-2 .co-b .co-h{color:var(--suave)}
  `,
};

S.para_quien = {
  base: css`
    .pq{gap:20px;max-width:none}
    @media (min-width:800px){.pq{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}}
    .pq-col{border-radius:var(--r-xl);padding:clamp(24px,3vw,40px)}
    ${vidrio('.pq-si', 'border-radius:var(--r-xl)')}
    .pq-si{background:radial-gradient(70% 55% at 0% 0%,var(--aura-c1),transparent 70%),linear-gradient(180deg,color-mix(in oklab,var(--texto) 6%,transparent),transparent),color-mix(in oklab,var(--fondo) 55%,transparent)}
    .pq-no{border:1px solid var(--linea);background:color-mix(in oklab,var(--fondo) 72%,transparent);color:var(--suave)}
    .pq-h{margin:0 0 20px;font:300 clamp(1.3rem,2vw,1.75rem)/1.2 var(--f-tit);letter-spacing:-.02em}
    .pq-no .pq-h{color:var(--suave)}
    .pq-col ul{gap:0}
    .pq-col li{gap:16px;padding:17px 0;border-top:1px solid var(--linea);font-size:1rem;line-height:1.55}
    .pq-si .ic{${SI}}
    .pq-no .ic{${NO}}
  `,
};

S.experto = {
  base: css`
    .ex-r{${MONO};font-size:.68rem;line-height:1.7;color:var(--acento);margin:20px 0 0}
    .ex-b{color:var(--suave);font-size:1.02rem;line-height:1.65;margin-top:18px;max-width:36em}
    .ex-l{margin-top:28px;gap:0;border-top:1px solid var(--linea)}
    .ex-l li{gap:14px;padding:14px 0;border-bottom:1px solid var(--linea);font-size:.98rem;line-height:1.5;align-items:center}
    .ex-l .ic{${SI}}
  `,
  lado: css`
    @media (min-width:880px){.ex-d{grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:clamp(48px,6vw,96px)}.ex-d>div:only-child{grid-column:1/-1;max-width:860px}}
    .ex-f{position:relative;isolation:isolate;max-width:540px;width:100%;justify-self:center;padding:14px;border-radius:var(--r-xl);border:1px solid var(--linea);background:var(--pie)}
    .ex-f::after{content:"";position:absolute;inset:26px;pointer-events:none;z-index:2;background:${VISOR('color-mix(in oklab,var(--texto) 55%,transparent)', '20px')}}
    .ex-f::before{content:"";position:absolute;inset:14px;z-index:1;border-radius:var(--r-l);pointer-events:none;background:linear-gradient(0deg,var(--pie) 0%,transparent 38%)}
    .ex-f img{border-radius:var(--r-l);border:0;filter:saturate(.92) contrast(1.04)}
    .ex-d .h2{font-size:clamp(2.6rem,5.4vw,5rem);line-height:.98;letter-spacing:-.05em}
  `,
  centrado: css`
    .ex-fc{padding:4px;border-radius:50%;margin-bottom:26px;background:conic-gradient(from 200deg,var(--pri),transparent 30%,var(--aura-2),transparent 70%,var(--pri));
      box-shadow:0 0 70px -10px color-mix(in oklab,var(--pri) 45%,transparent)}
    .ex-fc img{display:block;margin:0;border:4px solid var(--fondo)}
    .ex-c .h2{font-size:clamp(2.4rem,5vw,4.4rem);letter-spacing:-.05em}
  `,
};

S.testimonios = {
  base: css`
    ${vidrio('.te', 'border-radius:var(--r-l);gap:18px;padding:clamp(22px,2.6vw,30px)')}
    .te-e{color:var(--acento);gap:3px;filter:drop-shadow(0 0 6px color-mix(in oklab,var(--acento) 45%,transparent))}
    .te blockquote p{font-size:1rem;line-height:1.65;color:var(--texto)}
    .te figcaption strong{font-weight:600}
    .te figcaption small{color:var(--tenue);font-size:.84rem}
    .te-f img{box-shadow:0 0 0 2px var(--fondo),0 0 0 3px var(--linea-2)}
    .te-pc{background:none;border:1px dashed var(--linea-3);box-shadow:none;color:var(--suave)}
  `,
  destacado: css`
    .te-d{gap:18px}
    .te-g{padding:clamp(28px,4vw,56px);${BRILLO}}
    .te-g blockquote p{font:300 clamp(1.4rem,2.6vw,2.1rem)/1.3 var(--f-tit);letter-spacing:-.02em}
  `,
};

S.cifras = {
  base: css`
    .s-cifras{padding-block:clamp(56px,7vw,96px)}
    .ci-ey{text-align:left}
    .ci{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;background:none;border:0;border-top:1px solid var(--linea-2);border-radius:0;overflow:visible}
    .ci li{background:none;padding:22px 16px 24px;text-align:left;align-content:start;gap:10px}
    .ci li:nth-child(odd){padding-left:0}
    .ci li:nth-child(even){border-left:1px solid var(--linea)}
    .ci li:nth-child(n+3){border-top:1px solid var(--linea)}
    .ci li:last-child:nth-child(odd){grid-column:1/-1}
    .ci strong,.ci .ew-odo{font:200 clamp(2.8rem,5.2vw,4.75rem)/1 var(--f-tit);letter-spacing:-.045em;color:var(--texto);font-variant-numeric:tabular-nums}
    .ci span:not(.ew-odo):not(.ew-dg):not(.ew-tira):not(.ew-sr){font-size:.9rem;line-height:1.45;color:var(--suave);max-width:16em}
    @media (min-width:900px){
      .ci{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr)}
      .ci li,.ci li:nth-child(n){padding:26px 28px 8px;border-top:0;border-left:1px solid var(--linea);grid-column:auto}
      .ci li:first-child{border-left:0;padding-left:0}}
  `,
};

S.temario = {
  base: css`
    .tm-n{${MONO};font-size:.66rem;letter-spacing:.12em;color:var(--tenue)}
  `,
  acordeon: css`
    .s-temario .acor{max-width:1000px}
    .acor summary .tm-n{min-width:34px}
  `,
  lista: css`
    .tm-l{gap:18px}
    .tm-l li{padding:clamp(22px,2.6vw,30px)}
    .tm-l .tm-n{color:var(--acento)}
    .tm-l p{color:var(--suave)}
  `,
};

S.oferta = {
  base: css`
    .of-l{gap:0}
    .of-l li{padding:14px 0;border-bottom:1px solid var(--linea);align-items:center;gap:14px}
    .of-l .ic{${SI}}
    .of-v{${MONO};font-size:.66rem;letter-spacing:.08em;color:var(--tenue)}
    .of-total{${MONO};font-size:.66rem;color:var(--tenue)}
    .of-antes{color:var(--tenue)}
    .of-precio{font:200 clamp(3rem,7vw,5.25rem)/1 var(--f-tit);letter-spacing:-.05em;margin-top:8px;text-wrap:balance;color:var(--texto);text-shadow:0 0 50px color-mix(in oklab,var(--pri) 35%,transparent)}
    .of-det{color:var(--suave)}
    .of-seg{${MONO};font-size:.62rem;letter-spacing:.1em;color:var(--tenue)}
    .of-seg .ic{color:var(--acento)}
    .of-p .acc .btn{max-width:460px}
  `,
  tarjeta: css`
    ${vidrio('.of-card', 'max-width:700px;border-radius:var(--r-xl);gap:30px;padding:clamp(26px,4vw,52px)')}
    .of-card{${BRILLO}}
  `,
  dividida: css`
    .of-d{max-width:none;gap:clamp(28px,4vw,56px)}
    ${vidrio('.of-d .of-p', 'border-radius:var(--r-xl);padding:clamp(26px,3.4vw,44px)')}
    .of-d .of-p{${BRILLO}}
    .of-d .of-precio{font-size:clamp(2.6rem,4.6vw,4.25rem)}
  `,
};

S.bonos = {
  base: css`
    .bo{gap:18px;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))}
    .bo-tj{position:relative;padding:28px 28px 30px;gap:8px}
    .bo-i{width:56px;height:56px;border-radius:50%;margin-bottom:16px;background:color-mix(in oklab,var(--pri) 12%,transparent);color:var(--acento);
      box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--acento) 45%,transparent),0 0 30px -8px color-mix(in oklab,var(--pri) 60%,transparent)}
    .bo-f img{border-radius:var(--r-m);border:1px solid var(--linea)}
    .bo-n{${MONO};font-size:.62rem;color:var(--tenue)}
    .bo-v{font:300 1.25rem/1.2 var(--f-tit);letter-spacing:-.015em;color:var(--acento)!important;font-weight:300!important}
  `,
  fotos: css`
    .bo-fs{gap:18px}
    ${vidrio('.bo-ft', 'border-radius:var(--r-l);padding:10px')}
    .bo-ff img{border-radius:var(--r-m);border:1px solid var(--linea)}
    .bo-et{background:var(--fondo);color:var(--acento);box-shadow:inset 0 0 0 1px var(--linea-2);${MONO};font-size:.6rem}
    .bo-ft>.bo-et{margin:16px 14px 0}
    .bo-fc{padding:20px 16px 18px}
    .bo-fc .h3{font-weight:300}
  `,
};

S.garantia = {
  base: css`
    ${vidrio('.ga', 'max-width:920px;border-radius:var(--r-xl);padding:clamp(26px,4vw,52px);gap:clamp(24px,4vw,52px)')}
    .ga{${BRILLO}}
    .ga-s{width:150px;height:150px;color:var(--acento)}
    .ga-s>svg{filter:drop-shadow(0 0 10px color-mix(in oklab,var(--acento) 55%,transparent))}
    @media (prefers-reduced-motion:no-preference){.ew-mv .ga-s>svg{animation:ew-p-gira 50s linear infinite}}
    @keyframes ew-p-gira{to{rotate:1turn}}
    .ga-s span{${MONO};font-size:.6rem;letter-spacing:.16em;color:var(--tenue)}
    .ga-s strong{font:200 3.3rem/1 var(--f-tit);letter-spacing:-.04em;color:var(--texto)}
    .ga-t{font:300 clamp(1.4rem,2.4vw,2rem)/1.2 var(--f-tit);letter-spacing:-.025em}
    .ga-x{color:var(--suave);font-size:1rem}
  `,
};

S.faq = {
  acordeon: css`
    .fq{display:grid;gap:36px}
    .fq .cab{text-align:left;margin:0}
    .fq .cab .lead{margin-inline:0}
    .fq .acor{max-width:none;width:100%;margin-inline:0}
    .fq .acor summary::before{content:counter(ew-fq,decimal-leading-zero);content:counter(ew-fq,decimal-leading-zero) / "";flex:none;min-width:34px;${MONO};font-size:.62rem;letter-spacing:.1em;color:var(--tenue)}
    .fq .acor details>p{padding-left:50px}
    @media (min-width:900px){.fq{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,6vw,96px);align-items:start}}
    @media (max-width:860px){.fq .acor details>p{padding:0 8px 24px 50px}}
    @media (min-width:900px){.ew-mv .fq .cab{position:sticky;top:110px}}
  `,
  columnas: css`
    .fq-c{gap:0 56px}
    .fq-c>div{padding:24px 0;border-top:1px solid var(--linea)}
    .fq-c dt{font:300 clamp(1.1rem,1.5vw,1.3rem)/1.3 var(--f-tit);letter-spacing:-.015em;margin-bottom:10px}
    .fq-c dd{color:var(--suave);line-height:1.62}
  `,
};

S.servicios = {
  base: css`
    .sv-pr{font-family:var(--f-tit);font-weight:300;letter-spacing:-.015em;color:var(--acento)!important}
  `,
  tarjetas: css`
    .sv-g{gap:18px}
    ${vidrio('.sv-tj', 'border-radius:var(--r-l);overflow:hidden')}
    .sv-f{padding:8px 8px 0}.sv-f img{border-radius:var(--r-m)}
    .sv-c{padding:22px 24px 26px}
    .sv-c p{color:var(--suave)}
    .sv-c .sv-pr{align-self:flex-start;margin-top:auto;padding:6px 14px;border-radius:99px;font-size:1.05rem;background:color-mix(in oklab,var(--pri) 14%,transparent);
      box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--pri) 40%,transparent)}
    .sv-c .sv-pr{margin-top:18px}
  `,
  precios: css`
    .sv-p{gap:0;max-width:920px;border-top:1px solid var(--linea)}
    .sv-p li{padding:22px 0;border-bottom:1px solid var(--linea)}
    .sv-p p{color:var(--suave)}
    .sv-pd{border-bottom:1px dashed var(--linea-2)}
    .sv-p .sv-pr{font-size:1.35rem}
  `,
};

S.galeria = {
  base: css`
    .s-galeria figure{border-radius:var(--r-l);border:1px solid var(--linea);box-shadow:0 40px 80px -40px rgb(0 0 0/.8)}
    .s-galeria figcaption{left:10px;right:auto;bottom:10px;max-width:calc(100% - 20px);padding:6px 12px;border-radius:99px;${MONO};font-size:.6rem;letter-spacing:.12em;
      color:var(--texto);background:color-mix(in oklab,var(--fondo) 72%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
  `,
  cuadricula: css`.ga-c{gap:12px}@media (min-width:820px){.ga-c{gap:16px}}`,
  mosaico: css`.ga-m{gap:12px}@media (min-width:820px){.ga-m{gap:16px}}`,
};

S.ubicacion = {
  base: css`
    ${vidrio('.ub', 'gap:0;border-radius:var(--r-xl);max-width:1000px;overflow:hidden')}
    .ub>div{background:none;padding:clamp(24px,3.4vw,40px)}
    @media (min-width:760px){.ub>div+div{border-left:1px solid var(--linea)}}
    @media (max-width:759px){.ub>div+div{border-top:1px solid var(--linea)}}
    .ub-i{width:44px;height:44px;padding:11px;border-radius:50%;color:var(--acento);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--acento) 45%,transparent)}
    .ub-dir{font:300 1.3rem/1.3 var(--f-tit);letter-spacing:-.015em}
    .ub-ref{color:var(--suave)}
    .ub-h div{border-bottom:1px dashed var(--linea-2)}
    .ub-h dt{font-weight:500}
    .ub-h dd{color:var(--suave)}
  `,
};

S.video = {
  base: css`
    .vi{max-width:1060px}
    .vi .vid{margin-top:4px}
  `,
};

S.gracias = {
  base: css`
    .s-gracias{padding-block:clamp(48px,7vw,110px)}
    .s-gracias .w{position:relative;z-index:1}
    .gr{max-width:880px}
    .gr-ok{width:84px;height:84px;margin-bottom:26px;background:color-mix(in oklab,var(--pri) 14%,transparent);color:var(--acento);
      box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--acento) 50%,transparent),0 0 0 10px color-mix(in oklab,var(--pri) 6%,transparent),0 0 60px -10px color-mix(in oklab,var(--pri) 60%,transparent)}
    .gr-ok .ic{width:34px;height:34px}
    .gr .ey{display:inline-flex;align-items:center;gap:12px;padding:8px 16px 8px 13px;border-radius:999px;border:1px solid var(--linea-2);color:var(--texto)}
    .gr .h1{margin-top:20px}
    ${DOS_TONOS('.s-gracias .h1')}
    .gr .lead{margin-top:22px}
    .gr-acc{margin-top:32px}
    .gr-acc .btn{padding:8px 26px 8px 8px;gap:14px}
    .gr-acc .btn .ic{width:40px;height:40px;padding:10px;border-radius:50%;background:var(--sobre-pri);color:var(--pri);flex:none}
    .gr-cal{margin-top:16px}
    .gr-p{gap:12px;margin-top:48px}
    ${vidrio('.gr-p li', 'border-radius:var(--r-l);padding:20px 22px;gap:18px')}
    .gr-p p{color:var(--suave)}
    .gr-n{width:38px;height:38px;background:none;color:var(--acento);font:300 1.1rem/1 var(--f-tit);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--acento) 50%,transparent)}
    .s-gracias .ew-ancla{top:-40px;right:-70px;width:220px;background:none}
    @media (min-width:900px){.s-gracias .ew-ancla{top:6%;right:max(2vw,calc(50% - 660px));width:min(30vw,420px);background:${VISOR('var(--linea-3)', '18px')}}}
  `,
};

S.pie = {
  base: css`
    .s-pie{z-index:1;border-top:0;padding-block:clamp(64px,7vw,104px) 28px;color:var(--suave);
      background:radial-gradient(70% 80% at 50% 130%,var(--aura-c1),transparent 70%),radial-gradient(40% 60% at 95% 120%,var(--aura-c2),transparent 70%),var(--pie)}
    .pie{justify-items:stretch;text-align:left;gap:0;font-size:.84rem;color:var(--suave)}
    .pie-m{display:flex;flex-direction:column-reverse;gap:clamp(28px,4vw,48px);${MONO};font-size:.64rem;letter-spacing:.14em;color:var(--tenue)}
    /* la marca gigante, que se funde hacia abajo (y sube letra por letra con el telón) */
    .pie-m>span{display:block;font:200 clamp(2.75rem,8.4vw,8.5rem)/.94 var(--f-tit);letter-spacing:-.06em;text-transform:none;text-wrap:balance;color:var(--texto);caret-color:var(--texto);
      overflow-wrap:anywhere;padding-bottom:.08em;-webkit-mask:linear-gradient(180deg,#000 30%,rgb(0 0 0/.42) 100%);mask:linear-gradient(180deg,#000 30%,rgb(0 0 0/.42) 100%)}
    .ew-lp{display:inline-block;white-space:nowrap}
    .ew-mv:not(.ew-sin-telon) .ew-l{display:inline-block;--e:clamp(0,calc(var(--ew-r,1)*1.7 - var(--i)*.035),1);transform:translateY(calc((1 - var(--e))*85%));opacity:calc(.15 + var(--e)*.85)}
    .pie-l{justify-content:flex-start;gap:8px 24px;margin-top:40px;padding-top:18px;border-top:1px solid var(--linea);${MONO};font-size:.62rem;letter-spacing:.12em}
    .pie-l a{color:var(--suave);transition:color .25s}
    .pie-l a:hover{color:var(--acento);text-decoration:none}
    .pie .pie-x{margin-top:18px;max-width:62em;color:var(--suave);font-size:.8rem;line-height:1.6}
  `,
};

// ---------- las secciones de una página de evento (7-oct) ----------

S.niveles = {
  base: css`
    /* las entradas: tarjetas de vidrio; la destacada con el brillo del primario */
    .nv-ct .nv-etapa{${MONO};font-size:.62rem;border-color:var(--linea-2);color:var(--acento)}
    .nv-ct-t{${MONO};font-size:.66rem;color:var(--tenue)}
    ${vidrio('.nv-cc', 'border-radius:var(--r-m)')}
    .nv-cc .ct-n,.nv-cc .ew-odo{font-weight:250;letter-spacing:-.04em;color:var(--texto)}
    .nv-cl{${MONO};font-size:.56rem;color:var(--tenue)}
    .nv{gap:16px}
    @media (min-width:1000px){.nv-3{grid-template-columns:repeat(3,minmax(0,1fr))}.nv-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    ${vidrio('.nv-tj', 'border-radius:var(--r-l);padding:clamp(30px,3vw,40px) clamp(20px,2.4vw,28px) clamp(22px,2.4vw,28px)')}
    .nv-dest{${BRILLO}}
    .nv-eti{${MONO};font-size:.6rem;background:var(--pri);color:var(--sobre-pri);z-index:2}
    .nv-nom{${MONO};font-family:var(--f-mono);font-size:.7rem;color:var(--acento)}
    .nv-cab .nv-etapa{${MONO};font-size:.58rem;color:var(--tenue)}
    .nv-p strong{font-weight:250;font-size:clamp(3rem,5vw,4.2rem);letter-spacing:-.05em;color:var(--texto)}
    .nv-mon{${MONO};font-size:.62rem;color:var(--tenue)}
    .nv-cupos b{font-weight:500;color:var(--texto)}
    .nv-barra{height:3px;background:var(--linea-2)}.nv-barra>span{background:var(--pri);box-shadow:0 0 12px var(--pri)}
    .nv-sw{background:var(--pri);box-shadow:0 0 14px -2px color-mix(in oklab,var(--pri) 70%,transparent)}
    .nv-sw::after{background:var(--sobre-pri)}
    .nv-no .nv-sw{background:none;box-shadow:inset 0 0 0 1px var(--linea-2)}
    .nv-no .nv-sw::after{background:var(--linea-3)}
    .nv-seg{${MONO};font-size:.6rem;color:var(--tenue)}
  `,
};

S.equipo = {
  base: css`
    .eq{gap:16px}
    ${vidrio('.eq-tj', 'border-radius:var(--r-l)')}
    .eq-f{padding:12px 12px 0}.eq-f img{border-radius:var(--r-m);filter:saturate(.92) contrast(1.04)}
    .eq-sf .eq-c::before{content:"";width:9px;height:9px;margin-bottom:10px;border-radius:50%;background:var(--pri);box-shadow:0 0 14px var(--pri)}
    .eq-n{font-weight:300;letter-spacing:-.035em;font-size:clamp(1.6rem,2.6vw,2.2rem)}
    .eq-r{${MONO};font-size:.66rem;line-height:1.7;color:var(--acento)}
    .eq-b{line-height:1.65}
  `,
};

S.logistica = {
  base: css`
    .lg{gap:14px}
    @media (min-width:1000px){.lg-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    ${vidrio('.lg-tj', 'border-radius:var(--r-l)')}
    .lg-i{${SI};width:30px;height:30px;padding:7px}
    .lg-r{${MONO};font-size:.62rem;color:var(--tenue)}
    .lg-v{font-weight:300;font-size:1.25rem;letter-spacing:-.02em}
  `,
};

S.dudas = {
  base: css`
    ${vidrio('.du', 'border-radius:var(--r-xl)')}
    .du-i{${SI};width:44px;height:44px;padding:11px}
    .du-t{font-weight:300;letter-spacing:-.03em;font-size:clamp(1.5rem,2.6vw,2rem)}
  `,
};

S.idea = {
  base: css`
    .id-img img{border-radius:var(--r-l);border:1px solid var(--linea-2);filter:saturate(.92) contrast(1.04);box-shadow:0 50px 120px -40px color-mix(in oklab,var(--pri) 40%,transparent)}
    .id-fr{border-left:1px solid var(--pri);font:300 clamp(1.3rem,2.2vw,1.8rem)/1.35 var(--f-tit);letter-spacing:-.02em}
  `,
  lado: css`
    @media (min-width:880px){.id-d{gap:clamp(48px,6vw,96px)}}
  `,
  centrada: css`
    .id-c .id-img{padding:14px;border-radius:var(--r-xl);border:1px solid var(--linea);background:var(--pie)}
  `,
};

S.caminos = {
  base: css`
    .cm{gap:16px}
    ${vidrio('.cm-col', 'border-radius:var(--r-l)')}
    .cm-b{${BRILLO}}
    .cm-r{${MONO};font-size:.62rem;color:var(--tenue)}.cm-b .cm-r{color:var(--acento)}
    .cm-t{font-weight:300;letter-spacing:-.025em;font-size:clamp(1.45rem,2.2vw,1.9rem)}
    .cm-a .ic{${NO}}.cm-b .ic{${SI}}
    .cm-c{border-top-color:var(--linea)}
  `,
};

export const CSS_PENUMBRA = { base: BASE, secciones: S };

// Privacidad y términos sobre el mismo negro, con Sora fina en los títulos.
export const CSS_LEGAL_PENUMBRA = css`
  html{background:var(--fondo)}
  body{background:radial-gradient(60% 40% at 90% 0%,var(--aura-c1),transparent 70%) no-repeat,var(--fondo)}
  .lg h1{font-weight:250;letter-spacing:-.04em}
  .lg h2{font-weight:300;letter-spacing:-.02em}
  .lg-volver{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}
`;
