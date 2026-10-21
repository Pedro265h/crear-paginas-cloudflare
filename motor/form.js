// El formulario de registro. Lo usan la portada "evento", la sección formulario y la ventana que abren los botones.
import { esc, plano, sinMarcas } from './util.js';

export const CAMPOS = {
  nombre: { etiqueta: 'Nombre', tipo: 'text', auto: 'given-name', requerido: true, ph: 'Tu nombre' },
  correo: { etiqueta: 'Correo', tipo: 'email', auto: 'email', requerido: true, ph: 'tu@correo.com', modo: 'email' },
  whatsapp: { etiqueta: 'WhatsApp', tipo: 'tel', auto: 'tel', requerido: false, ph: '+57 300 000 0000', modo: 'tel' },
  telefono: { etiqueta: 'Teléfono', tipo: 'tel', auto: 'tel', requerido: false, ph: '+57 300 000 0000', modo: 'tel' },
  ciudad: { etiqueta: 'Ciudad', tipo: 'text', auto: 'address-level2', requerido: false, ph: 'Tu ciudad' },
  empresa: { etiqueta: 'Negocio o empresa', tipo: 'text', auto: 'organization', requerido: false, ph: 'Nombre de tu negocio' },
};

export const CAMPOS_FORMULARIO = Object.keys(CAMPOS);

// Datos con los que se puede contactar a la persona. El servidor exige al menos uno (correo, WhatsApp o teléfono).
export const CAMPOS_CONTACTO = ['correo', 'whatsapp', 'telefono'];

// Lista de campos con al menos un dato de contacto: si no hay ninguno se agrega el correo (después del nombre).
export function conContacto(campos) {
  if (campos.some((c) => CAMPOS_CONTACTO.includes(c))) return campos;
  const fuera = [...campos];
  fuera.splice(fuera[0] === 'nombre' ? 1 : 0, 0, 'correo');
  return fuera;
}

export function camposDe(plan) {
  const pedidos = Array.isArray(plan.conversion?.campos) ? plan.conversion.campos : ['nombre', 'correo', 'whatsapp'];
  const validos = [...new Set(pedidos.filter((c) => typeof c === 'string' && Object.hasOwn(CAMPOS, c)))];
  return conContacto(validos.length ? validos : ['nombre', 'correo']);
}

// ¿Este campo es obligatorio en este formulario? Sin correo, el primer teléfono (WhatsApp o teléfono) pasa a serlo:
// es el único dato con el que se puede contactar a la persona.
function requerido(nombre, campos) {
  if (CAMPOS[nombre].requerido) return true;
  return !campos.includes('correo') && campos.find((c) => c === 'whatsapp' || c === 'telefono') === nombre;
}

// o: { boton, nota, id, rutaBoton, enfoque }
export function formularioHTML(ctx, o = {}) {
  const lista = camposDe(ctx.plan);
  const campos = lista
    .map((nombre, i) => {
      const c = CAMPOS[nombre];
      const id = `${o.id || 'f'}-${nombre}`;
      const req = requerido(nombre, lista);
      return (
        `<label class="campo" for="${id}"><span>${esc(c.etiqueta)}${req ? '' : ' <small>(opcional)</small>'}</span>` +
        `<input id="${id}" name="${nombre}" type="${c.tipo}" autocomplete="${c.auto}" placeholder="${esc(c.ph)}"` +
        `${c.modo ? ` inputmode="${c.modo}"` : ''}${req ? ' required' : ''}${i === 0 && o.enfoque ? ' autofocus' : ''}></label>`
      );
    })
    .join('');
  // En publicado un texto hecho solo de marcas "[[POR COMPLETAR]]" queda vacío: va el de la página o el de fábrica.
  const util = (v) => (typeof v === 'string' && (ctx.modo === 'publicado' ? sinMarcas(v) : v.trim()) ? v : '');
  const etiqueta = util(o.boton) || util(ctx.plan.conversion?.boton) || 'Quiero mi cupo';
  const notaHTML = util(o.nota) ? plano(ctx, o.nota) : '';
  return (
    `<form class="form" data-form novalidate>${campos}` +
    // Trampa para robots: un campo que la gente no ve. Si llega lleno, el servidor descarta el registro.
    `<label class="hp" aria-hidden="true">No llenar<input name="sitio_web" tabindex="-1" autocomplete="off"></label>` +
    `<button class="btn btn-full" type="submit"><span${o.rutaBoton && ctx.modo === 'edicion' ? ` data-e="${esc(ctx.sid + ':' + o.rutaBoton)}"` : ''}>${plano(ctx, etiqueta)}</span><span class="btn-f" aria-hidden="true">→</span></button>` +
    (notaHTML ? `<p class="nota">${notaHTML}</p>` : '') +
    `<p class="form-msg" role="status" hidden></p>` +
    `<p class="form-priv">Tus datos están protegidos. <a href="/privacidad" data-legal>Política de privacidad</a>.</p>` +
    `</form>`
  );
}

export const CSS_FORM =
  '.form{display:grid;gap:14px;text-align:left}' +
  '.campo{display:grid;gap:6px;font-size:.88rem;font-weight:600;color:var(--texto)}' +
  '.campo small{font-weight:400;color:var(--tenue)}' +
  '.campo input{font:inherit;font-size:1rem;font-weight:400;color:var(--texto);background:var(--fondo);border:1px solid var(--linea);' +
  'border-radius:var(--r);padding:14px 16px;min-height:52px;width:100%;transition:border-color .15s,box-shadow .15s}' +
  '.campo input::placeholder{color:var(--tenue)}' +
  '.campo input:focus{outline:none;border-color:var(--pri);box-shadow:0 0 0 3px var(--pri-suave)}' +
  '.campo input[aria-invalid=true]{border-color:var(--error)}' +
  '.form .btn{margin-top:6px}' +
  '.form .nota{text-align:center;margin-top:2px}' +
  '.form-msg{margin:0;font-size:.9rem;padding:10px 12px;border-radius:var(--r);background:var(--sup2)}' +
  '.form-msg.err{color:var(--error)}' +
  '.form-priv{margin:0;font-size:.78rem;color:var(--tenue);text-align:center}' +
  '.form-priv a{color:inherit}.hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}';
