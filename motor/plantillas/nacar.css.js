// CSS de NÁCAR por sección (contrato en ./index.js). Va después del CSS clásico y lo pisa. Todo color sale de los tokens
// (--fondo, --texto, --iri-1…4…) que arma coloresNacar() con la marca. Lo que se mueve o se fija al hacer scroll va bajo
// .ew-mv (lo pone el JS de movimiento): sin JS y en edición la página queda quieta, completa y clicable.
import { css } from './css.js';

const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .09 0 0 0 0 .07 0 0 0 0 .12 0 0 0 .24 -.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const FLECHA =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E\")";

// Arte de nácar para tarjetas (tres brillos sobre el marfil). --a --b --c los pone cada tarjeta.
const ARTE = 'radial-gradient(60% 75% at 18% 22%,var(--a),transparent 72%),radial-gradient(70% 70% at 88% 26%,var(--b),transparent 72%),radial-gradient(90% 80% at 52% 110%,var(--c),transparent 72%),var(--fondo-2)';
// Los brillos de cada tarjeta, en rueda (n-ésima tarjeta → su combinación).
const TONOS = (sel) =>
  `${sel}:nth-child(4n+1){--a:var(--iri-2);--b:var(--iri-3);--c:var(--iri-1)}` +
  `${sel}:nth-child(4n+2){--a:var(--iri-1);--b:var(--iri-2);--c:var(--iri-3)}` +
  `${sel}:nth-child(4n+3){--a:var(--iri-4);--b:var(--iri-1);--c:var(--iri-2)}` +
  `${sel}:nth-child(4n+4){--a:var(--iri-3);--b:var(--iri-4);--c:var(--iri-2)}`;
// Borde iridiscente de 1px (máscara: solo el borde del degradado).
const BORDE_IRI = (sel, radio = 'var(--r-l)') =>
  `${sel}{position:relative}${sel}::after{content:"";position:absolute;inset:-1px;border-radius:calc(${radio} + 1px);padding:1px;background:var(--iri-lineal);` +
  '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);pointer-events:none;opacity:.95}';
// Campo de nácar quieto (lo que se ve sin WebGL): un halo cónico de los brillos que se funde con el marfil.
// Campo de nácar quieto (lo que se ve sin WebGL o mientras llega): cuatro brillos suaves alrededor de (x, y), sin costuras.
const CAMPO = (x, y, k = 1) =>
  `var(--grano),` +
  `radial-gradient(clamp(${190 * k}px,${30 * k}vw,${520 * k}px) clamp(${170 * k}px,${26 * k}vw,${440 * k}px) at calc(${x} - 7%) calc(${y} - 6%),var(--iri-2),transparent 72%),` +
  `radial-gradient(clamp(${170 * k}px,${26 * k}vw,${460 * k}px) clamp(${150 * k}px,${22 * k}vw,${400 * k}px) at calc(${x} + 9%) calc(${y} + 8%),var(--iri-3),transparent 72%),` +
  `radial-gradient(clamp(${150 * k}px,${22 * k}vw,${400 * k}px) clamp(${140 * k}px,${20 * k}vw,${360 * k}px) at calc(${x} - 3%) calc(${y} + 22%),var(--iri-1),transparent 72%),` +
  `radial-gradient(clamp(${140 * k}px,${20 * k}vw,${360 * k}px) clamp(${120 * k}px,${17 * k}vw,${300 * k}px) at calc(${x} + 13%) calc(${y} - 16%),var(--iri-4),transparent 74%) var(--fondo)`;
// Degradé a marfil (con su grano) para fundir un campo con la sección vecina: arriba ('top') o abajo ('bottom').
const FUNDIDO = (lado, alto) =>
  `content:"";position:absolute;left:0;right:0;${lado}:0;height:${alto}px;z-index:-1;pointer-events:none;background:var(--grano),var(--fondo);` +
  `-webkit-mask:linear-gradient(to ${lado},transparent,#000);mask:linear-gradient(to ${lado},transparent,#000)`;
const VIDRIO = 'background:color-mix(in srgb,var(--sup) 72%,transparent);border:1px solid rgba(255,255,255,.85);-webkit-backdrop-filter:blur(12px) saturate(1.3);backdrop-filter:blur(12px) saturate(1.3)';

const BASE = css`
  :root{
    --ease:cubic-bezier(.22,1,.36,1);--ease-io:cubic-bezier(.65,0,.35,1);
    --r-xl:36px;--r-l:26px;--r-m:18px;--gut:clamp(16px,4vw,36px);
    --sombra-1:0 1px 1px rgba(22,19,29,.04),0 8px 22px -10px rgba(22,19,29,.1),0 38px 70px -40px color-mix(in srgb,var(--duo) 40%,transparent);
    --sombra-2:0 1px 1px rgba(22,19,29,.05),0 18px 40px -18px rgba(22,19,29,.16),0 70px 120px -60px color-mix(in srgb,var(--duo) 55%,transparent);
    --iri-lineal:linear-gradient(100deg,var(--iri-1),var(--iri-2) 38%,var(--iri-3) 70%,var(--iri-4));
    --iri-conico:conic-gradient(from 210deg,var(--iri-1),var(--iri-2),var(--iri-3),var(--iri-4),var(--iri-1));
    --perla:radial-gradient(circle at 32% 28%,#fff 0 8%,transparent 30%),var(--iri-conico);
    --grano:${GRANO};--flecha:${FLECHA};
  }
  html{background:var(--texto);scroll-padding-top:20px}
  body{background:var(--fondo);font-size:1rem;line-height:1.6;letter-spacing:-.003em;overflow-x:clip;counter-reset:ew-n}
  @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
  .sec{padding-block:clamp(80px,10vw,150px);position:relative;overflow-x:clip;background-image:var(--grano)}
  .b-sup{background-color:transparent}.b-ninguna{padding:0}
  .w{max-width:1240px;padding-inline:var(--gut)}
  :focus-visible{outline:2px solid var(--acento);outline-offset:3px}

  /* letras */
  .h1{font-size:clamp(2.25rem,5.25vw,4.875rem);line-height:1;letter-spacing:-.046em;font-weight:500;text-wrap:pretty;max-width:14.5em}
  .h2{font-size:clamp(1.95rem,4.1vw,3.6rem);line-height:1.04;letter-spacing:-.042em;font-weight:500;text-wrap:pretty}
  .h3{font-size:clamp(1.2rem,1.7vw,1.45rem);line-height:1.18;letter-spacing:-.028em;font-weight:500}
  .h1.h1-l{font-size:clamp(2.05rem,4.4vw,3.9rem)}.h2.h2-l{font-size:clamp(1.75rem,3.4vw,2.85rem)}
  .hl{font-family:var(--f-acento);font-style:italic;font-weight:300;letter-spacing:-.015em;font-size:1.06em;color:inherit;padding-right:.07em}
  .ey{font-size:.75rem;font-weight:600;letter-spacing:.15em;color:var(--suave);gap:10px;margin:0 0 18px}
  .ey::before{width:9px;height:9px;border-radius:50%;background:var(--perla);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
  .sec:not(.s-hero):not(.s-gracias) .ey::before{counter-increment:ew-n;content:counter(ew-n,decimal-leading-zero);content:counter(ew-n,decimal-leading-zero) / "";
    width:auto;min-width:34px;height:24px;padding:0 8px;border-radius:99px;background:none;box-shadow:none;border:1px solid var(--linea-2);
    display:inline-grid;place-items:center;font:italic 300 15px/1 var(--f-acento);letter-spacing:0;text-transform:none;color:var(--texto)}
  .lead{font-size:clamp(1rem,1.35vw,1.16rem);line-height:1.6;color:var(--suave);max-width:37em;text-wrap:pretty}
  .cab{margin-bottom:clamp(40px,5vw,64px);max-width:820px}
  .cab .lead{margin-top:18px}

  /* botón: píldora con su perla */
  .btn{--h:58px;min-height:var(--h);padding:7px 7px 7px 26px;gap:16px;justify-content:space-between;border-radius:999px;font-weight:600;font-size:1rem;
    letter-spacing:-.005em;line-height:1.2;position:relative;isolation:isolate;overflow:hidden;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 12px 28px -12px color-mix(in srgb,var(--pri) 70%,#000),0 2px 6px rgba(22,19,29,.16);
    transition:transform .6s var(--ease),box-shadow .6s var(--ease),filter .3s}
  .btn::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%);transform:translateX(-110%);transition:transform 1.1s var(--ease)}
  .btn-f{flex:none;width:calc(var(--h) - 14px);height:calc(var(--h) - 14px);border-radius:50%;background:var(--perla);display:grid;place-items:center;font-size:0;color:transparent;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.45),inset -3px -4px 8px color-mix(in srgb,var(--duo) 22%,transparent);transition:none}
  .btn-f::before{content:"";width:18px;height:18px;background:var(--texto);-webkit-mask:var(--flecha) center/contain no-repeat;mask:var(--flecha) center/contain no-repeat;transition:transform .6s var(--ease)}
  .btn:hover{filter:none;transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 22px 40px -16px color-mix(in srgb,var(--pri) 70%,#000),0 2px 6px rgba(22,19,29,.16)}
  .btn:hover::before{transform:translateX(110%)}.btn:hover .btn-f{transform:none}.btn:hover .btn-f::before{transform:translateX(3px)}
  .btn:active{transform:translateY(0) scale(.985)}
  .btn-g{--h:60px;min-height:var(--h);font-size:1.02rem}
  .btn-sec{--h:48px;padding:10px 20px;justify-content:center;gap:10px;color:var(--texto);${VIDRIO};box-shadow:0 6px 18px -10px rgba(40,25,90,.3)}
  .btn-sec:hover{border-color:#fff;box-shadow:0 12px 26px -12px rgba(40,25,90,.35)}
  .btn-sec .ic{color:var(--acento)}
  .nota{display:block;font-size:.84rem;color:var(--suave);margin-top:14px}
  .nota::before{content:"";display:inline-block;width:14px;height:14px;margin-right:8px;vertical-align:-2px;border-radius:50%;background:var(--iri-conico)}
  .sec-acc .nota,.cta-in .nota,.ct .nota,.hero-c .nota,.hero-v .nota,.of-p .nota,.fo-t .nota,.form .nota,.vi .nota{justify-content:center;text-align:center}
  @media (max-width:620px){.acc .nota{justify-content:center;text-align:center}}
  .acc{margin-top:28px}

  /* piezas compartidas */
  .tj{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1)}
  .evento{gap:8px;margin-top:22px}
  .evento li{${VIDRIO};padding:8px 14px;font-size:.88rem;box-shadow:0 6px 18px -10px rgba(40,25,90,.3)}
  .evento .ic{color:var(--acento)}.evento small{color:var(--suave)}
  .hero-pts{gap:10px;margin-top:22px}
  .hero-pts li{align-items:center;font-size:.94rem;color:var(--suave)}
  .hero-pts .ic,.ok-perla{width:22px;height:22px;padding:5px;margin:0;border-radius:50%;background:var(--iri-conico);color:var(--texto);stroke-width:2.8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
  .acor{display:block;gap:0;border-top:1px solid var(--linea-2)}
  .acor details{background:none;border:0;border-bottom:1px solid var(--linea-2);border-radius:0;overflow:visible}
  .acor summary{padding:22px 0;gap:18px;font-size:clamp(1.05rem,1.5vw,1.25rem);font-weight:500;letter-spacing:-.02em;line-height:1.35}
  .acor-i{width:36px;height:36px;padding:10px;border-radius:50%;border:1px solid var(--linea-2);color:var(--texto);transition:transform .6s var(--ease),background .5s var(--ease),border-color .5s}
  .acor details[open] .acor-i{transform:rotate(135deg);background:var(--iri-conico);border-color:transparent}
  .acor details>p{padding:0 52px 24px 0;color:var(--suave);font-size:1rem;line-height:1.65;max-width:41em}
  @supports (interpolate-size:allow-keywords){@media (prefers-reduced-motion:no-preference){
    .acor{interpolate-size:allow-keywords}
    .acor details::details-content{height:0;overflow:clip;transition:height .55s var(--ease),content-visibility .55s allow-discrete}
    .acor details[open]::details-content{height:auto}}}
  .vid{border-radius:var(--r-l);border:1px solid rgba(255,255,255,.9);box-shadow:0 40px 90px -40px color-mix(in srgb,var(--duo) 70%,transparent),0 30px 80px -40px var(--iri-2)}
  .vid-p{background:var(--perla);color:var(--texto);box-shadow:0 0 0 10px color-mix(in srgb,var(--sup) 35%,transparent),0 20px 40px -12px rgba(22,19,29,.5)}
  .vid-pc{background:var(--fondo-2)}
  .pc{border-radius:12px}
  .img-pc{border-radius:var(--r-l);background:var(--fondo-2)}

  /* formulario */
  .form{gap:8px}
  .campo{position:relative;display:block;font-weight:400}
  .campo>span{position:absolute;z-index:1;left:19px;top:9px;font-size:.72rem;font-weight:600;letter-spacing:.03em;color:var(--suave);pointer-events:none;
    transition:top .4s var(--ease),font-size .4s var(--ease),transform .4s var(--ease),letter-spacing .4s}
  /* la etiqueta va dentro del campo: al centro mientras está vacío, arriba al escribir (sin :has queda arriba) */
  .campo:has(input:placeholder-shown:not(:focus))>span{top:29px;transform:translateY(-50%);font-size:.97rem;font-weight:400;letter-spacing:0}
  .campo small{color:var(--suave);font-weight:400}
  .campo input{height:58px;min-height:0;padding:24px 18px 6px;border-radius:var(--r-m);border:1px solid var(--linea-2);background:color-mix(in srgb,#fff 82%,transparent);
    font-size:1rem;color:var(--texto);transition:border-color .35s var(--ease),box-shadow .35s var(--ease),background .35s;-webkit-appearance:none;appearance:none}
  .campo input::placeholder{color:transparent}.campo input:focus::placeholder{color:var(--tenue)}
  .campo input:focus{background:#fff;border-color:var(--texto);box-shadow:0 0 0 4px color-mix(in srgb,var(--iri-2) 60%,transparent)}
  .form .btn{margin-top:4px;--h:58px}
  .form-msg{border-radius:14px}
  .form-priv{color:var(--suave)}

  /* ventana del formulario: hoja de nácar (abajo en el celular) */
  .modal{width:min(520px,calc(100vw - 24px))}
  .modal::backdrop{background:color-mix(in srgb,var(--texto) 40%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
  .modal-c{border-radius:var(--r-xl);border:1px solid rgba(255,255,255,.9);padding:30px 22px 22px;box-shadow:0 40px 100px -20px rgba(22,19,29,.5);
    background:radial-gradient(80% 60% at 100% 0%,color-mix(in srgb,var(--iri-2) 55%,transparent),transparent 70%),radial-gradient(60% 50% at 0% 0%,color-mix(in srgb,var(--iri-1) 45%,transparent),transparent 70%),var(--fondo)}
  .modal-t{font-weight:500;letter-spacing:-.035em;font-size:1.6rem;line-height:1.1;margin:4px 48px 20px 0}
  .modal-x{top:16px;right:16px;width:40px;height:40px;font-size:22px;color:var(--texto);border:1px solid var(--linea-2);background:rgba(255,255,255,.7)}
  @media (max-width:760px){.modal{margin:auto 0 0;width:100%;max-width:100%;max-height:calc(100dvh - 12px)}.modal-c{border-radius:var(--r-xl) var(--r-xl) 0 0;padding-bottom:calc(22px + env(safe-area-inset-bottom))}.modal.modal-fijo{top:auto;bottom:0;margin:0}}
  @media (prefers-reduced-motion:no-preference){.modal[open]{animation:ew-sube .6s var(--ease)}}
  @keyframes ew-sube{from{transform:translateY(40px);opacity:0}}

  /* objeto de vidrio: el respaldo en CSS de la escena (la escena WebGL lo reemplaza cuando dibuja) y el lienzo */
  .ew-ancla{position:absolute;z-index:0;pointer-events:none;aspect-ratio:1;transition:opacity 1.2s var(--ease)}
  .ew-ancla-gota{border-radius:50%;
    background:radial-gradient(circle at 33% 27%,rgba(255,255,255,.95) 0 3%,rgba(255,255,255,0) 13%),
      radial-gradient(circle at 50% 50%,rgba(255,255,255,0) 60%,color-mix(in srgb,var(--duo) 16%,transparent) 71%,rgba(255,255,255,.65) 75%,rgba(255,255,255,0) 77%),
      radial-gradient(circle at 60% 66%,rgba(255,255,255,.55),transparent 42%),
      conic-gradient(from 140deg,var(--iri-3),var(--iri-2),var(--iri-1),var(--iri-4),var(--iri-3));
    box-shadow:inset -18px -26px 50px color-mix(in srgb,var(--duo) 20%,transparent),inset 16px 20px 40px rgba(255,255,255,.6),0 60px 60px -46px color-mix(in srgb,var(--duo) 40%,transparent)}
  .ew-ancla-anillo{border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9) 0 4%,transparent 18%),var(--iri-conico);
    -webkit-mask:radial-gradient(circle,transparent 41%,#000 42.5% 69%,transparent 70.5%);mask:radial-gradient(circle,transparent 41%,#000 42.5% 69%,transparent 70.5%);transform:rotate(-24deg) scaleY(.7)}
  .ew-gl .ew-ancla{opacity:0}
  .ew-lienzo{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:-2;opacity:0;transition:opacity 1.6s var(--ease);pointer-events:none}
  .ew-lienzo.ew-on{opacity:1}
  @media (prefers-reduced-motion:no-preference){.ew-mv .ew-ancla-gota{animation:ew-flota 9s var(--ease-io) infinite alternate}}
  @keyframes ew-flota{to{translate:0 -12px;rotate:8deg}}

  /* el telón: el pie queda quieto detrás y la página se levanta al llegar al final */
  .ew-mv :where(.sec:not(.s-pie)){z-index:1;background-color:var(--fondo)}
  .ew-mv:not(.ew-sin-telon) .s-pie{position:sticky;bottom:0;z-index:0}
  .ew-mv:not(.ew-sin-telon):not(.ew-telon) .s-pie>*{visibility:hidden}
  .ew-mv:not(.ew-sin-telon) .sec:has(+.s-pie){border-radius:0 0 var(--r-xl) var(--r-xl);overflow:clip;box-shadow:0 40px 80px -20px rgba(0,0,0,.45)}

  /* barra fija del botón en el celular y flechas del carrusel */
  .ew-barra .btn{box-shadow:0 0 0 1px rgba(255,255,255,.16),0 18px 40px -12px rgba(22,19,29,.55)}
  .ew-car-b{border:1px solid var(--linea-2);background:color-mix(in srgb,var(--sup) 70%,transparent);transition:background .4s var(--ease),transform .4s var(--ease),opacity .3s}
  .ew-car-b::before{content:"";width:18px;height:18px;background:var(--texto);-webkit-mask:var(--flecha) center/contain no-repeat;mask:var(--flecha) center/contain no-repeat}
  .ew-car-b.ew-prev::before{transform:scaleX(-1)}
  .ew-car-b:not(:disabled):hover{background:#fff;transform:scale(1.05)}
  .ew-car-n{margin:0;min-width:64px;font:italic 300 1.25rem/1 var(--f-acento);font-variant-numeric:tabular-nums;color:var(--texto)}
  .ew-car-n span{color:var(--suave)}

  @media (prefers-reduced-motion:reduce){.ew-mv .s-pie{position:static!important}.btn,.btn::before,.btn-f::before{transition:none}}
`;

const S = {};

S.aviso = {
  base: css`
    .s-aviso{background:var(--texto);color:var(--sobre-tinta);position:relative;z-index:2}
    .aviso-a{min-height:38px;padding:9px 16px;font-size:.8rem;font-weight:500;letter-spacing:.02em;gap:10px}
    .aviso-a::before{content:"";width:8px;height:8px;flex:none;border-radius:50%;background:var(--iri-conico);box-shadow:0 0 0 0 color-mix(in srgb,var(--iri-2) 70%,transparent)}
    @media (prefers-reduced-motion:no-preference){.ew-mv .aviso-a::before{animation:ew-latido 2.2s var(--ease) infinite}}
    @keyframes ew-latido{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--iri-2) 70%,transparent)}75%,100%{box-shadow:0 0 0 9px transparent}}
    .aviso-a>span[aria-hidden]{opacity:.7}
  `,
};

S.hero = {
  base: css`
    .s-hero{--ox:74%;--oy:44%;background:${CAMPO('var(--ox)', 'var(--oy)')};padding-block:clamp(28px,5vw,64px) clamp(72px,9vw,128px);isolation:isolate}
    .s-hero::before{background:none}
    .s-hero::after{${FUNDIDO('bottom', 180)}}
    .s-hero .w{position:relative;z-index:1}
    .s-hero .h1{margin:20px 0 0}
    .s-hero .lead{margin-top:20px;font-size:clamp(1rem,1.35vw,1.16rem)}
    .s-hero .ey{height:34px;margin:0;padding:0 14px 0 12px;border-radius:99px;font-size:.8rem;font-weight:500;letter-spacing:0;text-transform:none;color:var(--texto);
      ${VIDRIO};box-shadow:0 6px 18px -10px rgba(40,25,90,.35)}
    .s-hero .ey::before{width:9px;height:9px}
    .s-hero .acc{margin-top:26px}
    @media (min-width:900px){.s-hero{min-height:min(780px,calc(100svh - 40px));display:flex;align-items:center}.s-hero>.w{width:100%}}
    @media (max-width:760px){.s-hero .lead{font-size:.97rem;line-height:1.55;margin-top:14px}.s-hero .h1{margin-top:16px}.s-hero .ey{height:32px;font-size:.78rem}}
    /* la gota (respaldo y ancla de la escena) */
    .s-hero .ew-ancla{top:-6px;right:-58px;width:206px}
    @media (min-width:900px){.s-hero .ew-ancla{top:12%;right:max(2%,calc(50% - 600px));width:min(380px,28vw)}}
  `,
  centrado: css`
    .hero-c .h1{margin-inline:auto}.hero-c .lead{margin-inline:auto}
    .s-hero.v-centrado{--ox:50%;--oy:30%}
    .hero-img{margin-top:clamp(40px,6vw,72px);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-xl);box-shadow:var(--sombra-2)}
    @media (min-width:900px){.s-hero.v-centrado .ew-ancla{top:6%;right:max(2%,calc(50% - 640px));width:min(230px,17vw)}}
  `,
  dividido: css`
    .hero-d{gap:44px}
    @media (min-width:920px){.hero-d{grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:72px}}
    .hero-m{isolation:isolate}
    .hero-m::before{content:"";position:absolute;inset:8% -6% -5% 8%;border-radius:var(--r-xl);background:var(--iri-conico);filter:blur(42px);opacity:.55;z-index:-1}
    .hero-m img{border-radius:var(--r-xl);border:1px solid rgba(255,255,255,.9);box-shadow:var(--sombra-2)}
    .hero-m .img-pc{aspect-ratio:4/5}
    @media (min-width:920px){.s-hero.v-dividido{--ox:80%;--oy:30%}.s-hero.v-dividido .ew-ancla{top:7%;right:auto;left:calc(50% + 40px);width:min(220px,16vw)}
      .s-hero.v-dividido:has(.hero-sf) .ew-ancla{left:auto;top:14%;right:max(2%,calc(50% - 620px));width:min(330px,24vw)}}
  `,
  video: css`
    .s-hero.v-video{--ox:50%;--oy:4%;padding-top:clamp(28px,4vw,56px)}
    .hero-v{max-width:980px}
    .hero-v .h1{font-size:clamp(1.7rem,3.3vw,2.75rem)!important;line-height:1.08!important;letter-spacing:-.04em;max-width:22em}
    .hero-v .lead{font-size:1.02rem}
    .hero-v .vid{margin-top:clamp(22px,3vw,34px)}
    .hero-v .ey{margin-inline:auto}
    @media (max-width:620px){.hero-v .h1{font-size:clamp(1.55rem,6.6vw,2.1rem)!important}}
  `,
  evento: css`
    .hero-e{gap:30px}
    @media (min-width:960px){.hero-e{grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);column-gap:72px}}
    .hero-form{position:relative;z-index:2;padding:clamp(22px,2.6vw,34px);border-radius:var(--r-xl);${VIDRIO};background:color-mix(in srgb,var(--sup) 70%,transparent);box-shadow:var(--sombra-2)}
    .hero-form-t{font-weight:500;letter-spacing:-.03em;font-size:clamp(1.3rem,1.8vw,1.6rem);line-height:1.12;margin:0 0 18px}
    .hero-x .hero-pts{margin-top:4px}
    @media (min-width:960px){.s-hero.v-evento .ew-ancla{top:8%;right:max(-1%,calc(50% - 640px));width:min(300px,22vw)}}
  `,
};

S.formulario = {
  base: css`
    .s-formulario{background:var(--grano),radial-gradient(40% 45% at 86% 72%,color-mix(in srgb,var(--iri-2) 50%,transparent),transparent 70%),radial-gradient(34% 40% at 12% 26%,color-mix(in srgb,var(--iri-1) 40%,transparent),transparent 70%) var(--fondo)}
    .fo-card{padding:clamp(22px,3vw,38px);border-radius:var(--r-xl);${VIDRIO};background:color-mix(in srgb,var(--sup) 78%,transparent);box-shadow:var(--sombra-2)}
    .fo-t{max-width:600px}
    .fo-t .cab{margin-bottom:0}
  `,
  dividido: css`
    @media (min-width:900px){.fo-d{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:80px}}
    .fo-d .cab{text-align:left;margin:0}
  `,
};

S.contador = {
  base: css`
    .s-contador .ct{--alto:1.05;position:relative;isolation:isolate;max-width:min(460px,calc(100% - 2*var(--gut)));padding:22px 20px 20px;
      margin-top:calc(min(460px,100vw - 2*var(--gut)) * var(--alto) - 110px)}
    @media (min-width:700px){.s-contador .ct{--alto:1.25}}
    .s-contador .ct::before{content:"";position:absolute;z-index:-2;left:0;right:0;bottom:calc(100% - 110px);aspect-ratio:1/var(--alto);
      border-radius:999px 999px var(--r-xl) var(--r-xl);transform-origin:50% 100%;transform:scaleX(calc(1 - var(--k,0)*.3));box-shadow:var(--sombra-2);
      outline:1px solid rgba(255,255,255,.75);outline-offset:-14px;
      background:radial-gradient(circle at 50% calc(42% + var(--k,0)*34%),#fff 0 9%,color-mix(in srgb,var(--iri-4) 60%,#fff) 15%,transparent 22%),
        radial-gradient(closest-side at 18% 30%,var(--iri-3),transparent),radial-gradient(closest-side at 86% 52%,color-mix(in srgb,var(--iri-2) 80%,#fff),transparent),
        linear-gradient(90deg,transparent calc(50% - .5px),rgba(255,255,255,.5) 0 calc(50% + .5px),transparent 0),
        linear-gradient(180deg,color-mix(in srgb,var(--iri-2) 85%,#fff) 0%,var(--iri-1) 58%,var(--iri-4) 100%)}
    .s-contador .ct::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:var(--r-l);${VIDRIO};background:color-mix(in srgb,var(--sup) 84%,transparent);box-shadow:var(--sombra-2)}
    .ew-mv .s-contador .ct{--k:clamp(0,(var(--p,0) - .3)/.55,1)}
    .ct .h3{margin:0 0 14px;font-size:.75rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--suave);font-family:var(--f-txt)}
    .ct-g{gap:8px;max-width:none}
    .ct-c{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:12px 4px 10px;gap:6px}
    .ct-n,.ct-c .ew-odo{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(2.1rem,4vw,2.9rem);letter-spacing:-.04em;line-height:1;justify-content:center}
    .ct-l{font-size:.68rem;letter-spacing:.1em;color:var(--suave)}
    .ct .acc{width:100%;align-items:stretch;margin-top:16px}.ct .acc .btn{width:100%}
  `,
};

S.cta = {
  base: css`
    .s-cta{--ox:80%;--oy:26%;isolation:isolate;background:${CAMPO('var(--ox)', 'var(--oy)', 0.85)}}
    .s-cta::before{${FUNDIDO('top', 160)}}
    .s-cta .w{position:relative;z-index:1}
    .s-cta .h2{font-size:clamp(2.2rem,5vw,4.5rem);max-width:13em}
    .cta-in .lead{margin-top:20px}
    .s-cta .ew-ancla{top:-40px;right:-80px;width:210px}
    @media (min-width:900px){.s-cta .ew-ancla{top:4%;right:max(1%,calc(50% - 660px));width:min(330px,24vw)}}
  `,
  banda: css`
    .s-cta.v-banda{color:var(--texto);background:${CAMPO('var(--ox)', 'var(--oy)', 0.85)}}
    .s-cta.v-banda h2,.s-cta.v-banda .h2{color:var(--texto)}
    .s-cta.v-banda .ey,.s-cta.v-banda .lead,.s-cta.v-banda .nota{color:var(--suave);opacity:1}
    .s-cta.v-banda .hl{text-decoration:none}
    .s-cta.v-banda .btn{background:var(--pri);color:var(--sobre-pri);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 12px 28px -12px color-mix(in srgb,var(--pri) 70%,#000),0 2px 6px rgba(22,19,29,.16)}
  `,
  tarjeta: css`
    .s-cta.v-tarjeta .cta-in{border-radius:var(--r-xl);padding:clamp(36px,6vw,80px) clamp(22px,5vw,72px);${VIDRIO};background:color-mix(in srgb,var(--sup) 66%,transparent);box-shadow:var(--sombra-2)}
    .s-cta.v-tarjeta .cta-in::before{display:none}
  `,
};

S.beneficios = {
  base: css`
    .s-beneficios p{color:var(--suave)}
  `,
  tarjetas: css`
    .be-g{gap:18px}
    .be-tj{padding:0;overflow:hidden;gap:0}
    .be-tj::before{content:"";display:block;height:120px;background:${ARTE}}
    ${TONOS('.be-tj')}
    .be-i{position:absolute;top:70px;right:18px;font:italic 300 3.6rem/1 var(--f-acento);letter-spacing:-.06em;color:rgba(255,255,255,.85);margin:0}
    .be-tj .h3,.be-tj p{padding-inline:clamp(20px,2.4vw,28px)}
    .be-tj .h3{margin-top:22px}.be-tj p{padding-bottom:26px}
    .be-tj{position:relative}
  `,
  lista: css`
    .be-l{gap:0 48px}
    .be-li{padding:22px 0;border-top:1px solid var(--linea-2);gap:16px}
    .be-li .ic{width:26px;height:26px;padding:6px;margin-top:1px;background:var(--iri-conico);color:var(--texto);stroke-width:2.8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
  `,
  numerada: css`
    /* la pila: cabecera a la izquierda (fija al bajar) y tarjetas que se apilan a la derecha */
    .s-beneficios.v-numerada .w{display:grid;gap:44px}
    .s-beneficios.v-numerada .cab{text-align:left;margin:0}
    .s-beneficios.v-numerada .cab .lead{margin-inline:0}
    .s-beneficios.v-numerada .sec-acc{justify-content:flex-start;margin-top:0}
    .be-nl{max-width:none;width:100%;margin-inline:0;gap:22px;--tope:18px}
    .be-num{position:relative;display:grid;grid-template-rows:170px auto;grid-template-columns:minmax(0,1fr);gap:0;padding:0;border:0;border-radius:var(--r-xl);
      background:var(--sup);box-shadow:var(--sombra-2);overflow:hidden;border:1px solid rgba(255,255,255,.9);transform-origin:50% 0}
    .be-num:last-child{border-bottom:1px solid rgba(255,255,255,.9)}
    ${TONOS('.be-num')}
    .be-num:nth-child(1){--i:0}.be-num:nth-child(2){--i:1}.be-num:nth-child(3){--i:2}.be-num:nth-child(4){--i:3}.be-num:nth-child(5){--i:4}.be-num:nth-child(6){--i:5}
    .be-n{position:relative;display:flex;align-items:flex-end;justify-content:flex-end;padding:0 14px;overflow:hidden;isolation:isolate;min-width:0;background:${ARTE};
      font:italic 300 clamp(7.5rem,15vw,13rem)/1 var(--f-acento);letter-spacing:-.07em;color:rgba(255,255,255,.74);text-shadow:0 1px 0 rgba(255,255,255,.4)}
    .be-n::before{content:"";position:absolute;z-index:-1;left:14%;top:50%;width:min(132px,32%);aspect-ratio:1;transform:translateY(-50%);border-radius:50%;
      background:radial-gradient(circle at 32% 28%,#fff 0 6%,rgba(255,255,255,0) 30%),radial-gradient(circle at 70% 75%,var(--b),var(--a));
      box-shadow:inset -10px -14px 26px color-mix(in srgb,var(--duo) 20%,transparent),inset 8px 10px 20px rgba(255,255,255,.55),0 30px 40px -22px color-mix(in srgb,var(--duo) 45%,transparent)}
    .be-num:nth-child(4n+2) .be-n::before{border-radius:999px;aspect-ratio:2.1;width:min(190px,44%);transform:translateY(-50%) rotate(-18deg)}
    .be-num:nth-child(4n+3) .be-n::before{background:var(--iri-conico);-webkit-mask:radial-gradient(circle,transparent 46%,#000 47.5% 68%,transparent 69.5%);mask:radial-gradient(circle,transparent 46%,#000 47.5% 68%,transparent 69.5%);transform:translateY(-50%) rotate(20deg) scaleY(.62);box-shadow:none}
    .be-n::after{content:"";position:absolute;inset:0;z-index:-1;background:var(--grano);opacity:.4;mix-blend-mode:multiply}
    .be-num>div{padding:24px 24px 28px}
    .be-num .h3{font-size:clamp(1.4rem,2.2vw,1.95rem);line-height:1.12;letter-spacing:-.03em}
    .be-num p{font-size:1rem;line-height:1.6;max-width:27.7em;margin-top:12px}
    @media (min-width:900px){
      .s-beneficios.v-numerada .w{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:72px;align-items:start}
      .s-beneficios.v-numerada .cab,.s-beneficios.v-numerada .sec-acc{grid-column:1}
      .s-beneficios.v-numerada .be-nl{grid-column:2;grid-row:1/span 3}
      .be-nl{--tope:110px;gap:28px}
      .be-num{grid-template-rows:none;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);min-height:380px}
      .be-n{order:2}
      .be-num>div{padding:44px 40px 40px}}
    .ew-mv .be-num{position:sticky;top:calc(var(--tope) + var(--i,0)*16px);transform:scale(calc(1 - var(--tapa,0)*.05))}
    .ew-mv .be-num::after{content:"";position:absolute;inset:0;background:var(--texto);opacity:calc(var(--tapa,0)*.07);pointer-events:none;border-radius:inherit}
    @media (min-width:900px){.ew-mv .s-beneficios.v-numerada .cab{position:sticky;top:120px}}
  `,
};

S.problema = {
  base: css`
    .s-problema .ic{color:var(--suave);width:24px;height:24px;padding:5px;border-radius:50%;border:1px solid var(--linea-2);stroke-width:2.2}
    .pr-cierre{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(1.4rem,2.6vw,2rem);line-height:1.3;letter-spacing:-.02em;max-width:24em;margin-top:44px}
  `,
  lista: css`
    .pr-l{gap:0;max-width:780px;border-top:1px solid var(--linea-2)}
    .pr-li{background:none;border:0;border-bottom:1px solid var(--linea-2);border-radius:0;padding:20px 4px;gap:16px;font-size:1.06rem;line-height:1.5;align-items:center}
  `,
  tarjetas: css`
    .pr-g{gap:16px}.pr-tj{background:var(--sup);gap:16px}
    .pr-tj p{font-size:1.06rem;line-height:1.5}
  `,
};

S.mecanismo = {
  base: css`
    .s-mecanismo p{color:var(--suave)}
    .me-n{width:52px;height:52px;background:var(--perla);color:var(--texto);font:italic 300 1.5rem/1 var(--f-acento);letter-spacing:-.03em;
      box-shadow:inset -4px -6px 12px color-mix(in srgb,var(--duo) 20%,transparent),inset 0 0 0 1px rgba(255,255,255,.5),0 14px 26px -14px color-mix(in srgb,var(--duo) 60%,transparent)}
  `,
  pasos: css`
    .me-f{gap:22px}
    .me-f .me-p{padding:clamp(22px,2.6vw,30px);border-radius:var(--r-l);background:var(--sup);border:1px solid rgba(255,255,255,.9);box-shadow:var(--sombra-1);gap:18px}
    @media (min-width:820px){.me-f .me-p:not(:last-child)::after{top:52px;left:calc(100% - 4px);right:auto;width:30px;height:1px;background:var(--iri-lineal)}}
  `,
  linea: css`
    .me-l .me-p{grid-template-columns:52px 1fr;gap:22px;padding-bottom:40px}
    .me-l .me-p:not(:last-child)::before{left:25.5px;top:58px;width:1px;background:linear-gradient(var(--iri-2),var(--iri-3),var(--iri-1))}
  `,
};

S.urgencia = {
  base: css`
    @media (min-width:900px){.ur{grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:90px}}
    .ur-t{margin-top:26px;padding-left:20px;border-left:1px solid var(--linea-2);font-size:1rem;line-height:1.65;color:var(--suave);max-width:34em}
    .ur-c{gap:12px}
    .ur-c li{padding:22px 24px;border:1px solid rgba(255,255,255,.9);border-left:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);background:var(--sup);box-shadow:var(--sombra-1)}
    .ur-c strong{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(2.4rem,4.4vw,3.4rem);letter-spacing:-.045em;color:var(--texto)}
    .ur-c span{color:var(--suave)}
    /* sin cifras: la ventana de luz que se cierra al bajar */
    /* (si la página ya tiene la cuenta regresiva con su arco, la urgencia va sin arco y a una columna) */
    body:has(.s-contador) .ur:not(:has(.ur-c)){grid-template-columns:minmax(0,820px)}
    body:not(:has(.s-contador)) .ur:not(:has(.ur-c))::after{content:"";justify-self:center;width:100%;max-width:min(420px,80vw);aspect-ratio:4/5;border-radius:999px 999px var(--r-xl) var(--r-xl);
      transform-origin:50% 100%;transform:scaleX(calc(1 - var(--k,0)*.3));box-shadow:var(--sombra-2);outline:1px solid rgba(255,255,255,.75);outline-offset:-14px;
      background:radial-gradient(circle at 50% calc(44% + var(--k,0)*34%),#fff 0 10%,color-mix(in srgb,var(--iri-4) 60%,#fff) 16%,transparent 23%),
        radial-gradient(closest-side at 18% 30%,var(--iri-3),transparent),radial-gradient(closest-side at 86% 52%,color-mix(in srgb,var(--iri-2) 80%,#fff),transparent),
        linear-gradient(90deg,transparent calc(50% - .5px),rgba(255,255,255,.5) 0 calc(50% + .5px),transparent 0),
        linear-gradient(180deg,color-mix(in srgb,var(--iri-2) 85%,#fff) 0%,var(--iri-1) 58%,var(--iri-4) 100%)}
    @media (max-width:899px){.ur:not(:has(.ur-c))::after{max-width:300px;aspect-ratio:1}}
    .ew-mv .s-urgencia .ur{--k:clamp(0,(var(--p,0) - .3)/.55,1)}
  `,
  frase: css`
    .ur-fr .ur-t{margin-top:28px;font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(1.5rem,2.8vw,2.3rem);letter-spacing:-.025em;line-height:1.25;color:var(--texto)}
    .ur-fr .ur-c{margin-top:36px}
  `,
};

S.comparacion = {
  base: css`
    .s-comparacion .ic{width:22px;height:22px;margin-top:0;border-radius:50%;padding:5px}
  `,
  tabla: css`
    .co-t{position:relative;max-width:1000px;border:0;border-radius:0;overflow:visible}
    .co-t::before{content:"";position:absolute;top:0;bottom:0;left:0;width:calc(50% - 7px);border-radius:var(--r-l);background:var(--sup);box-shadow:var(--sombra-2);border:1px solid rgba(255,255,255,.95)}
    .co-t::after{content:"";position:absolute;top:-1px;left:-1px;width:calc(50% - 5px);height:calc(100% + 2px);border-radius:calc(var(--r-l) + 1px);padding:1px;background:var(--iri-lineal);
      -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);pointer-events:none;opacity:.9}
    .co-f{column-gap:14px}
    .co-f>div{position:relative;z-index:1;border-top:1px solid var(--linea);padding:20px clamp(16px,2.4vw,28px);font-size:clamp(.94rem,1.2vw,1.03rem);line-height:1.5;gap:14px}
    .co-t .co-a{order:-1;background:none;color:var(--texto);font-weight:500}
    .co-t .co-b{color:var(--suave)}
    .co-cab>div{border-top:0;padding-top:24px;padding-bottom:18px;font-family:var(--f-txt);font-size:.75rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
    .co-t .co-a .ic{background:var(--iri-conico);color:var(--texto);stroke-width:2.8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .co-t .co-b .ic{color:var(--suave);border:1px solid var(--linea-2);stroke-width:2}
    @media (max-width:760px){
      .co-t::before{width:100%}.co-t::after{width:calc(100% + 2px)}
      .co-f{grid-template-columns:1fr;padding:18px;border-top:1px solid var(--linea)}
      .co-f>div{padding:0;border-top:0}
      .co-f .co-b{margin-top:10px;font-size:.92rem}
      .co-cab{display:flex;justify-content:space-between;gap:12px;border-top:0;padding:20px 18px 14px}
      .co-cab>div,.co-cab .co-b{padding:0;margin:0;font-size:.68rem}.co-cab .co-b{text-align:right}}
  `,
  tarjetas: css`
    .co-2{gap:18px}
    .co-col{border-radius:var(--r-l);padding:clamp(24px,3vw,36px)}
    .co-2 .co-b{border:1px solid var(--linea-2);background:color-mix(in srgb,var(--sup) 40%,transparent);color:var(--suave)}
    .co-2 .co-b .ic{color:var(--suave);border:1px solid var(--linea-2)}
    .co-2 .co-a{background:var(--sup);border:0;box-shadow:var(--sombra-2)}
    ${BORDE_IRI('.co-2 .co-a')}
    .co-2 .co-a .ic{background:var(--iri-conico);color:var(--texto);stroke-width:2.8}
    .co-h{font-weight:500;letter-spacing:-.02em}
  `,
};

S.para_quien = {
  base: css`
    .s-para_quien .cab{text-align:left;margin-inline:0}
    .pq{display:block;max-width:none}
    .pq-col{background:none;border:0;padding:0;border-radius:0}
    .pq-si{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:0 16px}
    .pq-si .pq-h{font-size:clamp(1.35rem,2vw,1.75rem);font-weight:500;letter-spacing:-.03em;margin:0 0 22px;font-family:var(--f-tit)}
    .pq-si .ew-car{margin-bottom:22px}
    .pq-si ul{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr));gap:16px;counter-reset:ew-pq}
    .pq-si li{display:flex;flex-direction:column;align-items:stretch;gap:0;counter-increment:ew-pq;border-radius:var(--r-xl);background:var(--sup);box-shadow:var(--sombra-1);border:1px solid rgba(255,255,255,.95);overflow:hidden}
    ${TONOS('.pq-si li')}
    .pq-si li::before{content:counter(ew-pq,decimal-leading-zero);content:counter(ew-pq,decimal-leading-zero) / "";display:flex;align-items:flex-end;justify-content:flex-end;height:150px;padding:0 12px;
      background:${ARTE};font:italic 300 8rem/1 var(--f-acento);letter-spacing:-.07em;color:rgba(255,255,255,.74);overflow:hidden}
    .pq-si li>.ic{display:none}
    .pq-si li>span{padding:20px 22px 26px;font-size:1.12rem;line-height:1.38;letter-spacing:-.02em;font-weight:500}
    /* el carrusel llega hasta el borde derecho de la pantalla (la sección recorta lo que sobra) */
    .ew-mv .pq-si ul{--sangria:calc(var(--gut) + max(0px,(100vw - 1240px)/2));display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;
      margin-inline:calc(-1*var(--gut)) calc(-1*var(--sangria));padding:6px var(--sangria) 30px var(--gut);scroll-padding-inline:var(--gut);outline-offset:-4px}
    .ew-mv .pq-si ul::-webkit-scrollbar{display:none}
    .ew-mv .pq-si li{flex:0 0 min(80%,330px);scroll-snap-align:start}
    .ew-mv .pq-si ul.ew-arrastre{scroll-snap-type:none;cursor:grabbing}
    .pq-no{position:relative;isolation:isolate;overflow:hidden;margin-top:28px;border-radius:var(--r-xl);background:var(--texto);color:var(--sobre-tinta);padding:30px 24px;display:grid;gap:22px}
    .pq-no::before{content:"";position:absolute;width:420px;aspect-ratio:1;right:-160px;top:-200px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--iri-2) 45%,transparent),transparent);z-index:-1}
    .pq-no .pq-h{margin:0;font-size:clamp(1.5rem,2.4vw,2rem);font-weight:500;letter-spacing:-.03em;line-height:1.1;color:var(--sobre-tinta)}
    .pq-no ul{gap:0}
    .pq-no li{gap:14px;padding:14px 0;border-top:1px solid var(--linea-tinta);font-size:1rem;line-height:1.5;color:var(--sobre-tinta-2)}
    .pq-no .ic{color:var(--sobre-tinta);width:24px;height:24px;padding:6px;border-radius:50%;border:1px solid var(--linea-tinta);margin-top:0}
    @media (min-width:900px){.pq-no{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);padding:44px 48px;gap:48px}}
  `,
};

S.experto = {
  base: css`
    .ex-r{color:var(--texto);font-weight:500;font-size:.98rem;letter-spacing:-.01em;margin:18px 0 0}
    .ex-b{font-size:1.06rem;line-height:1.65;margin-top:16px;max-width:35em}
    .ex-l{margin-top:30px;gap:0;border-top:1px solid var(--linea-2);counter-reset:ew-lo}
    .ex-l li{display:grid;grid-template-columns:44px 1fr;gap:10px;padding:16px 0;border-bottom:1px solid var(--linea);font-size:1rem;line-height:1.5;counter-increment:ew-lo}
    .ex-l li::before{content:counter(ew-lo,decimal-leading-zero);content:counter(ew-lo,decimal-leading-zero) / "";font:italic 300 1.15rem/1.4 var(--f-acento);color:var(--suave)}
    .ex-l .ic{display:none}
  `,
  lado: css`
    @media (min-width:880px){.ex-d{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:96px}.ex-d>div:only-child{grid-column:1/-1;max-width:820px}}
    .ex-f{position:relative;isolation:isolate;max-width:520px;width:100%;justify-self:center}
    .ex-f::before{content:"";position:absolute;inset:8% -8% -6% 6%;border-radius:var(--r-xl);background:var(--iri-conico);filter:blur(40px);opacity:.55;z-index:-1}
    .ex-f img{border-radius:var(--r-xl);border:1px solid rgba(255,255,255,.9);box-shadow:var(--sombra-2)}
    .ex-d .h2{font-size:clamp(2.5rem,5.6vw,5.1rem);letter-spacing:-.05em;line-height:.98}
  `,
  centrado: css`
    .ex-fc{padding:5px;border-radius:50%;background:var(--iri-conico);margin-bottom:24px;box-shadow:0 30px 60px -30px var(--duo)}
    .ex-fc img{display:block;border:4px solid var(--sup);margin:0}
    .ex-c .h2{font-size:clamp(2.3rem,5vw,4.2rem);letter-spacing:-.05em}
  `,
};

S.testimonios = {
  base: css`
    .te{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1);gap:18px}
    .te-e{color:var(--acento);gap:3px}
    .te blockquote p{font-size:1.04rem;line-height:1.62}
    .te figcaption small{color:var(--suave)}
    .te-f img{width:46px;height:46px;box-shadow:0 0 0 2px var(--sup),0 0 0 3px var(--linea-2)}
    .te-pc{background:none;border:1px dashed var(--linea-2);box-shadow:none}
  `,
  destacado: css`
    .te-g{padding:clamp(28px,4vw,52px)}
    ${BORDE_IRI('.te-g')}
    .te-g blockquote p{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(1.45rem,2.8vw,2.2rem);line-height:1.25;letter-spacing:-.02em}
  `,
};

S.cifras = {
  base: css`
    .s-cifras{padding-block:clamp(48px,6vw,84px)}
    .ci-ey{text-align:left}
    .ci{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;background:none;border:0;border-top:1px solid var(--linea-2);border-radius:0;overflow:visible}
    .ci li{background:none;padding:22px 16px 24px;text-align:left;align-content:start;gap:10px}
    .ci li:nth-child(odd){padding-left:0}
    .ci li:nth-child(even){border-left:1px solid var(--linea-2)}
    .ci li:nth-child(n+3){border-top:1px solid var(--linea)}
    .ci li:last-child:nth-child(odd){grid-column:1/-1}
    .ci strong,.ci .ew-odo{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(2.6rem,5vw,4.5rem);letter-spacing:-.045em;line-height:1;color:var(--texto)}
    .ci span:not(.ew-odo):not(.ew-dg):not(.ew-tira):not(.ew-sr){font-size:.86rem;line-height:1.45;color:var(--suave);max-width:16em}
    @media (min-width:900px){
      .ci{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr)}
      .ci li,.ci li:nth-child(n){padding:26px 28px 8px;border-top:0;border-left:1px solid var(--linea-2);grid-column:auto}
      .ci li:first-child{border-left:0;padding-left:0}}
  `,
};

S.temario = {
  base: css`
    .tm-n{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:1.2rem;letter-spacing:-.02em;text-transform:none;color:var(--suave)}
  `,
  acordeon: css`
    .s-temario .acor{max-width:900px;margin-inline:auto}
    .acor summary .tm-n{min-width:2.2ch}
  `,
  lista: css`
    .tm-l{gap:16px}
    .tm-l li{padding:clamp(22px,2.6vw,30px)}
    .tm-l .tm-n{font-size:.75rem;font-family:var(--f-txt);font-style:normal;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
    .tm-l p{color:var(--suave)}
  `,
};

S.oferta = {
  base: css`
    .s-oferta{background:var(--grano),radial-gradient(40% 45% at 82% 26%,color-mix(in srgb,var(--iri-2) 45%,transparent),transparent 70%),radial-gradient(40% 45% at 14% 74%,color-mix(in srgb,var(--iri-3) 40%,transparent),transparent 70%) var(--fondo)}
    .of-l{gap:0}
    .of-l li{padding:14px 0;border-bottom:1px solid var(--linea);align-items:center;gap:14px}
    .of-l .ic{width:22px;height:22px;padding:5px;margin:0;border-radius:50%;background:var(--iri-conico);color:var(--texto);stroke-width:2.8}
    .of-v{font-family:var(--f-acento);font-style:italic;font-weight:300;color:var(--suave)}
    .of-total{color:var(--suave)}
    .of-antes{color:var(--suave)}
    .of-precio{font-weight:500;letter-spacing:-.055em;font-size:clamp(3.2rem,8vw,5.2rem);margin-top:6px}
    .of-det{color:var(--suave)}
    .of-seg{color:var(--suave)}
    .of-p .acc .btn{max-width:440px}
  `,
  tarjeta: css`
    .of-card{max-width:660px;background:var(--sup);border:0;border-radius:var(--r-xl);box-shadow:var(--sombra-2);gap:28px;padding:clamp(26px,4vw,52px)}
    ${BORDE_IRI('.of-card', 'var(--r-xl)')}
  `,
  dividida: css`
    .of-d .of-p{background:var(--sup);border:0;border-radius:var(--r-xl);box-shadow:var(--sombra-2)}
    ${BORDE_IRI('.of-d .of-p', 'var(--r-xl)')}
  `,
};

S.bonos = {
  base: css`
    .bo{gap:18px;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),360px));justify-content:center}
    .bo-tj{position:relative;padding:12px 12px 26px;gap:8px}
    ${TONOS('.bo-tj')}
    .bo-i{width:100%;height:140px;margin-bottom:12px;border-radius:var(--r-m);background:${ARTE};color:var(--texto)}
    .bo-i .ic{width:58px;height:58px;padding:15px;border-radius:50%;background:color-mix(in srgb,#fff 70%,transparent);box-shadow:0 14px 30px -14px color-mix(in srgb,var(--duo) 50%,transparent)}
    .bo-f img{border-radius:var(--r-m);margin-bottom:12px}
    .bo-tj>:not(.bo-i):not(.bo-f){padding-inline:10px}
    .bo-n{font-size:.72rem;color:var(--suave);font-weight:600}
    .bo-v{font-family:var(--f-acento);font-style:italic;font-weight:300!important;font-size:1.25rem}
  `,
  fotos: css`
    .bo-fs{gap:18px}
    .bo-ft{padding:8px;background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1)}
    .bo-ff img{border-radius:var(--r-m)}
    .bo-et{background:var(--sup);color:var(--texto);letter-spacing:.12em;font-size:.7rem;font-weight:600;box-shadow:0 6px 18px -8px rgba(40,25,90,.35)}
    .bo-ft>.bo-et{margin:14px 12px 0}
    .bo-fc{padding:18px 12px 14px}
    .bo-fc .h3{font-weight:500;letter-spacing:-.03em}
  `,
};

S.garantia = {
  base: css`
    .ga{border-radius:var(--r-xl);background:var(--sup);border:1px solid rgba(255,255,255,.95);box-shadow:var(--sombra-2);padding:clamp(26px,4vw,48px);gap:clamp(24px,4vw,44px)}
    .ga-s{width:148px;height:148px;color:var(--texto)}
    .ga-s::before{content:"";position:absolute;inset:-6px;border-radius:50%;background:var(--iri-conico);
      -webkit-mask:radial-gradient(circle,transparent 62%,#000 63% 71%,transparent 72%);mask:radial-gradient(circle,transparent 62%,#000 63% 71%,transparent 72%)}
    .ga-s>svg{opacity:.5}
    .ga-s span{font-size:.7rem;color:var(--suave)}
    .ga-s strong{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:3rem;letter-spacing:-.04em;color:var(--texto)}
    .ga-s .ga-ic{color:var(--acento)}
    .ga-t{font-size:clamp(1.4rem,2.4vw,2rem);letter-spacing:-.035em}
    .ga-x{font-size:1.02rem}
  `,
};

S.faq = {
  acordeon: css`
    .fq{display:grid;gap:36px}
    .fq .cab{text-align:left;margin:0}
    .fq .cab .lead{margin-inline:0}
    .fq .acor{max-width:none;width:100%;margin-inline:0}
    @media (min-width:900px){.fq{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:80px;align-items:start}}
    @media (min-width:900px){.ew-mv .fq .cab{position:sticky;top:110px}}
  `,
  columnas: css`
    .fq-c{gap:0 56px}
    .fq-c>div{padding:22px 0;border-top:1px solid var(--linea-2)}
    .fq-c dt{font-weight:500;font-size:1.12rem;letter-spacing:-.02em;margin-bottom:8px}
    .fq-c dd{color:var(--suave);line-height:1.62}
  `,
};

S.servicios = {
  base: css`
    .sv-pr{font-family:var(--f-acento);font-style:italic;font-weight:300;color:var(--texto)!important;letter-spacing:-.02em}
  `,
  tarjetas: css`
    .sv-g{gap:18px}
    .sv-tj{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1)}
    .sv-f{padding:8px 8px 0}.sv-f img{border-radius:var(--r-m)}
    .sv-c .sv-pr{align-self:flex-start;margin-top:auto;padding:6px 14px;border-radius:99px;font-size:1.1rem;background:color-mix(in srgb,var(--iri-2) 40%,var(--sup))}
    .sv-c .sv-pr{margin-top:16px}
  `,
  precios: css`
    .sv-p{gap:0;max-width:820px;border-top:1px solid var(--linea-2)}
    .sv-p li{padding:22px 0;border-bottom:1px solid var(--linea-2)}
    .sv-pt .h3{font-size:clamp(1.15rem,1.6vw,1.35rem)}
    .sv-pd{border-bottom:1px dotted var(--linea-2)}
    .sv-p .sv-pr{font-size:1.4rem}
  `,
};

S.galeria = {
  base: css`
    .s-galeria figure{border-radius:var(--r-l);box-shadow:var(--sombra-1)}
    .s-galeria figcaption{left:10px;right:auto;bottom:10px;max-width:calc(100% - 20px);padding:6px 12px;border-radius:99px;font-size:.78rem;color:var(--texto);
      background:color-mix(in srgb,var(--sup) 86%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
  `,
  cuadricula: css`.ga-c{gap:12px}@media (min-width:820px){.ga-c{gap:16px}}`,
  mosaico: css`.ga-m{gap:12px}@media (min-width:820px){.ga-m{gap:16px}}`,
};

S.ubicacion = {
  base: css`
    .ub{gap:0;background:var(--sup);border:1px solid rgba(255,255,255,.95);border-radius:var(--r-xl);box-shadow:var(--sombra-2);max-width:960px}
    .ub>div{background:none;padding:clamp(24px,3.4vw,40px)}
    @media (min-width:760px){.ub>div+div{border-left:1px solid var(--linea)}}
    @media (max-width:759px){.ub>div+div{border-top:1px solid var(--linea)}}
    .ub-i{width:44px;height:44px;padding:11px;border-radius:50%;background:var(--iri-conico);color:var(--texto);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .ub-dir{font-weight:500;font-size:1.15rem;letter-spacing:-.02em}
    .ub-h div{border-bottom:1px dashed var(--linea-2)}
    .ub-h dt{font-weight:500}
  `,
};

S.video = {
  base: css`
    .vi .vid{margin-top:4px}
  `,
};

S.gracias = {
  base: css`
    .s-gracias{--ox:50%;--oy:22%;isolation:isolate;background:${CAMPO('var(--ox)', 'var(--oy)')};padding-block:clamp(48px,7vw,104px)}
    .s-gracias::after{${FUNDIDO('bottom', 160)}}
    .s-gracias .w{position:relative;z-index:1}
    .gr-ok{width:84px;height:84px;margin-bottom:22px;background:var(--perla);color:var(--texto);
      box-shadow:inset -6px -9px 18px color-mix(in srgb,var(--duo) 24%,transparent),inset 0 0 0 1px rgba(255,255,255,.5),0 26px 44px -20px color-mix(in srgb,var(--duo) 60%,transparent)}
    .gr-ok .ic{width:34px;height:34px}
    .gr .h1{margin-top:6px}
    .gr .lead{margin-top:18px}
    .gr-acc .btn{padding:7px 26px 7px 7px;gap:14px}
    .gr-acc .btn .ic{width:46px;height:46px;padding:11px;border-radius:50%;background:var(--perla);color:var(--texto);flex:none}
    .gr-p{gap:12px}
    .gr-p li{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1);padding:20px 22px;gap:18px}
    .gr-n{width:38px;height:38px;background:var(--iri-conico);color:var(--texto);font:italic 300 1.15rem/1 var(--f-acento)}
    .s-gracias .ew-ancla{top:-20px;right:-70px;width:190px}
    @media (min-width:900px){.s-gracias .ew-ancla{top:10%;right:max(2%,calc(50% - 620px));width:min(260px,19vw)}}
  `,
};

S.pie = {
  base: css`
    .s-pie{background:var(--texto);color:var(--sobre-tinta-2);border-top:0;padding-block:clamp(64px,9vw,120px) 30px}
    .pie{justify-items:stretch;text-align:left;gap:0;font-size:.84rem;color:var(--sobre-tinta-2)}
    .pie-m{display:flex;flex-direction:column-reverse;gap:22px;color:var(--sobre-tinta-2)}
    .pie-m>span{display:block;font-family:var(--f-tit);font-weight:500;font-size:clamp(2.6rem,9.5vw,9.5rem);line-height:.92;text-wrap:balance;letter-spacing:-.06em;color:var(--sobre-tinta);
      caret-color:var(--sobre-tinta);overflow-wrap:anywhere;padding-bottom:.06em}
    @supports ((-webkit-background-clip:text) or (background-clip:text)){.pie-m>span{background:var(--iri-lineal);-webkit-background-clip:text;background-clip:text;color:transparent}}
    .pie-l{justify-content:flex-start;gap:8px 24px;margin-top:40px;padding-top:22px;border-top:1px solid var(--linea-tinta)}
    .pie-l a{color:var(--sobre-tinta)}
    .pie-x{margin-top:18px;max-width:62em;color:var(--sobre-tinta-2);font-size:.8rem}
  `,
};

// ---------- las secciones de una página de evento (7-oct) ----------

S.niveles = {
  base: css`
    /* las entradas: tarjetas de nácar; la destacada con borde iridiscente, los interruptores son perlas */
    .nv-ct .nv-etapa{${VIDRIO};padding:6px 14px;border-radius:99px;color:var(--texto);font-size:.74rem;font-weight:600;letter-spacing:.15em;box-shadow:0 6px 18px -10px rgba(40,25,90,.35)}
    .nv-cc{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-m);box-shadow:var(--sombra-1)}
    .nv-cc .ct-n,.nv-cc .ew-odo{font-family:var(--f-acento);font-style:italic;font-weight:300;letter-spacing:-.04em;color:var(--texto)}
    .nv-cl{color:var(--suave)}
    .nv{gap:18px}
    @media (min-width:1000px){.nv-3{grid-template-columns:repeat(3,minmax(0,1fr))}.nv-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
    .nv-tj{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1);padding:clamp(30px,3vw,40px) clamp(20px,2.4vw,28px) clamp(22px,2.4vw,28px)}
    ${BORDE_IRI('.nv-dest')}
    .nv-dest{box-shadow:var(--sombra-2)}
    @media (min-width:1000px){.nv-dest{transform:translateY(-10px)}}
    .nv-eti{background:var(--texto);color:var(--sobre-tinta);font-size:.7rem;font-weight:600;letter-spacing:.14em;z-index:2}
    .nv-nom{font-family:var(--f-txt);font-size:.78rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--suave)}
    .nv-cab .nv-etapa{color:var(--suave);font-size:.7rem;letter-spacing:.15em}
    .nv-p strong{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(2.9rem,4.6vw,3.9rem);letter-spacing:-.045em;color:var(--texto)}
    .nv-cupos b{color:var(--texto)}
    .nv-barra{background:var(--linea)}.nv-barra>span{background:var(--iri-lineal)}
    .nv-sw{background:var(--iri-conico);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .nv-sw::after{background:#fff;box-shadow:0 1px 3px rgba(22,19,29,.25)}
    .nv-no .nv-sw{background:var(--fondo-2);box-shadow:inset 0 0 0 1px var(--linea-2)}
    .nv-no .nv-sw::after{background:var(--linea-2);box-shadow:none}
    .nv-seg{color:var(--suave)}
  `,
};

S.equipo = {
  base: css`
    .eq{gap:18px}
    .eq-tj{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1)}
    .eq-f{padding:8px 8px 0}.eq-f img{border-radius:var(--r-m)}
    .eq-sf .eq-c::before{content:"";width:46px;height:46px;margin-bottom:8px;border-radius:50%;background:var(--perla);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .eq-n{font-weight:500;letter-spacing:-.035em;font-size:clamp(1.5rem,2.4vw,2rem)}
    .eq-r{color:var(--suave);font-weight:500;font-size:.95rem}
    .eq-b{font-size:1rem;line-height:1.65}
  `,
};

S.logistica = {
  base: css`
    .lg{gap:0;background:var(--sup);border:1px solid rgba(255,255,255,.95);border-radius:var(--r-xl);box-shadow:var(--sombra-2);overflow:hidden}
    .lg-tj{background:none;border:0;border-radius:0;padding:clamp(24px,3vw,34px)}
    .lg-tj+.lg-tj{border-top:1px solid var(--linea)}
    @media (min-width:1000px){.lg-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg-tj+.lg-tj{border-top:0;border-left:1px solid var(--linea)}}
    .lg-i{width:40px;height:40px;padding:10px;border-radius:50%;background:var(--iri-conico);color:var(--texto);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .lg-r{color:var(--suave);font-weight:600;font-size:.72rem}
    .lg-v{font-weight:500;letter-spacing:-.02em;font-size:1.2rem}
  `,
};

S.dudas = {
  base: css`
    .du{background:var(--sup);border:1px solid rgba(255,255,255,.95);border-radius:var(--r-xl);box-shadow:var(--sombra-2)}
    .du-i{width:52px;height:52px;padding:13px;border-radius:50%;background:var(--iri-conico);color:var(--texto);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .du-t{font-weight:500;letter-spacing:-.03em}
  `,
};

S.idea = {
  base: css`
    .id-img img{border-radius:var(--r-xl);border:1px solid rgba(255,255,255,.9);box-shadow:var(--sombra-2)}
    .id-fr{border-left:0;padding-left:0;font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:clamp(1.5rem,2.6vw,2.1rem);letter-spacing:-.025em;line-height:1.25}
  `,
  lado: css`
    @media (min-width:880px){.id-d{gap:88px}}
  `,
  centrada: css`
    .id-c .id-img{position:relative;isolation:isolate}
    .id-c .id-img::before{content:"";position:absolute;inset:8% 6% -4%;border-radius:var(--r-xl);background:var(--iri-conico);filter:blur(42px);opacity:.5;z-index:-1}
  `,
};

S.caminos = {
  base: css`
    .cm{gap:18px}
    .cm-col{background:var(--sup);border:1px solid rgba(255,255,255,.9);border-radius:var(--r-l);box-shadow:var(--sombra-1)}
    ${BORDE_IRI('.cm-b')}
    .cm-b{box-shadow:var(--sombra-2)}
    .cm-r{color:var(--suave);font-weight:600;font-size:.72rem}.cm-b .cm-r{color:var(--texto)}
    .cm-t{font-weight:500;letter-spacing:-.03em;font-size:clamp(1.35rem,2vw,1.65rem)}
    .cm-l .ic{width:22px;height:22px;padding:5px;margin-top:1px;border-radius:50%;background:var(--fondo-2);color:var(--suave);stroke-width:2.4}
    .cm-b .ic{background:var(--iri-conico);color:var(--texto);box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}
    .cm-c{font-family:var(--f-acento);font-style:italic;font-weight:300;font-size:1.15rem;color:var(--texto);border-top-color:var(--linea-2)}
  `,
};

export const CSS_NACAR = { base: BASE, secciones: S };

// Privacidad y términos con el marfil y el grano de la página.
export const CSS_LEGAL_NACAR = css`
  body{background:var(--fondo) ${GRANO};letter-spacing:-.003em}
  .lg h1{font-weight:500;letter-spacing:-.04em}
  .lg h2{font-weight:500;letter-spacing:-.02em}
`;
