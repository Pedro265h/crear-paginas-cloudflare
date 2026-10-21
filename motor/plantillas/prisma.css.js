// CSS de PRISMA por sección (contrato en ./index.js). Va después del CSS clásico y lo pisa. Todo color sale de los tokens
// que arma coloresPrisma() con la marca (--fondo, --noche, --pri-a/--pri/--pri-c, --hl-a/--hl-c, --alt…): nada de colores
// fijos, así una página con colores propios se pinta con los suyos sin pasar por otro CSS. Las secciones claras de la
// identidad redefinen los tokens de texto para lo que llevan dentro (como los bloques de VOLTAJE), y las tarjetas «una
// oscura y una clara» hacen lo mismo. Lo que se mueve o se fija va bajo .ew-mv (lo pone el JS de movimiento): sin JS y en
// edición la página queda quieta, completa y clicable.
import { css } from './css.js';

// El degradado de la identidad (botones, números, el prisma): punta clara → primario (42 %) → acento. Se escribe en cada
// regla (no como variable de :root) para que una sección con su propio color de botón lo tome.
const GRAD = 'linear-gradient(100deg,var(--pri-a),var(--pri) 42%,var(--pri-c))';
// Borde de las tarjetas y del vidrio: el primario translúcido. Al pasar, el acento.
const BORDE = 'color-mix(in srgb,var(--pri) 24%,transparent)';
const BORDE_ON = 'color-mix(in srgb,var(--pri-c) 62%,transparent)';
const SOMBRA = '0 8px 40px rgba(0,0,0,.4)';
// Tarjeta de vidrio (sobre la noche, sobre el negro o, en una sección clara, blanca).
const TARJETA = `background:color-mix(in srgb,var(--sup) 92%,transparent);border:1px solid ${BORDE};border-radius:var(--rp);box-shadow:${SOMBRA}`;
// Sube 6 px y el borde va al acento (solo con mouse).
const SUBE = (sel) =>
  `${sel}{transition:transform .45s var(--ease),border-color .3s,box-shadow .35s}` +
  `@media (hover:hover){${sel}:hover{transform:translateY(-6px);border-color:${BORDE_ON};box-shadow:0 18px 60px color-mix(in srgb,var(--pri) 22%,transparent),${SOMBRA}}}`;
// Rótulo: Jost en mayúsculas muy espaciadas.
const ROT = (tam = '.74rem', esp = '.34em') => `font:400 ${tam}/1.45 var(--f-rot);letter-spacing:${esp};text-transform:uppercase`;
// Texto en degradado (los resaltados de los títulos, los precios). Sin soporte de background-clip queda del primer color.
const TXT_GRAD = 'color:var(--hl-a);background:linear-gradient(100deg,var(--hl-a),var(--hl-c));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent';
// Caja de ícono con un prisma (triángulo en degradado): la firma de las tarjetas.
const CAJA = (tam = '46px') =>
  `content:"";display:block;flex:none;width:${tam};height:${tam};border-radius:12px;border:1px solid ${BORDE};` +
  'background:conic-gradient(from 150deg at 50% 0,var(--hl-a),var(--hl-c) 60deg,transparent 0) 50% 52%/40% 36% no-repeat,' +
  'color-mix(in srgb,var(--pri) 12%,var(--sup))';
// Panel de azul noche (secciones de argumento): ancho contenido como en la referencia, con un halo en la esquina.
const PANEL_FONDO = 'radial-gradient(70% 55% at 88% 0%,var(--luz),transparent 72%),linear-gradient(180deg,var(--noche),var(--noche-2))';
const PANEL = `max-width:var(--panel);margin-inline:auto;background:${PANEL_FONDO}`;

// Las secciones claras de la identidad (blanco lavanda con halos de color) y lo que llevan dentro. Si la persona le puso
// un fondo propio a una de ellas (.ew-est-f), manda el suyo.
const CLARAS = '.s-comparacion,.s-para_quien,.s-testimonios,.s-garantia,.s-cta.v-banda';
const ALT =
  'max-width:var(--panel);margin-inline:auto;color:var(--alt-texto);' +
  'background:radial-gradient(42% 52% at 94% 6%,var(--alt-halo-c),transparent 72%),radial-gradient(46% 56% at 4% 96%,var(--alt-halo-a),transparent 72%),var(--alt);' +
  '--fondo:var(--alt);--sup:var(--alt-sup);--sup2:var(--alt-sup);--texto:var(--alt-texto);--suave:var(--alt-suave);--tenue:var(--alt-tenue);' +
  '--linea:var(--alt-linea);--linea-2:var(--alt-linea);--acento:var(--alt-hl-a);--hl-a:var(--alt-hl-a);--hl-c:var(--alt-hl-c);--fuerte:var(--alt-fuerte);--sombra-t:rgba(30,20,80,.10)';
// Una sección clara pegada a otra clara vuelve a la noche (el ritmo es claro, oscuro, claro).
const OSCURA =
  `${PANEL};color:var(--n-texto);--fondo:var(--n-fondo);--sup:var(--n-sup);--sup2:var(--n-sup2);--texto:var(--n-texto);--suave:var(--n-suave);` +
  '--tenue:var(--n-tenue);--linea:var(--n-linea);--linea-2:var(--n-linea);--acento:var(--n-acento);--hl-a:var(--n-hl-a);--hl-c:var(--n-hl-c);--fuerte:var(--n-fuerte);--sombra-t:rgba(0,0,0,.4)';
// Tarjeta oscura (la columna «es») y tarjeta clara (la columna «no es»), en cualquier sección.
const OSC =
  'background:var(--osc);color:var(--osc-texto);--sup:var(--osc);--texto:var(--osc-texto);--suave:var(--osc-suave);--tenue:var(--osc-suave);' +
  '--acento:var(--osc-hl);--hl-a:var(--osc-hl);--hl-c:var(--osc-acento);--fuerte:var(--osc-texto);--linea:color-mix(in srgb,var(--osc-texto) 12%,transparent);' +
  `border:1px solid color-mix(in srgb,var(--pri) 42%,transparent);box-shadow:0 0 0 1px color-mix(in srgb,var(--pri) 10%,transparent),0 24px 70px -18px color-mix(in srgb,var(--pri) 55%,transparent)`;
const CLARA =
  'background:var(--alt-sup);color:var(--alt-texto);--sup:var(--alt-sup);--texto:var(--alt-texto);--suave:var(--alt-suave);--tenue:var(--alt-tenue);' +
  '--acento:var(--alt-hl-a);--hl-a:var(--alt-hl-a);--hl-c:var(--alt-hl-c);--fuerte:var(--alt-fuerte);--linea:var(--alt-linea);' +
  'border:1px solid var(--alt-linea);box-shadow:0 18px 50px -20px rgba(30,20,80,.22)';

// El prisma de luz en CSS (lo que se ve sin WebGL, en edición o mientras llega la escena): un haz, las caras del prisma y
// el resplandor de su base. Lo dibujan ::before (luz) y ::after (prisma) de la caja que lo lleva.
const PRISMA_LUZ =
  'content:"";position:absolute;pointer-events:none;z-index:-1;' +
  'background:radial-gradient(46% 12% at 50% 96%,color-mix(in srgb,var(--pri) 55%,transparent),transparent 70%),' +
  'radial-gradient(60% 9% at 24% 92%,color-mix(in srgb,var(--pri) 30%,transparent),transparent 70%),' +
  'radial-gradient(60% 9% at 76% 92%,color-mix(in srgb,var(--pri-c) 26%,transparent),transparent 70%),' +
  'linear-gradient(90deg,transparent calc(50% - 1px),color-mix(in srgb,var(--pri-a) 80%,transparent) 50%,transparent calc(50% + 1px)) 50% 0/100% 92% no-repeat;' +
  'transition:opacity 1.4s ease';
const PRISMA_CARAS =
  'content:"";position:absolute;pointer-events:none;z-index:-1;clip-path:polygon(50% 0,94% 92%,6% 92%);' +
  'background:linear-gradient(100deg,color-mix(in srgb,var(--pri) 46%,transparent),color-mix(in srgb,var(--pri) 18%,transparent) 49.6%,' +
  'color-mix(in srgb,var(--pri-a) 70%,transparent) 50%,color-mix(in srgb,var(--pri-c) 22%,transparent) 50.6%,color-mix(in srgb,var(--pri-c) 40%,transparent));' +
  '-webkit-mask:linear-gradient(#000,rgba(0,0,0,.35) 70%,transparent 96%);mask:linear-gradient(#000,rgba(0,0,0,.35) 70%,transparent 96%);transition:opacity 1.4s ease';

const BASE = css`
  :root{
    --ease:cubic-bezier(.2,.8,.2,1);--panel:1150px;--rp:18px;
    --escenario:clamp(190px,24vw,320px);
    /* los tokens de la noche, para volver a ellos dentro de una sección clara */
    --n-fondo:var(--noche);--n-sup:var(--sup);--n-sup2:var(--sup2);--n-texto:var(--texto);--n-suave:var(--suave);--n-tenue:var(--tenue);
    --n-linea:var(--linea);--n-acento:var(--acento);--n-hl-a:var(--hl-a);--n-hl-c:var(--hl-c);--n-fuerte:var(--fuerte);--sombra-t:rgba(0,0,0,.4)
  }
  html{scroll-padding-top:96px}
  body{background:var(--fondo);font-size:1.0625rem;line-height:1.62;overflow-x:clip}
  /* el resplandor de abajo (fijo, muy tenue: medido en coloresPrisma como --luz) */
  body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(1200px 500px at 50% 115%,var(--luz),transparent 70%)}
  ::selection{background:var(--pri);color:var(--sobre-pri)}
  .sec{padding-block:clamp(72px,9vw,124px);position:relative;overflow-x:clip}
  .b-sup{background:transparent}.b-ninguna{padding:0}
  .w{max-width:1180px;padding-inline:clamp(20px,4vw,40px)}
  :focus-visible{outline:2px solid var(--hl-a);outline-offset:3px}

  /* letras: títulos en Sora, texto en Manrope y rótulos en Jost */
  h1,h2,h3,.h1,.h2,.h3{font-weight:600;color:var(--texto)}
  .h1{font-size:clamp(2.3rem,5.2vw,4.4rem);line-height:1.07;letter-spacing:-.028em;font-weight:700}
  .h1.h1-l{font-size:clamp(2rem,4.1vw,3.4rem)}
  .h2{font-size:clamp(1.95rem,3.9vw,3.45rem);line-height:1.12;letter-spacing:-.024em}
  .h2.h2-l{font-size:clamp(1.8rem,3.5vw,3rem)}
  .h3{font-size:clamp(1.12rem,1.45vw,1.3rem);line-height:1.3;letter-spacing:-.012em;font-weight:600}
  .hl{font-weight:700;${TXT_GRAD}}
  /* el énfasis dentro de un texto (**negrita** y *resaltado*): la negrita en el color fuerte, el resaltado en degradado */
  :is(p,li,span,dd,small,blockquote) strong{font-weight:700;color:var(--fuerte)}
  :is(.h1,.h2,.h3) strong{font-weight:700;color:var(--fuerte)}
  .ey{${ROT()};color:var(--acento);gap:10px;margin:0 0 18px}
  .ey::before{width:6px;height:6px;border-radius:50%;background:var(--pri);box-shadow:0 0 10px var(--pri)}
  .lead{color:var(--suave);font-size:clamp(1.02rem,1.25vw,1.15rem);line-height:1.7;max-width:62ch}
  .cab{margin-bottom:clamp(40px,5vw,64px)}.cab-c{max-width:880px}
  .cab-c .h2{margin-inline:auto}

  /* botón: píldora con el degradado de la identidad, su resplandor y un brillo que la cruza */
  .btn{position:relative;isolation:isolate;overflow:hidden;min-height:58px;padding:14px 32px;gap:14px;border:0;border-radius:999px;background:${GRAD};
    color:var(--sobre-pri);font:700 .86rem/1.25 var(--f-txt);letter-spacing:.14em;text-transform:uppercase;
    box-shadow:0 0 24px color-mix(in srgb,var(--pri) 42%,transparent);transition:transform .35s var(--ease),box-shadow .35s}
  .btn:hover{filter:none;transform:translateY(-2px);box-shadow:0 0 60px color-mix(in srgb,var(--pri) 58%,transparent)}
  .btn:active{transform:scale(.98)}
  .btn:focus-visible{outline:2px solid var(--hl-a);outline-offset:3px}
  .btn-f{font-size:1.15em;letter-spacing:0}
  .btn-g{min-height:60px;max-width:100%;font-size:.9rem;letter-spacing:.16em}
  @media (max-width:620px){.btn,.btn-g{padding-inline:22px;font-size:.82rem;letter-spacing:.1em}}
  /* centrado (portada, cierre, cuenta regresiva): la píldora ancha de la identidad */
  :is(.hero-c,.hero-v,.cta-in,.ct,.sec-acc) .btn-g{min-width:min(420px,calc(100vw - 40px))}
  @media (prefers-reduced-motion:no-preference){
    .ew-mv .btn::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.32) 50%,transparent 62%) no-repeat;
      background-size:260% 100%;background-position:160% 0;animation:ew-brillo 6s var(--ease) 1.2s infinite}}
  @keyframes ew-brillo{0%,62%{background-position:160% 0}100%{background-position:-60% 0}}
  .btn-sec{min-height:46px;padding:10px 20px;gap:10px;background:color-mix(in srgb,var(--sup) 70%,transparent);color:var(--texto);border:1px solid ${BORDE};box-shadow:none;${ROT('.7rem', '.2em')}}
  .btn-sec:hover{border-color:${BORDE_ON};box-shadow:none;transform:none}
  .btn-sec::after{content:none!important}
  .btn-sec .ic{width:18px;height:18px;color:var(--hl-c)}
  .nota{color:var(--tenue);font-size:.84rem;margin-top:14px}
  .acc{margin-top:32px}
  .sec-acc{margin-top:clamp(40px,5vw,60px)}

  /* piezas compartidas */
  .tj{${TARJETA}}
  .evento{gap:10px;margin-top:22px}
  .evento li{padding:8px 16px;border:1px solid ${BORDE};border-radius:999px;background:color-mix(in srgb,var(--sup) 80%,transparent);color:var(--suave);font-size:.88rem}
  .evento .ic{color:var(--hl-c)}.evento small{color:var(--tenue)}.evento .hl-local:not(:empty){color:var(--hl-a)}
  .hero-pts li{color:var(--suave)}.hero-pts .ic{color:var(--hl-c)}
  .acor{gap:12px}
  .acor details{background:color-mix(in srgb,var(--sup) 92%,transparent);border:1px solid ${BORDE};border-radius:12px;transition:border-color .3s}
  .acor details[open]{border-color:color-mix(in srgb,var(--pri) 45%,transparent)}
  .acor summary{padding:21px 24px;font-weight:500;color:var(--texto);transition:color .25s}
  .acor details[open] summary{color:var(--hl-a)}
  .acor-i{color:var(--hl-a);width:18px;height:18px}
  .acor details>p{padding:0 24px 22px;color:var(--suave);line-height:1.7}
  @media (hover:hover){.acor summary:hover{color:var(--hl-a)}}
  @supports (interpolate-size:allow-keywords){@media (prefers-reduced-motion:no-preference){
    .acor{interpolate-size:allow-keywords}
    .acor details::details-content{block-size:0;overflow:clip;transition:block-size .35s var(--ease),content-visibility .35s allow-discrete}
    .acor details[open]::details-content{block-size:auto}}}
  .vid{border:1px solid ${BORDE};border-radius:var(--rp);box-shadow:0 0 0 6px color-mix(in srgb,var(--pri) 9%,transparent),0 40px 110px -40px color-mix(in srgb,var(--pri) 60%,transparent)}
  .vid-p{width:80px;height:80px;margin:-40px 0 0 -40px;background:${GRAD};color:var(--sobre-pri);box-shadow:0 0 0 10px color-mix(in srgb,var(--pri) 20%,transparent),0 0 40px color-mix(in srgb,var(--pri) 60%,transparent)}
  .vid-pc{background:var(--sup2)}
  .img-pc{border-radius:var(--rp);border-color:${BORDE};background:var(--sup)}

  /* formulario: campos de vidrio con el rótulo arriba */
  .form{gap:14px}
  .campo{gap:8px}
  .campo>span{${ROT('.68rem', '.22em')};color:var(--suave)}
  .campo small{font:inherit;letter-spacing:.06em;text-transform:none;color:var(--tenue)}
  .campo input{min-height:54px;background:color-mix(in srgb,var(--fondo) 55%,var(--sup));border:1px solid ${BORDE};border-radius:12px;color:var(--texto)}
  .campo input:focus{border-color:var(--hl-c);box-shadow:0 0 0 3px color-mix(in srgb,var(--pri-c) 22%,transparent)}
  .form .btn{width:100%;margin-top:8px}
  .form-msg{border-radius:12px;background:var(--sup2)}
  .modal-c{${TARJETA};background:var(--sup);border-radius:22px}
  .modal-t{font:600 1.4rem/1.2 var(--f-tit);letter-spacing:-.015em}
  .modal::backdrop{background:color-mix(in srgb,var(--noche) 78%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}

  /* el prisma de luz: el lienzo de la escena y su ancla */
  .ew-ancla{position:absolute;inset:0;z-index:-3;pointer-events:none}
  .ew-lienzo{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:-1;opacity:0;transition:opacity 1.6s ease;pointer-events:none}
  .ew-lienzo.ew-on{opacity:1}
  /* con la escena dibujando, el prisma de CSS se apaga */
  .ew-gl .hero-c::before,.ew-gl .hero-c::after,.ew-gl .hero-form::before,.ew-gl .hero-form::after,.ew-gl .hero-sf::before,.ew-gl .hero-sf::after,.ew-gl .gr::before,.ew-gl .gr::after{opacity:0}

  /* las secciones claras y su ritmo */
  :is(${CLARAS}):not(.ew-est-f){${ALT}}
  /* el botón sobre lo claro: con su anillo (3:1 contra el fondo, medido en coloresPrisma) */
  :is(${CLARAS}):not(.ew-est-f) .btn{box-shadow:0 0 0 1.5px var(--alt-anillo),0 14px 40px -12px color-mix(in srgb,var(--pri) 55%,transparent)}
  :is(${CLARAS}):not(.ew-est-f)+:is(${CLARAS}):not(.ew-est-f) .btn{box-shadow:0 0 24px color-mix(in srgb,var(--pri) 42%,transparent)}
  :is(${CLARAS}):not(.ew-est-f)+:is(${CLARAS}):not(.ew-est-f){${OSCURA}}

  /* barra del botón en el celular (si no hay barra de arriba con su botón) */
  .ew-barra .btn{width:100%;box-shadow:0 0 0 1px ${BORDE},0 18px 40px -12px #000,0 0 30px color-mix(in srgb,var(--pri) 40%,transparent)}
  .ew-mv:has(.ew-tb) .ew-barra{display:none!important}

  /* la marca gigante del pie, que corre (la arma el decorado) */
  .ew-marq{overflow:hidden;white-space:nowrap}
  .ew-pista{display:flex;width:max-content;will-change:transform}
  .ew-it{display:inline-flex;align-items:center;gap:.4em;padding-right:.4em}
  .ew-it i{display:inline-block;width:.42em;height:.36em;background:currentColor;clip-path:polygon(50% 0,100% 100%,0 100%)}

  /* los dígitos que ruedan: de ancho fijo y con sus espacios */
  .ew-odo{font-variant-numeric:tabular-nums}.ew-odo>span:not(.ew-dg){white-space:pre}

  @media (prefers-reduced-motion:reduce){.btn,.tj{transition:none}}
`;

const S = {};

S.aviso = {
  base: css`
    /* la barra de arriba: vidrio que flota (con JS queda fija al bajar), la marca a la izquierda y su botón a la derecha */
    .s-aviso{position:relative;z-index:40;padding:14px clamp(12px,2vw,24px) 0;background:transparent;color:var(--suave)}
    .s-aviso:has(+.s-hero,+.s-gracias){margin-bottom:-76px}
    .ew-mv .s-aviso:first-child{position:sticky;top:0}
    .aviso-a{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;width:min(1200px,100%);min-height:62px;margin:0 auto;padding:10px 12px 10px 22px;
      border-radius:18px;background:color-mix(in srgb,var(--noche) 88%,transparent);-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);
      border:1px solid ${BORDE};box-shadow:${SOMBRA};color:var(--suave);font:500 .9rem/1.35 var(--f-txt);letter-spacing:0;text-decoration:none}
    .aviso-a>span:not([aria-hidden]){display:inline-flex;align-items:center;gap:10px;min-width:0}
    .aviso-a>span:not([aria-hidden])::before{content:"";flex:none;width:6px;height:6px;border-radius:50%;background:var(--pri);box-shadow:0 0 10px var(--pri)}
    .aviso-a>span[aria-hidden]:not([class]){flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:${GRAD};color:var(--sobre-pri);font-weight:700;
      box-shadow:0 0 18px color-mix(in srgb,var(--pri) 40%,transparent)}
    .aviso-a:hover>span[aria-hidden]:not([class]){transform:translateX(2px)}
    /* con el decorado: la marca, la frase y el botón */
    .ew-tb{justify-content:space-between}
    .ew-tb-m{flex:0 1 auto;min-width:0;max-width:38%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:600 1.02rem/1.2 var(--f-tit);letter-spacing:-.01em;color:var(--texto)}
    .ew-tb-m b{font-weight:700;${TXT_GRAD}}
    /* con el logo de la marca (plan.marca.logo): la imagen en vez del nombre */
    .ew-tb-m:has(img){display:flex;align-items:center;line-height:0}
    .ew-tb-m img{display:block;height:clamp(18px,2vw,26px);width:auto;max-width:100%;object-fit:contain;object-position:left center}
    /* la frase del aviso: su negrita en el color fuerte */
    .aviso-a strong{color:var(--fuerte);font-weight:700}
    .ew-tb-b{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:10px 20px;border-radius:999px;background:${GRAD};color:var(--sobre-pri);
      ${ROT('.72rem', '.12em')};font-weight:500;white-space:nowrap;box-shadow:0 0 24px color-mix(in srgb,var(--pri) 38%,transparent);transition:box-shadow .3s}
    .aviso-a:hover .ew-tb-b{box-shadow:0 0 44px color-mix(in srgb,var(--pri) 58%,transparent)}
    .ew-mv .ew-tb:has(.ew-tb-b)>span[aria-hidden]:not([class]){display:none}
    @media (max-width:860px){
      .ew-mv .ew-tb>span:not([aria-hidden]){position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
      .ew-tb-m{max-width:52%;font-size:.95rem}.ew-tb-b{padding:9px 14px;font-size:.66rem}}
    @media (max-width:520px){.aviso-a{padding:8px 8px 8px 16px;min-height:58px;font-size:.84rem}}
  `,
};

S.hero = {
  base: css`
    .s-hero{isolation:isolate;overflow:hidden;padding-block:clamp(96px,10vw,130px) clamp(56px,6vw,88px);
      background:radial-gradient(64% 48% at 50% 0%,var(--luz),transparent 72%)}
    .s-aviso+.s-hero{padding-top:clamp(126px,12vw,162px)}
    .s-hero .ey{display:inline-flex;align-items:center;gap:10px;margin:0;padding:8px 16px;border-radius:999px;border:1px solid ${BORDE};
      background:color-mix(in srgb,var(--noche) 82%,transparent);font:500 .86rem/1.35 var(--f-txt);letter-spacing:0;text-transform:none;color:var(--suave)}
    .s-hero .h1{margin:20px 0 0;max-width:17em}
    .s-hero .lead{margin-top:20px;max-width:58ch}
    .s-hero .acc{margin-top:32px}
    @media (max-width:620px){.s-hero .ey{font-size:.8rem;padding:6px 14px}.s-hero .lead{font-size:1rem;margin-top:16px}.s-hero .acc{margin-top:26px}}
  `,
  centrado: css`
    .hero-c{align-items:center;text-align:center}
    .hero-c .h1{margin-inline:auto}
    /* la fecha y el lugar debajo del botón */
    .hero-c>.evento{order:2;margin-top:22px}
    /* sin foto: el escenario del prisma arriba del texto */
    .hero-c:not(:has(.hero-img)){position:relative;padding-top:var(--escenario)}
    .hero-c:not(:has(.hero-img))::before{${PRISMA_LUZ};left:50%;top:-30px;width:min(760px,96vw);height:calc(var(--escenario) + 30px);transform:translateX(-50%)}
    .hero-c:not(:has(.hero-img))::after{${PRISMA_CARAS};left:50%;top:0;width:calc(var(--escenario)*.92);height:calc(var(--escenario)*.9);transform:translateX(-50%)}
    /* con foto: la foto de fondo, desvanecida a la noche y con viñeta; el texto sobre su parte de abajo */
    .s-hero.v-centrado:has(.hero-img){--foto:clamp(400px,60vw,820px);padding-top:calc(var(--foto)*.74)}
    .s-aviso+.s-hero.v-centrado:has(.hero-img){padding-top:calc(var(--foto)*.74)}
    .hero-img{position:absolute;z-index:-1;left:50%;top:0;width:min(var(--panel),100%);height:var(--foto,auto);margin:0;transform:translateX(-50%);border:0;border-radius:0;overflow:hidden}
    .hero-img img{width:100%;height:100%;aspect-ratio:auto;object-fit:cover;object-position:50% 24%}
    .hero-img::before,.hero-img::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none}
    .hero-img::before{background:linear-gradient(to bottom,color-mix(in srgb,var(--fondo) 55%,transparent),color-mix(in srgb,var(--fondo) 5%,transparent) 18%,transparent 34%,
      color-mix(in srgb,var(--fondo) 42%,transparent) 52%,color-mix(in srgb,var(--fondo) 88%,transparent) 72%,var(--fondo) 92%)}
    .hero-img::after{background:radial-gradient(130% 90% at 50% 38%,transparent 55%,color-mix(in srgb,var(--fondo) 90%,transparent))}
    /* en el celular la foto entera (su forma, a lo ancho) arriba del texto, que sube sobre su parte de abajo */
    @media (max-width:760px){.s-hero.v-centrado:has(.hero-img),.s-aviso+.s-hero.v-centrado:has(.hero-img){padding-top:clamp(64px,18vw,84px)}
      .s-hero.v-centrado .hero-img{position:relative;order:-1;left:auto;transform:none;width:auto;height:auto;margin:0 calc(clamp(20px,4vw,40px)*-1) -16vw}
      .s-hero.v-centrado .hero-img img{height:auto;aspect-ratio:auto;max-height:78vh}}
    /* con foto, los puntos clave van en una cinta a lo ancho, al pie de la portada: quietos y centrados sin JS; con JS el
       decorado arma una que corre (.ew-pts-m) y esta queda para los lectores de pantalla */
    .s-hero.v-centrado:has(.hero-img) .hero-pts,.ew-pts-m{order:3;align-self:stretch;margin:clamp(36px,4vw,56px) calc(50% - 50vw) calc(clamp(56px,6vw,88px)*-1);
      padding:12px 0;border-block:1px solid color-mix(in srgb,var(--pri) 18%,transparent);background:var(--noche);
      ${ROT('.75rem', '.28em')};font-weight:300;color:color-mix(in srgb,var(--hl-a) 80%,var(--texto))}
    .s-hero.v-centrado:has(.hero-img) .hero-pts{display:flex;justify-content:center;flex-wrap:nowrap;gap:0;overflow:hidden;white-space:nowrap}
    .s-hero.v-centrado:has(.hero-img) .hero-pts li{display:inline;color:inherit}
    .s-hero.v-centrado:has(.hero-img) .hero-pts li+li::before{content:"·";margin:0 1.2em}
    .s-hero.v-centrado:has(.hero-img) .hero-pts .ic{display:none}
    .ew-pts-m .ew-it{gap:0;padding-right:0}
    .ew-pts-m .ew-it i{width:4px;height:4px;margin:0 1.4em;border-radius:50%;clip-path:none;background:currentColor;opacity:.7}
  `,
  '+logo': css`
    /* el logo en lugar del título, con una sombra para que se lea sobre la foto */
    .s-hero .h1-logo{margin:14px 0 0}
    .s-hero .h1-logo img{width:min(556px,82vw);max-height:none;filter:drop-shadow(0 2px 24px rgba(0,0,0,.85))}
    .s-hero .ey+.h1-logo{margin-top:12px}
  `,
  dividido: css`
    .hero-d{gap:clamp(36px,5vw,72px);align-items:center}
    .hero-d .hero-t{display:flex;flex-direction:column;align-items:flex-start;text-align:left}
    .hero-d .acc{align-items:flex-start}
    .hero-m{position:relative;isolation:isolate}
    .hero-m::before{content:"";position:absolute;inset:8% -8% -6%;z-index:-1;pointer-events:none;
      background:radial-gradient(50% 50% at 30% 40%,color-mix(in srgb,var(--pri) 38%,transparent),transparent 70%),radial-gradient(45% 45% at 75% 70%,color-mix(in srgb,var(--pri-c) 26%,transparent),transparent 70%);filter:blur(10px)}
    .hero-m img{border:1px solid ${BORDE};border-radius:var(--rp);box-shadow:${SOMBRA}}
    .hero-m:has(img)::after{content:"";position:absolute;inset:0;border-radius:var(--rp);pointer-events:none;background:linear-gradient(to top,color-mix(in srgb,var(--fondo) 70%,transparent),transparent 42%)}
    /* sin foto: el prisma a la derecha del texto */
    .hero-sf{position:relative}
    @media (min-width:900px){.hero-sf{padding-right:min(40%,460px)}
      .hero-sf::before{${PRISMA_LUZ};right:2%;top:50%;width:min(36%,420px);aspect-ratio:1/1.06;transform:translateY(-50%)}
      .hero-sf::after{${PRISMA_CARAS};right:calc(2% + min(36%,420px)*.06);top:50%;width:calc(min(36%,420px)*.88);aspect-ratio:1/1.02;transform:translateY(-52%)}}
  `,
  video: css`
    .hero-v .h1{font-size:clamp(1.8rem,3.4vw,3rem)!important;line-height:1.1!important;max-width:24em}
    .hero-v .vid{margin-top:clamp(24px,3vw,36px)}
    .hero-v .hero-pts{gap:10px 26px}
  `,
  evento: css`
    .hero-e{gap:28px;align-items:start}
    @media (min-width:960px){.hero-e{align-items:start;column-gap:clamp(40px,5vw,80px)}}
    .hero-e .hero-t{display:flex;flex-direction:column;align-items:flex-start;text-align:left}
    .hero-e .acc{align-items:flex-start}
    /* la tarjeta del formulario, con el prisma encima */
    .hero-form{position:relative;isolation:isolate;margin-top:var(--escenario);${TARJETA};padding:clamp(22px,2.6vw,32px)}
    .hero-form::before{${PRISMA_LUZ};left:50%;bottom:calc(100% - 18px);width:min(150%,640px);height:calc(var(--escenario) + 10px);transform:translateX(-50%)}
    .hero-form::after{${PRISMA_CARAS};left:50%;bottom:100%;width:calc(var(--escenario)*.86);height:calc(var(--escenario)*.84);transform:translateX(-50%)}
    .hero-form-t{font:600 1.35rem/1.2 var(--f-tit);letter-spacing:-.015em;margin:0 0 18px}
    @media (max-width:959px){.hero-form{margin-top:calc(var(--escenario)*.9)}}
  `,
};

S.formulario = {
  base: css`
    .s-formulario{${PANEL}}
    .fo-card{position:relative;${TARJETA};padding:clamp(22px,3vw,34px)}
    .fo-t{max-width:640px}
    .fo-t .fo-card{margin-top:0}
  `,
  dividido: css`
    .fo-d{gap:clamp(32px,5vw,64px)}
    .fo-d .cab{text-align:left;margin:0}
    .fo-d .evento{margin-top:24px}
  `,
};

S.contador = {
  base: css`
    .s-contador{${PANEL}}
    .ct .h3{display:inline-flex;align-items:center;gap:10px;margin:0 0 22px;padding:8px 18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--pri-c) 40%,transparent);
      background:color-mix(in srgb,var(--pri-c) 8%,var(--noche));color:var(--hl-c);${ROT('.74rem', '.28em')}}
    .ct .h3::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--hl-c);box-shadow:0 0 10px var(--hl-c)}
    .ct-g{gap:12px;max-width:580px}
    .ct-c{${TARJETA};border-radius:14px;padding:18px 6px 14px;gap:8px}
    .ct-c .ew-odo{justify-content:center}
    .ct-n,.ct-c .ew-odo{font:700 clamp(2.1rem,6vw,3.2rem)/1 var(--f-tit);letter-spacing:-.02em;color:var(--fuerte);font-variant-numeric:tabular-nums}
    .ct-l{${ROT('.62rem', '.28em')};color:var(--tenue)}
    .ct .acc{margin-top:36px}
  `,
};

S.cta = {
  base: css`
    .cta-in{align-items:center;text-align:center}
    .s-cta .h2{font-size:clamp(2.1rem,4.6vw,4.1rem);max-width:16em;margin-inline:auto;line-height:1.08}
    .s-cta .h2.h2-l{font-size:clamp(1.9rem,4.2vw,3.8rem);max-width:13.5em}
    .cta-in .lead{margin-top:22px;max-width:56ch}
    .cta-in .acc{margin-top:36px}
  `,
  banda: css`
    .s-cta.v-banda{color:var(--texto)}
    .s-cta.v-banda h2,.s-cta.v-banda .h2{color:var(--texto)}
    .s-cta.v-banda .ey{color:var(--acento);opacity:1}.s-cta.v-banda .lead{color:var(--suave);opacity:1}.s-cta.v-banda .nota{color:var(--tenue);opacity:1}
    .s-cta.v-banda .hl{text-decoration:none;${TXT_GRAD}}
    .s-cta.v-banda .btn{background:${GRAD};color:var(--sobre-pri)}
  `,
  tarjeta: css`
    .s-cta.v-tarjeta{isolation:isolate;padding-block:clamp(88px,11vw,150px);background:radial-gradient(46% 34% at 50% 72%,var(--luz),transparent 72%)}
    .s-cta.v-tarjeta .cta-in{background:none;border:0;border-radius:0;padding:0;overflow:visible}
    .s-cta.v-tarjeta .cta-in::before{content:none}
  `,
};

S.beneficios = {
  base: css`
    .s-beneficios p{color:var(--suave)}
  `,
  tarjetas: css`
    .be-g{gap:18px}
    /* cuatro: en una fila (las cuatro áreas de la transformación) */
    @media (min-width:1040px){.be-g:has(>:nth-child(4):last-child){grid-template-columns:repeat(4,minmax(0,1fr))}}
    .be-tj{position:relative;overflow:hidden;isolation:isolate;padding:clamp(26px,2.8vw,36px);gap:12px}
    .be-tj::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--pri),var(--pri-c))}
    .be-tj .h3::before{${CAJA()};margin-bottom:22px}
    ${SUBE('.be-tj')}
    .be-i{position:absolute;z-index:-1;right:14px;top:-4px;margin:0;font:700 clamp(4.2rem,6.4vw,5.6rem)/1 var(--f-tit);letter-spacing:-.04em;
      color:color-mix(in srgb,var(--pri) 24%,transparent);pointer-events:none}
  `,
  lista: css`
    .be-l{gap:14px;max-width:1000px}
    .be-li{${TARJETA};padding:22px 24px;gap:16px}
    ${SUBE('.be-li')}
    .be-li .ic{width:40px;height:40px;padding:10px;border-radius:12px;background:color-mix(in srgb,var(--pri) 12%,var(--sup));border:1px solid ${BORDE};color:var(--hl-c);margin:0}
  `,
  iconos: css`
    /* «así se verá tu vida»: tarjetas de vidrio centradas, cada una con su ícono en un círculo */
    .be-ics{gap:20px;max-width:1000px}
    @media (min-width:900px){.be-ics:has(>:nth-child(4):last-child){grid-template-columns:repeat(4,minmax(0,1fr))}}
    .be-ic{${TARJETA};border-radius:16px;padding:clamp(24px,2.6vw,32px) clamp(18px,2vw,24px);gap:8px}
    ${SUBE('.be-ic')}
    .be-ico{width:54px;height:54px;margin-bottom:16px;background:color-mix(in srgb,var(--pri) 16%,var(--sup));border:1px solid ${BORDE};color:var(--hl-c)}
    .be-ic .h3{font-size:1.08rem}
    .be-ic p{margin-top:4px;font-size:.92rem;line-height:1.6}
  `,
  '+rotulo': css`
    .s-beneficios .be-rot{padding:9px 22px;border:1px solid color-mix(in srgb,var(--pri-c) 45%,transparent);background:color-mix(in srgb,var(--pri-c) 6%,transparent);
      ${ROT('.72rem', '.32em')};font-weight:400;color:var(--hl-c)}
  `,
  numerada: css`
    /* pasos numerados: número gigante tenue de fondo e ícono en caja */
    .be-nl{display:grid;gap:18px;max-width:none}
    @media (min-width:760px){.be-nl{grid-template-columns:repeat(2,minmax(0,1fr))}.be-num:last-child:nth-child(odd){grid-column:1/-1}}
    .be-num{position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;gap:16px;padding:clamp(26px,3vw,38px);border:0;${TARJETA}}
    .be-num:last-child{border-bottom:1px solid ${BORDE}}
    .be-num::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--pri),var(--pri-c))}
    .be-num>div::before{${CAJA()};margin-bottom:22px}
    ${SUBE('.be-num')}
    .be-n{position:absolute;z-index:-1;right:12px;top:-8px;min-width:0;font:700 clamp(4.6rem,8vw,7rem)/1 var(--f-tit);letter-spacing:-.04em;color:color-mix(in srgb,var(--pri) 22%,transparent);pointer-events:none}
    .be-num .h3{font-size:clamp(1.25rem,1.8vw,1.55rem)}
    .be-num p{margin-top:12px;line-height:1.7}
  `,
};

S.problema = {
  base: css`
    .s-problema{${PANEL}}
    .s-problema .ic{flex:none;width:40px;height:40px;padding:10px;margin:0;border-radius:12px;border:1px solid ${BORDE};background:color-mix(in srgb,var(--pri) 12%,var(--sup));color:var(--hl-a)}
    .pr-cierre{max-width:none;margin:30px 0 0;padding:22px 26px;text-align:left;border-left:2px solid var(--pri);border-radius:0 14px 14px 0;
      background:color-mix(in srgb,var(--sup) 82%,transparent);font:300 clamp(1.12rem,1.5vw,1.36rem)/1.55 var(--f-rot);letter-spacing:.01em;color:var(--texto)}
  `,
  lista: css`
    /* el título a la izquierda y los dolores en tarjetas a la derecha */
    .pr-l{gap:14px;max-width:none}
    .pr-li{${TARJETA};align-items:center;gap:16px;padding:18px 22px;font-size:1rem;line-height:1.5}
    .pr-li{transition:transform .45s var(--ease),border-color .3s}
    @media (hover:hover){.pr-li:hover{transform:translateX(6px);border-color:${BORDE_ON}}}
    /* en el celular: el título a la izquierda y la frase antes de los dolores */
    @media (max-width:959px){.s-problema.v-lista .w{display:flex;flex-direction:column}.s-problema.v-lista .cab{text-align:left}.s-problema.v-lista .cab .h2,.s-problema.v-lista .cab .lead{margin-inline:0}
      .s-problema.v-lista .pr-cierre{order:1;margin:0 0 28px}.s-problema.v-lista .pr-l{order:2}}
    @media (min-width:960px){
      .s-problema.v-lista .w{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:clamp(40px,5vw,72px);align-items:start}
      .s-problema.v-lista .cab{grid-column:1;grid-row:1;margin:0;text-align:left}.s-problema.v-lista .cab .lead{margin-inline:0}
      .s-problema.v-lista .cab .h2{margin-inline:0}
      .s-problema.v-lista .pr-l{grid-column:2;grid-row:1/span 2}
      .s-problema.v-lista .pr-cierre{grid-column:1;grid-row:2;align-self:start}}
  `,
  tarjetas: css`
    .pr-g{gap:16px}
    .pr-tj{gap:18px;padding:clamp(22px,2.6vw,30px)}
    ${SUBE('.pr-tj')}
    .pr-tj p{color:var(--texto);line-height:1.55}
  `,
};

S.mecanismo = {
  base: css`
    .s-mecanismo p{color:var(--suave)}
  `,
  pasos: css`
    /* «4 movimientos»: tarjetas con el número gigante tenue y el ícono en caja */
    .me-f{gap:18px}
    @media (min-width:760px){.me-f{grid-template-columns:repeat(2,minmax(0,1fr))}.me-f .me-p:last-child:nth-child(odd){grid-column:1/-1}}
    @media (min-width:1000px){.me-f:has(>:nth-child(3):last-child){grid-template-columns:repeat(3,minmax(0,1fr))}.me-f:has(>:nth-child(3):last-child) .me-p:last-child{grid-column:auto}}
    .me-f .me-p{position:relative;overflow:hidden;isolation:isolate;gap:0;padding:clamp(26px,3vw,38px);${TARJETA}}
    .me-f .me-p::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--pri),var(--pri-c))}
    .me-f .me-p:not(:last-child)::after{content:none}
    ${SUBE('.me-f .me-p')}
    .me-f .me-n{position:absolute;z-index:-1;right:12px;top:-8px;width:auto;height:auto;border-radius:0;background:none;display:block;
      font:700 clamp(4.6rem,8vw,7rem)/1 var(--f-tit);letter-spacing:-.04em;color:color-mix(in srgb,var(--pri) 22%,transparent);pointer-events:none}
    .me-f .me-n::before{content:"0"}
    .me-f .me-p>div::before{${CAJA()};margin-bottom:22px}
    .me-f .h3{font-size:clamp(1.25rem,1.8vw,1.55rem)}
    .me-f p{margin-top:12px;line-height:1.7}
  `,
  '+cierre': css`
    .s-mecanismo .me-cierre{max-width:860px;color:var(--suave);font-size:1.05rem}
  `,
  linea: css`
    .me-l{max-width:820px}
    .me-l .me-p{grid-template-columns:52px minmax(0,1fr);gap:24px;padding-bottom:40px}
    .me-l .me-n{width:52px;height:52px;background:${GRAD};color:var(--sobre-pri);box-shadow:0 0 24px color-mix(in srgb,var(--pri) 40%,transparent);font-size:1.1rem}
    .me-l .me-p:not(:last-child)::before{left:25.5px;top:58px;width:1px;background:linear-gradient(var(--pri),color-mix(in srgb,var(--pri-c) 30%,transparent))}
    .me-l .me-p>div{${TARJETA};padding:22px 26px}
  `,
};

S.urgencia = {
  base: css`
    .s-urgencia{${PANEL}}
    .ur .cab{text-align:left}.ur .cab .h2{margin-inline:0}
    .ur .sec-acc{justify-content:flex-start}.ur .sec-acc .acc{align-items:flex-start}
    /* sin cifras: el texto solo, a una columna */
    .ur:not(:has(.ur-c)){display:block;max-width:860px}
    .ur-t{color:var(--suave);line-height:1.7}
    .ur-c{gap:14px}
    .ur-c li{position:relative;overflow:hidden;${TARJETA};padding:24px 26px;gap:8px}
    .ur-c li::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(var(--pri),var(--pri-c))}
    .ur-c strong,.ur-c .ew-odo{font:700 clamp(2.2rem,4vw,3.1rem)/1 var(--f-tit);letter-spacing:-.02em;color:var(--fuerte)}
    .ur-c strong span{font:inherit;color:inherit;letter-spacing:inherit}
    .ur-c li>span{color:var(--suave)}
  `,
  frase: css`
    /* «la primera edición»: centrada, con el rótulo en una píldora del acento y una frase grande */
    .ur-fr .ey{display:inline-flex;align-items:center;padding:8px 18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--pri-c) 40%,transparent);
      background:color-mix(in srgb,var(--pri-c) 8%,var(--noche));color:var(--hl-c);margin-bottom:24px}
    .ur-fr .ey::before{background:var(--hl-c);box-shadow:0 0 10px var(--hl-c)}
    .ur-fr .h2{font-size:clamp(2.2rem,5vw,4.3rem);line-height:1.08;max-width:15em}
    .ur-fr .h2.h2-l{font-size:clamp(1.9rem,3.8vw,3.3rem)}
    .ur-fr .lead{margin-inline:auto}
    .ur-fr .ur-t{margin-top:30px;max-width:30ch;font:500 clamp(1.2rem,2.2vw,1.7rem)/1.4 var(--f-tit);letter-spacing:-.015em;color:var(--fuerte)}
  `,
};

S.comparacion = {
  base: css`
    .s-comparacion .ic{width:20px;height:20px;flex:none;margin-top:3px}
  `,
  tabla: css`
    /* dos columnas: «no es» clara y tachada, «es» oscura con sus vistos */
    .co-t{max-width:980px;border:0;border-radius:22px;overflow:hidden;box-shadow:0 24px 70px -24px color-mix(in srgb,var(--pri) 45%,transparent)}
    .co-f>div{padding:17px clamp(16px,2.6vw,30px);border-top:1px solid var(--linea)}
    .co-f>.co-b{${CLARA};border:0;border-top:1px solid var(--alt-linea);box-shadow:none;color:var(--tenue)}
    .co-f>.co-a{${OSC};border:0;border-top:1px solid color-mix(in srgb,var(--osc-texto) 10%,transparent);box-shadow:none;color:var(--texto)}
    .co-cab>div{border-top:0!important;padding-block:22px 16px;${ROT('.74rem', '.32em')};font-family:var(--f-rot)}
    .co-cab>.co-b{color:var(--tenue)}.co-cab>.co-a{color:var(--hl-a)}
    .co-t .co-b .ic{color:var(--tenue)}.co-t .co-a .ic{color:var(--hl-c)}
    .co-f:not(.co-cab) .co-b>span{text-decoration:line-through;text-decoration-thickness:1px;text-decoration-color:color-mix(in srgb,currentColor 70%,transparent)}
  `,
  tarjetas: css`
    .co-2{gap:22px;max-width:1000px}
    @media (min-width:780px){.co-2{gap:26px}}
    .co-col{border-radius:22px;padding:clamp(26px,3.4vw,40px)}
    .co-2 .co-b{${CLARA}}
    .co-2 .co-a{${OSC}}
    .co-h{margin:0 0 24px;${ROT('.76rem', '.34em')}}
    .co-2 .co-b .co-h{color:var(--tenue)}.co-2 .co-a .co-h{color:var(--hl-a)}
    .co-col ul{gap:16px}
    .co-col li{gap:14px;line-height:1.55}
    .co-2 .co-b li{color:var(--tenue)}
    .co-2 .co-b li>span{text-decoration:line-through;text-decoration-thickness:1px;text-decoration-color:color-mix(in srgb,currentColor 70%,transparent)}
    .co-2 .co-b .ic{color:var(--tenue)}
    .co-2 .co-a .ic{color:var(--hl-c)}
  `,
};

S.para_quien = {
  base: css`
    /* «es para ti si» en una tarjeta oscura, «no es para ti si» en una clara */
    .pq{gap:22px;max-width:1000px}
    @media (min-width:800px){.pq{grid-template-columns:repeat(2,minmax(0,1fr));gap:26px}}
    .pq-col{border-radius:22px;padding:clamp(26px,3.4vw,40px)}
    .pq-si{${OSC}}
    .pq-no{${CLARA};color:var(--suave)}
    .pq-h{margin:0 0 24px;${ROT('.76rem', '.34em')}}
    .pq-si .pq-h{color:var(--hl-a)}.pq-no .pq-h{color:var(--tenue)}
    .pq-col ul{gap:16px}
    .pq-col li{gap:14px;line-height:1.55}
    .pq-si .ic{color:var(--hl-c)}.pq-no .ic{color:var(--tenue)}
  `,
};

S.experto = {
  base: css`
    /* quien enseña: tarjeta con la foto y el nombre grande en mayúsculas */
    .s-experto .h2{text-transform:uppercase;font-weight:700;font-size:clamp(2.2rem,4.4vw,3.6rem);letter-spacing:-.02em;line-height:1.02;color:var(--fuerte)}
    .ex-r{margin:14px 0 0;${ROT('.76rem', '.24em')};color:var(--hl-a)}
    .ex-b{margin-top:20px;color:var(--suave);line-height:1.78}
    .ex-l{margin-top:24px;gap:0;border-top:1px solid var(--linea)}
    .ex-l li{gap:14px;padding:13px 0;border-bottom:1px solid var(--linea);color:var(--texto);line-height:1.5}
    .ex-l .ic{color:var(--hl-c);margin-top:2px}
  `,
  lado: css`
    .ex-d{gap:0;max-width:1080px;margin-inline:auto;overflow:hidden;align-items:stretch;${TARJETA};border-radius:22px}
    ${SUBE('.ex-d')}
    @media (hover:hover){.ex-d:hover{transform:translateY(-4px)}}
    .ex-f{position:relative;margin:0;max-width:none}
    .ex-f img{height:100%;border:0;border-radius:0;aspect-ratio:4/4.2}
    .ex-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),var(--sup) 20%,transparent 60%)}
    .ex-d>div:last-child{position:relative;padding:clamp(26px,3.6vw,48px)}
    .ex-d>.ex-f+div{margin-top:-64px}
    @media (min-width:880px){.ex-d{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}
      .ex-f::after{background:linear-gradient(to left,var(--sup),transparent 38%)}
      .ex-f img{aspect-ratio:auto;min-height:100%}
      .ex-d>.ex-f+div{margin-top:0;align-self:center}}
    .ex-d>div:only-child{max-width:820px;margin-inline:auto}
  `,
  centrado: css`
    .ex-c{max-width:840px;${TARJETA};border-radius:22px;padding:clamp(28px,4vw,52px)}
    .ex-fc img{width:clamp(150px,18vw,190px);height:clamp(150px,18vw,190px);border:2px solid transparent;
      background:linear-gradient(var(--sup),var(--sup)) padding-box,${GRAD} border-box;box-shadow:0 0 40px color-mix(in srgb,var(--pri) 45%,transparent)}
    .ex-c .ex-l{text-align:left;width:100%}
  `,
};

S.testimonios = {
  base: css`
    .te{position:relative;${TARJETA};gap:18px;padding:clamp(24px,2.8vw,32px)}
    ${SUBE('.te')}
    .te::before{content:"“";content:"“" / "";position:absolute;right:18px;top:-6px;font:700 5.4rem/1 var(--f-tit);color:color-mix(in srgb,var(--pri) 26%,transparent);pointer-events:none}
    .te-pc::before{content:none}
    .te-e{color:var(--hl-a)}
    .te blockquote p{color:var(--texto);font-size:1.03rem;line-height:1.7}
    .te figcaption strong{font-weight:700;color:var(--texto)}
    .te figcaption small{${ROT('.66rem', '.2em')};color:var(--tenue)}
    .te-f img{box-shadow:0 0 0 2px var(--sup),0 0 0 3px color-mix(in srgb,var(--pri) 60%,transparent)}
  `,
  tarjetas: css`
    .te-m{column-gap:20px}.te-m .te{margin-bottom:20px}
  `,
  destacado: css`
    .te-d{gap:20px}
    .te-g{${OSC};border-radius:22px;padding:clamp(28px,4.2vw,56px)}
    .te-g blockquote p{font:500 clamp(1.25rem,2.3vw,1.85rem)/1.45 var(--f-tit);letter-spacing:-.012em}
  `,
};

S.cifras = {
  base: css`
    /* fila de tarjetas: ícono en caja, número grande y rótulo */
    .s-cifras{padding-block:clamp(40px,5vw,80px)}
    .ci-ey{text-align:center}
    .ci{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;background:none;border:0;border-radius:0;overflow:visible}
    @media (min-width:900px){.ci{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:20px}}
    .ci li{position:relative;${TARJETA};padding:clamp(24px,3vw,38px) 14px clamp(24px,2.8vw,34px);display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
    .ci li:last-child:nth-child(odd){grid-column:1/-1}
    @media (min-width:900px){.ci li:last-child:nth-child(odd){grid-column:auto}}
    .ci li::before{content:"";position:absolute;top:-1px;left:50%;width:56px;height:3px;margin-left:-28px;border-radius:0 0 3px 3px;background:var(--pri);box-shadow:0 0 14px var(--pri)}
    .ci li::after{${CAJA('50px')};order:-1;margin-bottom:6px}
    ${SUBE('.ci li')}
    .ci strong,.ci .ew-odo{font:700 clamp(2.3rem,3.8vw,3.1rem)/1 var(--f-tit);letter-spacing:-.02em;color:var(--fuerte)}
    .ci strong span{font:inherit;color:inherit;letter-spacing:inherit}
    .ci li>span{${ROT('.7rem', '.24em')};color:var(--suave);max-width:24ch}
  `,
  '+detalle': css`
    .ci li{gap:10px}
    .ci li>span{color:var(--texto)}
    .ci .ci-d{margin-top:2px;font-size:.9rem;color:var(--suave)}
  `,
};

S.temario = {
  base: css`
    .s-temario{${PANEL}}
    .tm-n{${ROT('.7rem', '.24em')};font-weight:400;color:var(--hl-c)}
  `,
  acordeon: css`
    .s-temario .acor{max-width:880px;margin-inline:auto}
    .s-temario .acor summary .tm-n{min-width:3ch}
  `,
  lista: css`
    .tm-l{gap:16px}
    .tm-l li{position:relative;overflow:hidden;padding:clamp(24px,2.8vw,32px)}
    .tm-l li::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,var(--pri),var(--pri-c))}
    ${SUBE('.tm-l li')}
    .tm-l .h3{margin-top:10px}
  `,
};

S.oferta = {
  base: css`
    /* el precio: tarjeta con borde en degradado y resplandor, la lista con interruptores encendidos y el botón */
    .of-l{gap:4px}
    .of-l li{position:relative;padding:11px 0 11px 52px;border:0;align-items:center;gap:12px;color:var(--texto);line-height:1.45}
    .of-l .ic{position:absolute;left:0;top:50%;width:36px;height:21px;margin:-10.5px 0 0;padding:0;border-radius:999px;background:${GRAD};stroke:none;
      box-shadow:0 0 12px color-mix(in srgb,var(--pri) 40%,transparent)}
    .of-l li::after{content:"";position:absolute;left:18px;top:50%;width:15px;height:15px;margin-top:-7.5px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35)}
    .of-v{color:var(--tenue);font-size:.9rem}
    .of-p{align-items:center;text-align:center}
    .of-total{${ROT('.7rem', '.28em')};color:var(--tenue)}
    .of-antes{color:var(--tenue);font:500 1.15rem/1 var(--f-tit);margin-top:10px}
    .of-precio{font:700 clamp(3.2rem,7vw,4.6rem)/1.02 var(--f-tit);letter-spacing:-.03em;margin-top:6px;${TXT_GRAD}}
    .of-det{color:var(--suave);font-size:.92rem;margin-top:8px}
    .of-p .acc{align-items:stretch;width:100%}.of-p .acc .btn{width:100%;max-width:none;min-width:0}
    .of-seg{justify-content:center;color:var(--tenue);font-size:.82rem}
    .of-seg .ic{color:var(--tenue)}
  `,
  tarjeta: css`
    .of-card{position:relative;display:flex;flex-direction:column;max-width:560px;margin-inline:auto;padding:clamp(28px,4vw,44px);gap:0;
      border:1px solid transparent;border-radius:24px;background:linear-gradient(var(--sup),var(--sup)) padding-box,linear-gradient(160deg,var(--pri-a),var(--pri) 45%,var(--pri-c)) border-box;
      box-shadow:0 0 70px -12px color-mix(in srgb,var(--pri) 50%,transparent),0 30px 90px -30px rgba(0,0,0,.6)}
    .of-card>.of-p{display:contents}
    .of-card .of-total,.of-card .of-antes,.of-card .of-precio,.of-card .of-det{order:-1;text-align:center}
    .of-card .of-det{margin-bottom:26px;padding-bottom:24px;border-bottom:1px solid var(--linea)}
    .of-card .of-l{order:0}
    .of-card .acc{order:1;margin-top:28px;align-items:stretch}.of-card .acc .btn{width:100%}
    .of-card .of-seg{order:2}
  `,
  dividida: css`
    .of-d{gap:clamp(22px,3vw,36px);align-items:stretch}
    .of-inc{${TARJETA};padding:clamp(24px,3vw,36px)}
    .of-d .of-p{justify-content:center;padding:clamp(28px,3.6vw,44px);border:1px solid transparent;border-radius:24px;
      background:linear-gradient(var(--sup),var(--sup)) padding-box,linear-gradient(160deg,var(--pri-a),var(--pri) 45%,var(--pri-c)) border-box;
      box-shadow:0 0 70px -12px color-mix(in srgb,var(--pri) 50%,transparent)}
  `,
};

S.bonos = {
  base: css`
    .s-bonos{${PANEL}}
    .bo{gap:18px;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))}
    .bo-tj{position:relative;overflow:hidden;padding:clamp(22px,2.6vw,30px);gap:10px}
    ${SUBE('.bo-tj')}
    .bo-i{width:50px;height:50px;border-radius:12px;border:1px solid ${BORDE};background:color-mix(in srgb,var(--pri) 12%,var(--sup));color:var(--hl-c);margin-bottom:14px}
    .bo-f{margin:calc(clamp(22px,2.6vw,30px)*-1) calc(clamp(22px,2.6vw,30px)*-1) 16px;position:relative}
    .bo-f img{border-radius:0;margin:0}
    .bo-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),transparent 50%)}
    .bo-n{align-self:flex-start;padding:7px 14px;border-radius:999px;border:1px solid color-mix(in srgb,var(--pri-c) 45%,transparent);background:color-mix(in srgb,var(--noche) 80%,transparent);
      ${ROT('.64rem', '.24em')};color:var(--hl-c)}
    .bo-tj:has(.bo-f) .bo-n{position:absolute;top:18px;left:18px;z-index:2}
    .bo-v{${ROT('.68rem', '.22em')};color:var(--tenue)!important;font-weight:400}
  `,
  fotos: css`
    /* experiencias exclusivas: la foto grande que se funde con la tarjeta y su etiqueta en una píldora del acento */
    .bo-fs{gap:22px}
    .bo-ft{position:relative;${TARJETA};border-radius:22px;overflow:hidden}
    ${SUBE('.bo-ft')}
    .bo-ff::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),transparent 46%)}
    .bo-ff img{aspect-ratio:16/11}
    .bo-et{z-index:2;padding:7px 14px;border:1px solid color-mix(in srgb,var(--pri-c) 45%,transparent);background:var(--noche);${ROT('.62rem', '.24em')};color:var(--hl-c)}
    .bo-ft>.bo-et{margin:clamp(22px,2.6vw,30px) clamp(22px,2.6vw,30px) 0}
    .bo-fc{padding:clamp(22px,2.6vw,30px)}
    .bo-fc .h3{font:600 clamp(1.3rem,2vw,1.6rem)/1.25 var(--f-tit);letter-spacing:-.015em}
    .bo-fc p{color:var(--suave);line-height:1.7;margin-top:10px}
  `,
  '+fecha': css`
    .bo-fc .bo-fe{${ROT('.68rem', '.3em')};font-weight:400;color:var(--tenue);margin:0 0 10px}
  `,
  '+boton': css`
    /* el botón de cada experiencia: el de la primera claro (como la entrada destacada) y el de la segunda en el acento */
    .bo-acc .btn{min-height:46px;padding:12px 26px;font-size:.74rem;letter-spacing:.16em}
    .bo-ft:nth-child(odd) .bo-btn{background:linear-gradient(100deg,var(--texto),var(--hl-a));color:var(--fondo)}
    .bo-ft:nth-child(even) .bo-btn{background:linear-gradient(100deg,var(--hl-c),color-mix(in srgb,var(--hl-c) 62%,var(--texto)));color:var(--fondo)}
  `,
};

S.garantia = {
  base: css`
    .ga{${TARJETA};border-radius:24px;padding:clamp(28px,4vw,52px);gap:clamp(24px,4vw,48px)}
    .ga-s{color:var(--hl-a);width:140px;height:140px}
    .ga-s span{${ROT('.62rem', '.24em')};color:var(--suave)}
    .ga-s strong{font:700 2.8rem/1 var(--f-tit);letter-spacing:-.02em;${TXT_GRAD}}
    .ga-s .ga-ic{color:var(--hl-c)}
    @media (prefers-reduced-motion:no-preference){.ew-mv .ga-s>svg{animation:ew-gira 30s linear infinite}}
    @keyframes ew-gira{to{transform:rotate(360deg)}}
    .ga-t{font:600 clamp(1.4rem,2.4vw,2rem)/1.2 var(--f-tit);letter-spacing:-.02em}
    .ga-x{color:var(--suave);line-height:1.7}
  `,
};

S.faq = {
  acordeon: css`
    .fq .acor{max-width:820px}
  `,
  columnas: css`
    .fq-c{gap:16px 20px}
    .fq-c>div{${TARJETA};border-radius:14px;padding:22px 24px}
    .fq-c dt{font-weight:600;color:var(--texto)}
    .fq-c dd{color:var(--suave);line-height:1.7;margin-top:8px}
  `,
};

S.servicios = {
  base: css`
    .sv-pr{font-family:var(--f-tit)!important;font-weight:700!important;letter-spacing:-.02em}
  `,
  tarjetas: css`
    /* niveles de precio: el del medio con borde en degradado y resplandor, el último en el tono del acento */
    .sv-g{gap:20px;align-items:stretch}
    @media (min-width:720px){.sv-g:not(:has(>:nth-child(3):last-child)){grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))}}
    .sv-tj{position:relative;${TARJETA};border-radius:22px;overflow:hidden}
    ${SUBE('.sv-tj')}
    .sv-f{position:relative}
    .sv-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),transparent 55%)}
    .sv-c{align-items:center;text-align:center;padding:clamp(28px,3vw,38px) clamp(22px,2.4vw,30px) clamp(30px,3vw,40px);gap:10px}
    /* tres niveles: la descripción bajo una línea, como la lista de cada nivel */
    .sv-g:has(>:nth-child(3):last-child) .sv-c p:not(.sv-pr){width:100%;margin-top:14px;padding-top:18px;border-top:1px solid var(--linea)}
    .sv-c .h3{order:-2;padding:8px 18px;border:1px solid ${BORDE};border-radius:999px;${ROT('.74rem', '.3em')};color:var(--texto)}
    .sv-c .sv-pr{order:-1;margin:10px 0 4px!important;padding:0!important;font-size:clamp(2.6rem,4.4vw,3.5rem)!important;line-height:1;${TXT_GRAD}}
    .sv-c p{line-height:1.65}
    @media (min-width:1040px){.sv-g:has(>:nth-child(3):last-child)>.sv-tj:nth-child(2){border-color:transparent;background:linear-gradient(var(--sup),var(--sup)) padding-box,linear-gradient(160deg,var(--pri-a),var(--pri) 45%,var(--pri-c)) border-box;
        box-shadow:0 0 70px -14px color-mix(in srgb,var(--pri) 55%,transparent),${SOMBRA};transform:translateY(-10px)}
      .sv-g:has(>:nth-child(3):last-child)>.sv-tj:nth-child(3){border-color:color-mix(in srgb,var(--pri-c) 50%,transparent);
        background:linear-gradient(180deg,color-mix(in srgb,var(--pri-c) 9%,var(--sup)),var(--sup) 60%);box-shadow:0 0 60px -18px color-mix(in srgb,var(--pri-c) 45%,transparent),${SOMBRA}}}
  `,
  precios: css`
    .sv-p{gap:0;max-width:860px;${TARJETA};border-radius:22px;padding:8px clamp(20px,3vw,36px)}
    .sv-p li{padding:22px 0;border-bottom:1px solid var(--linea)}
    .sv-p li:last-child{border-bottom:0}
    .sv-pd{border-bottom:1px dashed ${BORDE}}
    .sv-p .sv-pr{font-size:1.35rem;${TXT_GRAD}}
  `,
};

S.galeria = {
  base: css`
    .s-galeria figure{border-radius:var(--rp);border:1px solid ${BORDE};box-shadow:${SOMBRA}}
    .s-galeria img{transition:transform .8s var(--ease)}
    @media (hover:hover){.s-galeria figure:hover img{transform:scale(1.04)}}
    .s-galeria figcaption{left:12px;right:auto;bottom:12px;max-width:calc(100% - 24px);padding:7px 14px;border-radius:999px;border:1px solid ${BORDE};
      background:color-mix(in srgb,var(--noche) 88%,transparent);color:var(--texto);${ROT('.62rem', '.2em')}}
  `,
  cuadricula: css`.ga-c{gap:12px}@media (min-width:820px){.ga-c{gap:18px}}`,
  mosaico: css`.ga-m{gap:12px}@media (min-width:820px){.ga-m{gap:18px}}`,
};

S.ubicacion = {
  base: css`
    .s-ubicacion{${PANEL}}
    .ub{gap:16px;max-width:980px;background:none;border:0;border-radius:0;overflow:visible}
    .ub>div{${TARJETA};padding:clamp(24px,3vw,36px);gap:18px}
    .ub-i{width:44px;height:44px;padding:11px;border-radius:12px;border:1px solid ${BORDE};background:color-mix(in srgb,var(--pri) 12%,var(--sup));color:var(--hl-c)}
    .ub-dir{font:600 1.2rem/1.35 var(--f-tit);letter-spacing:-.01em;color:var(--texto)}
    .ub-ref{color:var(--suave)}
    .ub-h div{border-bottom:1px solid var(--linea)}
    .ub-h dt{${ROT('.68rem', '.22em')};color:var(--tenue);align-self:center}
    .ub-h dd{color:var(--texto);font-weight:600}
  `,
};

S.video = {
  base: css`
    .vi .vid{margin-top:4px}
  `,
};

S.gracias = {
  base: css`
    .s-gracias{isolation:isolate;overflow:hidden;padding-block:clamp(96px,10vw,130px) clamp(72px,9vw,120px);background:radial-gradient(64% 48% at 50% 0%,var(--luz),transparent 72%)}
    .s-aviso+.s-gracias{padding-top:clamp(126px,12vw,162px)}
    .gr{position:relative;padding-top:calc(var(--escenario)*.8)}
    .gr::before{${PRISMA_LUZ};left:50%;top:-30px;width:min(700px,96vw);height:calc(var(--escenario)*.8 + 10px);transform:translateX(-50%)}
    .gr::after{${PRISMA_CARAS};left:50%;top:0;width:calc(var(--escenario)*.7);height:calc(var(--escenario)*.68);transform:translateX(-50%)}
    .gr-ok{width:76px;height:76px;background:${GRAD};color:var(--sobre-pri);box-shadow:0 0 0 10px color-mix(in srgb,var(--pri) 16%,transparent),0 0 44px color-mix(in srgb,var(--pri) 50%,transparent)}
    .gr .ey{display:inline-flex;margin-bottom:0}
    .gr .h1{margin-top:16px}
    .gr-acc .btn .ic{width:22px;height:22px}
    .gr-p{gap:16px}
    .gr-p li{${TARJETA};padding:22px 24px}
    .gr-n{background:${GRAD};color:var(--sobre-pri);box-shadow:0 0 18px color-mix(in srgb,var(--pri) 40%,transparent)}
  `,
};

S.pie = {
  base: css`
    .s-pie{padding-block:clamp(36px,4vw,56px) calc(30px + env(safe-area-inset-bottom));border-top:0;background:transparent;overflow:hidden}
    /* la marca gigante y tenue (la arma el decorado y corre como marquesina) */
    .ew-pie-m{margin:0 0 clamp(24px,3vw,40px);padding-bottom:clamp(14px,2vw,26px);border-bottom:1px solid var(--linea);font:700 clamp(4rem,13vw,12.5rem)/1 var(--f-tit);
      letter-spacing:-.03em;text-transform:uppercase;color:color-mix(in srgb,var(--texto) 8%,transparent);user-select:none;pointer-events:none}
    .pie{gap:16px;justify-items:center;text-align:center;color:var(--tenue)}
    .pie-m{display:flex;flex-direction:row-reverse;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:6px 16px;font-size:.84rem;color:var(--tenue)}
    .pie-m>span{font:700 1.1rem/1.2 var(--f-tit);letter-spacing:-.01em;${TXT_GRAD}}
    .pie-l{gap:8px 24px}.pie-l a{color:var(--suave);font-size:.86rem}
    .pie-x{color:var(--tenue)}
    @media (min-width:900px){.pie{grid-template-columns:auto 1fr;align-items:center;text-align:left;justify-items:start}
      .pie-l{justify-self:end}.pie-x{grid-column:1/-1;justify-self:start}}
    .ew-pie-m{max-width:var(--panel);margin-inline:auto}
  `,
  '+logo': css`
    /* con el logo: logo, el aviso, los links y el año en una fila (en el celular, uno debajo del otro) */
    .pie:has(.pie-logo){gap:14px 28px}
    .pie-logo img{max-height:clamp(20px,2vw,26px)}
    .pie:has(.pie-logo) .pie-m{flex-direction:row;gap:6px}
    .pie:has(.pie-logo) .pie-m>span{font:inherit;letter-spacing:0;color:inherit;background:none;-webkit-text-fill-color:currentColor}
    .pie:has(.pie-logo) .pie-x{font-size:.84rem}
    @media (min-width:900px){.pie:has(.pie-logo){grid-template-columns:auto 1fr auto auto}
      .pie:has(.pie-logo) .pie-logo{grid-column:1;grid-row:1}.pie:has(.pie-logo) .pie-x{grid-column:2;grid-row:1;justify-self:center}
      .pie:has(.pie-logo) .pie-l{grid-column:3;grid-row:1}.pie:has(.pie-logo) .pie-m{grid-column:4;grid-row:1}}
  `,
};

// ---------- las secciones de una página de evento (7-oct) ----------

S.niveles = {
  base: css`
    /* las entradas: tres niveles de vidrio sobre un resplandor; el destacado claro y arriba, el último en el tono del acento */
    .s-niveles{isolation:isolate;background:radial-gradient(56% 42% at 50% 64%,var(--luz),transparent 72%)}
    .nv-ct{margin-bottom:clamp(44px,5vw,68px)}
    .nv-ct .nv-etapa{display:inline-flex;align-items:center;gap:10px;margin:0 0 18px;padding:8px 18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--pri-c) 40%,transparent);
      background:color-mix(in srgb,var(--pri-c) 8%,var(--noche));${ROT('.72rem', '.28em')};color:var(--hl-c)}
    .nv-ct .nv-etapa::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--hl-c);box-shadow:0 0 10px var(--hl-c)}
    .nv-ct-t{margin:0 0 16px;color:var(--texto);font-size:1rem}
    .nv-ct-g{gap:12px;max-width:420px}
    .nv-cc{${TARJETA};border-radius:14px;padding:16px 4px 12px;gap:8px}
    .nv-cc .ct-n,.nv-cc .ew-odo{font:700 clamp(1.9rem,4.4vw,2.6rem)/1 var(--f-tit);letter-spacing:-.02em;color:var(--fuerte)}
    .nv-cl{${ROT('.6rem', '.26em')};color:var(--tenue)}
    .nv{gap:22px}
    .nv-2{max-width:900px;margin-inline:auto}
    @media (min-width:1000px){.nv-3{grid-template-columns:repeat(3,minmax(0,1fr))}.nv-4{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}}
    .nv-tj{${TARJETA};border-radius:22px;padding:clamp(30px,3vw,40px) clamp(22px,2.4vw,30px) clamp(24px,2.6vw,32px);
      border-color:color-mix(in srgb,var(--pri) 45%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--pri) 9%,var(--sup)),var(--sup) 58%);
      box-shadow:0 0 70px -30px color-mix(in srgb,var(--pri) 45%,transparent),${SOMBRA}}
    .nv-cab{gap:10px;padding-bottom:26px;margin-bottom:26px}
    .nv-nom{padding:8px 20px;border:1px solid ${BORDE};border-radius:999px;${ROT('.74rem', '.3em')};color:var(--texto)}
    .nv-cab .nv-etapa{margin-top:10px;${ROT('.64rem', '.26em')};color:var(--tenue)}
    .nv-p{margin-top:0}
    .nv-p strong{font:700 clamp(2.8rem,4.4vw,3.8rem)/1.02 var(--f-tit);letter-spacing:-.03em;${TXT_GRAD}}
    .nv-mon{color:var(--suave);font-size:.95rem}
    .nv-nota{color:var(--suave);font-size:.9rem}
    .nv-cupos{margin-top:10px}.nv-cupos p{color:var(--suave)}.nv-cupos b{font:700 1.08rem/1 var(--f-tit);color:var(--hl-a)}
    .nv-barra{height:4px;background:color-mix(in srgb,var(--texto) 14%,transparent)}
    .nv-barra>span{background:linear-gradient(90deg,var(--pri-a),var(--pri));box-shadow:0 0 10px color-mix(in srgb,var(--pri) 60%,transparent)}
    .nv-l{gap:13px;margin-bottom:30px}
    .nv-l li{gap:14px;align-items:center;color:var(--texto);font-size:.97rem}
    .nv-sw{width:34px;height:20px;margin-top:0;background:${GRAD};box-shadow:0 0 12px color-mix(in srgb,var(--pri) 40%,transparent)}
    .nv-sw::after{top:3px;left:17px;width:14px;height:14px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35)}
    .nv-no{color:var(--tenue)}.nv-no>span{text-decoration:none}
    .nv-no .nv-sw{background:color-mix(in srgb,var(--texto) 9%,var(--sup));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--texto) 12%,transparent)}
    .nv-no .nv-sw::after{left:3px;background:color-mix(in srgb,var(--texto) 30%,var(--sup));box-shadow:none}
    .nv-btn{min-width:0;padding-inline:22px 18px;letter-spacing:.12em;font-size:.82rem}
    .nv-seg{color:var(--tenue)}.nv-seg .ic{color:var(--tenue)}
    /* la destacada: clara, con su etiqueta arriba y más alta */
    .nv-dest{border-color:color-mix(in srgb,var(--texto) 34%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--texto) 5%,var(--noche)),var(--noche));
      box-shadow:0 0 0 1px color-mix(in srgb,var(--hl-a) 18%,transparent),0 0 90px -24px color-mix(in srgb,var(--hl-a) 45%,transparent),${SOMBRA}}
    .nv-eti{padding:7px 18px;background:linear-gradient(100deg,var(--texto),var(--hl-a));color:var(--fondo);${ROT('.66rem', '.26em')};font-weight:500;
      box-shadow:0 0 26px color-mix(in srgb,var(--hl-a) 45%,transparent)}
    .nv-dest .nv-p strong{color:var(--fuerte);background:none;-webkit-text-fill-color:currentColor}
    .nv-dest .btn{background:linear-gradient(100deg,var(--texto),var(--hl-a));color:var(--fondo);box-shadow:0 0 30px color-mix(in srgb,var(--hl-a) 38%,transparent)}
    @media (min-width:1000px){.nv-dest{transform:translateY(-12px)}}
    /* la última (con tres o cuatro): en el tono del acento */
    :is(.nv-3,.nv-4)>.nv-tj:last-child:not(.nv-dest){--pri:var(--pri-c);--hl-a:var(--hl-c);border-color:color-mix(in srgb,var(--pri-c) 55%,transparent);
      background:linear-gradient(180deg,color-mix(in srgb,var(--pri-c) 10%,var(--sup)),var(--sup) 60%)}
    :is(.nv-3,.nv-4)>.nv-tj:last-child:not(.nv-dest) .btn{background:linear-gradient(100deg,var(--hl-c),color-mix(in srgb,var(--hl-c) 62%,var(--texto)));color:var(--fondo)}
    :is(.nv-3,.nv-4)>.nv-tj:last-child:not(.nv-dest) .nv-p strong{background:linear-gradient(100deg,var(--hl-c),color-mix(in srgb,var(--hl-c) 55%,var(--texto)));-webkit-background-clip:text;background-clip:text}
  `,
};

S.equipo = {
  base: css`
    /* quienes guían: la foto de escenario arriba, el nombre grande en mayúsculas sobre su borde y la historia */
    .eq{gap:22px}
    .eq-tj{position:relative;${TARJETA};border-radius:22px}
    ${SUBE('.eq-tj')}
    .eq-f{position:relative}
    .eq-f img{aspect-ratio:4/3.6}
    .eq-f::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--sup),var(--sup) 22%,color-mix(in srgb,var(--sup) 50%,transparent) 40%,transparent 66%)}
    .eq-tj:has(.eq-f img) .eq-c{position:relative;z-index:1;margin-top:-66px}
    .eq-c{padding:clamp(24px,3vw,36px);gap:10px}
    .eq-sf .eq-c::before{${CAJA('50px')};margin-bottom:12px}
    .eq-n{font:700 clamp(1.9rem,3.2vw,2.7rem)/1.02 var(--f-tit);letter-spacing:-.02em;text-transform:uppercase;color:var(--fuerte)}
    .eq-r{${ROT('.7rem', '.24em')};color:var(--hl-a)}
    .eq-b{margin-top:10px;color:var(--suave);line-height:1.78}
  `,
  retratos: css`
    /* en retrato: la foto de escenario ocupa la tarjeta y el nombre y la historia van sobre su parte de abajo */
    .s-equipo .eq-rts{max-width:none}
    .s-equipo .cab .h2:only-child{font-weight:700;letter-spacing:-.02em;color:var(--fuerte)}
    .eq-rts .eq-tj{border-radius:22px}
    .eq-rts .eq-f img{aspect-ratio:4/4.1}
    .eq-rts .eq-f::after{background:linear-gradient(to top,var(--sup),var(--sup) 8%,color-mix(in srgb,var(--sup) 55%,transparent) 32%,transparent 62%)}
    .eq-rts .eq-tj:has(.eq-f img) .eq-c{margin-top:-130px}
    .eq-et{${ROT('.66rem', '.32em')};color:var(--suave);opacity:1}
    .eq-rts .eq-n{font-size:clamp(1.9rem,3vw,2.6rem)}
    .eq-rts .eq-b{font-size:.98rem;line-height:1.72}
  `,
};

S.logistica = {
  base: css`
    /* un día, todo resuelto: el panel de noche con cuatro tarjetas de vidrio */
    .s-logistica{${PANEL}}
    .lg{gap:16px}
    @media (min-width:1000px){.lg-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    .lg-tj{position:relative;${TARJETA};border-radius:16px;padding:clamp(22px,2.4vw,28px);gap:8px;background:color-mix(in srgb,var(--sup) 70%,var(--noche))}
    .lg-i{display:none}
    .lg-r{${ROT('.64rem', '.28em')};color:var(--hl-a)}
    .lg-v{font:600 1.12rem/1.35 var(--f-tit);letter-spacing:-.01em;color:var(--texto)}
    .lg-d{color:var(--tenue);font-size:.86rem}
  `,
};

S.dudas = {
  base: css`
    .s-dudas{padding-block:clamp(48px,6vw,88px)}
    .du{${TARJETA};border-radius:22px;max-width:640px}
    .du-i{width:46px;height:46px;padding:11px;border-radius:12px;border:1px solid ${BORDE};background:color-mix(in srgb,var(--pri) 12%,var(--sup));color:var(--hl-c)}
    .du-t{font:600 clamp(1.5rem,2.6vw,2rem)/1.15 var(--f-tit);letter-spacing:-.02em}
    .du-x{color:var(--suave)}
    .du-acc{margin-top:26px}
    /* el botón de WhatsApp en su verde, oscuro lo suficiente para el texto blanco (5:1 en las dos puntas) */
    .du-btn{--wa:#15803d;--wa-2:#116a32;--sobre-wa:#fff;background:linear-gradient(100deg,var(--wa),var(--wa-2));color:var(--sobre-wa);box-shadow:0 0 30px rgba(34,197,94,.35)}
    .du-btn:hover{box-shadow:0 0 50px rgba(34,197,94,.5)}
  `,
};

S.idea = {
  base: css`
    /* la idea que lo explica: panel de noche, la imagen con su borde y la frase destacada con su línea */
    .s-idea{${PANEL}}
    .id-img img{border:1px solid ${BORDE};border-radius:var(--rp);box-shadow:0 0 0 6px color-mix(in srgb,var(--pri) 8%,transparent),0 40px 100px -40px color-mix(in srgb,var(--pri) 55%,transparent)}
    .id-x{color:var(--suave);line-height:1.8}
    .id-t:not(:has(.id-h)) .id-x p:first-child{color:var(--texto);font:600 clamp(1.1rem,1.5vw,1.25rem)/1.55 var(--f-tit);letter-spacing:-.01em}
    .id-fr{margin-top:26px;padding:20px 24px;border-left:2px solid var(--pri);border-radius:0 14px 14px 0;background:color-mix(in srgb,var(--sup) 82%,transparent);
      font:300 clamp(1.08rem,1.4vw,1.3rem)/1.55 var(--f-rot);letter-spacing:.01em;color:var(--texto)}
    .id-num span{background:${GRAD};color:var(--sobre-pri);box-shadow:0 0 18px color-mix(in srgb,var(--pri) 45%,transparent)}
    .id-fr-a{max-width:920px;padding:28px 34px;font-size:clamp(1.2rem,1.8vw,1.55rem)}
  `,
  '+encabezado': css`
    .id-h{font:600 clamp(1.3rem,2vw,1.7rem)/1.3 var(--f-tit);letter-spacing:-.015em;color:var(--fuerte)}
  `,
  lado: css`
    .id-d{gap:clamp(32px,5vw,72px)}
    /* la imagen entera (un mapa o un esquema no se recorta), hasta un alto */
    .id-d .id-img img{aspect-ratio:auto;height:auto;max-height:640px;object-fit:cover}
  `,
  fondo: css`
    /* «tu identidad»: sin panel, la imagen a lo ancho del panel con los bordes fundidos a la noche, el título encima */
    .s-idea.v-fondo{background:none;max-width:var(--panel)}
    .id-bg img{-webkit-mask:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent);mask:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent)}
    .id-fo .ey{display:block;margin:0 0 6px;font:300 clamp(1.05rem,1.6vw,1.4rem)/1.4 var(--f-rot);letter-spacing:.12em;text-transform:none;color:var(--texto)}
    .id-fo .ey::before{content:none}
    .id-fo .h2{font-weight:700;font-size:clamp(2.1rem,4.4vw,3.8rem);line-height:1.08;filter:drop-shadow(0 0 22px color-mix(in srgb,var(--pri-c) 40%,transparent))}
    .id-fo .lead{max-width:560px;font-size:clamp(.92rem,1vw,1rem);color:var(--texto)}
    .id-fo .id-pie .id-fr{font:italic 400 .95rem/1.5 var(--f-txt);color:var(--texto);background:none;padding:0}
  `,
  centrada: css`
    .id-c .h2{font-size:clamp(2.4rem,5.4vw,4.6rem);line-height:1.05}
    .id-c .id-fr{border-left:0;border-radius:14px;text-align:center}
    .id-c .id-x p:first-child{font:inherit;color:var(--suave)}
  `,
};

S.caminos = {
  base: css`
    /* dos caminos: dos tarjetas oscuras; la del cambio con el borde y el resplandor del primario */
    .s-caminos{${PANEL}}
    .cm{gap:22px;max-width:1080px}
    .cm-col{${TARJETA};border-radius:22px;padding:clamp(26px,3.2vw,40px);background:color-mix(in srgb,var(--fondo) 50%,var(--sup))}
    .cm-b{border-color:color-mix(in srgb,var(--pri) 55%,transparent);box-shadow:0 0 70px -22px color-mix(in srgb,var(--pri) 45%,transparent),${SOMBRA}}
    .cm-r{${ROT('.66rem', '.28em')};color:var(--tenue);margin-bottom:16px}
    .cm-b .cm-r{color:var(--hl-a)}
    .cm-t{font:600 clamp(1.3rem,2vw,1.65rem)/1.25 var(--f-tit);letter-spacing:-.015em}
    .cm-x{color:var(--suave);line-height:1.7}
    .cm-l{gap:14px;margin-top:22px}
    .cm-l li{color:var(--texto);font-size:.97rem;line-height:1.55}
    .cm-a .ic{color:var(--tenue)}.cm-b .ic{color:var(--hl-c)}
    .cm-c{color:var(--suave);font-size:.92rem;border-top-color:var(--linea)}
  `,
};

export const CSS_PRISMA = { base: BASE, secciones: S };

// Privacidad y términos: la noche de la página, títulos en Sora.
export const CSS_LEGAL_PRISMA = css`
  body{background:var(--fondo)}
  .lg h1,.lg h2{font-weight:600;letter-spacing:-.02em}
  .lg h1{line-height:1.12}
`;
