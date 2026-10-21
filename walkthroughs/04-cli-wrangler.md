# Walkthrough 04 · La herramienta de Cloudflare (Wrangler)

> Wrangler es la herramienta oficial de Cloudflare para publicar desde la compu. La skill la usa con `npx` (viene con
> Node): no hace falta instalarla aparte y siempre corre una versión 4 al día.

Explícaselo así:

```
Para subir tu página a Cloudflare uso su herramienta oficial, que se llama Wrangler.
No tienes que instalar nada más: la descargo yo la primera vez (tarda un par de minutos)
y después queda lista.
```

## Comprobar que funciona

```bash
npx --yes wrangler@4 --version
```

Tiene que responder un número (`4.x.x`). `preparar.mjs` hace esto mismo.

- **Tarda mucho la primera vez:** es normal (descarga unos 100 MB). Si pasa de 5 minutos, revisa la conexión.
- **Windows dice que los scripts están deshabilitados:** usa `npx.cmd --yes wrangler@4 --version` o, una sola vez,
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (que diga «S»).
- **`EACCES` o «permiso denegado»:** no uses `sudo`. Borra la caché de npx (`npm cache clean --force`) y vuelve a
  intentar.
- **Detrás de una red de empresa (proxy):** pide que lo intente desde otra red (por ejemplo, compartiendo internet
  del celular).

## (Opcional) Instalarla para siempre

Solo si la persona lo pide o `npx` falla repetidamente:

```bash
npm install -g wrangler
wrangler --version
```

Los scripts igual usan `npx --yes wrangler@4`.

## Los comandos que usan los scripts (para que sepas qué pasa)

| comando | qué hace | lo corre |
|---|---|---|
| `wrangler login` | conecta la compu con la cuenta (un clic en el navegador) | tú, en el walkthrough 03 |
| `wrangler whoami` | dice con qué cuenta está conectada | `preparar.mjs`, `publicar.mjs` |
| `wrangler d1 create / list / execute` | crea la base de registros, le pone sus tablas y la consulta | `publicar.mjs`, `registros.mjs` |
| `wrangler deploy` | sube la página (y conecta el dominio) | `publicar.mjs` |
| `wrangler secret put` | guarda el webhook o el token de Meta como secreto | `secreto.mjs` |
| `wrangler dev --local` | prueba el sitio completo en la compu (formulario incluido) | tú, si quieres probar el formulario antes de publicar |
| `wrangler tail` | muestra en vivo lo que pasa en la página publicada (para buscar un error) | tú, en `99-problemas.md` |

Todos se corren **dentro de la carpeta de la página** (donde está `wrangler.jsonc`).

## Probar el formulario en la compu, antes de publicar (opcional)

```bash
cd <carpeta-de-la-pagina>
node "<skill>/scripts/armar.mjs"
npx --yes wrangler@4 d1 execute <nombre>-registros --local --file schema.sql
npx --yes wrangler@4 dev --local
```

Abre `http://localhost:8787`, llena el formulario y mira que llegue a `/gracias`. Los registros de prueba se ven con
`node "<skill>/scripts/registros.mjs" --local`. Corta el servidor con Ctrl+C.
