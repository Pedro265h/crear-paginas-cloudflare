# Walkthrough 99 · Problemas comunes y cómo se arreglan

> Cuando algo falla: lee el mensaje del script (dice qué pasó y qué hacer), busca aquí el caso y explícaselo a la
> persona en simple. Nunca la dejes con un error sin resolver.

Frase base: «Tranquilo, esto le pasa a casi todos la primera vez. Ya veo qué es y lo arreglamos.»

## La compu

| síntoma | causa | arreglo |
|---|---|---|
| `node: command not found` / `"node" no se reconoce` | falta Node, o la ventana es de antes de instalarlo | `01-instalar.md`; en Windows, cerrar y abrir Claude Code |
| Node 18 o menos | versión vieja | instalar la LTS (`01-instalar.md`) |
| PowerShell: «la ejecución de scripts está deshabilitada» | política de Windows | usar `npx.cmd`, o `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `EACCES` / permiso denegado con npm | caché de npm con permisos raros | `npm cache clean --force`; nunca `sudo npx` |
| la vista previa no abre | el navegador no se abrió solo | darle la dirección `http://127.0.0.1:4321` para que la pegue; `vista.mjs --parar` y volver a correrla |
| «Hay archivos que no armé yo» al armar | `--salida` apunta a una carpeta con cosas | usar otra carpeta (o la de siempre: `sitio/`) |

## La conexión con Cloudflare

| síntoma | causa | arreglo |
|---|---|---|
| «Tu compu no está conectada» / `not authenticated` | no hizo login o el token no está | `03-token-api.md` |
| `npx wrangler login` no abre el navegador | sin navegador por defecto o en otra compu | copiar el link `https://dash.cloudflare.com/oauth2/auth…` que imprimió y abrirlo a mano |
| `Authentication error [code: 10000]`, `9109`, «permission» | al token le falta un permiso | token nuevo con la plantilla «Editar Cloudflare Workers» + Cuenta › D1 › Editar + Zona › DNS › Editar + Zona › Zona › Leer (`03-token-api.md`) |
| «More than one account available» | su usuario tiene varias cuentas | `token.mjs --cuenta <id>` con la que elija |
| «You need to register a workers.dev subdomain» o un link a `…/workers/onboarding` | la cuenta no tiene dirección gratis | abrir ese link (o Workers y Pages) y elegir un nombre (`02-cuenta-cloudflare.md`, paso 3) |
| «payment method» / pide tarjeta | algunos servicios piden un medio de pago aunque no cobren | agregarla en Facturación (Billing); el plan gratis no cobra |

## La base de registros (D1)

| síntoma | causa | arreglo |
|---|---|---|
| «No pude crear la base» | sin permiso de D1 o llegó al máximo de bases del plan gratis | permiso D1 en el token; borrar bases que no use (D1 en el panel) |
| «no such table: registros» | no se aplicaron las tablas | volver a correr `publicar.mjs` (aplica `schema.sql`, no borra nada) |
| el formulario dice «La página todavía no tiene su base de registros» | `wrangler.jsonc` sin la base | `publicar.mjs` la crea y la conecta |
| la prueba del formulario falla al publicar | base mal conectada o el id viejo en `estado.json` | borrar `"base"` de `estado.json` y publicar de nuevo (la encuentra por su nombre) |

## El formulario en la página publicada

| síntoma | causa | arreglo |
|---|---|---|
| «Demasiados intentos. Espera unos minutos.» | más de 5 registros desde la misma conexión en 10 minutos (freno contra robots) | esperar; para eventos donde muchos se registran desde el mismo wifi, poner `"limite_registros": 20` en `estado.json` y volver a publicar |
| «Envía el formulario desde la página.» | alguien intentó mandar datos desde otra web, o la página está metida dentro de otra | normal: es una protección |
| el registro no llega al webhook | link mal copiado o el flujo apagado | `secreto.mjs WEBHOOK_URL --valor <link>` (manda un ejemplo); ver en vivo con `npx --yes wrangler@4 tail` en la carpeta de la página |
| no llega a Meta (CAPI) | falta el píxel o el token | `pixel.meta` en el plan y `secreto.mjs META_CAPI_TOKEN` |

## El dominio

| síntoma | causa | arreglo |
|---|---|---|
| «already has externally managed DNS records» / «existing DNS record» | el nombre apunta a otra web | borrar el registro A, AAAA o CNAME de ese nombre en DNS (nunca MX ni TXT) y publicar (`05-dominio.md`) |
| «Could not find zone» | el dominio no está en esa cuenta de Cloudflare | agregarlo (`05-dominio.md`, caso 2) y esperar a que diga Activo |
| el dominio dice «pendiente» o da error de seguridad | el candado (https) se está creando | esperar 5 a 15 minutos y `publicar.mjs --verificar` |
| sigue sin abrir después de horas | los servidores de nombres no se cambiaron en el registrador | revisar que sean los de Cloudflare (`05-dominio.md`, caso 2) |
| se cayó el correo del dominio | se borró un registro MX | volver a crearlo en DNS (el proveedor del correo dice cuál) |

## La página

| síntoma | causa | arreglo |
|---|---|---|
| `publicar.mjs` no publica y lista cosas | quedan huecos «por completar» | completarlos con la persona o quitar esas secciones (`revisar.mjs`) |
| publiqué y sigo viendo lo viejo | caché de un minuto | esperar 1 minuto y recargar |
| una foto no aparece | no está en `fotos/` o el nombre no coincide | `revisar.mjs` la lista; revisar mayúsculas y extensión |
| la página carga lenta en el celular | fotos pesadas | `node "<skill>/scripts/fotos.mjs"` y volver a publicar |
| el botón de WhatsApp no abre | número sin código de país | ponerlo con `+` y código, o el país en `marca.json` |
| el video no se ve | link de una plataforma que no se acepta | YouTube, Vimeo, Loom, Streamable, Panda, Wistia, VTurb o un .mp4 (máx. 25 MB en `fotos/`) |
| la cuenta regresiva no aparece | la fecha del evento ya pasó | actualizar `evento.fecha` |

## Ver qué pasa en la página publicada (para ti)

```bash
cd "<carpeta-de-la-pagina>"
npx --yes wrangler@4 tail
```

Muestra en vivo cada visita y cada error (corta con Ctrl+C). Si no sabes qué es un error, pídele a la persona una
captura de pantalla y lo que estaba haciendo.
