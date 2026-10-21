# La entrevista (Fase 2): qué preguntar, una cosa a la vez

Orden: **1** tipo de página → **2** nombre de la marca (y se crea la carpeta) → **3** la oferta → **4** la marca
(país, colores, logo y datos legales) → **5** la plantilla → **6** las fotos → **7** confirmar.

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

## 2. El nombre de la marca (y la carpeta)

«¿Cómo se llama tu marca o tu negocio (como quieres que aparezca en la página)?» Con la respuesta, crea la carpeta:
`node "<skill>/scripts/nuevo.mjs" --nombre "<Marca>" --tipo <tipo>` (dice dónde quedó: esa es `<pagina>`).

## 3. La oferta (según el tipo)

Siempre: **qué ofreces** (en una frase), **para quién es** (quién es tu cliente ideal), **qué cambia en su vida** (el
resultado) y **qué se lleva** (3 a 5 cosas concretas: lo que aprende en la clase, lo que incluye el curso, lo que
resuelve el servicio). Si no sabe decir qué se lleva, ayúdale con preguntas («¿Qué va a poder hacer después que hoy no
puede?») y escríbelo con sus respuestas; no lo inventes. Después, solo lo de su tipo:

| tipo | preguntas (una por mensaje) |
|---|---|
| `registro` | Nombre de la clase · día y hora (y de qué país es esa hora) · ¿online o presencial? (si es presencial, el lugar) · duración · ¿queda grabada? · ¿hay cupos limitados? (solo si es verdad) · ¿quién la da? (nombre y una historia corta) · ¿qué datos pides en el formulario? (por defecto nombre, correo y WhatsApp; el correo es el obligatorio: si quiere el WhatsApp obligatorio, se quita el correo) · ¿hay grupo de WhatsApp o Telegram para después? (el link) |
| `vsl` | Link del video (YouTube, Vimeo, VTurb, Panda, Wistia o un archivo .mp4) · ¿en qué minuto presenta la oferta? (para que el botón aparezca ahí; si no sabe, desde el inicio) · precio (o «no lo quiero mostrar») · qué incluye · link de pago (Hotmart, Mercado Pago, Stripe…) · garantía (días y condiciones, solo si la da) |
| `ventas` | Nombre del producto · los 4 a 6 dolores de su cliente · su método (nombre y pasos) · temario o qué incluye · bonos (si hay) · precio (y precio anterior o en cuotas, si aplica) · garantía · link de pago · quién lo enseña |
| `evento` | Nombre del evento · día, hora de inicio y de fin (y de qué país) · ciudad y lugar · las entradas: nombre y precio de cada una (con la moneda) · qué incluye cada entrada · cupos (solo si quiere mostrarlos) · link de pago de cada entrada · ¿quiénes guían? (nombre, rol, historia, foto) · WhatsApp para dudas |
| `local` | Nombre del negocio · qué hace y dónde · servicios (y precio «desde», si quiere) · WhatsApp (con el país) y el mensaje que te llega escrito · dirección, referencia y horarios · link de Google Maps · años o clientes atendidos (solo si quiere mostrarlos) |

Pruebas sociales (para todos, una pregunta cada una): **¿tienes testimonios reales?** Pídele que los pegue tal cual
(texto, nombre y, si tiene, foto). **¿Cifras reales** (alumnos, clientes, años)? Si no tiene, esas secciones no van: no
se inventan.

## 4. La marca

1. **País** (para las legales y el código del WhatsApp).
2. **Colores**: «¿Tu marca tiene colores? Dímelos como quieras: "azul y amarillo", o el código si lo tienes (#1d4ed8). Si
   no tienes, te propongo una paleta.» Traduce los nombres a hex (colores-y-cambios.md › Nombres de colores) y llena
   los cuatro de `tema.colores` así: el **primer** color que nombra es el `primario` (botones), el **segundo** el
   `acento` (resaltados); `fondo` y `texto` salen de la paleta de plantillas.md › Colores más parecida a esos dos
   (clara u oscura, según la plantilla y lo que pida). Si da un solo color: ese es el `primario` y el `acento` va de la
   misma paleta. Si dice el fondo («fondo negro»), ese es el `fondo`.
3. **Logo**: «Si tienes logo, ponlo en la carpeta fotos/ de tu página (te la abro) y dime el nombre del archivo.»
4. **Datos legales** (van en la política de privacidad y los términos, son obligatorios para publicar): razón social o
   nombre completo del responsable, número tributario (NIT o cédula, RFC, RUC, RUT, CUIT, NIF…) y correo de contacto.
   Explícalo así: «Toda página que recibe datos de personas necesita una política de privacidad. La armo yo, solo
   necesito estos tres datos.»

## 5. La plantilla

Muéstrale las 5 con su tipo de página (`node "<skill>/scripts/vista.mjs" --plantillas --tipo <tipo>`), recomiéndale una con una
frase (plantillas.md › Cuándo recomendar cada una) y pregúntale cuál le gusta. Si no se decide, usa la recomendada.

## 6. Las fotos

Abre su carpeta de fotos (`open`/`start`/`xdg-open` en `<proyecto>/fotos`) y pídele lo que su tipo de página usa:

- `registro`, `ventas`, `vsl`: su foto (para «Quién te enseña» y la portada dividida) y el logo.
- `evento`: una foto para la portada (escenario o de quien guía), las fotos de quienes guían, el logo.
- `local`: la foto del local o del trabajo para la portada, fotos para la galería (6 es lo ideal), el logo.

«Arrástralas a esa carpeta y dime "listo". Si son del celular, yo las dejo livianas para que la página cargue rápido.»
Si no tiene fotos: la portada va sin foto (variante `centrado` o `evento`) y «Quién te enseña» va con `imagen: ""`:
todo se ve bien sin ellas. Si dice que te las va a pasar después, quedan por completar (y la página no se publica hasta
que lleguen o se quiten).

## 7. Antes de armar: confirma

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
