# La entrevista (Fase 2): qué preguntar, una cosa a la vez

Pregunta **una sola cosa por mensaje**, con un ejemplo de respuesta. Si la persona ya contó algo en un mensaje
anterior, no lo vuelvas a preguntar: confírmalo. Anota cada respuesta en la cabeza del plan (después va a plan.json y
marca.json). Si no sabe algo, sigue: queda «por completar» y se lo pides al final.

## 1. ¿Qué quieres lograr? → el tipo de página

```
¿Qué quieres que haga tu página? Elige la que más se parezca:

1. Que la gente se registre a una clase, taller o evento GRATIS (masterclass, webinar, reto)
2. Vender con un video (VSL): el video explica y abajo está el botón de compra
3. Vender un curso, mentoría o servicio con una página larga (problema, método, precio, garantía)
4. Vender ENTRADAS para un evento presencial (con fecha, lugar y tipos de entrada)
5. Que te escriban por WhatsApp para tu negocio o tus servicios (negocio local)

Respóndeme con el número o cuéntamelo con tus palabras.
```

1 → `registro` · 2 → `vsl` · 3 → `ventas` · 4 → `evento` · 5 → `local`. Si dice «vender» sin más, pregunta si tiene video.

## 2. La oferta (según el tipo)

Siempre: **qué ofreces** (en una frase), **para quién es** (quién es tu cliente ideal) y **qué cambia en su vida** (el
resultado). Después, solo lo de su tipo:

| tipo | preguntas (una por mensaje) |
|---|---|
| `registro` | Nombre de la clase · día y hora (y de qué país es esa hora) · ¿online o presencial? (si es presencial, el lugar) · duración · ¿quién la da? (nombre y una historia corta) · ¿qué datos pides en el formulario? (por defecto nombre, correo y WhatsApp) · ¿hay grupo de WhatsApp o Telegram para después? (el link) |
| `vsl` | Link del video (YouTube, Vimeo, VTurb, Panda, Wistia o un archivo .mp4) · ¿en qué minuto presenta la oferta? (para que el botón aparezca ahí; si no sabe, desde el inicio) · precio (o «no lo quiero mostrar») · qué incluye · link de pago (Hotmart, Mercado Pago, Stripe…) · garantía (días y condiciones, solo si la da) |
| `ventas` | Nombre del producto · los 4 a 6 dolores de su cliente · su método (nombre y pasos) · temario o qué incluye · bonos (si hay) · precio (y precio anterior o en cuotas, si aplica) · garantía · link de pago · quién lo enseña |
| `evento` | Nombre del evento · día, hora de inicio y de fin (y de qué país) · ciudad y lugar · las entradas: nombre y precio de cada una (con la moneda) · qué incluye cada entrada · cupos (solo si quiere mostrarlos) · link de pago de cada entrada · ¿quiénes guían? (nombre, rol, historia, foto) · WhatsApp para dudas |
| `local` | Nombre del negocio · qué hace y dónde · servicios (y precio «desde», si quiere) · WhatsApp (con el país) y el mensaje que te llega escrito · dirección, referencia y horarios · link de Google Maps · años o clientes atendidos (solo si quiere mostrarlos) |

Pruebas sociales (para todos): **¿tienes testimonios reales?** Pídele que los pegue tal cual (texto, nombre y, si
tiene, foto). ¿Cifras reales (alumnos, clientes, años)? Si no tiene, esas secciones no van: no se inventan.

## 3. La marca

1. **Nombre de la marca** (como quiere que aparezca).
2. **País** (para las legales y el código del WhatsApp).
3. **Colores**: «¿Tu marca tiene colores? Dímelos como quieras: "azul y amarillo", o el código si lo tienes (#1d4ed8). Si
   no tienes, te propongo una paleta.» Traduce los nombres a hex (colores-y-cambios.md › Nombres de colores).
4. **Logo**: «Si tienes logo, ponlo en la carpeta fotos/ de tu página (te la abro) y dime el nombre del archivo.»
5. **Datos legales** (van en la política de privacidad y los términos, son obligatorios para publicar): razón social o
   nombre completo del responsable, número tributario (NIT o cédula, RFC, RUC, RUT, CUIT, NIF…) y correo de contacto.
   Explícalo así: «Toda página que recibe datos de personas necesita una política de privacidad. La armo yo, solo
   necesito estos tres datos.»

## 4. La plantilla

Muéstrale las 5 con su tipo de página (`node scripts/vista.mjs --plantillas --tipo <tipo>`), recomiéndale una con una
frase (plantillas.md › Cuándo recomendar cada una) y pregúntale cuál le gusta. Si no se decide, usa la recomendada.

## 5. Las fotos

Abre su carpeta de fotos (`open`/`start`/`xdg-open` en `<proyecto>/fotos`) y pídele lo que su tipo de página usa:

- `registro`, `ventas`, `vsl`: su foto (para «Quién te enseña» y la portada dividida) y el logo.
- `evento`: una foto para la portada (escenario o de quien guía), las fotos de quienes guían, el logo.
- `local`: la foto del local o del trabajo para la portada, fotos para la galería (6 es lo ideal), el logo.

«Arrástralas a esa carpeta y dime "listo". Si son del celular, yo las dejo livianas para que la página cargue rápido.»
Si no tiene fotos: la portada va sin foto (centrada) y las demás secciones también funcionan sin ellas.

## 6. Antes de armar: confirma

```
A ver si te entendí bien:

• Página: [tipo en palabras simples]
• Ofreces: [oferta] para [cliente ideal]
• El botón: [registrarse / comprar en (link) / escribir a tu WhatsApp (número)]
• [fecha y lugar, si aplica]
• Diseño: [plantilla] con tus colores [colores]
• Lo que todavía falta (lo dejo marcado y me lo das cuando puedas): [lista]

¿Le atinamos o ajustamos algo?
```

No arranques a escribir el plan hasta que diga que sí.
