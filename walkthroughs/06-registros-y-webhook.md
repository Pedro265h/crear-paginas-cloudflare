# Walkthrough 06 · Tus registros, el webhook y el píxel de Meta

> Cada persona que llena el formulario queda en la base de registros de la persona (Cloudflare D1, en su cuenta).
> Desde ahí: bajarlos a Excel, mandarlos a su CRM (GoHighLevel, Zapier o Make) y medirlos con Meta.

## Ver los registros

```bash
node "<skill>/scripts/registros.mjs" --proyecto "<carpeta-de-la-pagina>"
```

Crea `registros/registros-AAAA-MM-DD.csv` dentro de la carpeta de la página y dice cuántos hay, de dónde vinieron y la
conversión (registros sobre visitas). Ábrele la carpeta (`open`/`start`/`xdg-open`) y dile:

```
Te bajé tus registros a un archivo de Excel: "registros-2026-10-21.csv". Ábrelo con
Excel o súbelo a Google Sheets (Archivo → Importar).
```

- Solo desde una fecha: `--desde 2026-10-01`.
- Si Excel muestra todo en una sola columna (pasa en países que usan «;»): `--punto-y-coma`.
- También se ven en `https://dash.cloudflare.com` → «Almacenamiento y bases de datos» (Storage & Databases) → D1 →
  `<nombre>-registros` → «Consola» (Console): `SELECT * FROM registros ORDER BY id DESC LIMIT 50`.

## Mandar cada registro a GoHighLevel, Zapier o Make (webhook)

Explícaselo así:

```
Un webhook es un aviso automático: cada vez que alguien se registra en tu página, tu
página le avisa a tu otra herramienta (tu CRM, tu correo, una hoja de cálculo) con sus
datos. Así no tienes que bajar el Excel: llegan solos.
```

### 1. Conseguir el link del webhook

- **GoHighLevel:** Automatización (Automation) → Flujos de trabajo (Workflows) → Crear flujo → «Agregar disparador»
  (Add New Trigger) → **Inbound Webhook** → copiar la URL que muestra. Guarda el flujo.
- **Zapier:** Crear Zap → disparador **Webhooks by Zapier** → evento **Catch Hook** → Continuar → copiar la URL.
- **Make:** Crear escenario → módulo **Webhooks** → **Custom webhook** → Agregar → copiar la dirección.

### 2. Guardarlo en la página

El link de un webhook es medio secreto (quien lo tenga puede mandar datos ahí): se guarda en Cloudflare, no en el plan.
La página tiene que estar publicada antes.

```bash
node "<skill>/scripts/secreto.mjs" WEBHOOK_URL --valor "https://..." --proyecto "<carpeta-de-la-pagina>"
```

(O, si lo copió: `--portapapeles`.) El script lo guarda y **manda un registro de ejemplo** a ese link, para que
GoHighLevel, Zapier o Make vean los campos y la persona los pueda asignar. Dile:

```
Te mandé un registro de ejemplo a tu webhook ("Registro de ejemplo (puedes borrarlo)").
En tu herramienta debería aparecer ahora: úsalo para elegir dónde va cada dato (nombre,
correo, WhatsApp). Desde ahora, cada registro real llega solo.
```

Los campos que llegan: `nombre`, `correo`, `whatsapp`, `telefono`, `ciudad`, `empresa` (los que pida el formulario),
`pagina`, `url`, `fecha` y las etiquetas de campaña (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `fbclid`…).

Para quitarlo: `secreto.mjs WEBHOOK_URL --borrar`. Para ver cuáles hay: `secreto.mjs --lista`.

## El píxel de Meta

1. Pídele el id del píxel: Administrador de eventos de Meta (Events Manager) → «Orígenes de datos» (Data sources) → su
   píxel → el número de «Identificador» (Pixel ID), solo números.
2. Ponlo en `plan.json` → `"pixel": { "meta": "1234567890" }` y vuelve a publicar (`publicar.mjs`).

La página manda solo: `PageView` al entrar, `Lead` al registrarse (con un id único para no contarlo dos veces),
`InitiateCheckout` al tocar un botón de pago, `Contact` al tocar WhatsApp y `Schedule` al tocar la agenda. Las
etiquetas de campaña del anuncio (UTM y `fbclid`) viajan con cada registro y con los links de pago (en Hotmart, como
`sck`).

### (Opcional) La API de conversiones (mide mejor, sobre todo en iPhone)

1. En el Administrador de eventos → su píxel → «Configuración» (Settings) → «API de conversiones» → «Generar token de
   acceso» (Generate access token). Que toque «Copiar» y te diga «copiado» (no lo pegue en el chat).
2. Tú:

```bash
node "<skill>/scripts/secreto.mjs" META_CAPI_TOKEN --portapapeles --proyecto "<carpeta-de-la-pagina>"
```

Desde ahí cada `Lead` también sale desde el servidor, con el mismo id del píxel (Meta lo cuenta una sola vez). Necesita
que `pixel.meta` esté puesto y publicado.

## Volver a pedir cambios y republicar

Cuando quiera: «cambia el precio», «agrega una pregunta». Editas `plan.json`, muestras la vista
(`vista.mjs`) y, con su visto bueno, `publicar.mjs`. La página publicada se actualiza en menos de un minuto; los
registros, el webhook y el dominio no se tocan.
