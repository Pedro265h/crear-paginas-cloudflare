# Walkthrough 02 · Crear la cuenta de Cloudflare

> Cloudflare es donde va a vivir la página: la sirve rápido en todo el mundo, guarda los registros y conecta el
> dominio. El plan gratis alcanza de sobra para una página de venta (100.000 visitas al día al Worker, más todas las
> letras y fotos, y una base de datos de 5 GB).

Explícaselo así:

```
Tu página necesita un lugar donde vivir en internet, prendido las 24 horas. Vamos a usar
Cloudflare: una empresa enorme (la usan Shopify, Discord y millones de páginas) con un
plan gratis que te alcanza perfecto. La cuenta es tuya: tu página y tus registros quedan
a tu nombre.
```

## Paso 1 · Crear la cuenta (3 minutos)

Abre la página exacta (tú):

- Mac: `open "https://dash.cloudflare.com/sign-up"`
- Windows: `start https://dash.cloudflare.com/sign-up`
- Linux: `xdg-open "https://dash.cloudflare.com/sign-up"`

Y dile:

```
Te abrí la página para crear tu cuenta de Cloudflare:

1. Escribe tu correo y una contraseña fuerte (guárdala donde guardas tus contraseñas).
2. Toca "Sign up" (Registrarse).
3. Te llega un correo de Cloudflare: abre el link para verificarlo.
4. Si te pregunta qué quieres hacer o te ofrece planes, elige el gratis ("Free") o
   "Omitir/Skip". No hace falta tarjeta.

Cuando estés adentro del panel de Cloudflare, dime "listo".
```

Si ya tiene cuenta: «Perfecto, entra con tu correo en https://dash.cloudflare.com y dime "listo".»

## Paso 2 · (Opcional) El panel en español

```
Si prefieres el panel en español: arriba a la derecha toca tu perfil (el muñequito) →
"Mi perfil" (My Profile) → "Preferencias" (Preferences) → "Idioma" (Language) → Español.
```

En esta skill los botones se nombran en español y, entre paréntesis, en inglés: así los encuentra en cualquier idioma.

## Paso 3 · La dirección gratis de workers.dev

La primera vez que se publica, Cloudflare le crea a la cuenta una dirección gratis (`algo.workers.dev`). Normalmente
lo hace solo al publicar. Si `publicar.mjs` dice que falta («workers.dev subdomain»), pídele:

```
Entra a https://dash.cloudflare.com → en el menú de la izquierda "Workers y Pages"
(Workers & Pages; en algunos paneles está dentro de "Computación" / Compute). La primera
vez te pide un nombre para tu dirección gratis (por ejemplo tu marca): escríbelo y
confirma. Después dime "listo".
```

## Paso 4 · Conectar la compu con la cuenta

Sigue con `03-token-api.md` (el camino recomendado es un clic en el navegador).

## Reglas

1. **No le pidas que pague nada.** Todo cabe en el plan gratis. Si Cloudflare pide tarjeta para activar algo, ver
   `99-problemas.md` (no cobra mientras se quede en el plan gratis).
2. Si tiene **varias cuentas** de Cloudflare (pasa si trabaja con agencias), pregúntale en cuál quiere su página.
3. La cuenta es de la persona: nunca uses una cuenta tuya ni de otra persona.
