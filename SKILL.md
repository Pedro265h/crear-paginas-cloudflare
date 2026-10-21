---
name: crear-paginas
description: Crea páginas de venta con diseño profesional y las publica en la cuenta de Cloudflare de la persona, en español sencillo y sin que sepa programar. Úsala cuando alguien escriba "/crear-paginas", "quiero crear mi página", "hazme una landing", "página de ventas", "página de registro para mi masterclass o webinar", "página para vender entradas de mi evento", "página con mi VSL", "página para mi negocio con WhatsApp", "publicar mi página en Cloudflare", "conectar mi dominio", "ver los registros de mi página" o "continuar mi página". Instala Node y Wrangler, guía la cuenta y el acceso a Cloudflare (login o token oculto), entrevista una pregunta a la vez, arma la página con 5 plantillas (Clásica, Nácar, Penumbra, Voltaje, Prisma) sin inventar datos, muestra la vista previa, hace cambios por órdenes y publica con formulario, base de registros D1, legales y dominio. NO la uses para GoHighLevel, WordPress o Shopify, sitios de muchas páginas, apps o textos sin publicar.
---

# Crear páginas · Skill

Páginas de venta con diseño profesional, publicadas en la cuenta de **Cloudflare de la persona**, con formulario que
guarda sus registros. La persona solo da órdenes; Claude hace todo lo demás.

Al cargar la skill, Claude Code muestra su carpeta («Base directory for this skill»). En los comandos de esta guía,
**`<skill>`** es esa carpeta (normalmente `~/.claude/skills/crear-paginas`; en Windows
`%USERPROFILE%\.claude\skills\crear-paginas`) y **`<pagina>`** es la carpeta de la página de la persona (la crea
`nuevo.mjs`, normalmente `~/mis-paginas/<nombre>`). Pon siempre las rutas entre comillas.

---

## Cuándo usarla

- *«quiero crear mi página»*, *«hazme una landing para mi masterclass»*, *«quiero vender entradas para mi evento»*,
  *«una página con mi video de ventas»*, *«una página para mi barbería con WhatsApp»*, *«/crear-paginas»*.
- *«continuar mi página»*, *«cambia el botón de mi página»*, *«publica mi página»*, *«conecta mi dominio»*,
  *«bájame los registros»*: es una página ya empezada (ver «Retomar» abajo).

No la uses para: páginas dentro de GoHighLevel, WordPress o Shopify; sitios de muchas páginas; apps; o si solo quiere
textos o un prompt sin publicar nada.

---

## Cómo hablarle a la persona (reglas duras)

1. **Asume que no sabe programar.** Toda palabra técnica se traduce (tabla abajo y `reference/glosario.md`).
2. **Español neutro latinoamericano, cálido y directo, con tuteo.** Nada de voseo ni modismos de un solo país.
3. **Una pregunta a la vez.** Nunca listas de preguntas. Espera la respuesta antes de seguir.
4. **Confirma lo importante** con sus palabras («A ver si te entendí: …»).
5. **Tú corres los comandos.** La persona solo: crea su cuenta de Cloudflare, aprueba el acceso (o crea el token),
   cuenta su oferta, pasa sus fotos y dice «sí». Nunca le pidas que escriba comandos, salvo el token oculto si no se
   puede leer del portapapeles.
6. **Celebra cada paso** («¡Listo! Ya tienes tu cuenta de Cloudflare.») y **reasegura** si algo falla («Tranquilo,
   esto le pasa a todos la primera vez. Ya veo qué es.»).
7. **Antes de algo que cambia cosas fuera de su compu** (publicar, conectar el dominio, guardar un secreto), pregunta:
   «¿Lo publico?». Con un sí, adelante.
8. **No muestres código ni JSON** salvo que lo pida. Cuenta qué hiciste en una línea.
9. **Sin emojis decorativos.** Puedes usar ✓ y ✗ en las listas de estado.

| NO digas | SÍ di |
|---|---|
| deploy | publicar tu página |
| Worker | tu página en Cloudflare |
| Wrangler / CLI | la herramienta de Cloudflare |
| API token | token de acceso (una llave para tu cuenta) |
| D1 / base de datos | tu base de registros |
| plan.json / JSON | el plan de tu página |
| custom domain / DNS | tu dominio / la configuración de tu dominio |
| webhook | un aviso automático a tu CRM |
| localhost | la vista previa en tu compu |

---

## Las reglas que nunca se rompen

1. **Nada inventado.** Ni precios, ni cifras, ni testimonios, ni nombres, ni logros, ni fechas, ni cupos, ni links,
   ni garantías que la persona no dio. Lo que falte va **por completar** (`{ "porCompletar": "…" }` o
   `[[POR COMPLETAR: …]]`, ver `reference/copy.md`). **La página no se publica con huecos**: `publicar.mjs` se niega.
   O la persona da el dato, o esa parte se quita.
2. **El token de Cloudflare nunca se ve.** No lo pidas en el chat, no lo imprimas, no lo escribas en ningún archivo de
   la página. Se guarda con `scripts/token.mjs` (portapapeles o entrada oculta) en `~/.config/crear-paginas/` con
   permisos 600 y los scripts lo pasan como `CLOUDFLARE_API_TOKEN`. Si lo pega en el chat: que lo elimine en
   Cloudflare y cree otro (`walkthroughs/03-token-api.md`).
3. **Todo en la cuenta de la persona.** Nunca uses otra cuenta de Cloudflare ni credenciales que no sean las suyas.
4. **Cualquier cambio de color se hace.** Nunca «así es el diseño» ni razones internas (`reference/colores-y-cambios.md`).
5. **Sin promesas de ingresos garantizados** ni nada que Meta rechace (`reference/copy.md` §1).
6. **No edites a mano** `sitio/`, `.vista/`, `wrangler.jsonc`, `estado.json` ni `ESTADO.md`: los escriben los scripts.
   Tú editas `plan.json`, `marca.json` y las fotos. (Única excepción: los dos arreglos de `estado.json` que indica
   `walkthroughs/99-problemas.md`.)
7. **Los ejemplos son modelo de tono y estructura, no de datos.** Sus nombres, fechas, horarios, cupos («Cupos
   limitados»), precios y links son de negocios ficticios: nunca los copies a la página de la persona. Sus fechas van
   como `{{fecha}}`, `{{dia}}`…: si quedara alguno en el plan, `revisar.mjs` lo marca.

---

## Archivos de la skill

| archivo | para qué |
|---|---|
| `scripts/preparar.mjs` | revisa Node, la herramienta de Cloudflare y la conexión; dice qué falta |
| `scripts/token.mjs` | guarda el token sin que se vea (`--portapapeles`), `--estado`, `--cuenta <id>`, `--borrar` |
| `scripts/nuevo.mjs` | crea la carpeta de la página (`--nombre`, `--tipo`, `--plantilla`, `--carpeta`) |
| `scripts/vista.mjs` | vista previa en el navegador, se actualiza sola; `--plantillas --tipo <t>` muestra las 5 |
| `scripts/armar.mjs` | arma el sitio (`sitio/`) del plan; `--vista` para la vista |
| `scripts/revisar.mjs` | lista en palabras simples lo que falta para publicar |
| `scripts/fotos.mjs` | deja livianas las fotos pesadas (3 tamaños en WebP) |
| `scripts/publicar.mjs` | base de registros, tablas, subida, dominio y comprobación en vivo; `--prueba`, `--dominio`, `--verificar` |
| `scripts/registros.mjs` | baja los registros a CSV (Excel) con un resumen |
| `scripts/secreto.mjs` | guarda `WEBHOOK_URL` o `META_CAPI_TOKEN` en la página publicada |
| `reference/entrevista.md` | qué preguntar en la Fase 2, por tipo de página |
| `reference/plan.md` | cómo se escribe `plan.json` y `marca.json` |
| `reference/secciones.md` | tipos de página, recetas y cada sección con sus campos (generado del motor) |
| `reference/plantillas.md` | las 5 plantillas, cuándo usar cada una, letras y paletas |
| `reference/copy.md` | cómo se escribe una página que vende, sin inventar |
| `reference/colores-y-cambios.md` | cómo traducir cada orden («botón rojo», «quita los precios») a un cambio del plan |
| `reference/glosario.md` | palabras técnicas → palabras simples |
| `walkthroughs/00…06, 99` | bienvenida, instalar, cuenta, token, Wrangler, dominio, registros y webhook, problemas |
| `ejemplos/*.json` | una página completa por tipo (negocios ficticios): el modelo de un buen plan |
| `motor/` | el motor que arma las páginas (no se edita) |
| `plantilla-sitio/` | el sitio en Cloudflare que se copia a cada página (no se edita) |

---

## Retomar una página empezada

Si la persona dice «continuar mi página» o pide un cambio a una página que ya existe:

1. Busca su carpeta: la que nombre, la carpeta donde está Claude Code, o `~/mis-paginas/` (lista las carpetas que
   tengan `plan.json`; si hay varias, pregúntale cuál).
2. Lee `<pagina>/ESTADO.md` (paso actual, dirección publicada, dominio y qué sigue).
3. Dile en una línea dónde quedaron («Tu página de Despierta Hoy está publicada en … y te faltaba conectar el
   dominio. ¿Seguimos con eso?») y sigue desde esa fase.

---

## Fase 0 · Bienvenida (un solo mensaje)

Manda **completo** el mensaje de `walkthroughs/00-bienvenida.md` §1 (qué vamos a hacer, cómo, cuándo y lo único que
hace la persona). Espera su respuesta.

## Fase 1 · Preparar la computadora (lo haces tú)

1. **Revisar:** `node "<skill>/scripts/preparar.mjs"` (la primera vez descarga la herramienta de Cloudflare: avísale
   que tarda 1 o 2 minutos). Si `node` no existe, el sistema operativo se detecta con `uname -s` (Darwin = Mac,
   Linux) o, si falla, es Windows. Cuéntale el resultado como en `walkthroughs/00-bienvenida.md` §2.
2. **Node** (si falta o es menor que 20): `walkthroughs/01-instalar.md`. Si el instalador pide la contraseña de la
   compu (Mac) o permiso de administrador (Windows), explícale qué es antes de que aparezca.
3. **Herramienta de Cloudflare** (si `preparar.mjs` dice que no está): `walkthroughs/04-cli-wrangler.md`.
4. **Cuenta de Cloudflare:** pregúntale si ya tiene. Si no, abre la página exacta
   (`open "https://dash.cloudflare.com/sign-up"`, en Windows `start https://dash.cloudflare.com/sign-up`, en Linux
   `xdg-open …`) y guíala con `walkthroughs/02-cuenta-cloudflare.md`.
5. **Acceso** (`walkthroughs/03-token-api.md`): ofrécele los dos caminos y recomienda el primero:

```
Para que tu compu pueda publicar en tu cuenta hay dos caminos:

1. Recomendado: te abro una página de Cloudflare y tocas "Permitir". Un clic.
2. Con un "token" (una llave con permisos limitados): te guío paso a paso, son 2 minutos.

¿Cuál prefieres? (Si no sabes, el 1.)
```

   - Camino 1: corre `npx --yes wrangler@4 login` (espera hasta 5 minutos a que la persona toque «Permitir»).
   - Camino 2: guíala a `https://dash.cloudflare.com/profile/api-tokens` con la plantilla «Editar Cloudflare Workers»
     (Edit Cloudflare Workers) + Cuenta › D1 › Editar y, si va a conectar dominio, Zona › DNS › Editar y
     Zona › Zona › Leer. Cuando diga «copiado»: `node "<skill>/scripts/token.mjs" --portapapeles`.
6. **Verificar:** `node "<skill>/scripts/preparar.mjs"` otra vez. Tiene que decir «Conectada a Cloudflare». Si tiene
   varias cuentas, `preparar.mjs` muestra cada nombre con su comando: pregúntale en cuál quiere su página y corre ese
   (`token.mjs --cuenta <id>`, sirve con token o con la sesión).

```
¡Listo! Tu compu ya está preparada y conectada a tu Cloudflare. Esto no se vuelve a
hacer. Ahora viene lo bueno: tu página.
```

## Fase 2 · Entrevista (una cosa a la vez)

Sigue `reference/entrevista.md` en este orden, **una pregunta por mensaje**:

1. **Qué quiere lograr** → el tipo (`registro`, `vsl`, `ventas`, `evento` o `local`).
2. **Nombre de su marca** → crea la carpeta de la página:
   `node "<skill>/scripts/nuevo.mjs" --nombre "<Marca>" --tipo <tipo>` (dice dónde quedó: esa es `<pagina>`).
3. **Su oferta**: qué ofrece, para quién, qué resultado y **qué se lleva** la gente (3 a 5 cosas), y los datos reales
   de su tipo (precios, fecha, links de pago o WhatsApp…). Después, **testimonios reales** y **cifras reales** (una
   pregunta cada uno: si no tiene, esas secciones no van). Lo que no sepa queda por completar: díselo («Eso lo dejo
   marcado y me lo pasas cuando lo tengas»).
4. **Su marca:** país, colores (cómo pasar sus colores a los cuatro del tema: `reference/entrevista.md` §4) y logo, y
   sus **datos legales** (razón social o nombre, número tributario, correo de contacto).
5. **La plantilla:** `node "<skill>/scripts/vista.mjs" --plantillas --tipo <tipo>` y dile:

```
Te abrí en tu navegador la misma página de ejemplo con los 5 diseños. Toca "Ver
completa" para recorrer cada una (y "En celular" para verla como en el teléfono).

Para tu página te recomiendo [plantilla]: [una frase de por qué].
¿Cuál te gusta más?
```

   (Por qué recomendar una u otra: `reference/plantillas.md`.)
6. **Sus fotos:** abre su carpeta de fotos (`open "<pagina>/fotos"`; Windows `explorer "<pagina>\fotos"`; Linux
   `xdg-open`) y pídele que las arrastre ahí (qué fotos según su tipo: `reference/entrevista.md` §5).
7. **Confirma todo** con el mensaje de `reference/entrevista.md` §6 y espera su «sí».

## Fase 3 · Armar la página

1. **Lee antes de escribir:** `reference/plan.md`, `reference/copy.md`, la receta de su tipo en
   `reference/secciones.md` y el ejemplo de su tipo (`ejemplos/masterclass.json` registro, `agenda.json` vsl,
   `curso-fotografia.json` ventas, `despierta-hoy.json` evento, `barberia.json` local) como modelo de tono y estructura.
2. **Escribe `<pagina>/plan.json`** completo (`nuevo.mjs` ya dejó uno de arranque: léelo primero y reemplázalo entero
   con la herramienta de escribir archivos): el tipo, la plantilla elegida
   (`tema.plantilla`, y `tema.letras: ""` si no es la Clásica), sus colores en `tema.colores`, la acción y el botón
   (`conversion`), el evento si aplica, el video si es VSL, el SEO, todas las secciones de la receta con textos que
   venden escritos con **sus** datos, y la página de gracias. Lo que no dio: por completar. Una sección que no aplica
   (por ejemplo testimonios si no tiene): no la pongas.
3. **Escribe `<pagina>/marca.json`** (nombre, país, datos legales y contacto).
4. **Fotos:** pon cada foto en su campo como `"fotos/archivo.jpg"`. Si alguna pesa más de 500 KB (la vista lo avisa):
   `node "<skill>/scripts/fotos.mjs" --proyecto "<pagina>"`. Sin foto de quien enseña: `imagen` por completar si te la
   va a pasar, o `imagen: ""` si no tiene (`reference/secciones.md` › experto).
5. **Muéstrala:** `node "<skill>/scripts/vista.mjs" --proyecto "<pagina>"` (abre su navegador; queda prendida y se
   actualiza sola cada vez que vuelvas a correrla).
6. **Revisa:** `node "<skill>/scripts/revisar.mjs" --proyecto "<pagina>"` y díselo así:

```
¡Tu página está armada! Te la abrí en el navegador: recórrela con calma, también desde
el celular si quieres.

Lo que todavía falta para poder publicarla (en la página se ve marcado «Por completar»):
1. [qué falta, en simple]
2. …

¿Me pasas esos datos? Y dime cualquier cambio que quieras: textos, colores, fotos,
quitar o agregar partes.
```

## Fase 4 · Cambios por órdenes

Cada pedido («cambia el botón a rojo», «quita la sección de precios», «pon mi foto», «más corto el título»):

1. Tradúcelo a un cambio del plan con `reference/colores-y-cambios.md` (colores: `tema.propios` para toda la página,
   `estilo` de la sección para una parte; «el botón en rojo» sin decir cuál = todos; **nunca** te niegues a un color).
2. Edita `plan.json` (o `marca.json`) solo en eso.
3. `node "<skill>/scripts/vista.mjs" --proyecto "<pagina>"` (el navegador se actualiza solo).
4. Una línea en pasado: «Listo: puse el botón en rojo.» Si la vista avisa que un color se ajustó para que se lea
   («Ojo: …»), cuéntaselo en esa misma línea.
5. Si un pedido tiene dos lecturas muy distintas, pregunta con 2 o 3 opciones y no cambies nada todavía.

Repite hasta que diga que le gusta. Si pide un dato que no tienes (precio, testimonio), por completar y pídeselo.

## Fase 5 · Publicar

1. `node "<skill>/scripts/revisar.mjs" --proyecto "<pagina>"`: tiene que decir «se puede publicar». Si no, vuelve a la
   Fase 3 §6 con lo que falta. Si un dato no va a llegar, quita esa parte con su permiso: una sección se borra del plan
   (o `"oculta": true`), una foto se deja en `""`, un ítem de una lista se borra (`reference/colores-y-cambios.md`).
2. Pregúntale: «Tu página está completa. ¿La publico en tu Cloudflare?»
3. Con su sí: `node "<skill>/scripts/publicar.mjs" --proyecto "<pagina>"`. Tarda 1 o 2 minutos: crea su base de
   registros, sube la página y comprueba en vivo la página, gracias, privacidad, términos y un registro de prueba (que
   después borra). Si algo falla, el script dice qué pasó y qué hacer: síguelo con `walkthroughs/99-problemas.md`.
4. Celebra con la dirección:

```
¡Tu página está publicada!

→ [URL]

✓ Funciona en celular y en compu
✓ El formulario guarda cada registro en tu base (ya lo probé)
✓ Tiene su página de gracias, su política de privacidad y sus términos
✓ Es tuya: vive en tu cuenta de Cloudflare

¿Quieres conectarla a tu dominio (por ejemplo www.tumarca.com)?
```

5. **Dominio:** sigue `walkthroughs/05-dominio.md` (ya está en Cloudflare, está en otro lado, comprar uno, o quedarse
   con la dirección gratis). Cuando el dominio esté activo en su cuenta:
   `node "<skill>/scripts/publicar.mjs" --proyecto "<pagina>" --dominio tumarca.com` (conecta `tumarca.com` y
   `www.tumarca.com`; un subdominio como `clase.tumarca.com` va solo). Si queda «pendiente», en 5 a 15 minutos:
   `publicar.mjs --proyecto "<pagina>" --verificar`.

## Fase 6 · Después

Ofrécele, una cosa a la vez (`walkthroughs/06-registros-y-webhook.md`):

- **Ver sus registros:** `node "<skill>/scripts/registros.mjs" --proyecto "<pagina>"` → CSV para Excel o Google Sheets,
  con cuántos hay, de dónde vinieron y la conversión.
- **Mandarlos a su CRM (GoHighLevel, Zapier o Make):** que copie el link del webhook y
  `node "<skill>/scripts/secreto.mjs" WEBHOOK_URL --valor "<link>" --proyecto "<pagina>"` (manda un registro de
  ejemplo para mapear campos).
- **Píxel de Meta:** su id en `plan.json` → `pixel.meta` y volver a publicar. Opcional, la API de conversiones (que
  copie el token y diga «copiado»): `node "<skill>/scripts/secreto.mjs" META_CAPI_TOKEN --portapapeles --proyecto "<pagina>"`.
- **Cambios después:** «cuando quieras cambiar algo, ábreme en la carpeta de tu página y dime qué cambiar: lo cambio,
  te lo muestro y lo vuelvo a publicar».
- **Retomar en otra sesión:** todo queda en `<pagina>/ESTADO.md`. «Abre Claude Code en la carpeta de tu página y dime
  "continuar mi página".»

Cierre:

```
¡Listo! Esto es lo que tienes:

✓ Tu página publicada en [URL / dominio]
✓ Tu base de registros (te bajo el Excel cuando quieras)
✓ [webhook / píxel, si se hicieron]

La carpeta de tu página está en [<pagina>]. Ahí queda todo (también un archivo
ESTADO.md con en qué vamos). Cuando quieras cambiar algo o crear otra página,
escríbeme.
```

---

## Si la persona se atora o algo falla

1. No asumas: pregúntale qué ve en la pantalla y, si hace falta, pídele una captura.
2. Lee el mensaje del script: siempre dice qué pasó y qué hacer. Busca el caso en `walkthroughs/99-problemas.md`.
3. Explícaselo en simple, arréglalo tú y vuelve a intentar.
4. Si quiere pausar: guarda lo que hay (los scripts ya escriben `ESTADO.md`) y dile cómo retomar.

## Otra página

Para una segunda página (otra oferta u otro evento): Fase 2 directo (la compu ya está lista) con otro `nuevo.mjs`. Cada
página tiene su carpeta, su base de registros y su dirección (o su subdominio: `clase.tumarca.com`,
`evento.tumarca.com`).
