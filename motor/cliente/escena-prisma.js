// Escena de PRISMA (sin librerías). Dos partes, las dos las llama motor/cliente/movimiento.js (nunca en edición ni en
// las miniaturas):
//  · window.__ewDecorado(api): en cuanto corre el JS de movimiento, antes de la primera pintura, arma las piezas quietas
//    que no vienen en el HTML de las secciones: en la barra de arriba (el aviso, si es lo primero de la página) la marca a
//    la izquierda y una píldora con el texto del botón de la portada a la derecha, y en el pie la marca gigante y tenue
//    que corre como marquesina. Todo aria-hidden: el texto real sigue en su lugar (la frase del aviso, la marca del pie).
//    Corre también con movimiento reducido y ahorro de datos (lo que se mueve lo decide el resto del JS y el CSS).
//  · window.__ewEscena(api): un prisma de luz violeta y cian en WebGL (las caras, las aristas encendidas, un haz vertical,
//    el resplandor de la base y rayos de luz que se abren a los lados) en el escenario de la portada o de gracias: el
//    mismo lugar donde el CSS dibuja su respaldo (el ::after de .hero-c, .hero-form, .hero-sf o .gr). Arranca después de
//    la primera pintura y en tiempo libre; dibuja solo cuando se ve y con la pestaña a la vista, a 30 cuadros por segundo
//    en escritorio y 24 (con menos resolución) en el celular, baja la resolución sola si el equipo no da y se apaga detrás
//    del texto. Nunca con movimiento reducido, ahorro de datos o 2G, ni sobre una página clara o una sección con colores
//    propios (su respaldo en CSS ya toma esos colores).
// Se compacta (esbuild) en ESCENAS.prisma.
(function () {
  var d = document;
  var W = window;

  function nodo(tag, clase, txt) {
    var x = d.createElement(tag);
    if (clase) x.className = clase;
    if (txt != null) x.textContent = txt;
    return x;
  }
  function oculto(x) {
    x.setAttribute('aria-hidden', 'true');
    return x;
  }
  function texto(x) {
    return x ? (x.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }
  function $(s, c) {
    return (c || d).querySelector(s);
  }

  // La marca con su última palabra en degradado (como un logotipo de dos tonos).
  function marca(el, t) {
    var p = t.split(' ');
    if (p.length > 1) {
      el.appendChild(d.createTextNode(p.slice(0, -1).join(' ') + ' '));
      el.appendChild(nodo('b', '', p[p.length - 1]));
    } else el.textContent = t;
    return el;
  }

  // Una cinta que corre (la arma igual que la marca gigante del pie): `tanda()` da un trozo y se repite hasta pasar 1,6
  // veces el ancho, dos veces (la mitad de la pista es la vuelta).
  function cinta(clase, tanda) {
    var m = oculto(nodo('div', 'ew-marq ' + clase));
    m.setAttribute('data-dir', '1');
    var pista = nodo('div', 'ew-pista');
    m.appendChild(pista);
    return {
      m: m,
      llenar: function () {
        pista.appendChild(tanda());
        var una = pista.scrollWidth || 1;
        var veces = Math.min(10, Math.max(1, Math.ceil((m.clientWidth || innerWidth) * 1.6 / una)));
        for (var i = 1; i < veces * 2; i++) pista.appendChild(tanda());
      },
    };
  }

  W.__ewDecorado = function () {
    var nombre = texto($('.s-pie .pie-m>span'));
    // El logo de la marca (el del pie), si la página tiene: va en la barra en lugar del nombre.
    var logo = $('.s-pie .pie-logo img');
    // La barra de arriba: solo si el aviso es lo primero de la página.
    var primera = $('body>.sec');
    var a = primera && primera.classList.contains('s-aviso') ? $('.aviso-a', primera) : null;
    if (a && !$('.ew-tb-b', a)) {
      var b = $('.s-hero a.btn,.s-hero button.btn,.s-gracias a.btn');
      var tb = b && texto(b.firstElementChild || b);
      if (nombre || tb || logo) {
        a.classList.add('ew-tb');
        if (logo) {
          var l = logo.cloneNode();
          l.removeAttribute('loading');
          l.setAttribute('alt', '');
          a.insertBefore(oculto(nodo('span', 'ew-tb-m')), a.firstChild).appendChild(l);
        } else if (nombre) a.insertBefore(marca(oculto(nodo('span', 'ew-tb-m')), nombre), a.firstChild);
        if (tb) a.appendChild(oculto(nodo('span', 'ew-tb-b', tb + ' →')));
      }
    }
    // Los puntos clave de una portada con foto: una cinta que corre al pie de la portada (sin JS quedan quietos, en fila).
    var pts = $('.s-hero.v-centrado .hero-img') && $('.s-hero .hero-pts');
    if (pts && !$('.ew-pts-m')) {
      var frases = Array.prototype.map.call(pts.querySelectorAll('li'), texto).filter(Boolean);
      if (frases.length) {
        var c = cinta('ew-pts-m', function () {
          var it = nodo('span', 'ew-it');
          frases.forEach(function (f) {
            it.appendChild(nodo('span', '', f));
            it.appendChild(nodo('i'));
          });
          return it;
        });
        pts.parentNode.insertBefore(c.m, pts.nextSibling);
        pts.classList.add('ew-sr');
        c.llenar();
      }
    }
    // El pie: la marca gigante que corre (la pista con el nombre repetido hasta pasar 1,6 veces el ancho, dos veces).
    var pie = $('.s-pie');
    if (pie && nombre && !$('.ew-pie-m', pie)) {
      var g = cinta('ew-pie-m', function () {
        var it = nodo('span', 'ew-it', nombre);
        it.appendChild(nodo('i'));
        return it;
      });
      pie.insertBefore(g.m, pie.firstChild);
      g.llenar();
    }
  };

  // ── El prisma de luz ──────────────────────────────────────────────────────────────────────────────────────────────
  // uE: el escenario (x, y desde abajo, ancho, alto) en píxeles del lienzo; uZ: hasta 4 cajas de texto (0-1, y desde
  // abajo) donde la luz se apaga; uA, uB, uC: la punta clara, el primario y el acento.
  var FS =
    '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' +
    'uniform vec2 uR,uM;uniform vec4 uE;uniform vec4 uZ[4];uniform float uT;uniform vec3 uA,uB,uC;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float sg(vec2 p,vec2 a,vec2 b){vec2 q=p-a,e=b-a;return length(q-e*clamp(dot(q,e)/dot(e,e),0.,1.));}' +
    'float cr(vec2 a,vec2 b,vec2 p){return (b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);}' +
    'float ry(vec2 d,float an,float an2,float L,float s){vec2 v=vec2(cos(an),sin(an));float t=dot(d,v),tt=max(t,0.);float w=abs(dot(d,vec2(-v.y,v.x)));' +
    'return step(0.,t)*exp(-w/(s*(1.5+tt*an2)))*exp(-tt/L);}' +
    'void main(){vec2 p=gl_FragCoord.xy;float Wd=uE.z,H=uE.w,s=H/300.;' +
    'vec2 ap=vec2(uE.x+Wd*.5,uE.y+H),bl=vec2(uE.x+Wd*.06,uE.y+H*.08),br=vec2(uE.x+Wd*.94,uE.y+H*.08),bc=vec2(ap.x,bl.y);' +
    'float mx=uM.x>-9e2?(uM.x/uR.x-.5):0.;' +
    // aristas y arista central
    'float e1=sg(p,ap,bl),e2=sg(p,ap,br),e3=sg(p,ap,bc);' +
    'float ar=exp(-e1/(1.8*s))*.75+exp(-e2/(1.8*s))*.75+exp(-e3/(1.3*s))+(exp(-e1/(16.*s))+exp(-e2/(16.*s)))*.16;' +
    // dentro del prisma: las caras, con un barrido de luz que va y viene
    'float dn=step(0.,cr(bl,br,p))*step(0.,cr(br,ap,p))*step(0.,cr(ap,bl,p));' +
    'float yv=clamp((p.y-bl.y)/(ap.y-bl.y),0.,1.);' +
    'float bx=ap.x+sin(uT*.42)*Wd*.3;float ba=exp(-pow((p.x-bx)/(Wd*.13),2.));' +
    'float lado=smoothstep(-3.*s,3.*s,p.x-ap.x);vec3 cara=mix(uB,uC,lado);' +
    'float cf=dn*(.13+.2*(1.-yv)+.3*ba*(1.-yv*.5));' +
    // el haz vertical sobre la punta
    'float hz=step(ap.y-2.,p.y)*(exp(-abs(p.x-ap.x)/(1.2*s))*.85+exp(-abs(p.x-ap.x)/(20.*s))*.12)*exp(-(p.y-ap.y)/(H*.9));' +
    // el resplandor de la base y los rayos que se abren a los lados
    'vec2 q=p-bc;vec2 g=q/vec2(Wd*.62,H*.075);float gl=exp(-dot(g,g))*.8;' +
    'float L=Wd*1.15,f1=.75+.25*sin(uT*.9),f2=.75+.25*sin(uT*.7+2.);float k=.006;' +
    'float rl=ry(q,3.1416-.05-mx*.06,k,L,s)*f1+ry(q,3.1416-.2-mx*.08,k*1.6,L*.8,s)*.55*f2+ry(q,3.1416+.07,k,L*.7,s)*.4;' +
    'float rr=ry(q,.05-mx*.06,k,L,s)*f2+ry(q,.2-mx*.08,k*1.6,L*.8,s)*.55*f1+ry(q,-.07,k,L*.7,s)*.4;' +
    // chispas sueltas cerca del prisma
    'vec2 cg=floor(p/(24.*s)),cfp=fract(p/(24.*s))-.5;float rn=h(cg);' +
    'float ch=step(.94,rn)*exp(-dot(cfp,cfp)*120.)*pow(max(0.,sin(uT*1.4+rn*60.)),6.)*.9*exp(-length(p-vec2(ap.x,ap.y-H*.4))/(Wd*.7));' +
    'vec3 col=cara*cf+mix(uA,vec3(1.),.35)*ar*(.55+.45*yv)+uA*hz+mix(uA,vec3(1.),.2)*gl+uB*rl+uC*rr+mix(uA,uC,rn)*ch;' +
    // la luz se queda en su escenario y se apaga detrás del texto
    'vec2 c0=vec2(uE.x-Wd*.75,uE.y-H*.18),c1=vec2(uE.x+Wd*1.75,uE.y+H*2.);' +
    'float ez=smoothstep(c0.x-30.*s,c0.x+60.*s,p.x)*(1.-smoothstep(c1.x-60.*s,c1.x+30.*s,p.x))*smoothstep(c0.y-10.*s,c0.y+40.*s,p.y);' +
    'vec2 u=p/uR;float z=0.;for(int i=0;i<4;i++){vec4 Z=uZ[i];vec2 zz=smoothstep(Z.xy-.025,Z.xy+.01,u)*(1.-smoothstep(Z.zw-.01,Z.zw+.025,u));z=max(z,zz.x*zz.y);}' +
    'col=min(col*ez*(1.-.9*z),vec3(1.));float al=clamp(max(col.r,max(col.g,col.b)),0.,1.);' +
    'gl_FragColor=vec4(col,al);}';
  var NOMBRES = ['uR', 'uM', 'uE', 'uT', 'uA', 'uB', 'uC'];

  function rgb(s) {
    s = String(s || '').trim().replace('#', '');
    if (s.length === 3) s = s.replace(/(.)/g, '$1$1');
    var v = parseInt(s, 16);
    if (isNaN(v)) v = 0x7a4eff;
    return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
  }
  function luz(c) {
    return c.reduce(function (t, v, i) { return t + [0.2126, 0.7152, 0.0722][i] * (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }, 0);
  }
  // La caja del prisma de CSS (el ::after de `el`), en coordenadas de la página. null si no se dibuja.
  function escenario(el) {
    var cs = getComputedStyle(el, '::after');
    if (!cs || cs.content === 'none' || cs.display === 'none') return null;
    var w = parseFloat(cs.width), h = parseFloat(cs.height), x = parseFloat(cs.left), y = parseFloat(cs.top);
    if (!(w > 20 && h > 20) || isNaN(x) || isNaN(y)) return null;
    var m = /matrix\(([^)]+)\)/.exec(cs.transform || '');
    var t = m ? m[1].split(',').map(parseFloat) : [1, 0, 0, 1, 0, 0];
    var r = el.getBoundingClientRect();
    return { left: r.left + el.clientLeft + x + t[4], top: r.top + el.clientTop + y + t[5], width: w, height: h };
  }

  function prisma(api, sec) {
    var host = null;
    ['.hero-form', '.hero-c', '.hero-sf', '.gr'].some(function (s) {
      var x = $(s, sec);
      if (x && escenario(x)) host = x;
      return !!host;
    });
    if (!host || $('.ew-lienzo', sec)) return;
    var cv = oculto(nodo('canvas', 'ew-lienzo'));
    sec.insertBefore(cv, sec.firstChild);
    var gl = cv.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) return cv.remove();
    var movil = api.movil;
    var sombra = function (t, s) {
      var o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    var pr = gl.createProgram();
    gl.attachShader(pr, sombra(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(pr, sombra(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    var ext = gl.getExtension('KHR_parallel_shader_compile');
    var U = {};
    var UZ = [];
    // El texto de la portada (la luz se apaga detrás): cada bloque por separado.
    var textos = [].slice.call(sec.querySelectorAll('.hero-t,.hero-x,.hero-c>:not(.hero-img),.hero-form,.gr>*,.cta-in'));
    var fps = movil ? 24 : 30;
    var minimo = 1000 / fps;
    var q = 1, s = 1, w = 0, alto = 0, mx = -9e3, my = -9e3, vis = 0, raf = 0, t0 = performance.now() - Math.random() * 3e4, ultimo = 0, lentos = 0, listo = 0, muerto = 0;
    var medir = function () {
      var r = cv.getBoundingClientRect();
      if (!r.width || muerto) return;
      s = (movil ? 0.75 : Math.min(W.devicePixelRatio || 1, 1.5)) * q;
      w = Math.max(1, Math.round(r.width * s));
      alto = Math.max(1, Math.round(r.height * s));
      cv.width = w;
      cv.height = alto;
      gl.viewport(0, 0, w, alto);
      gl.uniform2f(U.uR, w, alto);
      var e = escenario(host);
      if (!e) e = { left: -9e3, top: -9e3, width: 100, height: 100 };
      gl.uniform4f(U.uE, (e.left - r.left) * s, (r.bottom - (e.top + e.height)) * s, e.width * s, e.height * s);
      // Hasta 4 cajas de texto, en 0-1 con y desde abajo.
      var cajas = [];
      textos.forEach(function (x) {
        var b = x.getBoundingClientRect();
        if (b.width && b.height && cajas.length < 4) cajas.push([(b.left - r.left) / r.width, (r.bottom - b.bottom) / r.height, (b.right - r.left) / r.width, (r.bottom - b.top) / r.height]);
      });
      for (var i = 0; i < 4; i++) {
        var c = cajas[i] || [2, 2, 2, 2];
        gl.uniform4f(UZ[i], c[0], c[1], c[2], c[3]);
      }
    };
    var dibujar = function (ahora) {
      gl.uniform1f(U.uT, (ahora - t0) / 1000);
      gl.uniform2f(U.uM, mx < -8e3 ? -9e3 : mx * s, alto - my * s);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!listo) {
        listo = 1;
        cv.classList.add('ew-on');
        sec.classList.add('ew-gl');
      }
    };
    var bucle = function (ahora) {
      raf = 0;
      if (!vis || d.hidden || muerto) return;
      raf = requestAnimationFrame(bucle);
      var dt = ahora - ultimo;
      if (dt < minimo - 2) return;
      // Si el equipo no llega a los cuadros pedidos, baja la resolución (hasta la mitad).
      if (ultimo && dt > minimo * 1.8) {
        if (++lentos > 45 && q > 0.55) {
          q *= 0.8;
          lentos = 0;
          medir();
        }
      } else lentos = Math.max(0, lentos - 1);
      ultimo = ahora;
      dibujar(ahora);
    };
    var arrancar = function () {
      if (!raf && vis && !d.hidden && !muerto) {
        ultimo = 0;
        raf = requestAnimationFrame(bucle);
      }
    };
    var empezar = function () {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return cv.remove();
      gl.useProgram(pr);
      NOMBRES.forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
      for (var i = 0; i < 4; i++) UZ.push(gl.getUniformLocation(pr, 'uZ[' + i + ']'));
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var al = gl.getAttribLocation(pr, 'a');
      gl.enableVertexAttribArray(al);
      gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
      gl.uniform3fv(U.uA, rgb(api.color('--pri-a', sec)));
      gl.uniform3fv(U.uB, rgb(api.color('--pri', sec)));
      gl.uniform3fv(U.uC, rgb(api.color('--pri-c', sec)));
      medir();
      if (typeof ResizeObserver === 'function') new ResizeObserver(medir).observe(sec);
      else addEventListener('resize', medir);
      api.observar(cv, function (si) {
        vis = si;
        arrancar();
      }, '60px 0px');
      d.addEventListener('visibilitychange', arrancar);
      if (!movil) {
        sec.addEventListener('pointermove', function (e) {
          var r = cv.getBoundingClientRect();
          mx = e.clientX - r.left;
          my = e.clientY - r.top;
        }, { passive: true });
        sec.addEventListener('pointerleave', function () { mx = my = -9e3; });
      }
      cv.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        muerto = 1;
        cv.classList.remove('ew-on');
        sec.classList.remove('ew-gl');
      });
    };
    // El sombreador se compila en paralelo si el navegador lo permite: así no traba la página mientras tanto.
    var esperar = function () {
      if (ext && !gl.getProgramParameter(pr, ext.COMPLETION_STATUS_KHR)) return setTimeout(esperar, 40);
      empezar();
    };
    esperar();
  }

  W.__ewEscena = function (api) {
    // La luz suma: sobre una página clara no se ve (ahí queda el prisma de CSS).
    if (luz(rgb(api.color('--fondo'))) > 0.2) return;
    var a = api.anclas().filter(function (x) { return x.getAttribute('data-forma') === 'prisma'; })[0];
    var sec = a && a.closest('section');
    if (sec && !sec.classList.contains('ew-est-x')) prisma(api, sec);
  };
})();
