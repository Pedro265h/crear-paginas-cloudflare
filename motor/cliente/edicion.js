// JS del modo edición: corre dentro de la vista previa del estudio (iframe aislado, sin acceso al estudio).
// Habla con el estudio solo por postMessage.
//   iframe → estudio: { ew:'listo' } · { ew:'seleccion', id } · { ew:'editando', id, ruta } · { ew:'texto', id, ruta, valor }
//                     { ew:'imagen', id, ruta }
//                     { ew:'video', id, ruta } · { ew:'scroll', y } · { ew:'sinCampo', id, ruta }
//   estudio → iframe: { ew:'seccion', id, html } · { ew:'orden', ids } · { ew:'quitar', id } · { ew:'insertar', despuesDe, html }
//                     { ew:'tema', css, estilo } · { ew:'seleccionar', id, ir, nombre, ruta } · { ew:'scrollA', y }
//                     { ew:'editar', id, ruta }
// La sección elegida lleva un marco y una etiqueta con su nombre ("Portada"); el texto o la foto elegida dentro de ella,
// su propio marco. { ew:'editar' } abre la edición en línea de un texto (lo que falta por completar, tocado en el estudio):
// si ese texto no está en la página (otra variante, una lista vacía), responde { ew:'sinCampo' }.
// Con window.__EW.scroll la página arranca en ese punto (al recargar la vista previa no vuelve un instante arriba).
(function () {
  var padre = window.parent;
  var C = window.__EW || {};
  document.body.setAttribute('data-ew-edicion', '');
  function decir(m) {
    m.ewOrigen = 'pagina';
    padre.postMessage(m, '*');
  }
  function partir(ruta) {
    var i = ruta.indexOf(':');
    return { id: ruta.slice(0, i), ruta: ruta.slice(i + 1) };
  }
  // Busca por atributo sin armar selectores con lo que llega (un id raro no rompe nada).
  function buscar(atributo, valor, raiz) {
    var lista = (raiz || document).querySelectorAll('[' + atributo + ']');
    for (var i = 0; i < lista.length; i++) if (lista[i].getAttribute(atributo) === valor) return lista[i];
    return null;
  }
  var seleccion = null;
  var nombreSel = '';
  var campoSel = '';
  function etiqueta(sec) {
    var vieja = document.getElementById('ew-etq');
    if (vieja) vieja.remove();
    if (!sec || !nombreSel) return;
    var e = document.createElement('div');
    e.id = 'ew-etq';
    e.setAttribute('aria-hidden', 'true');
    e.textContent = nombreSel;
    sec.appendChild(e);
  }
  function marcarCampo(sec) {
    document.querySelectorAll('.ew-campo').forEach(function (el) { el.classList.remove('ew-campo'); });
    if (!sec || !campoSel) return;
    var clave = seleccion + ':' + campoSel;
    var el = buscar('data-e', clave, sec) || buscar('data-img', clave, sec) || buscar('data-vid', clave, sec);
    if (el) el.classList.add('ew-campo');
  }
  function seleccionar(id, ir, nombre, ruta) {
    document.querySelectorAll('.ew-sel').forEach(function (el) { el.classList.remove('ew-sel'); });
    var el = id ? buscar('data-s', id) : null;
    seleccion = id;
    if (nombre !== undefined) nombreSel = nombre || '';
    campoSel = ruta || '';
    etiqueta(el);
    marcarCampo(el);
    if (!el) return;
    el.classList.add('ew-sel');
    if (ir) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // El texto de un elemento con sus marcas: los avisos "Por completar" y la pastilla {nombre} vuelven a su marca.
  function textoReal(el) {
    var copia = el.cloneNode(true);
    copia.querySelectorAll('[data-marca]').forEach(function (m) { m.replaceWith(document.createTextNode(m.getAttribute('data-marca'))); });
    // El énfasis (**negrita**, *resaltado*) vuelve a su marca con lo que tenga escrito ahora (vacío: se va).
    copia.querySelectorAll('[data-md]').forEach(function (m) {
      var t = m.textContent;
      var k = m.getAttribute('data-md');
      m.replaceWith(document.createTextNode(t.trim() ? k + t + k : t));
    });
    copia.style.textTransform = 'none';
    copia.style.position = 'absolute';
    copia.style.left = '-99999px';
    document.body.appendChild(copia);
    var t = copia.innerText;
    copia.remove();
    return t.replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  // Termina la edición en línea. Con `cancelar` (Escape) o si se tocó un "por completar" y se salió sin escribir, el
  // elemento vuelve a como estaba (con su aviso) y no se manda nada: la marca de lo que falta no se pierde.
  function terminarEdicion(el, cancelar) {
    if (!el.hasAttribute('contenteditable')) return;
    var antes = el._ew || { html: el.innerHTML, texto: null };
    el._ew = null;
    var valor = cancelar ? null : textoReal(el);
    el.removeAttribute('contenteditable');
    if (cancelar || (antes.texto === null && !valor)) {
      el.innerHTML = antes.html;
      return;
    }
    var p = partir(el.getAttribute('data-e'));
    if (antes.texto !== valor) decir({ ew: 'texto', id: p.id, ruta: p.ruta, valor: valor });
  }

  // Abre la edición en línea de un texto: el cursor al final y, si era un "por completar", vacío para escribir encima.
  function editar(ed) {
    if (ed.hasAttribute('contenteditable')) return;
    var vacio = ed.hasAttribute('data-pc');
    // Cómo estaba (para Escape o para devolver el aviso si no se escribe nada) y su texto real (texto: null = era un
    // "por completar"). Con contenteditable puesto el CSS quita text-transform: se guarda el texto real, no el que se ve
    // en mayúsculas.
    ed._ew = { html: ed.innerHTML, texto: vacio ? null : textoReal(ed) };
    if (vacio) ed.textContent = '';
    try { ed.setAttribute('contenteditable', 'plaintext-only'); } catch (x) { ed.setAttribute('contenteditable', 'true'); }
    if (!ed.isContentEditable) ed.setAttribute('contenteditable', 'true');
    var pe = partir(ed.getAttribute('data-e'));
    decir({ ew: 'editando', id: pe.id, ruta: pe.ruta });
    ed.focus();
    var r = document.createRange();
    r.selectNodeContents(ed);
    r.collapse(false);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target;
      if (!t.closest) return;
      var sec = t.closest('[data-s]');
      var img = t.closest('[data-img]');
      var vid = t.closest('[data-vid]');
      var ed = t.closest('[data-e]');
      if (t.closest('a,button,summary,label')) e.preventDefault();
      if (sec && sec.getAttribute('data-s') !== seleccion) {
        // La etiqueta con su nombre la manda el estudio enseguida ({ ew:'seleccionar' }).
        seleccionar(sec.getAttribute('data-s'), false, '');
        decir({ ew: 'seleccion', id: sec.getAttribute('data-s') });
      }
      if (img) {
        var pi = partir(img.getAttribute('data-img'));
        decir({ ew: 'imagen', id: pi.id, ruta: pi.ruta });
        return;
      }
      if (vid) {
        var pv = partir(vid.getAttribute('data-vid'));
        decir({ ew: 'video', id: pv.id, ruta: pv.ruta });
        return;
      }
      if (ed) editar(ed);
    },
    true,
  );

  document.addEventListener('focusout', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-e')) terminarEdicion(e.target);
  });
  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!el.hasAttribute || !el.hasAttribute('contenteditable')) return;
    if (e.key === 'Escape') {
      terminarEdicion(el, true);
      el.blur();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      el.blur();
    }
  });
  // Pegar solo texto.
  document.addEventListener('paste', function (e) {
    var el = e.target.closest && e.target.closest('[contenteditable]');
    if (!el) return;
    e.preventDefault();
    var txt = (e.clipboardData || window.clipboardData).getData('text');
    document.execCommand('insertText', false, txt);
  });

  var tScroll;
  window.addEventListener('scroll', function () {
    clearTimeout(tScroll);
    tScroll = setTimeout(function () { decir({ ew: 'scroll', y: window.scrollY }); }, 120);
  });

  // Sin la animación del scroll suave de la página (html{scroll-behavior:smooth}).
  function irA(y) {
    try { window.scrollTo({ top: y, behavior: 'instant' }); } catch (x) { window.scrollTo(0, y); }
  }

  function html(cadena) {
    var t = document.createElement('template');
    t.innerHTML = cadena;
    return t.content.firstElementChild;
  }

  window.addEventListener('message', function (e) {
    var m = e.data;
    if (!m || m.ewOrigen !== 'estudio') return;
    if (m.ew === 'seccion') {
      var vieja = buscar('data-s', m.id);
      var nueva = html(m.html);
      if (vieja && nueva) {
        vieja.replaceWith(nueva);
        if (window.__ew) window.__ew.iniciar(nueva);
        if (seleccion === m.id) {
          nueva.classList.add('ew-sel');
          etiqueta(nueva);
          marcarCampo(nueva);
        }
      }
    } else if (m.ew === 'insertar') {
      var nuevaS = html(m.html);
      var ref = m.despuesDe && buscar('data-s', m.despuesDe);
      if (!nuevaS) return;
      if (ref) ref.after(nuevaS);
      else {
        var primera = document.querySelector('[data-s]');
        if (primera) primera.before(nuevaS);
        else document.body.prepend(nuevaS);
      }
      if (window.__ew) window.__ew.iniciar(nuevaS);
    } else if (m.ew === 'quitar') {
      var q = buscar('data-s', m.id);
      if (q) q.remove();
    } else if (m.ew === 'orden') {
      var antes = document.getElementById('ew-modal') || document.querySelector('body > script');
      m.ids.forEach(function (id) {
        var el = buscar('data-s', id);
        if (el) document.body.insertBefore(el, antes);
      });
    } else if (m.ew === 'tema') {
      var st = document.getElementById('ew-tema');
      if (st) st.textContent = m.css;
      if (m.estilo) document.body.setAttribute('data-estilo', m.estilo);
    } else if (m.ew === 'seleccionar') {
      seleccionar(m.id, m.ir, m.nombre, m.ruta);
    } else if (m.ew === 'editar') {
      var s = buscar('data-s', m.id);
      var ed = s && buscar('data-e', m.id + ':' + m.ruta, s);
      if (!ed) {
        decir({ ew: 'sinCampo', id: m.id, ruta: m.ruta });
        return;
      }
      if (seleccion !== m.id) seleccionar(m.id);
      ed.scrollIntoView({ block: 'center' });
      editar(ed);
    } else if (m.ew === 'scrollA') {
      irA(m.y || 0);
    }
  });

  if (C.scroll > 0) irA(C.scroll);
  decir({ ew: 'listo' });
})();
