// JS de movimiento de las plantillas modernas (motor/plantillas/), el mismo para todas. Se compacta (esbuild)
// en JS_MOVIMIENTO. render.js lo pone solo con una plantilla moderna y solo en modo publicado o vista (nunca en edición
// ni en las miniaturas). Lee window.__EW.mv: la ficha `movimiento` de la plantilla:
//   revelar   selector: lo que aparece al entrar en pantalla (solo lo que al cargar está más abajo de la primera pantalla)
//   pila      selector de listas cuyas tarjetas se apilan al bajar (--tapa en cada tarjeta: cuánto la tapa la siguiente, de 0 a 1)
//   ruedas    selector de cifras cuyos dígitos ruedan al entrar
//   reloj     selector de los números de la cuenta regresiva (los escribe el JS de la página; aquí ruedan)
//   progreso  selector de lo que necesita el avance del scroll (--p de 0 a 1)
//   carrusel  selector de listas que pasan a carrusel con flechas y contador
//   telon     true: el pie queda fijo detrás (CSS); aquí se muestra al acercarse (ew-telon) o se apaga (ew-sin-telon)
//   barra     true: botón fijo abajo en el celular cuando la portada ya no se ve
//   anclas    [{ en, cual: 'primero' | 'ultimo', forma }]: dónde va el objeto de la escena (y su respaldo en CSS)
//   escena    id de la escena: la arranca después de la primera pintura y en tiempo libre (window.__ewEscena(api))
//   (VOLTAJE) decorado   si la escena registra window.__ewDecorado(api), arma sus piezas quietas en cuanto corre esto
//             palabras   selector de títulos que entran palabra por palabra (nunca desde invisibles)
//             (las palabras que se encienden con el scroll son la clave `encender` de PENUMBRA, más abajo)
//             marquesinas selector de marquesinas (su primer hijo: la pista con el contenido dos veces) que siguen el scroll
//             cursor     [[selector, etiqueta], …]: cursor con etiqueta encima de esos elementos (escritorio con mouse)
//             magnetico  selector de botones que siguen un poco al puntero · puntero: selector que recibe --px y --py
// Reglas: todo lo que esconde o mueve depende de la clase .ew-mv que se pone aquí (sin JS, nada escondido); cada pieza
// corre aparte (si una falla, las demás siguen) y ante cualquier error lo que estaba por aparecer se muestra.
(function () {
  var C = window.__EW || {};
  var M = C.mv;
  var W = window;
  var d = document;
  var de = d.documentElement;
  if (!M || !('IntersectionObserver' in W) || !W.matchMedia) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cn = navigator.connection || {};
  var AHORRO = !!cn.saveData || /(^|-)2g/.test(cn.effectiveType || '');
  var MOVIL = matchMedia('(max-width: 760px), (pointer: coarse)').matches;

  function todos(s, c) {
    if (!s) return [];
    try {
      return [].slice.call((c || d).querySelectorAll(s));
    } catch (e) {
      return [];
    }
  }
  function cl(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  function seguro(f) {
    try {
      f();
    } catch (e) {
      mostrarTodo();
    }
  }
  function mostrarTodo() {
    todos('.ew-rv').forEach(function (el) { el.classList.add('ew-visto'); });
    de.classList.add('ew-telon');
  }
  function observar(el, f, margen) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { f(e.isIntersecting, e); }); }, { rootMargin: margen || '0px' });
    io.observe(el);
    return io;
  }

  de.classList.add('ew-mv');
  // Un error en cualquier JS de la página (también ajeno): lo que estaba por aparecer se muestra ya.
  W.addEventListener('error', mostrarTodo);

  // Núcleo de scroll: un cuadro por vez y solo para lo que está cerca de la pantalla.
  var mods = [];
  var pend = 0;
  function cuadro() {
    pend = 0;
    var vh = innerHeight;
    mods.forEach(function (m) { if (m.on) seguro(function () { m.f(vh); }); });
  }
  function pedir() {
    if (!pend) {
      pend = 1;
      requestAnimationFrame(cuadro);
    }
  }
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  function modulo(el, f) {
    var m = { on: 0, f: f };
    mods.push(m);
    observar(el, function (si) {
      m.on = si;
      if (si) pedir();
    }, '160px 0px');
  }

  // ── VOLTAJE: decorado y palabras ────────────────────────────────────────────────────────────────────────────────────
  // Decorado de la plantilla: piezas quietas que arma su escena-<id>.js (window.__ewDecorado) en cuanto corre esto, antes
  // de que se pinte (marquesinas, el dato gigante, el sello, el nombre enorme). También con movimiento reducido y ahorro
  // de datos; nunca en edición. Todo aria-hidden y fuera del flujo (no mueve nada de lugar).
  seguro(function () {
    if (typeof W.__ewDecorado === 'function') W.__ewDecorado({ movil: MOVIL, rm: RM });
  });

  // Parte un título en palabras (<span class=clase style=--i>), sin tocar lo que ya es una etiqueta (el resaltado, el
  // nombre de gracias). Las palabras quedan en línea (no inline-block): el título sigue siendo un solo bloque de texto
  // para el LCP. Devuelve cuántas palabras hay.
  function partir(el, clase) {
    var n = 0;
    (function ir(nodo) {
      [].slice.call(nodo.childNodes).forEach(function (x) {
        if (x.nodeType !== 3 || !x.textContent.trim()) return;
        var f = d.createDocumentFragment();
        x.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (!p.trim()) return f.appendChild(d.createTextNode(p));
          var s = d.createElement('span');
          s.className = clase;
          s.style.setProperty('--i', n++);
          s.textContent = p;
          f.appendChild(s);
        });
        nodo.replaceChild(f, x);
      });
    })(el);
    el.style.setProperty('--n', n);
    return n;
  }
  // Los títulos de la primera pantalla entran palabra por palabra, solo si la página todavía no se pintó (con la red
  // lenta puede haberse pintado ya: entonces quedan como están, sin parpadeo).
  seguro(function () {
    if (!M.palabras || RM) return;
    var pintada = W.performance && performance.getEntriesByType && performance.getEntriesByType('paint').length;
    if (pintada) return;
    todos(M.palabras).forEach(function (el) { partir(el, 'ew-pal'); });
  });

  // Marquesinas que siguen la dirección y la fuerza del scroll: un solo cuadro por vez para todas, solo las que se ven y
  // con la pestaña a la vista. La pista trae el contenido dos veces (corre media pista y vuelve sin salto).
  seguro(function () {
    if (!M.marquesinas || RM) return;
    var activas = [];
    var vel = 0;
    var sent = 1;
    var y0 = scrollY;
    var t0 = 0;
    var raf = 0;
    addEventListener('scroll', function () {
      var dy = scrollY - y0;
      y0 = scrollY;
      if (dy) {
        sent = dy > 0 ? 1 : -1;
        vel = Math.min(1800, vel + Math.abs(dy) * 1.6);
      }
    }, { passive: true });
    function paso(t) {
      raf = 0;
      if (!activas.length || d.hidden) return;
      var dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 0.016;
      t0 = t;
      vel *= Math.exp(-dt * 3.2);
      activas.forEach(function (m) {
        m.x = (m.x - m.dir * sent * (52 + vel * 0.42) * dt) % m.w;
        if (m.x > 0) m.x -= m.w;
        m.p.style.transform = 'translate3d(' + m.x.toFixed(1) + 'px,0,0)';
      });
      raf = requestAnimationFrame(paso);
    }
    function ir() {
      if (!raf && activas.length && !d.hidden) {
        t0 = 0;
        raf = requestAnimationFrame(paso);
      }
    }
    d.addEventListener('visibilitychange', ir);
    todos(M.marquesinas).forEach(function (el) {
      var p = el.firstElementChild;
      if (!p) return;
      var m = { p: p, x: 0, w: 1, dir: +el.getAttribute('data-dir') || 1 };
      var medir = function () { m.w = p.scrollWidth / 2 || 1; };
      medir();
      addEventListener('resize', medir);
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(medir);
      observar(el, function (si) {
        var i = activas.indexOf(m);
        if (si && i < 0) activas.push(m);
        if (!si && i >= 0) activas.splice(i, 1);
        ir();
      }, '40px 0px');
    });
  });

  // Cursor con etiqueta, botones magnéticos y capas que siguen al puntero: solo en escritorio con mouse.
  seguro(function () {
    if (RM || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var c = null;
    var s = null;
    var x = -99, y = -99, tx = -99, ty = -99, lab = null, rafC = 0;
    var mover = function () {
      rafC = 0;
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      c.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) rafC = requestAnimationFrame(mover);
    };
    if (M.cursor && M.cursor.length) {
      c = d.createElement('div');
      c.className = 'ew-cursor ew-fuera';
      c.setAttribute('aria-hidden', 'true');
      s = d.createElement('span');
      c.appendChild(s);
      d.body.appendChild(c);
      de.addEventListener('mouseleave', function () { c.classList.add('ew-fuera'); });
    }
    var iman = null;
    var capas = todos(M.puntero);
    var rafP = 0, px = 0, py = 0;
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = e.target && e.target.closest ? e.target : null;
      if (c) {
        tx = e.clientX;
        ty = e.clientY;
        c.classList.remove('ew-fuera');
        var l = '';
        if (t) for (var i = 0; i < M.cursor.length; i++) if (t.closest(M.cursor[i][0])) { l = M.cursor[i][1]; break; }
        if (l !== lab) {
          lab = l;
          s.textContent = l;
          c.classList.toggle('ew-lab', !!l);
        }
        if (!rafC) rafC = requestAnimationFrame(mover);
      }
      if (M.magnetico) {
        var b = t && t.closest(M.magnetico);
        if (iman && iman !== b) {
          iman.style.setProperty('--mx', '0px');
          iman.style.setProperty('--my', '0px');
        }
        iman = b;
        if (b) {
          var r = b.getBoundingClientRect();
          b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.14).toFixed(1) + 'px');
          b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
        }
      }
      if (capas.length) {
        px = (e.clientX / innerWidth) * 2 - 1;
        py = (e.clientY / innerHeight) * 2 - 1;
        if (!rafP) rafP = requestAnimationFrame(function () {
          rafP = 0;
          capas.forEach(function (el) {
            el.style.setProperty('--px', px.toFixed(3));
            el.style.setProperty('--py', py.toFixed(3));
          });
        });
      }
    }, { passive: true });
  });

  // Aparecer al entrar.
  seguro(function () {
    if (!M.revelar || RM) return;
    var vh = innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('ew-visto');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    var hermanos = typeof Map === 'function' ? new Map() : null;
    todos(M.revelar).forEach(function (el) {
      if (el.closest('.ew-rv') || el.getBoundingClientRect().top < vh * 0.92 || !el.offsetParent) return;
      var n = hermanos ? hermanos.get(el.parentNode) || 0 : 0;
      if (hermanos) hermanos.set(el.parentNode, n + 1);
      el.style.setProperty('--d', Math.min(n, 4));
      el.classList.add('ew-rv');
      io.observe(el);
    });
  });

  // Tarjetas que se apilan.
  seguro(function () {
    if (!M.pila || RM) return;
    todos(M.pila).forEach(function (lista) {
      var cs = [].slice.call(lista.children);
      if (cs.length < 2) return;
      modulo(lista, function () {
        for (var i = 0; i < cs.length - 1; i++) {
          var a = cs[i].getBoundingClientRect();
          var b = cs[i + 1].getBoundingClientRect();
          cs[i].style.setProperty('--tapa', cl((a.bottom - b.top) / Math.max(1, a.height - 16), 0, 1).toFixed(3));
        }
      });
    });
  });

  // Avance del scroll (--p).
  seguro(function () {
    if (!M.progreso || RM) return;
    todos(M.progreso).forEach(function (el) {
      modulo(el, function (vh) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--p', cl((vh - r.top) / (vh + r.height), 0, 1).toFixed(3));
      });
    });
  });

  // Dígitos que ruedan. El texto real queda para los lectores de pantalla (y sin JS es lo único que hay).
  function odometro(texto) {
    var caja = d.createElement('span');
    caja.className = 'ew-odo';
    caja.setAttribute('aria-hidden', 'true');
    var tiras = [];
    var k = 0;
    String(texto).split('').forEach(function (ch) {
      if (/\d/.test(ch)) {
        var dg = d.createElement('span');
        dg.className = 'ew-dg';
        var t = d.createElement('span');
        t.className = 'ew-tira';
        t.style.setProperty('--k', k++);
        for (var i = 0; i < 10; i++) {
          var b = d.createElement('b');
          b.textContent = i;
          t.appendChild(b);
        }
        dg.appendChild(t);
        caja.appendChild(dg);
        tiras.push(t);
      } else {
        var s = d.createElement('span');
        s.textContent = ch;
        caja.appendChild(s);
      }
    });
    return {
      el: caja,
      forma: String(texto).replace(/\d/g, '0'),
      poner: function (v) {
        var ds = String(v).replace(/\D/g, '');
        tiras.forEach(function (t, i) { t.style.setProperty('--v', ds.charAt(i) || 0); });
      },
    };
  }
  seguro(function () {
    if (!M.ruedas || RM) return;
    todos(M.ruedas).forEach(function (el) {
      var texto = (el.textContent || '').trim();
      if (!/\d/.test(texto) || texto.length > 16 || el.children.length) return;
      var o = odometro(texto);
      var sr = d.createElement('span');
      sr.className = 'ew-sr';
      sr.textContent = texto;
      el.textContent = '';
      el.appendChild(sr);
      el.appendChild(o.el);
      var io = observar(el, function (si) {
        if (!si) return;
        io.disconnect();
        o.poner(texto);
      }, '0px 0px -10% 0px');
    });
  });
  seguro(function () {
    if (!M.reloj || RM || typeof MutationObserver !== 'function') return;
    todos(M.reloj).forEach(function (n) {
      var o = null;
      function pintar() {
        var v = (n.textContent || '').trim();
        if (!o || o.forma !== v.replace(/\d/g, '0')) {
          if (o) o.el.remove();
          o = odometro(v);
          n.parentNode.insertBefore(o.el, n.nextSibling);
        }
        o.poner(v);
      }
      pintar();
      n.classList.add('ew-sr');
      new MutationObserver(pintar).observe(n, { childList: true, characterData: true, subtree: true });
    });
  });

  // Carrusel: flechas, contador y arrastre con el mouse. Sin JS es una cuadrícula.
  seguro(function () {
    if (!M.carrusel) return;
    todos(M.carrusel).forEach(function (pista) {
      var items = [].slice.call(pista.children);
      if (items.length < 2) return;
      var n = items.length;
      var dos = function (x) { return String(x).padStart(2, '0'); };
      var caja = d.createElement('div');
      caja.className = 'ew-car';
      caja.innerHTML =
        '<button type="button" class="ew-car-b ew-prev" aria-label="Anterior"></button>' +
        '<button type="button" class="ew-car-b ew-next" aria-label="Siguiente"></button>' +
        '<p class="ew-car-n" aria-live="polite"><b>01</b> <span>/ ' + dos(n) + '</span></p>';
      pista.parentNode.insertBefore(caja, pista);
      if (!pista.hasAttribute('tabindex')) pista.setAttribute('tabindex', '0');
      var prev = caja.children[0];
      var next = caja.children[1];
      var num = caja.querySelector('b');
      var paso = function () { return items[1].offsetLeft - items[0].offsetLeft || pista.clientWidth; };
      var act = function () {
        var max = pista.scrollWidth - pista.clientWidth;
        var x = pista.scrollLeft;
        caja.hidden = max < 4;
        num.textContent = dos(cl(Math.round(x / paso()), 0, n - 1) + 1);
        prev.disabled = x < 4;
        next.disabled = x > max - 4;
      };
      var ir = function (dx) { pista.scrollBy({ left: dx * paso(), behavior: RM ? 'auto' : 'smooth' }); };
      prev.addEventListener('click', function () { ir(-1); });
      next.addEventListener('click', function () { ir(1); });
      pista.addEventListener('scroll', function () { requestAnimationFrame(act); }, { passive: true });
      addEventListener('resize', act);
      act();
      var x0 = null;
      var s0 = 0;
      pista.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button) return;
        x0 = e.clientX;
        s0 = pista.scrollLeft;
        pista.classList.add('ew-arrastre');
        pista.setPointerCapture(e.pointerId);
      });
      pista.addEventListener('pointermove', function (e) { if (x0 !== null) pista.scrollLeft = s0 - (e.clientX - x0); });
      var fin = function () {
        if (x0 === null) return;
        x0 = null;
        pista.classList.remove('ew-arrastre');
        var p = paso();
        pista.scrollTo({ left: Math.round(pista.scrollLeft / p) * p, behavior: RM ? 'auto' : 'smooth' });
      };
      pista.addEventListener('pointerup', fin);
      pista.addEventListener('pointercancel', fin);
    });
  });

  // Telón: el pie queda fijo detrás (CSS) y su contenido se muestra recién cuando falta poco para llegar (ew-telon): así
  // no se pinta detrás de la portada ni compite por el LCP. Va normal si no cabe en la pantalla, si la página es corta o
  // con movimiento reducido.
  seguro(function () {
    var pie = d.querySelector('.s-pie');
    if (!M.telon || !pie || RM) {
      de.classList.add('ew-sin-telon');
      return;
    }
    var medir = function () { de.classList.toggle('ew-sin-telon', pie.offsetHeight > innerHeight * 0.85 || de.scrollHeight < innerHeight * 2.2); };
    var revisar = function () {
      if (de.classList.contains('ew-telon')) return removeEventListener('scroll', revisar);
      if (de.scrollHeight - pie.offsetHeight - (scrollY + innerHeight) < innerHeight * 0.6) de.classList.add('ew-telon');
    };
    medir();
    revisar();
    addEventListener('resize', medir);
    addEventListener('scroll', revisar, { passive: true });
  });

  // ── PENUMBRA (claves fondo, encender y letras; las demás plantillas no las usan) ─────────────────────────────────
  //   fondo     true: la página tiene un fondo fijo (la aurora en CSS y la escena no se mueven al bajar). Con el telón,
  //             ese fondo termina donde termina la última sección antes del pie: mientras ese borde está cerca se pone
  //             en <html> --ew-fin (px desde arriba de la pantalla hasta el borde) y --ew-r (0-1: cuánto del pie ya se
  //             ve); el CSS recorta el fondo ahí y el pie se descubre debajo.
  //   encender  selector de títulos cuyas palabras se encienden de a una al bajar: cada palabra va en <span class="ew-w">
  //             con --j (su número) y el título lleva .ew-enc y --lp (cuántas van encendidas). El CSS solo las apaga con
  //             .ew-mv y sin .ew-telon (que pone también cualquier error): si algo falla, todas se ven.
  //   letras    selector de textos que se arman letra por letra (<span class="ew-l"> con --i, agrupadas por palabra); el
  //             texto real queda en .ew-sr para los lectores de pantalla y las letras van aria-hidden.
  // Ante un error en cualquier JS de la página el telón se apaga (.ew-sin-telon): el pie vuelve a su lugar, completo.
  seguro(function () {
    if (!M.fondo && !M.letras) return;
    var apagar = function () {
      de.classList.add('ew-sin-telon');
      de.style.removeProperty('--ew-fin');
      de.style.removeProperty('--ew-r');
    };
    W.addEventListener('error', apagar);
    var pie = d.querySelector('.s-pie');
    var ultima = pie && pie.previousElementSibling;
    while (ultima && (!ultima.classList.contains('sec') || !ultima.offsetHeight)) ultima = ultima.previousElementSibling;
    if (!M.fondo || RM || !ultima) return;
    modulo(ultima, function (vh) {
      try {
        var fin = ultima.getBoundingClientRect().bottom;
        de.style.setProperty('--ew-fin', Math.round(fin) + 'px');
        de.style.setProperty('--ew-r', cl((vh - fin) / Math.max(1, pie.offsetHeight), 0, 1).toFixed(3));
      } catch (e) {
        apagar();
      }
    });
  });
  seguro(function () {
    if (!M.encender || RM) return;
    todos(M.encender).forEach(function (t) {
      var n = 0;
      var textos = [];
      var w = d.createTreeWalker(t, 4);
      while (w.nextNode()) textos.push(w.currentNode);
      textos.forEach(function (x) {
        if (!x.nodeValue.trim()) return;
        var f = d.createDocumentFragment();
        x.nodeValue.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (!p.trim()) return f.appendChild(d.createTextNode(p));
          var s = d.createElement('span');
          s.className = 'ew-w';
          s.style.setProperty('--j', n++);
          s.textContent = p;
          f.appendChild(s);
        });
        x.parentNode.replaceChild(f, x);
      });
      if (n < 2) return;
      t.classList.add('ew-enc');
      modulo(t, function (vh) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--lp', (cl((vh * 0.86 - r.top) / (vh * 0.3 + r.height), 0, 1) * (n + 1.2)).toFixed(2));
      });
    });
  });
  seguro(function () {
    if (!M.letras || RM) return;
    todos(M.letras).forEach(function (el) {
      var texto = (el.textContent || '').trim();
      if (!texto || texto.length > 80 || el.children.length) return;
      var caja = d.createElement('span');
      caja.className = 'ew-letras';
      caja.setAttribute('aria-hidden', 'true');
      var i = 0;
      texto.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (!p.trim()) return caja.appendChild(d.createTextNode(' '));
        var pal = d.createElement('span');
        pal.className = 'ew-lp';
        Array.from(p).forEach(function (ch) {
          var l = d.createElement('span');
          l.className = 'ew-l';
          l.style.setProperty('--i', i++);
          l.textContent = ch;
          pal.appendChild(l);
        });
        caja.appendChild(pal);
      });
      var sr = d.createElement('span');
      sr.className = 'ew-sr';
      sr.textContent = texto;
      el.textContent = '';
      el.appendChild(sr);
      el.appendChild(caja);
    });
  });

  // Botón fijo en el celular: copia del primer botón de la portada. Se ve cuando la portada ya pasó y no hay a la vista
  // otro llamado (cierre, formulario, pie). Un botón retrasado (VSL) no se adelanta.
  seguro(function () {
    if (!M.barra) return;
    var portada = d.querySelector('.s-hero');
    var a = portada && portada.querySelector('a.btn');
    if (!a) return;
    var barra = d.createElement('div');
    barra.className = 'ew-barra';
    barra.setAttribute('aria-hidden', 'true');
    var b = a.cloneNode(true);
    b.removeAttribute('id');
    b.tabIndex = -1;
    barra.appendChild(b);
    d.body.appendChild(barra);
    var enPortada = true;
    var finales = 0;
    var pintar = function () {
      var on = !enPortada && !finales && !a.closest('[data-retraso]:not(.ok)');
      barra.classList.toggle('ew-on', on);
      barra.setAttribute('aria-hidden', on ? 'false' : 'true');
      b.tabIndex = on ? 0 : -1;
    };
    observar(portada, function (si, e) {
      enPortada = si || e.boundingClientRect.top > 0;
      pintar();
    });
    todos('.s-cta,.s-formulario,.s-pie').forEach(function (el) {
      var dentro = false;
      observar(el, function (si) {
        if (si !== dentro) finales += si ? 1 : -1;
        dentro = si;
        pintar();
      });
    });
  });

  // Anclas del objeto de la escena (y su respaldo en CSS, que se ve aunque no haya WebGL).
  seguro(function () {
    (M.anclas || []).forEach(function (x) {
      var lista = todos(x.en);
      if (!lista.length) return;
      var sec = x.cual === 'ultimo' ? lista[lista.length - 1] : lista[0];
      if (sec.querySelector('.ew-ancla')) return;
      var i = d.createElement('i');
      i.className = 'ew-ancla ew-ancla-' + x.forma;
      i.setAttribute('aria-hidden', 'true');
      i.setAttribute('data-forma', x.forma);
      sec.insertBefore(i, sec.firstChild);
    });
  });

  // Escena WebGL: después de la primera pintura y en tiempo libre; nunca con movimiento reducido, ahorro de datos o 2G.
  seguro(function () {
    if (!M.escena || RM || AHORRO || typeof W.__ewEscena !== 'function') return;
    var api = {
      movil: MOVIL,
      // Un color del tema: el de la página o, con `el`, el de su sección (una sección con estilo propio tiene los suyos).
      color: function (nombre, el) { return getComputedStyle(el || de).getPropertyValue(nombre).trim(); },
      anclas: function () { return todos('.ew-ancla'); },
      observar: observar,
    };
    var ya = 0;
    var iniciar = function () {
      if (ya++) return;
      try {
        W.__ewEscena(api);
      } catch (e) {}
    };
    var libre = function () {
      if ('requestIdleCallback' in W) requestIdleCallback(iniciar, { timeout: 1800 });
      else setTimeout(iniciar, 300);
    };
    var trasPintura = function () { requestAnimationFrame(function () { setTimeout(libre, 250); }); };
    if (d.readyState === 'complete') trasPintura();
    else addEventListener('load', trasPintura, { once: true });
  });
})();
