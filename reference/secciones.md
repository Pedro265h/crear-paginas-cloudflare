# Catálogo de páginas y secciones

> Generado desde el motor con `node scripts/catalogo.mjs`. No lo edites a mano: si cambia el motor, se vuelve a generar.
> Úsalo para escribir planes válidos: cada sección lleva `tipo`, `variante` y `campos` con estas claves.

## Tipos de página

| tipo | nombre | qué es | botón principal | plantilla por defecto |
|---|---|---|---|---|
| `registro` | Registro a masterclass o evento | Capta registros gratis para una clase en vivo, un taller o un evento presencial. | `formulario` (Abrir el formulario de registro) | Clásica |
| `vsl` | VSL de venta | Video de ventas arriba y el botón de compra que aparece en el minuto justo. | `checkout` (Ir al link de pago (Hotmart, Mercado Pago, Stripe…)) | Clásica |
| `ventas` | Página de ventas larga | La oferta completa: problema, método, temario, bonos, precio y garantía. | `checkout` (Ir al link de pago (Hotmart, Mercado Pago, Stripe…)) | Clásica |
| `local` | Negocio local o servicios | Servicios, precios, fotos, ubicación y un botón directo a WhatsApp. | `whatsapp` (Abrir WhatsApp con un mensaje listo) | Clásica |
| `evento` | Vender entradas para un evento presencial | Un evento presencial con fecha y lugar: entradas por nivel con su precio, sus cupos y su link de pago, quiénes guían y la logística del día. | `checkout` (Ir al link de pago (Hotmart, Mercado Pago, Stripe…)) | Prisma |

### La receta de cada tipo (el orden de las secciones)

- **registro**: `aviso` → `hero` (evento) → `beneficios` (numerada) → `urgencia` → `comparacion` → `para_quien` → `experto` → `testimonios` → `formulario` → `faq` → `cta` (tarjeta) → `pie`
- **vsl**: `hero` (video) → `beneficios` (lista) → `testimonios` → `oferta` → `garantia` → `faq` → `cta` (banda) → `pie`
- **ventas**: `aviso` → `hero` (dividido) → `problema` → `mecanismo` → `beneficios` (tarjetas) → `experto` → `testimonios` → `temario` → `bonos` → `oferta` → `garantia` → `faq` → `cta` (tarjeta) → `pie`
- **local**: `hero` (dividido) → `servicios` (tarjetas) → `cifras` → `mecanismo` → `testimonios` → `galeria` → `ubicacion` → `faq` → `cta` (banda) → `pie`
- **evento**: `aviso` → `hero` (centrado) → `cifras` → `problema` (lista) → `idea` (lado) → `comparacion` (tarjetas) → `mecanismo` (pasos) → `beneficios` (tarjetas) → `caminos` → `para_quien` → `equipo` → `urgencia` (frase) → `niveles` → `dudas` → `bonos` (fotos) → `logistica` → `faq` → `cta` (tarjeta) → `pie`
- **página de gracias** (todas): `gracias` → `pie`

### Acciones del botón principal (`conversion.accion`)

- `formulario`: Abrir el formulario de registro
- `checkout`: Ir al link de pago (Hotmart, Mercado Pago, Stripe…)
- `whatsapp`: Abrir WhatsApp con un mensaje listo
- `agenda`: Abrir la agenda (Calendly u otra)

### Campos del formulario (`conversion.campos`)

- `nombre`: Nombre (obligatorio)
- `correo`: Correo (obligatorio)
- `whatsapp`: WhatsApp (opcional)
- `telefono`: Teléfono (opcional)
- `ciudad`: Ciudad (opcional)
- `empresa`: Negocio o empresa (opcional)

Siempre va al menos un dato de contacto (correo, WhatsApp o teléfono): si no hay ninguno, el motor agrega el correo.

## Secciones

Para cada una: en qué tipos de página se puede usar, sus variantes (diseños) y sus campos. Los textos aceptan
`**negrita**`, `*resaltado*` y saltos de línea. Un dato que falta va como `{ "porCompletar": "qué falta" }` o, dentro de un
texto, `[[POR COMPLETAR: qué falta]]` (ver copy.md). Una foto va como `"fotos/archivo.jpg"` (ver plan.md).

### `aviso` · Barra de aviso

Franja fina arriba de todo con la fecha o la urgencia. Al tocarla hace la acción de la página.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `barra` (Barra)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `texto` | texto (una línea) | Texto | 90 | Ej. "Masterclass gratis en vivo · Sábado 18 de octubre · Cupos limitados" |

### `hero` · Portada

La primera pantalla. Promesa principal específica (resultado + tiempo o mecanismo), subtítulo que quita la objeción principal, 3 puntos clave y el botón. En celular el botón tiene que verse sin bajar.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `centrado` (Centrada), `dividido` (Texto y foto), `video` (Video arriba (VSL)), `evento` (Evento con formulario)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título principal | 110 | La promesa. Específica, sin humo. |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `puntos` | lista (hasta 4) | Puntos clave |  |  |
| `puntos[].texto` | texto (una línea) | Punto | 70 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |
| `imagen` | foto | Foto |  | La persona que enseña o el producto. Variante "Texto y foto". |
| `logo` | foto | Logo en lugar del título |  | Opcional: tu logo grande en vez del título escrito. (solo si la persona lo da) |

### `formulario` · Formulario de registro

Bloque con el formulario a la vista. Solo si la acción de la página es "formulario".

- Tipos de página: `registro`, `local`
- Variantes: `tarjeta` (Tarjeta centrada), `dividido` (Texto y formulario)
- Ancla: `#registro` (los botones pueden llevar aquí)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `contador` · Cuenta regresiva

Días, horas, minutos y segundos hasta el evento. Solo si hay fecha de evento.

- Tipos de página: `registro`, `ventas`, `evento`
- Variantes: `bloque` (Bloque)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `titulo` | texto (una línea) | Título | 60 | Ej. "Empezamos en" |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `beneficios` · Beneficios / Lo que vas a descubrir

Qué se lleva la persona. Cada ítem: un resultado concreto (no una característica) y una línea que lo explica.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `tarjetas` (Tarjetas), `lista` (Lista con checks), `numerada` (Numerada grande), `iconos` (Tarjetas con ícono)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `rotulo` | texto (una línea) | Rótulo sobre los beneficios | 50 | Opcional: una etiqueta corta entre el título y los beneficios, ej. "Así se verá tu vida en 6 meses" |
| `items` | lista (3 a 6) | Beneficios |  |  |
| `items[].titulo` | texto (una línea) | Beneficio | 70 |  |
| `items[].texto` | texto largo (párrafo) | Explicación | 180 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `problema` · El problema

Los dolores que vive hoy la persona, en sus palabras. Cierra con una frase que quita la culpa y abre la solución.

- Tipos de página: `vsl`, `ventas`, `registro`, `evento`
- Variantes: `lista` (Lista), `tarjetas` (Tarjetas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (3 a 6) | Dolores |  |  |
| `items[].texto` | texto (una línea) | Dolor | 120 |  |
| `cierre` | texto largo (párrafo) | Frase de cierre | 220 | Ej. "No es tu culpa: nadie te enseñó a…" |

### `mecanismo` · El método

Cómo funciona la solución: el nombre del método y sus 3 a 5 pasos o pilares. Es el "por qué esto sí funciona".

- Tipos de página: `ventas`, `vsl`, `registro`, `local`, `evento`
- Variantes: `pasos` (Pasos en fila), `linea` (Línea de tiempo)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (3 a 5) | Pasos |  |  |
| `items[].titulo` | texto (una línea) | Paso | 50 |  |
| `items[].texto` | texto largo (párrafo) | Qué pasa en este paso | 180 |  |
| `cierre` | texto largo (párrafo) | Frase de cierre | 220 | Opcional: una frase debajo de los pasos, ej. "Las 4 áreas no se trabajan por separado." |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `urgencia` · Por qué ahora

Por qué actuar hoy: el cambio del mercado o la ventana que se cierra (una primera edición, una fecha que no se repite). Las cifras solo si la persona las dio (con fuente). La variante "frase" es un bloque centrado con una frase grande.

- Tipos de página: `registro`, `ventas`, `vsl`, `evento`
- Variantes: `bloque` (Bloque con cifras), `frase` (Frase centrada)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `texto` | texto largo (párrafo) | Texto | 420 |  |
| `cifras` | lista (hasta 3) | Cifras |  |  |
| `cifras[].valor` | texto (una línea) | Cifra | 12 | Ej. 88% |
| `cifras[].etiqueta` | texto (una línea) | Qué significa | 90 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `comparacion` · Comparación

Esto contra la alternativa (otros cursos, hacerlo solo, antes/después). Filas cortas, una idea por fila.

- Tipos de página: `registro`, `ventas`, `vsl`, `local`, `evento`
- Variantes: `tabla` (Tabla), `tarjetas` (Dos tarjetas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `columnaA` | texto (una línea) | Nombre de lo tuyo | 30 | Ej. "Esta masterclass" |
| `columnaB` | texto (una línea) | Nombre de la alternativa | 30 | Ej. "Otros cursos" |
| `filas` | lista (3 a 7) | Filas |  |  |
| `filas[].a` | texto (una línea) | Lo tuyo | 80 |  |
| `filas[].b` | texto (una línea) | La alternativa | 80 |  |

### `para_quien` · Para quién es

Para quién SÍ es y para quién NO. Filtra y sube la confianza de los que sí son.

- Tipos de página: `registro`, `ventas`, `vsl`, `evento`
- Variantes: `columnas` (Dos columnas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `tituloSi` | texto (una línea) | Título del sí | 40 | Ej. "Es para ti si…" |
| `si` | lista (2 a 6) | Es para |  |  |
| `si[].texto` | texto (una línea) | Perfil | 120 |  |
| `tituloNo` | texto (una línea) | Título del no | 40 | Ej. "No es para ti si…" |
| `no` | lista (1 a 5) | No es para |  |  |
| `no[].texto` | texto (una línea) | Perfil | 120 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `experto` · Quién te enseña

La persona detrás: nombre, rol, historia corta en primera persona y logros VERIFICABLES (solo los que dio la persona).

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `lado` (Foto al lado), `centrado` (Centrado)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 40 | Ej. "Quién te enseña" |
| `nombre` | texto (una línea) | Nombre | 60 |  |
| `rol` | texto (una línea) | Rol | 90 |  |
| `bio` | texto largo (párrafo) | Historia corta | 650 | En primera persona. Por qué le deben creer. |
| `logros` | lista (hasta 5) | Logros |  |  |
| `logros[].texto` | texto (una línea) | Logro | 110 |  |
| `imagen` | foto | Foto |  |  |

### `testimonios` · Testimonios

Lo que dicen clientes reales. La IA NUNCA los inventa: deja cada uno "por completar" si la persona no los dio.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `tarjetas` (Tarjetas), `destacado` (Uno destacado)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (hasta 6) | Testimonios |  |  |
| `items[].texto` | texto largo (párrafo) | Testimonio | 320 |  |
| `items[].nombre` | texto (una línea) | Nombre | 50 |  |
| `items[].detalle` | texto (una línea) | Detalle | 70 | Ciudad, profesión o resultado |
| `items[].imagen` | foto | Foto |  |  |

### `cifras` · Cifras

Números que dan confianza (años, clientes, alumnos). SOLO cifras que dio la persona.

- Tipos de página: `local`, `ventas`, `registro`, `vsl`, `evento`
- Variantes: `fila` (En fila)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `items` | lista (2 a 4) | Cifras |  |  |
| `items[].valor` | texto (una línea) | Cifra | 12 | Ej. +3.000 |
| `items[].etiqueta` | texto (una línea) | Qué significa | 50 |  |
| `items[].detalle` | texto (una línea) | Detalle | 60 | Opcional: una línea más chica debajo, ej. "impactadas en eventos" |

### `temario` · Temario

Módulos o clases, cada uno con el resultado que deja (no solo el tema).

- Tipos de página: `ventas`, `vsl`, `registro`
- Variantes: `acordeon` (Acordeón), `lista` (Lista de módulos)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (3 a 12) | Módulos |  |  |
| `items[].titulo` | texto (una línea) | Módulo | 80 |  |
| `items[].texto` | texto largo (párrafo) | Qué logra | 260 |  |

### `oferta` · Oferta y precio

Todo lo que incluye con su valor, el total, el precio real y el botón de compra. Precios SOLO los que dio la persona.

- Tipos de página: `ventas`, `vsl`, `local`
- Variantes: `tarjeta` (Tarjeta de precio), `dividida` (Lista y precio)
- Ancla: `#oferta` (los botones pueden llevar aquí)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (2 a 10) | Lo que incluye |  |  |
| `items[].texto` | texto (una línea) | Ítem | 90 |  |
| `items[].valor` | texto (una línea) | Valor | 20 | Ej. $297 (opcional) |
| `valorTotal` | texto (una línea) | Valor total | 20 |  |
| `precioAntes` | texto (una línea) | Precio tachado | 20 |  |
| `precio` | texto (una línea) | Precio | 20 |  |
| `detallePrecio` | texto (una línea) | Detalle del precio | 60 | Ej. "Pago único" o "o 12 cuotas de $9,90" |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `bonos` · Bonos

Regalos que suben el valor de la oferta, cada uno con su valor (si la persona lo dio). En un evento, las experiencias exclusivas de algunos niveles: variante "fotos" (foto grande y la etiqueta en "valor", ej. "Incluido en VIP").

- Tipos de página: `ventas`, `vsl`, `registro`, `evento`
- Variantes: `tarjetas` (Tarjetas), `fotos` (Fotos con etiqueta)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (1 a 5) | Bonos |  |  |
| `items[].titulo` | texto (una línea) | Bono | 70 |  |
| `items[].texto` | texto largo (párrafo) | Qué es | 400 | Uno o dos párrafos (sepáralos con una línea en blanco) |
| `items[].valor` | texto (una línea) | Valor | 40 |  |
| `items[].imagen` | foto | Imagen |  |  |
| `items[].fecha` | texto (una línea) | Fecha o rótulo | 40 | Opcional, en "Fotos con etiqueta": una línea chica arriba del título, ej. "18 de octubre" |
| `items[].boton` | texto (una línea) | Texto del botón | 40 | Opcional, en "Fotos con etiqueta": un botón que lleva a las entradas, ej. "Ir a la entrada VIP" |

### `garantia` · Garantía

La garantía que ofrece la persona (días y condiciones). Nunca inventar una garantía que no dio.

- Tipos de página: `ventas`, `vsl`, `evento`
- Variantes: `sello` (Sello)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `dias` | texto (una línea) | Días | 4 | Ej. 7 |
| `titulo` | texto (una línea) | Título | 80 |  |
| `texto` | texto largo (párrafo) | Condiciones | 360 |  |

### `faq` · Preguntas frecuentes

Las dudas que frenan la compra o el registro (precio, tiempo, para quién, acceso, garantía), con respuestas cortas.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `acordeon` (Acordeón), `columnas` (Dos columnas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `items` | lista (3 a 8) | Preguntas |  |  |
| `items[].pregunta` | texto (una línea) | Pregunta | 110 |  |
| `items[].respuesta` | texto largo (párrafo) | Respuesta | 380 |  |

### `servicios` · Servicios

Lo que ofrece el negocio: nombre, para qué sirve y precio (solo si la persona lo dio).

- Tipos de página: `local`
- Variantes: `tarjetas` (Tarjetas con foto), `precios` (Lista de precios)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `items` | lista (2 a 9) | Servicios |  |  |
| `items[].titulo` | texto (una línea) | Servicio | 60 |  |
| `items[].texto` | texto largo (párrafo) | Descripción | 180 |  |
| `items[].precio` | texto (una línea) | Precio | 24 |  |
| `items[].imagen` | foto | Foto |  |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `galeria` · Galería

Fotos del lugar, del trabajo o de resultados (antes/después con permiso).

- Tipos de página: `local`, `ventas`, `evento`
- Variantes: `cuadricula` (Cuadrícula), `mosaico` (Mosaico)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `items` | lista (3 a 9) | Fotos |  |  |
| `items[].imagen` | foto | Foto |  |  |
| `items[].texto` | texto (una línea) | Pie de foto | 70 |  |

### `ubicacion` · Ubicación y horarios

Dirección, horarios y cómo llegar. Para negocios con local.

- Tipos de página: `local`
- Variantes: `tarjeta` (Tarjeta)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `direccion` | texto (una línea) | Dirección | 120 |  |
| `referencia` | texto (una línea) | Referencia | 120 | Ej. "Frente al parque principal" |
| `horarios` | lista (1 a 7) | Horarios |  |  |
| `horarios[].dia` | texto (una línea) | Días | 30 |  |
| `horarios[].hora` | texto (una línea) | Horas | 40 |  |
| `mapa` | texto (una línea), link | Link de Google Maps | 300 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `video` · Video

Un video a lo ancho con su título. Para una presentación, un testimonio en video o el VSL más abajo.

- Tipos de página: `vsl`, `ventas`, `registro`, `local`, `evento`, `gracias`
- Variantes: `centrado` (Centrado)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `url` | texto (una línea), video | Link del video | 400 | YouTube, Vimeo, Streamable, Loom, Panda, Wistia o el código de VTurb/Panda/Wistia |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `cta` · Llamada final

El cierre: repite la promesa en una frase, quita la última duda y vuelve a mostrar el botón.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`
- Variantes: `banda` (Banda de color), `tarjeta` (Tarjeta destacada)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `niveles` · Entradas por nivel

Las entradas (o los planes) de 2 a 4 niveles lado a lado: cada uno con su nombre, su precio, lo que incluye y lo que no (apagado, para comparar), sus cupos con una barra (solo si la persona los dio), su propio link de pago y uno destacado ("Recomendada", o "Más elegida" si la persona dijo que es la que más se vende). Con la fecha del evento puede llevar la cuenta regresiva de las ventas. Precios, cupos y links SOLO los que dio la persona.

- Tipos de página: `evento`, `ventas`
- Variantes: `tarjetas` (Tarjetas lado a lado)
- Ancla: `#entradas` (los botones pueden llevar aquí)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `etapa` | texto (una línea) | Etapa de venta | 30 | Ej. "Preventa" o "Etapa final". Va sobre la cuenta regresiva y en cada precio (opcional). |
| `cierre` | texto (una línea) | Texto de la cuenta regresiva | 40 | Ej. "Las ventas cierran en". Con la fecha del evento muestra la cuenta regresiva; vacío = sin cuenta. |
| `niveles` | lista (2 a 4) | Niveles |  |  |
| `niveles[].nombre` | texto (una línea) | Nombre del nivel | 30 | Ej. General, VIP, Diamante |
| `niveles[].precio` | texto (una línea) | Precio | 16 | Ej. $250 |
| `niveles[].moneda` | texto (una línea) | Moneda | 8 | Ej. USD |
| `niveles[].nota` | texto (una línea) | Nota del precio | 60 | Ej. "80 lugares · precio final" |
| `niveles[].lugares` | texto (una línea) | Lugares en total | 8 | Solo si la persona lo dio. Ej. 80 |
| `niveles[].disponibles` | texto (una línea) | Lugares disponibles | 8 | Solo si la persona lo dio. Ej. 40 (con los dos se ve la barra de cupos) |
| `niveles[].incluye` | texto largo (párrafo) | Lo que incluye | 700 | Una cosa por línea |
| `niveles[].noIncluye` | texto largo (párrafo) | Lo que no incluye | 400 | Una cosa por línea: se ve apagada, para comparar con los otros niveles (opcional) |
| `niveles[].etiqueta` | texto (una línea) | Etiqueta destacada | 24 | Ej. "Recomendada" ("Más elegida" solo si de verdad es la que más se vende). Solo en el nivel que se destaca; vacío en los demás |
| `niveles[].boton` | texto (una línea) | Texto del botón | 32 | Ej. "Reservar VIP". Vacío = "Reservar" y el nombre del nivel |
| `niveles[].link` | texto (una línea), link | Link de pago de este nivel | 2000 | Hotmart, Mercado Pago, Stripe… Vacío = el link de pago de la página |
| `nota` | texto (una línea) | Nota bajo cada botón | 60 | Ej. "Compra 100% segura". Vacío = "Pago seguro" |
| `cupos` | texto (una línea) | Texto de los cupos | 30 | Lo que va después de "40 de 80": ej. "en este lote". Vacío = "disponibles" |

### `equipo` · Equipo (quienes guían)

De 2 a 4 personas que enseñan o guían, lado a lado: foto, nombre, rol y una historia corta de cada una. Nombres, roles e historias SOLO los que dio la persona (si falta alguien, queda por completar). Para una sola persona va "Quién te enseña".

- Tipos de página: `evento`, `registro`, `ventas`, `vsl`
- Variantes: `tarjetas` (Tarjetas lado a lado), `retratos` (Retratos grandes con el nombre encima)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `personas` | lista (2 a 4) | Personas |  |  |
| `personas[].nombre` | texto (una línea) | Nombre | 50 |  |
| `personas[].rol` | texto (una línea) | Rol | 80 | Ej. "Facilitadora y conferencista" |
| `personas[].bio` | texto largo (párrafo) | Historia corta | 600 | Quién es y por qué creerle, con logros que dio la persona |
| `personas[].imagen` | foto | Foto |  |  |

### `logistica` · Logística del evento

Fecha, horario, lugar y formato en cuatro tarjetas, cada una con una línea de detalle. Lo que no se escriba sale solo de la fecha, la hora, la duración y el lugar del evento (en Conversión).

- Tipos de página: `evento`, `registro`
- Variantes: `tarjetas` (Cuatro tarjetas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `fecha` | texto (una línea) | Fecha | 40 | Vacío = la fecha del evento. Ej. "Sábado 21 de noviembre" |
| `fechaDetalle` | texto (una línea) | Detalle de la fecha | 60 | Ej. "Un solo día, de principio a fin" |
| `horario` | texto (una línea) | Horario | 40 | Vacío = la hora del evento y su duración. Ej. "9:00 a. m. — 6:00 p. m." |
| `horarioDetalle` | texto (una línea) | Detalle del horario | 60 | Ej. "Resérvate el día completo" |
| `lugar` | texto (una línea) | Lugar | 80 | Vacío = el lugar del evento |
| `lugarDetalle` | texto (una línea) | Detalle del lugar | 80 | Ej. la ciudad o cómo llegar |
| `formato` | texto (una línea) | Formato | 40 | Vacío = presencial o en línea, según el evento |
| `formatoDetalle` | texto (una línea) | Detalle del formato | 80 | Ej. "Charlas, dinámicas y una experiencia en vivo" |
| `mapa` | texto (una línea), link | Link de Google Maps | 300 |  |

### `dudas` · Dudas por WhatsApp

Un bloque corto que invita a escribir por WhatsApp con cualquier duda antes de comprar ("¿Tienes dudas? Escríbenos"). Usa el WhatsApp de la página.

- Tipos de página: `evento`, `ventas`, `vsl`, `registro`
- Variantes: `tarjeta` (Tarjeta)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `titulo` | texto (una línea) | Título | 60 | Ej. "¿Tienes dudas?" |
| `texto` | texto largo (párrafo) | Texto | 220 | Ej. "Escríbenos por WhatsApp y te ayudamos con cualquier inquietud." |
| `boton` | texto (una línea) | Texto del botón | 32 | Vacío = "Escribir por WhatsApp" |
| `whatsapp` | texto (una línea) | WhatsApp | 30 | Con el código del país. Vacío = el WhatsApp de la página |
| `mensaje` | texto (una línea) | Mensaje que te llega | 200 | Vacío = el de la página. Ej. "Hola, tengo una duda sobre el evento" |

### `idea` · La idea que lo explica

El concepto de fondo que explica por qué la persona está donde está y qué lo cambia (el "por qué" del método o del evento): título que lo nombra, uno o dos párrafos, una frase destacada y una imagen al lado o debajo.

- Tipos de página: `evento`, `registro`, `ventas`, `vsl`
- Variantes: `lado` (Texto e imagen al lado), `centrada` (Centrada con la imagen debajo), `fondo` (La imagen de fondo con el título encima)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `encabezado` | texto (una línea) | Título del texto | 80 | Opcional: una línea en negrita arriba del texto, ej. "La ciencia y la espiritualidad, unidas." |
| `texto` | texto largo (párrafo) | Texto | 1200 | Uno o dos párrafos (sepáralos con una línea en blanco). Un párrafo que es solo un número se ve como una marca de nivel |
| `frase` | texto largo (párrafo) | Frase destacada | 220 | La idea en una frase, ej. "No es falta de trabajo: es quién eres mientras trabajas." |
| `imagen` | foto | Imagen |  | Una foto, un esquema o un mapa que explique la idea |
| `boton` | texto (una línea) | Texto del botón | 32 | Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página. |
| `nota` | texto (una línea) | Nota bajo el botón | 80 | Quita miedo: "Gratis · 100% online · Cupos limitados" |

### `caminos` · Dos caminos

La decisión en dos columnas: a un lado el costo de no hacer nada (lo que sigue igual otro año), al otro lo que cambia para siempre si da el paso. Cada columna con su rótulo, un título, la lista y una frase de cierre.

- Tipos de página: `evento`, `registro`, `ventas`, `vsl`
- Variantes: `columnas` (Dos columnas)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 110 |  |
| `resaltado` | texto (una línea) | Frase resaltada | 40 | Parte del título que va en color de acento. Debe aparecer tal cual en el título. |
| `subtitulo` | texto largo (párrafo) | Subtítulo | 220 |  |
| `rotuloA` | texto (una línea) | Rótulo del primer camino | 40 | Ej. "El costo de no ir" |
| `tituloA` | texto (una línea) | Título del primer camino | 90 |  |
| `textoA` | texto largo (párrafo) | Texto del primer camino | 260 |  |
| `itemsA` | lista (3 a 6) | Lo que sigue igual |  |  |
| `itemsA[].texto` | texto (una línea) | Ítem | 160 |  |
| `cierreA` | texto largo (párrafo) | Cierre del primer camino | 200 |  |
| `rotuloB` | texto (una línea) | Rótulo del segundo camino | 40 | Ej. "Lo que cambia" |
| `tituloB` | texto (una línea) | Título del segundo camino | 90 |  |
| `textoB` | texto largo (párrafo) | Texto del segundo camino | 260 |  |
| `itemsB` | lista (3 a 6) | Lo que cambia |  |  |
| `itemsB[].texto` | texto (una línea) | Ítem | 160 |  |
| `cierreB` | texto largo (párrafo) | Cierre del segundo camino | 200 |  |

### `gracias` · Confirmación (gracias)

Lo primero que ve la persona después de registrarse o comprar: confirma, dice los siguientes pasos y lleva al grupo. Escribe {nombre} en el título donde va el nombre de la persona (ej. "¡Listo{nombre}! Tu cupo está confirmado").

- Tipos de página: `gracias`
- Variantes: `confirmacion` (Confirmación)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `antetitulo` | texto (una línea) | Antetítulo | 50 | Etiqueta corta arriba del título, ej. "Lo que vas a descubrir" |
| `titulo` | texto (una línea) | Título | 90 |  |
| `texto` | texto largo (párrafo) | Texto | 300 |  |
| `pasos` | lista (hasta 4) | Siguientes pasos |  |  |
| `pasos[].titulo` | texto (una línea) | Paso | 60 |  |
| `pasos[].texto` | texto largo (párrafo) | Detalle | 160 |  |
| `grupoTexto` | texto (una línea) | Texto del botón del grupo | 40 | Ej. "Entrar al grupo de WhatsApp" |
| `grupoUrl` | texto (una línea), link | Link del grupo | 300 | Link de invitación al grupo de WhatsApp o Telegram |

### `pie` · Pie de página

Marca, aviso legal corto y links a privacidad y términos.

- Tipos de página: `registro`, `vsl`, `ventas`, `local`, `evento`, `gracias`
- Variantes: `simple` (Simple)

| campo | tipo | qué es | largo máx. | ayuda |
|---|---|---|---|---|
| `marca` | texto (una línea) | Nombre de la marca | 60 |  |
| `texto` | texto largo (párrafo) | Aviso | 300 | Ej. "Esta formación es educativa y no garantiza resultados ni ingresos específicos." |
