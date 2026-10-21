# El plan de la página (plan.json) y los datos de la marca (marca.json)

La página entera vive en `plan.json`, dentro de la carpeta del proyecto. Claude lo escribe y lo edita; `armar.mjs` lo
convierte en HTML con el motor. El motor normaliza todo al armar: lo que no conoce lo descarta, así que **escribe solo
las claves de esta guía y de [secciones.md](secciones.md)**. Para ver un plan bien escrito, abre cualquiera de
`ejemplos/*.json` (uno por tipo de página).

## Estructura

```jsonc
{
  "v": 1,
  "tipo": "registro",                 // registro | vsl | ventas | evento | local  (secciones.md › Tipos de página)
  "marca": {
    "nombre": "Bolsillo Claro",
    "logo": "fotos/logo.png"          // opcional: va en el pie (y con Prisma, en la barra de arriba)
  },
  "seo": {
    "titulo": "Masterclass gratis: ordena tus finanzas de freelancer",   // pestaña, Google y redes (máx. 70)
    "descripcion": "En 90 minutos armas tu sistema… · Gratis."          // Google y redes (máx. 160)
  },
  "tema": {
    "plantilla": "nacar",             // clasica | nacar | penumbra | voltaje | prisma  (plantillas.md)
    "letras": "",                     // "" = las de la plantilla; o una pareja (plantillas.md › Letras)
    "modo": "claro",                  // claro | oscuro (solo cambia algo en la Clásica)
    "colores": { "fondo": "#f7f5f0", "texto": "#15171c", "primario": "#5b4bff", "acento": "#14b8a6" },  // los de la MARCA
    "propios": { "primario": "#dc2626" },  // opcional: los que la persona pidió para esta página (colores-y-cambios.md)
    "radio": "suave",                 // recto | suave | redondo (solo Clásica)
    "estilo": ""                      // impacto | editorial | limpio (solo Clásica; "" = el de la pareja de letras)
  },
  "conversion": {
    "accion": "formulario",           // formulario | checkout | whatsapp | agenda
    "boton": "Reservar mi cupo gratis",   // texto de TODOS los botones (máx. 32), salvo los que tengan el suyo
    "url": "",                        // checkout o agenda: el link de pago o de la agenda (https://…)
    "whatsapp": "+573001234567",      // whatsapp: con código de país (si falta, se pone con el país de marca.json)
    "mensaje": "Hola, vi tu página y quiero información",   // whatsapp: el mensaje que llega escrito
    "campos": ["nombre", "correo", "whatsapp"]              // formulario: los campos (secciones.md › Campos del formulario)
  },
  "evento": {                         // registro, evento o con cuenta regresiva
    "nombre": "Masterclass · Ordena tus finanzas",
    "fecha": "2026-11-12T19:00",      // AAAA-MM-DDTHH:MM, hora local del evento
    "zona": "America/Bogota",         // zona horaria (America/Mexico_City, America/Lima, Europe/Madrid…)
    "duracionMin": 90,
    "modalidad": "online",            // online | presencial
    "lugar": ""                       // presencial: el lugar ("Hotel Sheraton, Bogotá")
  },
  "video": { "url": "https://youtu.be/…", "ctaSegundos": 0 },  // VSL: el video de la portada y a los cuántos segundos aparece el botón
  "pixel": { "meta": "" },            // id del píxel de Meta (solo números). Vacío = sin píxel
  "secciones": [ … ],                 // la página principal, en orden (el pie siempre al final)
  "gracias": { "secciones": [ … ] }   // la página de gracias (normalmente: gracias + pie)
}
```

## Cada sección

```json
{ "id": "mc-hero", "tipo": "hero", "variante": "evento", "campos": { "titulo": "…", "resaltado": "…" } }
```

- `id`: corto y único (letras, números y guiones), por ejemplo `mc-hero`, `faq-1`. Sirve para encontrarla al hacer cambios.
- `tipo` y `variante`: los de [secciones.md](secciones.md). Si la variante no existe, se usa la primera.
- `campos`: solo las claves de esa sección. Las listas son arreglos de objetos (`"items": [{ "titulo": "…", "texto": "…" }]`).
- `"oculta": true` la esconde sin borrarla (sirve para «quita esa sección por ahora»).
- `"estilo": { "fondo": "#…", "texto": "#…", "titulo": "#…", "primario": "#…", "acento": "#…" }`: colores solo de esa
  sección (colores-y-cambios.md).
- `resaltado` tiene que aparecer **tal cual** dentro del `titulo` (va en el color de acento).
- En los textos: `**negrita**`, `*resaltado*` y saltos de línea con `\n`.
- En el título de la sección `gracias`, `{nombre}` pegado a la palabra anterior pone el nombre de la persona:
  `"¡Listo{nombre}! Tu cupo está confirmado"` → «¡Listo, Laura! Tu cupo está confirmado».

## Lo que falta: «por completar»

Nunca se inventa un dato. Si la sección lo necesita y la persona no lo dio:

- un campo entero: `"precio": { "porCompletar": "tu precio" }`
- dentro de un texto: `"subtitulo": "Ya lo usan [[POR COMPLETAR: cuántas personas]] freelancers"`

En la vista previa se ve como una etiqueta «Por completar: …»; `revisar.mjs` lo lista y `publicar.mjs` no publica
mientras quede alguno. Ver [copy.md](copy.md).

## Fotos y videos de la persona

Van en la carpeta `fotos/` del proyecto. En el plan se nombran con su ruta:

- foto: `"imagen": "fotos/retrato.jpg"` (también sirve en `marca.logo`, `testimonios[].imagen`, `galeria[].imagen`…)
- video propio (máx. 25 MB): `"video": { "url": "fotos/demo.mp4" }`. Si al lado hay `demo.jpg` o `demo.webp`, va de portada.
  Para videos largos (una VSL), mejor un link de YouTube, Vimeo, VTurb, Panda o Wistia.
- ícono de la pestaña: un archivo `fotos/favicon.png` (o .svg / .ico).

Fotos pesadas (de celular): corre `node "<skill>/scripts/fotos.mjs" --proyecto "<pagina>"` y el motor usa solo los tamaños
livianos (480, 960 y 1600 px).
Las de los ejemplos van como `{ "ref": "barberia-hero" }`, que es lo mismo con otra forma de escribirlo.

## marca.json (los datos de las páginas legales)

```json
{
  "nombre": "Bolsillo Claro",
  "pais": "Colombia",
  "legal": { "razon_social": "Bolsillo Claro SAS (o tu nombre completo)", "documento": "900123456-7" },
  "contacto": { "correo": "hola@ejemplo.com", "whatsapp": "+573001234567" }
}
```

- `pais` elige la ley de datos de la política de privacidad (Colombia, México, España, Perú, Chile, Argentina y
  Ecuador tienen la suya; otro país va con un texto general) y completa el código del WhatsApp.
- `razon_social`, `documento` y `correo` son obligatorios para publicar (van en privacidad y términos).
- `documento`: el número tributario del país (NIT o cédula en Colombia, RFC en México, RUC en Perú y Ecuador, RUT en
  Chile, CUIT en Argentina, NIF o CIF en España).
- Las legales son una plantilla general: dile a la persona que las revise con un abogado si su negocio lo necesita.

## Claves que pone el motor solo

Al crear la página, `nuevo.mjs` deja también `estrategia` (notas internas: avatar, promesa y ángulo; no se ven en la
página) y `conversion.webhook` (no se usa: el webhook se guarda como secreto con `secreto.mjs`). Puedes dejarlas así.

## estado.json y ESTADO.md

Los escriben los scripts: nombre en Cloudflare, base de registros, dirección publicada, dominios, fase y el siguiente
paso. Al empezar una sesión nueva, léelos para retomar. Solo se tocan a mano en dos casos de `walkthroughs/99-problemas.md`
(borrar `"base"` si la base quedó mal conectada, o poner `"limite_registros"`).
