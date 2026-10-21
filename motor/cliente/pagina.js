// JS de la página publicada (~4 KB minificado). Se compacta (esbuild) en motor/cliente.generado.js.
// Lee su configuración de window.__EW: { modo, pagina, gracias, lead, visita, tipoPagina }.
(function () {
  var C = window.__EW || {};
  var publicado = C.modo === 'publicado';
  var UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'gclid', 'ttclid', 'sck', 'src', 'xcod'];

  function leer(k) {
    try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; }
  }
  function guardar(k, v) {
    try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function galleta(n) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
    if (!m) return '';
    // Una cookie mal codificada (ej. un % suelto) no puede tumbar el resto del JS de la página.
    try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
  }
  function fbq() {
    if (publicado && window.fbq) try { window.fbq.apply(null, arguments); } catch (e) {}
  }
  function idEvento() {
    return 'ew' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // UTMs de la visita (se quedan las primeras de la sesión) y fbclid → _fbc.
  var params = new URLSearchParams(location.search);
  var utm = leer('ew_utm') || {};
  UTM.forEach(function (k) {
    var v = params.get(k);
    if (v && !utm[k]) utm[k] = v.slice(0, 200);
  });
  guardar('ew_utm', utm);
  // Páginas de gracias de antes: el nombre venía en ?n=. Se saca de la barra de direcciones y del historial.
  if (publicado && params.has('n')) {
    var nombreViejo = params.get('n');
    if (!leer('ew_nombre')) guardar('ew_nombre', (nombreViejo || '').trim().split(/\s+/)[0].slice(0, 30));
    try {
      params.delete('n');
      var q = params.toString();
      history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash);
    } catch (e) {}
  }
  // Solo un fbclid con la forma de Meta (letras, números, _ y -): un ';' o un '%' en el link no puede agregar atributos
  // a la cookie (ej. domain=) ni dejarla mal codificada.
  if (publicado && /^[\w-]{10,500}$/.test(utm.fbclid || '') && !galleta('_fbc')) {
    document.cookie = '_fbc=fb.1.' + Date.now() + '.' + utm.fbclid + ';path=/;max-age=7776000;SameSite=Lax';
  }

  function conUtm(url) {
    try {
      var u = new URL(url, location.href);
      Object.keys(utm).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, utm[k]);
      });
      // Hotmart: el rastreo viaja en sck. Si no vino, se arma con la fuente y la campaña.
      if (/hotmart|pay\.hotmart|go\.hotmart/.test(u.hostname) && !u.searchParams.has('sck') && (utm.utm_source || utm.utm_campaign)) {
        u.searchParams.set('sck', [utm.utm_source, utm.utm_campaign, utm.utm_content].filter(Boolean).join('|').slice(0, 200));
      }
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function modal() {
    return document.getElementById('ew-modal');
  }
  // Safari anterior a 15.4 no tiene <dialog>: se abre con el atributo open y queda fijo en pantalla (CSS .modal-fijo).
  function abrirModal(m) {
    if (typeof m.showModal === 'function') m.showModal();
    else { m.setAttribute('open', ''); m.classList.add('modal-fijo'); }
  }
  function cerrarModal(m) {
    if (typeof m.close === 'function') m.close();
    else m.removeAttribute('open');
  }

  function iniciar(raiz) {
    raiz = raiz || document;

    // Cuenta regresiva. Si el evento ya empezó, en la página publicada la sección se esconde (no queda en ceros).
    raiz.querySelectorAll('[data-contador]').forEach(function (el) {
      var fin = +el.getAttribute('data-contador');
      function tic() {
        var r = Math.max(0, fin - Date.now());
        if (r <= 0 && publicado) {
          var sec = el.closest('section') || el;
          sec.hidden = true;
          sec.style.display = 'none';
          return;
        }
        var d = Math.floor(r / 864e5), h = Math.floor((r % 864e5) / 36e5), m = Math.floor((r % 36e5) / 6e4), s = Math.floor((r % 6e4) / 1e3);
        [['d', d], ['h', h], ['m', m], ['s', s]].forEach(function (p) {
          var n = el.querySelector('[data-' + p[0] + ']');
          if (n) n.textContent = String(p[1]).padStart(2, '0');
        });
        if (r > 0 && el.isConnected) setTimeout(tic, 1000);
      }
      tic();
    });

    // "En tu hora" si el visitante está en otra zona.
    raiz.querySelectorAll('[data-hora-local]').forEach(function (el) {
      try {
        var mia = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var zona = el.getAttribute('data-zona');
        var ms = +el.getAttribute('data-hora-local');
        if (!mia || mia === zona || !ms) return;
        var f = new Intl.DateTimeFormat('es', { weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(ms);
        var f0 = new Intl.DateTimeFormat('es', { weekday: 'short', hour: 'numeric', minute: '2-digit', timeZone: zona }).format(ms);
        if (f !== f0) el.textContent = 'En tu hora: ' + f;
      } catch (e) {}
    });

    // Botón que aparece a los N segundos (VSL). Quien ya lo vio, lo ve de una.
    raiz.querySelectorAll('[data-retraso]').forEach(function (el) {
      if (!publicado) { el.classList.add('ok'); return; }
      var clave = 'ew_ret_' + (C.pagina || location.pathname);
      var visto = false;
      try { visto = localStorage.getItem(clave) === '1'; } catch (e) {}
      if (visto) { el.classList.add('ok'); return; }
      setTimeout(function () {
        el.classList.add('ok');
        try { localStorage.setItem(clave, '1'); } catch (e) {}
      }, (+el.getAttribute('data-retraso') || 0) * 1000);
    });

    // Nombre en la página de gracias ("¡Listo, Ana!"): llega por sessionStorage, nunca en la URL (el píxel manda la URL
    // a Meta y queda en el historial).
    var n = String(leer('ew_nombre') || params.get('n') || '').trim().split(/\s+/)[0];
    raiz.querySelectorAll('[data-nombre]').forEach(function (el) {
      el.textContent = n ? ', ' + n.charAt(0).toUpperCase() + n.slice(1, 30) : '';
    });
  }

  // Video de YouTube: el reproductor carga al tocar.
  document.addEventListener('click', function (e) {
    var yt = e.target.closest && e.target.closest('[data-yt]');
    if (yt && !document.body.hasAttribute('data-ew-edicion')) {
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + yt.getAttribute('data-yt') + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      yt.replaceWith(f);
      return;
    }
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.hasAttribute('data-abrir-form') && modal()) {
      e.preventDefault();
      if (document.body.hasAttribute('data-ew-edicion')) return;
      abrirModal(modal());
      var primero = modal().querySelector('input');
      if (primero) setTimeout(function () { primero.focus(); }, 40);
      fbq('trackCustom', 'AbrioFormulario');
      return;
    }
    if (!publicado) {
      // En la vista previa ningún link navega (la vista vive en un iframe aislado).
      if (a.getAttribute('href') && a.getAttribute('href').charAt(0) !== '#') e.preventDefault();
      return;
    }
    if (a.hasAttribute('data-checkout')) {
      a.href = conUtm(a.href);
      fbq('track', 'InitiateCheckout');
    } else if (a.hasAttribute('data-whatsapp')) {
      fbq('track', 'Contact');
    } else if (a.hasAttribute('data-agenda')) {
      fbq('track', 'Schedule');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cerrar]') && modal()) cerrarModal(modal());
  });
  document.addEventListener('click', function (e) {
    var m = modal();
    if (m && e.target === m) cerrarModal(m);
  });

  // Formularios.
  var CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    var msg = form.querySelector('.form-msg');
    function decir(t, err) {
      if (!msg) return;
      msg.hidden = false;
      msg.textContent = t;
      msg.classList.toggle('err', !!err);
    }
    var datos = {};
    var malo = null;
    form.querySelectorAll('input').forEach(function (i) {
      var v = (i.value || '').trim();
      var invalido = (i.required && !v) || (i.type === 'email' && v && !CORREO.test(v)) || (i.type === 'tel' && v && v.replace(/\D/g, '').length < 7);
      i.setAttribute('aria-invalid', invalido ? 'true' : 'false');
      if (invalido && !malo) malo = i;
      datos[i.name] = v.slice(0, 200);
    });
    if (malo) {
      decir(malo.type === 'email' ? 'Revisa tu correo.' : malo.type === 'tel' ? 'Revisa tu número (con código de país).' : 'Completa los campos marcados.', true);
      malo.focus();
      return;
    }
    if (!publicado) {
      decir('Vista previa: aquí se registraría a ' + (datos.nombre || 'la persona') + ' y pasaría a la página de gracias.');
      return;
    }
    var boton = form.querySelector('button[type=submit]');
    if (boton) boton.disabled = true;
    decir('Enviando…');
    // Un id por formulario: si el envío falla y la persona reintenta, es el mismo registro (el servidor no lo duplica).
    var evento = form._ewEvento || (form._ewEvento = idEvento());
    fetch(C.lead, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pagina: C.pagina, datos: datos, utm: utm, event_id: evento, url: location.href, fbp: galleta('_fbp'), fbc: galleta('_fbc'), ref: document.referrer }),
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (cuerpo) {
          if (!r.ok) {
            // El servidor dice qué pasó ("Revisa tus datos…", "Demasiados intentos…"): eso es lo que ve la persona.
            var err = new Error(String(r.status));
            err.mensaje = cuerpo && typeof cuerpo.error === 'string' ? cuerpo.error.slice(0, 200) : '';
            throw err;
          }
          fbq('track', 'Lead', {}, { eventID: evento });
          form._ewEvento = null;
          // Solo el primer nombre, y fuera de la URL.
          guardar('ew_nombre', (datos.nombre || '').split(/\s+/)[0].slice(0, 30));
          setTimeout(function () { location.href = C.gracias; }, 250);
        });
      })
      .catch(function (err) {
        if (boton) boton.disabled = false;
        decir((err && err.mensaje) || 'No se pudo enviar. Revisa tu conexión e inténtalo otra vez.', true);
      });
  });

  // Visita (una por sesión y página).
  if (publicado && navigator.sendBeacon) {
    var clave = 'ew_v_' + C.pagina + '_' + C.tipoPagina;
    if (!leer(clave)) {
      guardar(clave, 1);
      try {
        navigator.sendBeacon(C.visita, JSON.stringify({ pagina: C.pagina, tipo: C.tipoPagina, utm: utm, ref: document.referrer }));
      } catch (e) {}
    }
  }

  window.__ew = { iniciar: iniciar };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { iniciar(); });
  else iniciar();
})();
