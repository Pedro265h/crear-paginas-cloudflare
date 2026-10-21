# Walkthrough 03 · Darle permiso a la compu para publicar (sesión o token)

> Hay dos caminos. **(a) Recomendado: `wrangler login`**, un clic en el navegador. **(b) Token de API**, para cuando
> el navegador no se abre, la persona trabaja en una compu compartida o prefiere un permiso limitado.

Explícaselo así:

```
Ahora le damos permiso a tu compu para publicar en TU cuenta de Cloudflare. Es como
darle una llave: solo sirve para tu cuenta y la puedes quitar cuando quieras.
```

## Camino (a) · Un clic en el navegador (recomendado)

1. Avísale y corre (tú; deja hasta 5 minutos de espera):

```bash
npx --yes wrangler@4 login
```

```
Se va a abrir tu navegador con una página de Cloudflare que pregunta si permites que
"Wrangler" (la herramienta de Cloudflare) use tu cuenta. Toca "Permitir" (Allow).
Cuando veas "Successfully logged in" (o algo parecido), vuelve aquí y dime "listo".
```

2. Si el navegador no se abrió: en lo que imprimió el comando hay un link largo que empieza con
   `https://dash.cloudflare.com/oauth2/auth…`. Pásale **solo ese link** y que lo abra a mano.
3. Comprueba con `node "<skill>/scripts/preparar.mjs"`: tiene que decir «Conectada a Cloudflare con tu sesión».
4. Si tiene varias cuentas, `preparar.mjs` lo dice y muestra sus nombres: pregúntale en cuál quiere su página y
   guarda esa con `node "<skill>/scripts/token.mjs" --cuenta <id>` (los ids salen en `preparar.mjs`; sirve también con
   la sesión, sin token).

## Camino (b) · Token de API (paso a paso)

### 1. Crear el token

Abre (tú) `https://dash.cloudflare.com/profile/api-tokens` y dile, un paso por mensaje si se pierde:

```
1. Estás en "Mi perfil" → "Tokens de API" (My Profile → API Tokens).
2. Toca el botón azul "Crear token" (Create Token).
3. En la lista de plantillas busca "Editar Cloudflare Workers" (Edit Cloudflare Workers)
   y toca "Usar plantilla" (Use template) en esa fila.
4. Ya trae casi todos los permisos. Agrega dos más con "+ Agregar más" (+ Add more):
   · Cuenta (Account) → D1 → Editar (Edit)      ← para tu base de registros
   · Zona (Zone) → DNS → Editar (Edit)          ← solo si vas a conectar tu dominio
   (Si vas a conectar tu dominio, agrega también Zona → Zona → Leer / Zone → Zone → Read.)
5. En "Recursos de la cuenta" (Account Resources): Incluir → tu cuenta.
   En "Recursos de zona" (Zone Resources): Incluir → Todas las zonas (All zones)
   o solo tu dominio.
6. Abajo, "Continuar con el resumen" (Continue to summary) → "Crear token" (Create Token).
7. Cloudflare te muestra el token UNA sola vez. Toca el botón "Copiar" (Copy).

NO me lo pegues aquí en el chat. Cuando lo hayas copiado, dime solo "copiado".
```

### 2. Guardarlo sin que se vea

Cuando diga «copiado», corre (tú):

```bash
node "<skill>/scripts/token.mjs" --portapapeles
```

El script lee el portapapeles, comprueba el token con Cloudflare, lo guarda en `~/.config/crear-paginas/cloudflare.json`
con permisos 600 (solo su usuario lo lee, fuera de la carpeta de la página), **vacía el portapapeles** y nunca lo
imprime. Los scripts lo usan como `CLOUDFLARE_API_TOKEN` solo al hablar con Cloudflare.

Si la persona prefiere escribirlo ella (o el portapapeles no se puede leer, por ejemplo en un Linux sin `xclip`),
pídele que abra su propia terminal y corra:

```bash
node "<skill>/scripts/token.mjs"
```

```
Te va a pedir el token. Pégalo (no se va a ver mientras lo pegas, es normal) y presiona
Enter. Cuando diga "Token guardado y funcionando", dime "listo".
```

### 3. Comprobar

`node "<skill>/scripts/token.mjs" --estado` y `node "<skill>/scripts/preparar.mjs"`. Si su usuario tiene varias cuentas,
`token.mjs` las lista: pregúntale cuál y corre `node "<skill>/scripts/token.mjs" --cuenta <id>`.

### Si pegó el token en el chat por error

```
Tranquilo, pasa. Pero como quedó escrito en el chat, vamos a cambiarlo por uno nuevo:
en https://dash.cloudflare.com/profile/api-tokens, en la fila de ese token toca "..." →
"Eliminar" (Delete), y crea otro igual (te guío). El nuevo no lo pegues aquí: solo
cópialo y dime "copiado".
```

No lo uses, no lo repitas y no lo guardes en ningún archivo.

## Reglas del token

1. **Nunca** se imprime, se pega en el chat, se escribe en el plan, en `wrangler.jsonc` ni en ningún archivo de la
   página. Vive solo en `~/.config/crear-paginas/cloudflare.json`.
2. Nunca uses la «Global API Key» (la llave maestra de la cuenta): solo un token con los permisos de arriba.
3. Para quitarlo de la compu: `node "<skill>/scripts/token.mjs" --borrar` (y si ya no lo usa, eliminarlo en Cloudflare).
4. Si un comando dice que falta un permiso (error 10000, 9109 o «Authentication error»), crea uno nuevo con los
   permisos de arriba (ver `99-problemas.md`).
