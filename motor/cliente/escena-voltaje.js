// Escena de VOLTAJE (sin librerías). Dos partes, las dos las llama motor/cliente/movimiento.js (nunca en edición ni
// en las miniaturas):
//  · window.__ewDecorado(api): en cuanto corre el JS de movimiento, antes de la primera pintura, arma las piezas quietas
//    que no vienen en el HTML de las secciones: la marquesina del aviso, las cintas cruzadas al pie de la portada, el
//    dato gigante del evento (p. ej. "29 OCT") detrás de la foto con su sello giratorio, el nombre enorme de quién enseña
//    en dos filas, la marquesina de la urgencia y las cifras de los logros (para que rueden). Todo aria-hidden y fuera
//    del flujo: no mueve nada de lugar (CLS 0) y sin JS la página está completa igual. Corre también con movimiento
//    reducido y ahorro de datos (lo que se mueve lo decide el resto del JS y el CSS).
//  · window.__ewEscena(api): un panel de LEDs en WebGL que fluye y se apaga detrás del texto, en la portada (o gracias)
//    y en el cierre con formulario. Arranca después de la primera pintura y en tiempo libre; dibuja solo lo que se ve y
//    con la pestaña a la vista, a 30 cuadros por segundo en escritorio y 24 (con menos resolución) en el celular, y baja
//    la resolución sola si el equipo no da. Nunca con movimiento reducido, ahorro de datos o 2G.
// Se compacta (esbuild) en ESCENAS.voltaje.
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
  function $$(s, c) {
    return [].slice.call((c || d).querySelectorAll(s));
  }
  // Frases cortas de una lista de textos (partidos en "·"), sin repetir y hasta `max`.
  function frases(lista, max) {
    var fuera = [];
    var vistas = {};
    lista.forEach(function (t) {
      String(t || '').split(/\s+·\s+|\s+•\s+/).forEach(function (f) {
        f = f.replace(/[.\s]+$/, '').trim();
        var k = f.toLowerCase();
        if (f && f.length <= 60 && !vistas[k] && fuera.length < max) {
          vistas[k] = 1;
          fuera.push(f);
        }
      });
    });
    return fuera;
  }
  // Una marquesina (ya puesta en la página, para medirla): la pista con las frases (con su asterisco) repetidas hasta
  // pasar 1,6 veces el ancho, dos veces.
  function marquesina(el, lista, dir) {
    el.classList.add('ew-marq');
    el.setAttribute('data-dir', dir);
    var pista = nodo('div', 'ew-pista');
    var tanda = function () {
      var f = d.createDocumentFragment();
      lista.forEach(function (t) {
        var it = nodo('span', 'ew-it', t + ' ');
        it.appendChild(nodo('i', 'ew-ast'));
        f.appendChild(it);
      });
      return f;
    };
    pista.appendChild(tanda());
    el.appendChild(pista);
    var una = pista.scrollWidth || 1;
    var veces = Math.min(12, Math.max(1, Math.ceil((el.clientWidth || innerWidth) * 1.6 / una)));
    for (var i = 1; i < veces * 2; i++) pista.appendChild(tanda());
    return el;
  }

  // Fecha del evento ("29", "OCT") en su zona horaria, de los chips de la portada o de gracias.
  function fecha(sec) {
    var e = $('[data-hora-local]', sec);
    var ms = e && +e.getAttribute('data-hora-local');
    if (!ms || !W.Intl) return null;
    try {
      var p = {};
      new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: e.getAttribute('data-zona') || undefined }).formatToParts(ms).forEach(function (x) {
        p[x.type] = x.value;
      });
      var mes = String(p.month || '').replace(/\./g, '').slice(0, 3).toUpperCase();
      return p.day && mes ? [p.day, mes] : null;
    } catch (err) {
      return null;
    }
  }
  function dato(sec, donde) {
    var f = fecha(sec);
    if (!f || !donde || $('.ew-dato', donde)) return;
    var p = oculto(nodo('p', 'ew-dato'));
    f.forEach(function (t, i) {
      var s = nodo('span', 'ew-dato-' + (i ? 'b' : 'a'), t);
      s.style.setProperty('--i', i);
      p.appendChild(s);
    });
    donde.insertBefore(p, donde.firstChild);
  }

  // El sello giratorio: las frases de la nota de la portada (o de sus chips) alrededor de un círculo, en mayúsculas.
  var SVG = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs) {
    var x = d.createElementNS(SVG, tag);
    for (var k in attrs) x.setAttribute(k, attrs[k]);
    return x;
  }
  function sello(sec, donde) {
    if (!donde || $('.ew-sello', donde)) return;
    var lista = frases([texto($('.nota', sec))].concat($$('.evento li>span', sec).map(function (s) { return s.firstChild ? s.firstChild.textContent : ''; })), 5);
    if (!lista.length) return;
    var t = '';
    for (var i = 0; t.length < 30 && i < 8; i++) t += lista[i % lista.length].toUpperCase() + ' • ';
    while (t.length > 46 && lista.length > 1) {
      lista.pop();
      t = lista.map(function (x) { return x.toUpperCase() + ' • '; }).join('');
    }
    if (t.length > 46) return;
    var caja = oculto(nodo('div', 'ew-sello'));
    var s = svg('svg', { viewBox: '0 0 200 200', focusable: 'false' });
    var defs = svg('defs', {});
    defs.appendChild(svg('path', { id: 'ew-circulo', d: 'M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0' }));
    s.appendChild(defs);
    var g = svg('g', { class: 'ew-gira' });
    g.appendChild(svg('circle', { class: 'ew-s-fondo', cx: 100, cy: 100, r: 99 }));
    var tx = svg('text', {});
    var tp = svg('textPath', { href: '#ew-circulo', textLength: 496, lengthAdjust: 'spacing' });
    tp.textContent = t;
    tx.appendChild(tp);
    g.appendChild(tx);
    s.appendChild(g);
    s.appendChild(svg('circle', { class: 'ew-s-centro', cx: 100, cy: 100, r: 46 }));
    var a = svg('g', { class: 'ew-s-ast', transform: 'translate(100 100) scale(.62)' });
    for (var k = 0; k < 4; k++) a.appendChild(svg('rect', { x: -3.4, y: -20, width: 6.8, height: 40, rx: 3.4, transform: 'rotate(' + k * 45 + ')' }));
    s.appendChild(a);
    caja.appendChild(s);
    donde.appendChild(caja);
  }

  W.__ewDecorado = function () {
    // El aviso de arriba corre como marquesina (el texto real queda para los lectores de pantalla).
    var a = $('.s-aviso .aviso-a');
    var t0 = a && texto(a.firstElementChild);
    if (t0 && !$('.ew-marq', a)) {
      a.classList.add('ew-con-marq');
      marquesina(a.appendChild(oculto(nodo('span', 'ew-aviso-m'))), [t0], 1);
    }

    var h = $('.s-hero');
    if (h) {
      // Cintas cruzadas al pie de la portada: los puntos clave (o los beneficios) y los datos del evento.
      var uno = frases($$('.hero-pts li', h).map(texto), 4);
      if (uno.length < 2) uno = frases($$('.s-beneficios .h3').map(texto), 4);
      var dos = frases($$('.evento li>span', h).map(function (s) { return s.firstChild ? s.firstChild.textContent : ''; }).concat([texto($('.nota', h))]), 6);
      if (dos.length < 2) dos = frases([texto($('.ey', h))], 4);
      if (uno.length < 2) {
        uno = dos;
        dos = [];
      }
      if (uno.length >= 2 && !$('.ew-cintas', h)) {
        var cintas = oculto(nodo('div', 'ew-cintas'));
        h.appendChild(cintas);
        marquesina(cintas.appendChild(nodo('div', 'ew-cinta ew-c1')), uno, 1);
        if (dos.length >= 2) marquesina(cintas.appendChild(nodo('div', 'ew-cinta ew-c2')), dos, -1);
      }
      // El dato gigante y el sello: detrás de la foto, sobre la tarjeta del formulario o a la derecha del texto.
      var m = $('.hero-m', h);
      var e = $('.hero-e', h);
      var sf = $('.hero-sf', h);
      if (m && $('img', m)) {
        dato(h, m);
        sello(h, m);
      } else if (e) {
        dato(h, e);
        sello(h, $('.hero-form', e));
      } else if (sf) {
        dato(h, sf);
        if ($('.ew-dato', sf)) sello(h, sf);
      }
    }
    var g = $('.s-gracias .gr');
    if (g) dato(g, g);

    // La urgencia: una marquesina de tinta con su resaltado (o su antetítulo).
    var u = $('.s-urgencia');
    var tu = u && (texto($('.hl', u)) || texto($('.ey', u)));
    if (tu && !$('.ew-cinta-u', u)) marquesina(u.insertBefore(oculto(nodo('div', 'ew-cinta-u')), u.firstChild), [tu], -1);

    // Quién enseña: su nombre enorme en dos filas detrás de la foto (la primera palabra y el resto).
    var x = $('.s-experto');
    var n = x && texto($('.h2', x));
    if (n && !$('.ew-nombre', x)) {
      var pal = n.split(' ');
      var p = oculto(nodo('p', 'ew-nombre'));
      [pal[0], pal.slice(1, 3).join(' ')].forEach(function (f, i) {
        if (!f) return;
        var s = nodo('span', 'ew-n' + (i + 1), f);
        s.style.setProperty('--n', Math.max(4, f.length));
        p.appendChild(s);
      });
      x.insertBefore(p, x.firstChild);
    }
    // Logros que empiezan con una cifra (+4, US$2,3M, 3.000, 98%): la cifra aparte, grande, para que ruede.
    $$('.ex-l li>span').forEach(function (s) {
      if (s.children.length) return;
      var t = s.textContent;
      var c = /^\s*([+~]?\s?(?:US\$|\$|€|S\/\.?)?\s?\d[\d.,]*\s?(?:%|[MKk](?![a-záéíóúñ])|mil(?![a-záéíóúñ]))?\+?)\s+(\S[\s\S]*)$/i.exec(t);
      if (!c || c[1].length > 12) return;
      s.textContent = ' ' + c[2];
      s.insertBefore(nodo('b', 'ew-cifra', c[1].replace(/\s/g, '')), s.firstChild);
    });
    // El pie: la marca lo más grande que se pueda sin cortar su palabra más larga y sin que el pie pase de media pantalla
    // de alto (así el telón funciona). Las letras de Anton miden ~0,5 de su alto a lo ancho.
    var pm = $('.pie-m>span');
    var tm = texto(pm);
    if (tm) {
      var larga = Math.max.apply(null, tm.split(' ').map(function (w) { return w.length; }));
      var medir = function () {
        var t = Math.min(330, (pm.parentNode.clientWidth || innerWidth) / (0.52 * larga));
        for (var i = 0; i < 8; i++) {
          pm.style.setProperty('--tam', Math.round(t) + 'px');
          if (pm.offsetHeight <= innerHeight * 0.45 || t < 56) break;
          t *= 0.86;
        }
      };
      medir();
      addEventListener('resize', medir);
    }
  };

  // ── Panel de LEDs ─────────────────────────────────────────────────────────────────────────────────────────────────
  // Una grilla de puntos: cada uno se enciende con un ruido que fluye (y con el scroll), una ola diagonal que lo cruza y
  // el puntero; detrás del texto (uZ: su caja en coordenadas del lienzo) se apagan. Colores: el primario y el papel.
  var FS =
    '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' +
    'uniform vec2 uR,uM;uniform float uT,uC,uS;uniform vec3 uP,uK;uniform vec4 uZ;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}' +
    'float fb(vec2 p){return n(p)*.5+n(p*2.1+5.2)*.3+n(p*4.3+1.7)*.2;}' +
    'void main(){vec2 g=gl_FragCoord.xy/uC,c=floor(g),l=fract(g)-.5,u=(c+.5)*uC/uR;' +
    'float a=fb(c*.055+vec2(uT*.06,uS-uT*.04));' +
    'float v=fb(c*.04+vec2(a*1.7,-a*1.3)+vec2(-uT*.02,uT*.016));' +
    'float i=smoothstep(.5,.7,v);' +
    'float o=pow(max(0.,sin((c.x*.7+c.y*.45)*.075-uT*1.15)),22.);' +
    'i=max(i,o*.9*step(.5,h(c+floor(uT*3.))));' +
    'vec2 m=(c+.5)*uC-uM;i+=exp(-dot(m,m)/(uC*uC*70.))*.85;' +
    'vec2 z=smoothstep(uZ.xy-.08,uZ.xy+.03,u)*(1.-smoothstep(uZ.zw-.03,uZ.zw+.08,u));' +
    'i=clamp(i*(1.-.8*z.x*z.y),0.,1.);' +
    'float r=mix(.1,.44,i),k=1.-smoothstep(r-.08,r+.03,length(l)),al=k*mix(.12,1.,i);' +
    'vec3 col=mix(uP*.5,uP,i);col=mix(col,uK,smoothstep(.84,1.,i)*.75);' +
    'gl_FragColor=vec4(col*al,al);}';
  var NOMBRES = ['uR', 'uM', 'uT', 'uC', 'uS', 'uP', 'uK', 'uZ'];

  function rgb(s) {
    s = String(s || '').trim().replace('#', '');
    if (s.length === 3) s = s.replace(/(.)/g, '$1$1');
    var v = parseInt(s, 16);
    if (isNaN(v)) v = 0x3ddc84;
    return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
  }

  function panel(api, ancla) {
    var sec = ancla.closest('section');
    if (!sec || $('.ew-lienzo', sec)) return;
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
    // Dónde va el texto (los LEDs se apagan detrás): la unión de sus cajas.
    var zonas = $$('.hero-t,.hero-x,.hero-c,.hero-v,.gr,.fo-d>div:first-child,.fo-t>.cab,.cta-in', sec);
    var fps = movil ? 24 : 30;
    var minimo = 1000 / fps;
    var q = 1, s = 1, w = 0, alto = 0, mx = -9e3, my = -9e3, vis = 0, raf = 0, t0 = performance.now() - Math.random() * 4e4, ultimo = 0, lentos = 0, listo = 0, muerto = 0;
    var medir = function () {
      var r = cv.getBoundingClientRect();
      if (!r.width || muerto) return;
      // Celular: menos resolución (los puntos miden igual en pantalla); escritorio hasta 1,5× la densidad.
      s = (movil ? 0.75 : Math.min(W.devicePixelRatio || 1, 1.5)) * q;
      w = Math.max(1, Math.round(r.width * s));
      alto = Math.max(1, Math.round(r.height * s));
      cv.width = w;
      cv.height = alto;
      gl.viewport(0, 0, w, alto);
      gl.uniform2f(U.uR, w, alto);
      gl.uniform1f(U.uC, (movil ? 11 : 13) * s);
      var z = null;
      zonas.forEach(function (x) {
        var b = x.getBoundingClientRect();
        if (!b.width || !b.height) return;
        z = z ? { left: Math.min(z.left, b.left), top: Math.min(z.top, b.top), right: Math.max(z.right, b.right), bottom: Math.max(z.bottom, b.bottom) } : b;
      });
      gl.uniform4f(U.uZ, !z || movil ? -1 : (z.left - r.left) / r.width, z ? (r.bottom - z.bottom) / r.height : 2, !z || movil ? 2 : (z.right - r.left) / r.width, z ? (r.bottom - z.top) / r.height : 2);
    };
    var dibujar = function (ahora) {
      gl.uniform1f(U.uT, (ahora - t0) / 1000);
      gl.uniform1f(U.uS, scrollY * 0.002);
      gl.uniform2f(U.uM, mx * s, alto - my * s);
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
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var al = gl.getAttribLocation(pr, 'a');
      gl.enableVertexAttribArray(al);
      gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
      gl.uniform3fv(U.uP, rgb(api.color('--pri', sec)));
      gl.uniform3fv(U.uK, rgb(api.color('--papel', sec)));
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
    // La portada (o gracias) arranca ya; el cierre, cuando está por verse. Hasta dos paneles por página.
    api.anclas().filter(function (a) { return a.getAttribute('data-forma') === 'led'; }).slice(0, 2).forEach(function (a, i) {
      if (!i) return panel(api, a);
      var hecho = 0;
      var io = api.observar(a.closest('section') || a, function (si) {
        if (!si || hecho) return;
        hecho = 1;
        io.disconnect();
        panel(api, a);
      }, '700px 0px');
    });
  };
})();
