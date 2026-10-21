# Cambios por órdenes (Fase 4)

La persona pide en sus palabras; tú editas `plan.json` (o `marca.json`), vuelves a armar la vista
(`node "<skill>/scripts/vista.mjs" --proyecto "<pagina>"`, se actualiza sola en el navegador) y le cuentas en una línea qué cambiaste, en pasado:
«Listo: puse el botón en rojo.» Cambia **solo** lo que pidió; conserva los datos reales que ya estaban.

## Regla de oro de los colores

**Cualquier pedido de color se hace, siempre.** Nunca digas «así es el diseño», «la plantilla no deja» ni des razones
internas. El motor ajusta solo lo necesario para que todo se lea (mueve la luz del color, en el mismo tono, hasta que
el texto tenga buen contraste); si para leerse tuvo que cambiar mucho (la vista lo avisa con «Ojo: …» o «En "sección": …»),
cuéntalo en una línea: «Ojo: el texto no se
leía con ese fondo, así que lo dejé en el tono más parecido que sí se lee.»

Todo color va en hex `#rrggbb`. Si hay dos interpretaciones muy distintas («ponlo azul»: ¿el fondo o los botones?),
pregunta con 2 o 3 opciones cortas y no cambies nada hasta que responda. Si responde corto («sí», «dale», «la
primera», «todos»), haz lo que proponías.

### Dónde va cada color

| la persona dice | qué cambias |
|---|---|
| «todos los botones rojos», «los botones en rojo» | `tema.propios.primario` |
| «el botón en rojo» (sin decir cuál) | `tema.propios.primario` (todos: la página tiene una sola acción) y ofrécele «Si querías solo el de la portada, dime» |
| «el botón de la portada rojo», «este botón» | `estilo.primario` de esa sección |
| «fondo blanco», «ponla blanca», «toda la página negra» | `tema.propios.fondo` (y si hace falta `tema.propios.texto`) |
| «el fondo de esta sección (o de la portada) negro» | `estilo.fondo` de esa sección |
| «las letras / el texto en gris oscuro» | `tema.propios.texto` (o `estilo.texto` de una sección) |
| «el título dorado» (uno) | `estilo.titulo` de esa sección |
| «todos los títulos dorados» | `estilo.titulo` en **todas** las secciones |
| «los resaltados / las palabras de color en verde» | `tema.propios.acento` (o `estilo.acento` de una sección) |
| «usa los colores de mi marca» | pon sus colores en `tema.colores` y borra `tema.propios` y los `estilo` de las secciones |
| «vuelve a los colores del diseño», «quita mis colores» | borra `tema.propios` y los `estilo` de las secciones |
| «quítale los colores a esta sección» | borra el `estilo` de esa sección |
| «otros colores», «sorpréndeme» | una paleta de plantillas.md › Colores en `tema.propios` |

- `tema.colores` = los colores de la **marca** (cada plantilla los adapta a su estilo: Nácar a marfil, Penumbra y Prisma
  a la noche, Voltaje a su póster). Úsalos al crear la página.
- `tema.propios` = `{ fondo?, texto?, primario?, acento? }` que la persona **pidió para esta página**: se pintan tal cual
  con cualquier plantilla (una plantilla oscura con `fondo: "#ffffff"` se vuelve clara y conserva su identidad).
- `seccion.estilo` = `{ fondo?, texto?, titulo?, primario?, acento? }`: solo esa sección.

### Nombres de colores → hex (para traducir lo que dice la persona)

| nombre | hex | nombre | hex |
|---|---|---|---|
| rojo | `#dc2626` | azul | `#2563eb` |
| rojo vino / burdeos | `#7f1d1d` | azul rey | `#1d4ed8` |
| naranja | `#f97316` | azul marino | `#1e3a8a` |
| amarillo | `#facc15` | celeste | `#38bdf8` |
| dorado | `#d4a84b` | turquesa | `#14b8a6` |
| verde | `#16a34a` | morado / violeta | `#7c3aed` |
| verde menta | `#6ee7b7` | lila / lavanda | `#c4b5fd` |
| verde oliva | `#65a30d` | rosa | `#ec4899` |
| verde WhatsApp | `#25d366` | fucsia | `#d946ef` |
| negro | `#0a0a0a` | blanco | `#ffffff` |
| gris oscuro | `#374151` | gris claro | `#e5e7eb` |
| crema / hueso | `#f6f1e8` | café / marrón | `#7c4a2d` |
| terracota | `#c4532c` | coral | `#fb7185` |

«Como la de Coca-Cola» → `#f40009`; «como Facebook» → `#1877f2`; «como Spotify» → `#1db954`. Si no estás seguro de un
tono, elige uno bonito y dile cuál pusiste.

## Textos

| la persona dice | qué cambias |
|---|---|
| «cambia el título» | `campos.titulo` de la portada (`hero`), y su `resaltado` si ya no aparece en el título |
| «el botón que diga X» (todos) | `conversion.boton` y los `boton` de las secciones que repetían el texto anterior |
| «este botón que diga X» | el `boton` de esa sección |
| «más corto», «más directo», «más emocional» | reescribe ese texto con las reglas de copy.md (sin inventar datos) |
| «agrega que…» con un dato duro que no te dio (precio, cifra, testimonio) | escríbelo como `[[POR COMPLETAR: …]]` y pídeselo |

## Secciones

| la persona dice | qué cambias |
|---|---|
| «quita la sección de precios» | bórrala de `secciones` (o `"oculta": true` si dice «por ahora») |
| «vuelve a poner…» | quita `oculta` o agrégala de nuevo |
| «pon los testimonios antes del precio» | mueve la sección en el arreglo (el pie siempre al final; el aviso siempre primero) |
| «agrega preguntas frecuentes / una galería / un video…» | agrega la sección (secciones.md: su `tipo`, una `variante` y sus `campos`) con un `id` nuevo, en el lugar que tenga sentido |
| «que se vea en tarjetas / en lista» | cambia la `variante` de esa sección (secciones.md › Variantes) |
| «duplica esta sección» | cópiala con otro `id` |

## Fotos y video

| la persona dice | qué cambias |
|---|---|
| «pon mi foto» | que la ponga en `fotos/` (ábrele la carpeta), y pon `"fotos/archivo.jpg"` donde va (portada `dividido`: `hero.imagen`; «Quién te enseña»: `experto.imagen`) |
| «cambia la foto de la portada» | el `imagen` del `hero` (si la variante es `centrado` o `evento` y quiere foto, pásala a `dividido`) |
| «quita la foto» | deja el campo en `""` |
| «pon mi logo» | `marca.logo` (y si lo quiere grande en lugar del título: `hero.logo`) |
| «este es el video» | `video.url` (VSL) o el `url` de la sección `video` |
| «que el botón aparezca al minuto 8» | `video.ctaSegundos: 480` |

Fotos de celular: después de copiarlas corre `node "<skill>/scripts/fotos.mjs" --proyecto "<pagina>"` (las deja livianas).

## Diseño

| la persona dice | qué cambias |
|---|---|
| «muéstrame cómo se vería con otro diseño» | `node "<skill>/scripts/vista.mjs" --plantillas --tipo <tipo>` (ejemplo) o cambia `tema.plantilla` y vuelve a correr la vista |
| «usa Voltaje» | `tema.plantilla: "voltaje"` y `tema.letras: ""` |
| «otras letras», «letras más elegantes» | `tema.letras` con una pareja (plantillas.md › Letras) |
| «más redondeado», «bordes rectos» (Clásica) | `tema.radio`: `redondo` / `recto` |
| «modo oscuro / claro» (Clásica) | `tema.modo` |

## Lo de toda la página

| la persona dice | qué cambias |
|---|---|
| «mi WhatsApp es…» | `conversion.whatsapp` con código de país (y en `marca.json › contacto.whatsapp`) |
| «el link de pago es…» | `conversion.url` (o el `link` de cada entrada en `niveles`) |
| «que el formulario pida también la ciudad» | agrega `"ciudad"` a `conversion.campos` |
| «cambió la fecha» | `evento.fecha` (y los textos que la nombran: aviso, portada, contador, logística) |
| «mi píxel de Meta es 123…» | `pixel.meta` (solo números) y vuelve a publicar |
| «el título que sale en Google / al compartir» | `seo.titulo` y `seo.descripcion` |

Después de cualquier cambio: `node "<skill>/scripts/vista.mjs" --proyecto "<pagina>"` (se ve al instante). Si la página
ya estaba publicada, pregunta «¿La publico con este cambio?» y, con un sí,
`node "<skill>/scripts/publicar.mjs" --proyecto "<pagina>"`.
