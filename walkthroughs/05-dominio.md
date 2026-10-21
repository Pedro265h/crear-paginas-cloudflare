# Walkthrough 05 · Tu dominio (www.tumarca.com)

> La página ya funciona en la dirección gratis (`https://<nombre>.<subdominio>.workers.dev`). Con un dominio propio se
> ve más profesional y los anuncios rinden mejor. Cloudflare crea solo el registro DNS y el candado (https): lo único
> es que el dominio esté **en la cuenta de Cloudflare de la persona**.

Primero pregúntale:

```
¿Tienes un dominio propio (por ejemplo tumarca.com)?

1. Sí, y ya está en Cloudflare
2. Sí, pero lo compré en otro lado (GoDaddy, Hostinger, Namecheap, Google…)
3. No tengo, quiero comprar uno
4. No por ahora: me quedo con la dirección gratis
```

## 1 · Ya está en Cloudflare

Comprueba que esté «Activo» (Active) en `https://dash.cloudflare.com` (aparece en la lista de dominios de la cuenta).
Pregúntale qué dirección quiere:

- `tumarca.com` → se conectan `tumarca.com` y `www.tumarca.com` (las dos llevan a la página).
- Un subdominio para esta página, por ejemplo `clase.tumarca.com` (útil si en `tumarca.com` ya tiene otra web).

Después (tú):

```bash
node "<skill>/scripts/publicar.mjs" --dominio tumarca.com        # o clase.tumarca.com
```

- Si dice que ese nombre **ya tiene un registro DNS** (porque antes apuntaba a otra web o a un hosting), pídele:

```
En Cloudflare, entra a tu dominio → "DNS" → "Registros" (Records). Busca la fila cuyo
nombre es "tumarca.com" (o "www", o "clase") de tipo A, AAAA o CNAME y bórrala
("Editar" → "Eliminar" / Edit → Delete). OJO: no borres las de tipo MX ni TXT: esas son
de tu correo. Dime "listo" y vuelvo a publicar.
```

- El candado (https) puede tardar de 1 a 15 minutos la primera vez. Si `publicar.mjs` dice «pendiente», espera y
  comprueba con `node "<skill>/scripts/publicar.mjs" --verificar`.

## 2 · Comprado en otro lado: pasarlo a Cloudflare (gratis)

El dominio sigue siendo suyo y lo sigue pagando donde lo compró; solo cambia quién lo «administra».

```
1. En Cloudflare: "Agregar un dominio" (Add a domain / Add a site). Escribe tumarca.com.
2. Elige el plan "Free" (gratis).
3. Cloudflare copia los registros que ya tenía tu dominio (tu correo incluido). Revisa
   que estén los de tipo MX si tienes correo con tu dominio. Continúa.
4. Te muestra dos "servidores de nombres" (nameservers), algo como
   "ana.ns.cloudflare.com" y "bob.ns.cloudflare.com". Cópialos.
5. Entra a donde compraste el dominio (GoDaddy, Hostinger…), busca "DNS" o
   "Servidores de nombres" (Nameservers) → "Cambiar" / "Personalizados" y pega los dos
   de Cloudflare en lugar de los que hay. Guarda.
6. Vuelve a Cloudflare y toca "Comprobar ahora" (Check nameservers).
```

Puede tardar de unos minutos a 24 horas. Cuando el dominio diga **Activo**, sigue con el caso 1. Mientras tanto, la
página ya funciona en la dirección gratis: no hay que esperar para empezar a usarla.

Si en ese dominio ya tiene una web que quiere conservar, recomiéndale un subdominio para la página
(`clase.tumarca.com`).

## 3 · Comprar uno en Cloudflare

Cloudflare los vende a precio de costo (un `.com` ronda los US$10 al año) y quedan listos en la cuenta.

```
1. En Cloudflare: menú de la izquierda → "Registro de dominios" (Domain Registration) →
   "Registrar dominios" (Register Domains).
2. Busca el nombre que quieres (por ejemplo tumarca.com) y elige uno disponible.
3. Paga con tu tarjeta (es un cobro de Cloudflare, una vez al año). Completa tus datos.
4. En unos minutos aparece en tu lista de dominios como "Activo".
```

Después, caso 1. (Algunas terminaciones de país, como `.co` o `.mx`, se compran en otros lados: entonces caso 2.)

## 4 · Sin dominio por ahora

Perfecto: la dirección gratis funciona igual (formulario, registros, píxel). Se puede conectar un dominio cuando
quiera con `publicar.mjs --dominio`, sin rehacer nada.

## Qué contarle al terminar

```
¡Listo! Tu página ya está en https://tumarca.com (y en www.tumarca.com).
La dirección gratis sigue funcionando también.
```
