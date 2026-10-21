// Política de privacidad y términos de cada página publicada, con los datos de la marca y la ley de su país.
// Es una plantilla general (hay que avisarle a la persona que la revise con un abogado). Puro: sin DOM.
//
// renderLegal(plan, marca, 'privacidad' | 'terminos', { modo, rutaLetras, base }) → documento HTML completo
//   base: la ruta de la página dueña de estas legales ('' en la raíz, '/curso' en /curso): "Volver" lleva a ella y los
//   términos enlazan a SU privacidad (/curso/privacidad). Cada página publicada tiene las suyas.
// faltanDatosLegales(marca) → lista de lo que falta para publicar (razón social, documento, correo)
import { resolverTemaPagina, cssTemaPagina } from './plantillas/index.js';
import { esc } from './util.js';
import { camposDe } from './form.js';

const PAISES = {
  colombia: {
    ley: 'la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015)',
    autoridad: 'la Superintendencia de Industria y Comercio (SIC)',
    derechos: 'conocer, actualizar y rectificar tus datos; pedir prueba de la autorización que nos diste; ser informado del uso que les damos; presentar quejas ante la Superintendencia de Industria y Comercio; revocar la autorización o pedir que los suprimamos; y acceder a ellos gratis',
    documento: 'NIT o cédula',
  },
  mexico: {
    ley: 'la Ley Federal de Protección de Datos Personales en Posesión de los Particulares',
    autoridad: 'la autoridad de protección de datos competente',
    derechos: 'acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), y revocar tu consentimiento',
    documento: 'RFC',
  },
  espana: {
    ley: 'el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales',
    autoridad: 'la Agencia Española de Protección de Datos (AEPD)',
    derechos: 'acceder a tus datos, rectificarlos, suprimirlos, oponerte a su tratamiento, pedir su limitación y su portabilidad, y retirar tu consentimiento en cualquier momento',
    documento: 'NIF o CIF',
    base: 'La base legal es tu consentimiento, que das al enviar el formulario y puedes retirar cuando quieras.',
  },
  peru: {
    ley: 'la Ley 29733 de Protección de Datos Personales y su Reglamento',
    autoridad: 'la Autoridad Nacional de Protección de Datos Personales',
    derechos: 'acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento (derechos ARCO), y revocar tu consentimiento',
    documento: 'RUC',
  },
  chile: {
    ley: 'la Ley 19.628 sobre protección de la vida privada y sus modificaciones',
    autoridad: 'la autoridad de protección de datos competente',
    derechos: 'acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento, y revocar tu consentimiento',
    documento: 'RUT',
  },
  argentina: {
    ley: 'la Ley 25.326 de Protección de los Datos Personales',
    autoridad: 'la Agencia de Acceso a la Información Pública (AAIP)',
    derechos: 'acceder a tus datos de forma gratuita, rectificarlos, actualizarlos o suprimirlos',
    documento: 'CUIT',
  },
  ecuador: {
    ley: 'la Ley Orgánica de Protección de Datos Personales',
    autoridad: 'la Superintendencia de Protección de Datos Personales',
    derechos: 'acceder a tus datos, rectificarlos, eliminarlos, oponerte a su tratamiento, pedir su portabilidad y revocar tu consentimiento',
    documento: 'RUC',
  },
};

const GENERAL = {
  ley: 'la normativa de protección de datos personales que aplique',
  autoridad: 'la autoridad de protección de datos competente',
  derechos: 'acceder a tus datos, rectificarlos, pedir que los eliminemos u oponerte a su uso, y retirar tu consentimiento',
  documento: 'documento de identificación tributaria',
};

function paisDe(marca) {
  const p = String(marca?.pais || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const clave = Object.keys(PAISES).find((k) => p.includes(k));
  return { clave: clave || '', datos: PAISES[clave] || GENERAL };
}

const NOMBRES_CAMPO = { nombre: 'nombre', correo: 'correo electrónico', whatsapp: 'número de WhatsApp', telefono: 'teléfono', ciudad: 'ciudad', empresa: 'nombre de tu negocio' };

export function faltanDatosLegales(marca = {}) {
  const falta = [];
  if (!marca.legal?.razon_social?.trim()) falta.push('razón social o nombre del responsable');
  if (!marca.legal?.documento?.trim()) falta.push(`${paisDe(marca).datos.documento} del responsable`);
  if (!marca.contacto?.correo?.trim()) falta.push('correo de contacto');
  return falta;
}

function dato(v, falta, modo) {
  if (v && String(v).trim()) return esc(v);
  return modo === 'publicado' ? '' : `<span class="pc">Por completar: ${esc(falta)}</span>`;
}

function privacidad(plan, marca, modo) {
  const { datos: pais } = paisDe(marca);
  const responsable = dato(marca.legal?.razon_social || '', 'razón social o tu nombre', modo);
  const documento = dato(marca.legal?.documento || '', pais.documento, modo);
  const correo = dato(marca.contacto?.correo || '', 'correo de contacto', modo);
  const usaForm = plan.conversion?.accion === 'formulario';
  const campos = usaForm ? camposDe(plan).map((c) => NOMBRES_CAMPO[c] || c) : [];
  const pixel = !!plan.pixel?.meta;
  const pago = plan.conversion?.accion === 'checkout';
  const whatsapp = plan.conversion?.accion === 'whatsapp';
  const marcaNombre = esc(marca.nombre || plan.marca?.nombre || 'esta marca');
  return `
<h1>Política de privacidad</h1>
<p class="lg-act">Última actualización: ${new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<p>En ${marcaNombre} cuidamos tus datos personales. Aquí te contamos qué datos recogemos en esta página, para qué los usamos y cómo puedes ejercer tus derechos, de acuerdo con ${pais.ley}.</p>
<h2>Quién es el responsable</h2>
<p>${responsable}${documento ? ` · ${esc(pais.documento)}: ${documento}` : ''}${correo ? ` · Contacto: ${correo}` : ''}.</p>
<h2>Qué datos recogemos</h2>
<ul>
${campos.length ? `<li>Los que escribes en el formulario: ${campos.join(', ')}.</li>` : ''}
${whatsapp ? '<li>Los que nos compartes al escribirnos por WhatsApp (tu número y lo que nos cuentes).</li>' : ''}
${pago ? '<li>Si compras, el pago lo procesa una plataforma externa (por ejemplo Hotmart, Mercado Pago o Stripe) con su propia política de privacidad. Nosotros no vemos ni guardamos los datos de tu tarjeta.</li>' : ''}
<li>Datos de navegación: la página de la que vienes, los parámetros de la campaña (UTM) y datos técnicos básicos de tu visita.</li>
${pixel ? '<li>Cookies y tecnologías de medición de Meta (Facebook e Instagram) para medir nuestros anuncios y mostrarte información relevante.</li>' : ''}
</ul>
<h2>Para qué los usamos</h2>
<ul>
${usaForm ? '<li>Para darte lo que pediste al registrarte (acceso, recordatorios e información del evento o del producto) por correo o WhatsApp.</li>' : '<li>Para responder tus mensajes y atender lo que nos pidas.</li>'}
<li>Para enviarte información sobre nuestros productos y servicios, que puedes dejar de recibir cuando quieras.</li>
<li>Para medir y mejorar esta página y nuestras campañas.</li>
</ul>
${pais.base ? `<p>${pais.base}</p>` : '<p>Al enviar tus datos nos das tu autorización para usarlos con estos fines. Puedes revocarla cuando quieras.</p>'}
<h2>Con quién los compartimos</h2>
<p>Solo con proveedores que nos ayudan a operar (alojamiento de la página, envío de correos y mensajes, herramientas de medición${pixel ? ' como Meta' : ''}${pago ? ' y la plataforma de pago' : ''}), que los tratan por cuenta nuestra. No vendemos tus datos.</p>
<h2>Cuánto tiempo los guardamos</h2>
<p>Mientras exista la relación contigo o hasta que nos pidas eliminarlos, y después solo el tiempo que exija la ley.</p>
<h2>Tus derechos</h2>
<p>Puedes ${pais.derechos}. Escríbenos${correo ? ` a ${correo}` : ''} y te respondemos en los plazos que fija la ley. Si no quedas conforme, puedes acudir a ${pais.autoridad}.</p>
<h2>Cambios</h2>
<p>Si cambiamos esta política, publicaremos la nueva versión en esta misma página.</p>`;
}

function terminos(plan, marca, modo, base = '') {
  const { clave, datos: pais } = paisDe(marca);
  const responsable = dato(marca.legal?.razon_social || '', 'razón social o tu nombre', modo);
  const documento = dato(marca.legal?.documento || '', pais.documento, modo);
  const correo = dato(marca.contacto?.correo || '', 'correo de contacto', modo);
  const marcaNombre = esc(marca.nombre || plan.marca?.nombre || 'esta marca');
  const pago = plan.conversion?.accion === 'checkout';
  const infoproducto = ['registro', 'vsl', 'ventas'].includes(plan.tipo);
  return `
<h1>${clave === 'espana' ? 'Aviso legal y términos de uso' : 'Términos y condiciones'}</h1>
<p class="lg-act">Última actualización: ${new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
<h2>Quién está detrás de esta página</h2>
<p>Esta página es de ${marcaNombre}, a cargo de ${responsable}${documento ? ` (${esc(pais.documento)}: ${documento})` : ''}${correo ? `. Contacto: ${correo}` : ''}.</p>
<h2>Uso de la página</h2>
<p>Al usar esta página aceptas estos términos. Te comprometes a darnos datos verdaderos y a no usar la página para fines ilegales o que perjudiquen a otros.</p>
${pago ? `<h2>Compras</h2>
<p>Las compras se hacen en una plataforma de pago externa, que aplica sus propias condiciones de compra, reembolso y facturación. El precio, lo que incluye y la garantía son los que se muestran en esta página y en el proceso de pago.</p>` : ''}
${infoproducto ? `<h2>Resultados</h2>
<p>El contenido que ofrecemos es educativo. Los resultados de cada persona dependen de su esfuerzo, su experiencia y su contexto, por lo que no garantizamos ingresos ni resultados específicos. Los ejemplos y testimonios muestran casos reales que no son necesariamente típicos.</p>` : ''}
<h2>Propiedad intelectual</h2>
<p>Los textos, imágenes, videos, marcas y materiales de esta página y de nuestros productos son de ${marcaNombre} o de sus autores, y no se pueden copiar, distribuir ni revender sin permiso escrito.</p>
<h2>Responsabilidad</h2>
<p>Hacemos lo posible para que la información sea correcta y la página funcione bien, pero no respondemos por interrupciones, errores técnicos o daños indirectos derivados de su uso, en la medida en que la ley lo permita.</p>
<h2>Tus datos</h2>
<p>El uso de tus datos personales se rige por nuestra <a href="${esc(base)}/privacidad">política de privacidad</a>.</p>
<h2>Ley aplicable</h2>
<p>Estos términos se rigen por las leyes de ${clave ? esc(marca.pais) : 'el país del responsable'}. Cualquier duda o reclamo, escríbenos${correo ? ` a ${correo}` : ''}.</p>`;
}

const CSS_LEGAL =
  '*,*::before,*::after{box-sizing:border-box}body{margin:0;background:var(--fondo);color:var(--texto);font-family:var(--f-txt);font-size:1rem;line-height:1.7;-webkit-font-smoothing:antialiased}' +
  '.lg{max-width:760px;margin:0 auto;padding:clamp(28px,6vw,72px) clamp(20px,4vw,32px) 80px}' +
  '.lg-volver{display:inline-flex;gap:8px;align-items:center;color:var(--suave);text-decoration:none;font-size:.9rem;margin-bottom:28px}.lg-volver:hover{color:var(--texto)}' +
  '.lg h1{font-family:var(--f-tit);font-size:clamp(1.9rem,4vw,2.6rem);line-height:1.1;margin:0 0 6px;letter-spacing:-.015em}' +
  '.lg h2{font-family:var(--f-tit);font-size:1.2rem;margin:34px 0 8px}.lg p,.lg li{color:var(--suave)}.lg ul{padding-left:1.2em}.lg li{margin:6px 0}' +
  '.lg a{color:var(--acento)}.lg-act{font-size:.85rem;color:var(--tenue)!important;margin-top:0}' +
  '.pc{display:inline-block;padding:2px 10px;border:1px dashed var(--acento);border-radius:6px;background:var(--pri-suave);color:var(--texto);font-size:.85rem}' +
  '.lg-pie{margin-top:48px;padding-top:20px;border-top:1px solid var(--linea);font-size:.82rem;color:var(--tenue)}';

export function renderLegal(plan, marca = {}, cual = 'privacidad', o = {}) {
  const modo = o.modo || 'publicado';
  const t = resolverTemaPagina(plan.tema);
  const base = typeof o.base === 'string' && /^(\/[a-z0-9-]+){0,2}$/.test(o.base) ? o.base : '';
  const cuerpo = cual === 'terminos' ? terminos(plan, marca, modo, base) : privacidad(plan, marca, modo);
  const titulo = (cual === 'terminos' ? 'Términos y condiciones' : 'Política de privacidad') + ' · ' + (marca.nombre || plan.marca?.nombre || '');
  return (
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>${esc(titulo)}</title><meta name="robots" content="noindex"><meta name="theme-color" content="${t.colores.fondo}">` +
    `<style>${cssTemaPagina(t, o.rutaLetras || '/_f/')}${CSS_LEGAL}${t.plantilla?.cssLegal || ''}</style></head>` +
    `<body><main class="lg"><a class="lg-volver" href="${esc(base || '/')}">← Volver</a>${cuerpo.replace(/\n<li><\/li>/g, '').replace(/^\s*$/gm, '')}` +
    `<p class="lg-pie">© ${new Date().getFullYear()} ${esc(marca.nombre || plan.marca?.nombre || '')}</p></main></body></html>`
  );
}
