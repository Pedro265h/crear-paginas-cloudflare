# Walkthrough 00 · Bienvenida y revisión de la compu

> El primer paso de la skill. Un solo mensaje que explica todo (qué, cómo, cuándo y qué hace la persona) y, apenas
> responda, la revisión de la compu.

## 1. El mensaje de bienvenida (va completo, en UN solo mensaje)

```
¡Hola! Vamos a crear tu página de venta y a dejarla publicada en internet hoy mismo.

QUÉ VAMOS A HACER
Una página de venta con diseño profesional (de las que se ven en lanzamientos grandes),
publicada en internet con tu dominio (o una dirección gratis si todavía no tienes), y
con un formulario que guarda a cada persona que se registra en tu propia base de datos.
También la página de gracias y tus páginas legales (privacidad y términos), que son
obligatorias si recibes datos.

CÓMO LO VAMOS A HACER
Tú me cuentas tu oferta con tus palabras. Yo escribo los textos, armo la página con una
de 5 plantillas de diseño, te la muestro en tu compu para que pidas cambios
("pon el botón rojo", "quita los precios") y, cuando te guste, la subo a TU cuenta de
Cloudflare (una empresa que aloja páginas, con plan gratis). La página es tuya: vive en
tu cuenta, no en la mía.

CUÁNDO
Hoy, en unos 30 minutos (un poco más si hay que instalar algo o conectar tu dominio).

LO ÚNICO QUE VAS A HACER TÚ
1. Crear tu cuenta gratis de Cloudflare (te llevo a la página exacta).
2. Darle permiso a tu compu para publicar ahí: un clic en el navegador
   (o crear un "token", te guío paso a paso).
3. Contarme tu oferta y pasarme tus fotos.

Todo lo demás lo hago yo: instalar lo que falte, escribir, diseñar, publicar y
comprobar que funciona.

Empiezo revisando tu compu. ¿Te parece?
```

Espera el «sí» (o cualquier respuesta que no sea una duda) y sigue.

## 2. Revisar la compu

Corre (tú, no la persona):

```bash
node "<carpeta-de-la-skill>/scripts/preparar.mjs"
```

`<carpeta-de-la-skill>` es donde está este archivo, sin `walkthroughs/` (normalmente `~/.claude/skills/crear-paginas`;
en Windows `%USERPROFILE%\.claude\skills\crear-paginas`).

- **Si dice `node: command not found` o `"node" no se reconoce`**: no hay Node. Ve a `01-instalar.md`.
- La primera vez descarga la herramienta de Cloudflare: tarda 1 o 2 minutos. Avísale: «Estoy descargando la herramienta
  de Cloudflare, tarda un ratito la primera vez.»
- Lee su resultado y dile a la persona lo que encontró, en simple:

```
Esto es lo que encontré en tu compu:

✓ Sistema: Mac (o Windows / Linux)
✓ Node 24: el motor que corre los programas de la página. Listo.
✓ La herramienta de Cloudflare (Wrangler): lista.
✗ Tu compu todavía no está conectada a Cloudflare: lo hacemos en un momento.
```

Según lo que falte:

| falta | walkthrough |
|---|---|
| Node (o es menor que 20) | `01-instalar.md` |
| la herramienta de Cloudflare | `04-cli-wrangler.md` |
| la cuenta o la conexión con Cloudflare | `02-cuenta-cloudflare.md` y después `03-token-api.md` |

## 3. Reglas de este paso

1. **No avances con algo roto.** Si falta Node, se instala primero.
2. **Un paso por mensaje.** Espera su respuesta antes del siguiente.
3. **Reasegura.** «Esto es lo más técnico de todo y solo se hace una vez. Lo demás es contarme tu oferta.»
4. Si la persona ya tiene todo (vuelve por segunda página), salta directo a la entrevista (Fase 2 del SKILL.md).
